import math
import json
import os

_DATA_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', 'data'))

# _load_json — safely loads JSON data files, returns empty dict if missing
def _load_json(filename):
    path = os.path.realpath(os.path.join(_DATA_DIR, filename))
    if not path.startswith(_DATA_DIR + os.sep):
        return {}
    if os.path.exists(path):
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    return {}


class RecommendationEngine:
    def __init__(self, career_database):
        self.careers = career_database
        # Load supplementary data files for enriched scoring
        self._ocean_profiles  = _load_json('career_ocean_profiles.json')  # Data-driven OCEAN profiles per career
        self._norms           = _load_json('personality_norms.json')       # Population norms for personality
        self._linkedin        = _load_json('linkedin_job_profiles.json')   # LinkedIn industry demand data
        self._industry_demand = self._linkedin.get('industry_demand_scores', {})

    # ------------------------------------------------------------------
    # Core math utilities
    # ------------------------------------------------------------------

    def cosine_similarity(self, vec1, vec2):
        """Cosine similarity between two vectors — measures directional alignment
        Used for psychometric matching (how similar user OCEAN is to career OCEAN)"""
        dot = sum(a * b for a, b in zip(vec1, vec2))
        n1  = math.sqrt(sum(a * a for a in vec1))
        n2  = math.sqrt(sum(b * b for b in vec2))
        return dot / (n1 * n2) if n1 > 0 and n2 > 0 else 0.0

    def jaccard_similarity(self, set_a, set_b):
        """Jaccard similarity — measures overlap between two sets
        Used for Ikigai alignment (how much user and career Ikigai dimensions overlap)"""
        a = set(str(x).lower() for x in set_a)
        b = set(str(x).lower() for x in set_b)
        return len(a & b) / len(a | b) if (a | b) else 0.0

    # ------------------------------------------------------------------
    # Paper Eq. (9): Psych(c) — psychometric match score
    # Uses hand-coded OCEAN profiles only (rho=0.0) — ablation study
    # (Table VIII) showed monotonic degradation as Kaggle blend increases,
    # because the dataset provides only one sample per career (zero variance).
    # ------------------------------------------------------------------
    def calculate_psychometric_match(self, user_personality, career_personality, career_title=''):
        keys = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']

        # User OCEAN vector (0-1 scale)
        u = [float(user_personality.get(k, 0.5)) for k in keys]
        # Hand-coded career OCEAN vector (normalized from 0-100 to 0-1)
        c = [float(career_personality.get(k, 50)) / 100.0 for k in keys]

        return self.cosine_similarity(u, c)

    # ------------------------------------------------------------------
    # Paper Eq. (10): A(c) — Ikigai alignment score
    # Mean Jaccard similarity across all 4 Ikigai dimensions
    # ------------------------------------------------------------------
    def calculate_ikigai_alignment(self, user_ikigai, career_ikigai):
        # Map user Ikigai keys to dimension codes
        user_map = {
            'L': user_ikigai.get('whatYouLove', []),
            'G': user_ikigai.get('whatYouAreGoodAt', []),
            'W': user_ikigai.get('whatTheWorldNeeds', []),
            'P': user_ikigai.get('whatYouCanBePaidFor', []),
        }
        # Support both key naming conventions in career data
        career_map = {
            'L': career_ikigai.get('whatYouLove',       career_ikigai.get('passionArea', [])),
            'G': career_ikigai.get('whatYouAreGoodAt',  career_ikigai.get('talentArea', [])),
            'W': career_ikigai.get('whatTheWorldNeeds', career_ikigai.get('demandArea', [])),
            'P': career_ikigai.get('whatYouCanBePaidFor',career_ikigai.get('profitArea', [])),
        }
        scores = []
        for dim in ['L', 'G', 'W', 'P']:
            u_items = user_map[dim]
            c_items = career_map[dim]
            if u_items or c_items:
                scores.append(self.jaccard_similarity(u_items, c_items))
            else:
                scores.append(0.5)  # Neutral score when both sides are empty
        return sum(scores) / len(scores)

    # ------------------------------------------------------------------
    # Paper Eq. (11): M(c) — market viability score
    # Combines growth rate, salary, and LinkedIn industry demand
    # ------------------------------------------------------------------
    def calculate_market_score(self, career):
        # Parse growth rate percentage from string (e.g. "22% growth" → 22.0)
        growth_str = career.get('growthRate', '5% growth')
        try:
            growth_pct = float(''.join(ch for ch in growth_str if ch.isdigit() or ch == '.'))
        except Exception:
            growth_pct = 5.0
        growth_norm = min(growth_pct / 40.0, 1.0)  # Normalize: 40% growth = max score

        # Parse salary from string, handling multiple currency symbols
        salary_str = career.get('averageSalary', '')
        try:
            clean = salary_str.replace(',', '')
            for sym in ['\u20b9', '$', 'Rs', 'INR']:
                clean = clean.replace(sym, '')
            parts = clean.replace('\u2013', '-').replace('\u2014', '-').split('-')
            nums = [float(p.strip()) for p in parts if p.strip() and any(ch.isdigit() for ch in p)]
            salary_mid = sum(nums) / len(nums) if nums else 500000
        except Exception:
            salary_mid = 500000
        salary_norm = min(salary_mid / 2000000.0, 1.0)  # Normalize: 2M = max score

        # Use LinkedIn industry demand score if the career category matches
        category = career.get('category', '')
        linkedin_score = None
        for industry, score in self._industry_demand.items():
            if category.lower() in industry.lower() or industry.lower() in category.lower():
                linkedin_score = score / 10.0
                break
        demand_norm = linkedin_score if linkedin_score is not None else growth_norm

        # Weighted combination: growth 40%, salary 35%, demand 25%
        return 0.40 * growth_norm + 0.35 * salary_norm + 0.25 * demand_norm

    # ------------------------------------------------------------------
    # Paper Eq. (8): Score(c) = 0.40*Psych + 0.35*Ikigai + 0.25*Market
    # Composite score combining all three dimensions
    # ------------------------------------------------------------------
    def calculate_composite_score(self, psych, ikigai, market):
        return 0.40 * psych + 0.35 * ikigai + 0.25 * market

    # ------------------------------------------------------------------
    # Paper Eq. (12): Conf(c,n) = 1 - e^(-0.1 * n)
    # Confidence grows with number of sessions — more data = more reliable
    # ------------------------------------------------------------------
    def calculate_confidence(self, n_sessions):
        return 1.0 - math.exp(-0.1 * n_sessions)

    # ------------------------------------------------------------------
    # Main recommendation method — scores all careers and returns top N
    # ------------------------------------------------------------------
    def generate_recommendations(self, user_profile, top_n=5):
        user_personality = user_profile.get('personality', {})
        user_ikigai      = user_profile.get('ikigai', {})
        n_sessions       = user_profile.get('conversationCount', 1)
        confidence       = self.calculate_confidence(n_sessions)

        results = []
        for career in self.careers:
            # Calculate all three component scores
            psych  = self.calculate_psychometric_match(
                user_personality, career.get('personalityFit', {}), career.get('title', ''))
            ikigai = self.calculate_ikigai_alignment(user_ikigai, career.get('ikigaiMapping', {}))
            market = self.calculate_market_score(career)
            score  = self.calculate_composite_score(psych, ikigai, market)

            results.append({
                'careerTitle':       career['title'],
                'careerCategory':    career.get('category', 'General'),
                'confidenceScore':   round(score * 100, 1),
                'sessionConfidence': round(confidence, 3),
                'componentScores': {
                    'psychometric':    round(psych, 3),
                    'ikigaiAlignment': round(ikigai, 3),
                    'marketViability': round(market, 3),
                },
                'explanation':  self._generate_explanation(career, user_profile, score),
                'careerDetails': {
                    'description':    career.get('description', ''),
                    'requiredSkills': career.get('skills', []),
                    'averageSalary':  career.get('averageSalary', 'Varies'),
                    'growthOutlook':  career.get('growthRate', 'Stable'),
                    'educationPath':  career.get('education', []),
                }
            })

        # Sort by composite score descending and return top N
        results.sort(key=lambda x: x['confidenceScore'], reverse=True)
        return results[:top_n]

    def _generate_explanation(self, career, user_profile, score):
        """Generate human-readable explanation for why this career was recommended"""
        traits = user_profile.get('behavioralTraits', {})
        # Get the user's top 3 traits to mention in the explanation
        top_traits = sorted(traits.items(), key=lambda x: x[1], reverse=True)[:3]
        matching = [t[0].replace('_', ' ') for t in top_traits]

        # Tailor the summary message based on the composite score
        if score > 0.75:
            summary = "Strong match - your profile closely aligns with {} requirements.".format(career['title'])
        elif score > 0.55:
            summary = "Good match - {} fits several of your key strengths.".format(career['title'])
        else:
            summary = "Potential match - {} could be worth exploring.".format(career['title'])

        return {
            'summary':       summary,
            'matchingTraits':matching,
        }

    def update_from_feedback(self, user_id, career_title, interested, rating):
        """Record user feedback — currently logs it; can be used for model retraining"""
        from datetime import datetime
        return {
            'user_id':    user_id,
            'career':     career_title,
            'interested': interested,
            'rating':     rating,
            'timestamp':  datetime.now().isoformat()
        }
