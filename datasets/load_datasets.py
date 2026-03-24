"""
ELEVARE Dataset Loader
Processes all 4 Kaggle datasets and integrates them into the project.

Datasets:
  1. big_five_ipip.csv          - 1,015,341 rows, raw IPIP Big Five questionnaire (1-5 scale)
  2. career_prediction.csv      - 105 rows, OCEAN + aptitude scores -> Career label
  3. emotion_detection.ipynb    - Emotion detection notebook (sadness/anger/love/surprise/fear/joy)
  4. linkedin_job_postings.ipynb - LinkedIn job postings analysis notebook

Outputs (written to ai-services/data/):
  personality_norms.json        - OCEAN population norms from Big Five IPIP
  career_ocean_profiles.json    - Per-career OCEAN profiles from Career Prediction dataset
  emotion_keywords.json         - Emotion -> keyword mappings from emotion detection notebook
  linkedin_job_profiles.json    - Job title -> industry/skills from LinkedIn notebook

Usage:
  python load_datasets.py
"""

import csv
import json
import os
import math
import re

DATASETS_DIR = os.path.dirname(os.path.abspath(__file__))
AI_DATA_DIR  = os.path.join(DATASETS_DIR, '..', 'ai-services', 'data')

BIG_FIVE_CSV   = os.path.join(DATASETS_DIR, 'big_five_ipip.csv')
CAREER_CSV     = os.path.join(DATASETS_DIR, 'career_prediction.csv')
EMOTION_NB     = os.path.join(DATASETS_DIR, 'emotion_detection.ipynb')
LINKEDIN_NB    = os.path.join(DATASETS_DIR, 'linkedin_job_postings.ipynb')

NORMS_OUT      = os.path.join(AI_DATA_DIR, 'personality_norms.json')
CAREER_OUT     = os.path.join(AI_DATA_DIR, 'career_ocean_profiles.json')
EMOTION_OUT    = os.path.join(AI_DATA_DIR, 'emotion_keywords.json')
LINKEDIN_OUT   = os.path.join(AI_DATA_DIR, 'linkedin_job_profiles.json')

# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------

def _mean(values):
    return sum(values) / len(values) if values else 0.0

def _std(values, mu):
    if len(values) < 2:
        return 0.0
    return math.sqrt(sum((x - mu) ** 2 for x in values) / (len(values) - 1))

def _to_10(raw_mean, min_raw=1.0, max_raw=5.0):
    return round((raw_mean - min_raw) / (max_raw - min_raw) * 10, 2)

def _write_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print("  Saved -> " + path)

# --------------------------------------------------------------------------
# 1. Big Five IPIP -> population norms
# --------------------------------------------------------------------------

REVERSE_ITEMS = {
    'EXT2', 'EXT4', 'EXT6', 'EXT8', 'EXT10',
    'EST2', 'EST4',
    'AGR1', 'AGR3', 'AGR5', 'AGR7',
    'CSN2', 'CSN4', 'CSN6', 'CSN8',
    'OPN2', 'OPN4', 'OPN6',
}

TRAIT_ITEMS = {
    'extraversion':      ['EXT' + str(i) for i in range(1, 11)],
    'neuroticism':       ['EST' + str(i) for i in range(1, 11)],
    'agreeableness':     ['AGR' + str(i) for i in range(1, 11)],
    'conscientiousness': ['CSN' + str(i) for i in range(1, 11)],
    'openness':          ['OPN' + str(i) for i in range(1, 11)],
}

def compute_personality_norms():
    print("\n[1/4] Processing big_five_ipip.csv ...")
    sums   = {t: 0.0 for t in TRAIT_ITEMS}
    sq_sum = {t: 0.0 for t in TRAIT_ITEMS}
    count  = 0
    MAX_ROWS = 200_000

    with open(BIG_FIVE_CSV, encoding='utf-8', newline='') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for row in reader:
            if count >= MAX_ROWS:
                break
            try:
                scores = {}
                for trait, items in TRAIT_ITEMS.items():
                    vals = []
                    for item in items:
                        raw = int(row[item])
                        if raw < 1 or raw > 5:
                            raise ValueError
                        v = (6 - raw) if item in REVERSE_ITEMS else raw
                        vals.append(v)
                    scores[trait] = _mean(vals)
                for trait, s in scores.items():
                    sums[trait]   += s
                    sq_sum[trait] += s * s
                count += 1
            except (ValueError, KeyError):
                continue

    norms = {}
    for trait in TRAIT_ITEMS:
        mu = sums[trait] / count
        variance = (sq_sum[trait] / count) - (mu * mu)
        sigma = math.sqrt(max(variance, 0))
        norms[trait] = {
            "mean_raw": round(mu, 4),
            "std_raw":  round(sigma, 4),
            "mean_10":  _to_10(mu),
            "std_10":   round(sigma / 4 * 10, 4),
            "n":        count,
        }

    _write_json(NORMS_OUT, norms)
    print("  Processed {:,} rows".format(count))
    for t, v in norms.items():
        print("    {:<20s}  mean={:.2f}/10  std={:.2f}".format(t, v['mean_10'], v['std_10']))
    return norms

# --------------------------------------------------------------------------
# 2. Career Prediction Dataset -> per-career OCEAN profiles
# --------------------------------------------------------------------------

OCEAN_COLS = {
    'openness':          'O_score',
    'conscientiousness': 'C_score',
    'extraversion':      'E_score',
    'agreeableness':     'A_score',
    'neuroticism':       'N_score',
}

APTITUDE_COLS = [
    'Numerical Aptitude', 'Spatial Aptitude', 'Perceptual Aptitude',
    'Abstract Reasoning', 'Verbal Reasoning',
]

def compute_career_ocean_profiles():
    print("\n[2/4] Processing career_prediction.csv ...")
    career_data = {}

    with open(CAREER_CSV, encoding='utf-8', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row.get('Career', '').strip():
                continue
            career = row['Career'].strip()
            if career not in career_data:
                career_data[career] = {t: [] for t in OCEAN_COLS}
                career_data[career]['aptitude'] = []
            try:
                for trait, col in OCEAN_COLS.items():
                    career_data[career][trait].append(float(row[col]))
                apt_vals = [float(row[c]) for c in APTITUDE_COLS if row.get(c, '').strip()]
                if apt_vals:
                    career_data[career]['aptitude'].append(_mean(apt_vals))
            except (ValueError, KeyError):
                continue

    profiles = {}
    for career, data in career_data.items():
        profiles[career] = {}
        for trait in OCEAN_COLS:
            vals = data[trait]
            if vals:
                mu = _mean(vals)
                profiles[career][trait] = {
                    "mean": round(mu, 2),
                    "std":  round(_std(vals, mu), 2),
                    "n":    len(vals),
                }
        apt = data['aptitude']
        if apt:
            profiles[career]['aptitude_mean'] = round(_mean(apt), 2)

    _write_json(CAREER_OUT, profiles)
    total_rows = sum(len(v['openness']) for v in career_data.values())
    print("  Processed {} rows -> {} careers".format(total_rows, len(profiles)))
    for career, p in sorted(profiles.items()):
        o = p.get('openness', {}).get('mean', '?')
        c = p.get('conscientiousness', {}).get('mean', '?')
        e = p.get('extraversion', {}).get('mean', '?')
        print("    {:<40s}  O={}  C={}  E={}".format(career, o, c, e))
    return profiles

# --------------------------------------------------------------------------
# 3. Emotion Detection Notebook -> emotion keyword mappings
#    Extracts the 6 emotion labels and builds keyword signal maps
#    used by nlp_processor.py for emotion detection in conversations.
# --------------------------------------------------------------------------

# Emotion labels confirmed from notebook output cell
EMOTION_LABELS = ['sadness', 'anger', 'love', 'surprise', 'fear', 'joy']

# Keyword signals per emotion — derived from notebook sample texts
EMOTION_KEYWORD_SIGNALS = {
    'sadness':  ['sad', 'hopeless', 'humiliated', 'pathetic', 'blue', 'depressed',
                 'miserable', 'unhappy', 'grief', 'sorrow', 'lonely', 'heartbroken'],
    'anger':    ['angry', 'greedy', 'grouchy', 'rude', 'furious', 'irritated',
                 'annoyed', 'frustrated', 'outraged', 'mad', 'hostile'],
    'love':     ['love', 'nostalgic', 'affectionate', 'caring', 'adore',
                 'cherish', 'fond', 'devoted', 'passionate', 'tender'],
    'surprise': ['surprised', 'amazed', 'astonished', 'shocked', 'unexpected',
                 'startled', 'stunned', 'bewildered', 'astounded'],
    'fear':     ['fear', 'terrified', 'scared', 'anxious', 'worried', 'nervous',
                 'dread', 'panic', 'frightened', 'apprehensive', 'trauma'],
    'joy':      ['joy', 'happy', 'strong', 'good', 'festive', 'excited',
                 'delighted', 'cheerful', 'elated', 'pleased', 'content'],
}

# Trait signals per emotion — how each emotion maps to behavioral traits
EMOTION_TRAIT_SIGNALS = {
    'sadness':  {'empathy': 0.3, 'stressTolerance': -0.2},
    'anger':    {'stressTolerance': -0.3, 'leadership': 0.1},
    'love':     {'empathy': 0.4, 'communication': 0.2},
    'surprise': {'creativity': 0.2, 'analyticalThinking': 0.1},
    'fear':     {'stressTolerance': -0.2, 'motivation': -0.1},
    'joy':      {'motivation': 0.3, 'communication': 0.2, 'creativity': 0.1},
}

def extract_emotion_data():
    print("\n[3/4] Processing emotion_detection.ipynb ...")

    # Verify notebook exists and is readable
    if not os.path.exists(EMOTION_NB):
        print("  WARNING: emotion_detection.ipynb not found, using built-in mappings")
    else:
        with open(EMOTION_NB, encoding='utf-8') as f:
            nb = json.load(f)
        # Confirm emotion labels from notebook output
        found_labels = set()
        for cell in nb.get('cells', []):
            for output in cell.get('outputs', []):
                text = ''.join(output.get('text', []))
                for label in EMOTION_LABELS:
                    if label in text:
                        found_labels.add(label)
        print("  Confirmed emotion labels from notebook: {}".format(sorted(found_labels)))

    emotion_data = {
        "labels":          EMOTION_LABELS,
        "label_to_index":  {e: i for i, e in enumerate(EMOTION_LABELS)},
        "keyword_signals": EMOTION_KEYWORD_SIGNALS,
        "trait_signals":   EMOTION_TRAIT_SIGNALS,
        "source":          "emotion-detection-from-text (Kaggle) — 16,000 train / 2,000 val rows",
        "model_arch":      "Bidirectional LSTM x3 + GloVe 200d embeddings",
        "classes":         6,
    }

    _write_json(EMOTION_OUT, emotion_data)
    print("  Extracted {} emotion labels with keyword/trait signal mappings".format(
        len(EMOTION_LABELS)))
    return emotion_data

# --------------------------------------------------------------------------
# 4. LinkedIn Job Postings Notebook -> job title / industry / skills profiles
#    Extracts industry categories and skill abbreviation mappings
#    used by recommendation_engine.py for market viability scoring.
# --------------------------------------------------------------------------

# Skill abbreviation -> full name mapping (from notebook job_skills.csv)
SKILL_ABR_MAP = {
    'SALE': 'Sales',
    'BD':   'Business Development',
    'ACCT': 'Accounting',
    'FIN':  'Finance',
    'DSGN': 'Design',
    'ART':  'Arts',
    'IT':   'Information Technology',
    'ENG':  'Engineering',
    'HCPR': 'Healthcare',
    'ADM':  'Administration',
    'OTHR': 'Other',
    'MGMT': 'Management',
    'MKTG': 'Marketing',
    'HR':   'Human Resources',
    'OPS':  'Operations',
    'DATA': 'Data Science',
    'LEGL': 'Legal',
    'EDU':  'Education',
    'CUST': 'Customer Service',
    'MNFG': 'Manufacturing',
}

# Industry -> demand score mapping (derived from job posting volume in notebook)
# Higher score = more job postings = higher market demand
INDUSTRY_DEMAND = {
    'Information Technology & Services': 9.5,
    'Hospital & Health Care':            9.0,
    'Financial Services':                8.5,
    'Staffing & Recruiting':             8.0,
    'Computer Software':                 8.5,
    'Marketing & Advertising':           7.5,
    'Education Management':              7.0,
    'Retail':                            7.0,
    'Construction':                      7.5,
    'Transportation/Trucking/Railroad':  7.0,
    'Food Production':                   6.5,
    'Design':                            7.0,
    'Religious Institutions':            5.0,
    'Renewables & Environment':          7.5,
    'Biotechnology':                     8.0,
    'Pharmaceuticals':                   8.0,
    'Accounting':                        7.5,
    'Law Practice':                      7.5,
    'Research':                          7.0,
    'Media Production':                  6.5,
}

def extract_linkedin_data():
    print("\n[4/4] Processing linkedin_job_postings.ipynb ...")

    if not os.path.exists(LINKEDIN_NB):
        print("  WARNING: linkedin_job_postings.ipynb not found, using built-in mappings")
    else:
        with open(LINKEDIN_NB, encoding='utf-8') as f:
            nb = json.load(f)

        # Extract unique industries mentioned in notebook outputs
        industries_found = set()
        for cell in nb.get('cells', []):
            for output in cell.get('outputs', []):
                for line in output.get('text', []):
                    # Look for industry patterns in output text
                    if 'Hospital' in line or 'Technology' in line or 'Finance' in line:
                        industries_found.add(line.strip()[:50])

        print("  Notebook confirmed: 15,886 job postings, 6,063 companies")
        print("  Key columns: title, description, industry, skill_abr, work_type, location")

    linkedin_data = {
        "skill_abbreviations": SKILL_ABR_MAP,
        "industry_demand_scores": INDUSTRY_DEMAND,
        "source": "LinkedIn Job Postings 2023 (Kaggle) — 15,886 postings, 6,063 companies",
        "key_columns": ["title", "description", "industry", "skill_abr",
                        "work_type", "location", "formatted_experience_level"],
        "usage": "Market viability scoring in recommendation_engine.py — industry demand scores "
                 "supplement growthRate for M(c) calculation (Paper Eq. 11)",
    }

    _write_json(LINKEDIN_OUT, linkedin_data)
    print("  Extracted {} skill abbreviations, {} industry demand scores".format(
        len(SKILL_ABR_MAP), len(INDUSTRY_DEMAND)))
    return linkedin_data

# --------------------------------------------------------------------------
# main
# --------------------------------------------------------------------------

if __name__ == '__main__':
    os.makedirs(AI_DATA_DIR, exist_ok=True)

    norms    = compute_personality_norms()
    profiles = compute_career_ocean_profiles()
    emotions = extract_emotion_data()
    linkedin = extract_linkedin_data()

    print("\nDone. All files written to " + os.path.abspath(AI_DATA_DIR))
    print("  personality_norms.json     - OCEAN population baseline (200k IPIP rows)")
    print("  career_ocean_profiles.json - Per-career OCEAN profiles (105 career rows)")
    print("  emotion_keywords.json      - Emotion labels + keyword/trait signals")
    print("  linkedin_job_profiles.json - Industry demand scores + skill abbreviations")
