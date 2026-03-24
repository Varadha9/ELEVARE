# ELEVARE Datasets

All datasets sourced from Kaggle and processed by `load_datasets.py`.

## Source Files

| File | Source | Size | Purpose |
|------|--------|------|---------|
| `big_five_ipip.csv` | Kaggle - Big Five Personality Test | 1,015,341 rows | Raw IPIP questionnaire (EXT/EST/AGR/CSN/OPN, 1-5 scale) |
| `big_five_codebook.txt` | Same dataset | - | Item descriptions and reverse-scoring notes |
| `career_prediction.csv` | Kaggle - Career Prediction Dataset | 105 rows | OCEAN + aptitude scores mapped to 104 career labels |
| `emotion_detection.ipynb` | Kaggle - Emotion Detection from Text | 16,000 train / 2,000 val | Bidirectional LSTM emotion classifier (6 classes) |
| `linkedin_job_postings.ipynb` | Kaggle - LinkedIn Job Postings 2023 | 15,886 postings | Job titles, industries, skill abbreviations |

## Generated Outputs (written to `ai-services/data/`)

| File | Source Dataset | Used By |
|------|---------------|---------|
| `personality_norms.json` | Big Five IPIP | `behavioral_analyzer.py` - population OCEAN baseline |
| `career_ocean_profiles.json` | Career Prediction | `recommendation_engine.py` - data-driven psychometric match |
| `emotion_keywords.json` | Emotion Detection notebook | `nlp_processor.py` - emotion detection in conversations |
| `linkedin_job_profiles.json` | LinkedIn Job Postings notebook | `recommendation_engine.py` - industry demand scores |

## How to Regenerate

```bash
cd datasets
python load_datasets.py
```

Processes all 4 source files and writes the 4 JSON outputs above.

---

## Dataset Details

### 1. Big Five IPIP (`big_five_ipip.csv`)
- 50 item scores (EXT1-10, EST1-10, AGR1-10, CSN1-10, OPN1-10) on 1-5 Likert scale
- 50 response-time columns (_E suffix), plus metadata (dateload, country, IPC, etc.)
- Reverse-scored items: EXT2,4,6,8,10 / EST2,4 / AGR1,3,5,7 / CSN2,4,6,8 / OPN2,4,6
- `load_datasets.py` uses first 200k rows (statistically robust)
- Output: population means/stds per trait on 0-10 scale

### 2. Career Prediction (`career_prediction.csv`)
- Columns: O_score, C_score, E_score, A_score, N_score (0-10), 5 aptitude scores (0-10), Career label
- 104 unique career labels across 105 rows
- Output: per-career OCEAN mean/std profiles blended 50/50 with hand-coded profiles in recommendation engine

### 3. Emotion Detection (`emotion_detection.ipynb`)
- 6 emotion classes: sadness, anger, love, surprise, fear, joy
- Architecture: Bidirectional LSTM x3 + GloVe 200d embeddings
- Output: keyword signal maps and trait signal maps per emotion used by NLP processor

### 4. LinkedIn Job Postings (`linkedin_job_postings.ipynb`)
- 15,886 job postings, 6,063 companies (2023 data)
- Key fields: title, description, industry, skill_abr, work_type, location
- Skill abbreviations: SALE, BD, ACCT, FIN, DSGN, IT, ENG, HCPR, ADM, etc.
- Output: industry demand scores (0-10) used in market viability scoring (Paper Eq. 11)
