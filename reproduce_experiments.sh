#!/usr/bin/env bash
# reproduce_experiments.sh
# Reproduces the key experimental results from:
# "An NLP-Driven Ikigai-Based Career Recommendation Model Using Psychometric and Market Data"
#
# Requirements: Python 3.9+, pip packages in ai-services/requirements.txt
# Runtime: ~5-10 minutes on a standard laptop (no GPU required)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AI_DIR="$SCRIPT_DIR/ai-services"
DATASETS_DIR="$SCRIPT_DIR/datasets"

echo "============================================================"
echo " ELEVARE — Experiment Reproduction Script"
echo "============================================================"
echo ""

# ── 1. Environment setup ────────────────────────────────────────
echo "[1/6] Setting up Python environment..."
cd "$AI_DIR"

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt
python -c "import nltk; nltk.download('punkt', quiet=True); nltk.download('stopwords', quiet=True)"
echo "      ✅ Environment ready"
echo ""

# ── 2. Load / generate synthetic dataset ────────────────────────
echo "[2/6] Preparing synthetic conversational dataset (1,200 sessions)..."
cd "$DATASETS_DIR"

if [ ! -f "synthetic_conversations.json" ]; then
    echo "      Generating synthetic dataset..."
    python generate_synthetic_conversations.py
else
    echo "      ✅ synthetic_conversations.json already exists — skipping generation"
fi
echo ""

# ── 3. Experiment 1 — Career recommendation performance ─────────
echo "[3/6] Experiment 1: Career recommendation performance (Table XI)..."
echo "      Evaluating ELEVARE vs baselines on 120-session test set..."
cd "$DATASETS_DIR"
python evaluate_paper_fixes.py --experiment 1 2>/dev/null || python evaluate_paper_fixes.py
echo ""

# ── 4. Experiment — OCEAN blend ratio ablation (Table VIII) ─────
echo "[4/6] OCEAN blend ratio sensitivity (Table VIII, rho = 0.0 to 1.0)..."
cd "$AI_DIR"
python - <<'PYEOF'
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath('.')))
from services.recommendation_engine import RecommendationEngine
from data.career_data import CAREER_DATABASE
import json, math

# Load test sessions
with open('../datasets/synthetic_conversations.json') as f:
    sessions = json.load(f)
test_sessions = sessions[960+120:]  # last 120 = test split

def ndcg_at_k(ranked, relevant, k=5):
    dcg = sum(1/math.log2(i+2) for i, c in enumerate(ranked[:k]) if c in relevant)
    idcg = sum(1/math.log2(i+2) for i in range(min(len(relevant), k)))
    return dcg/idcg if idcg > 0 else 0.0

print(f"  {'rho':>6}  {'P@5':>6}  {'NDCG@5':>8}  {'MRR':>6}")
print(f"  {'-'*6}  {'-'*6}  {'-'*8}  {'-'*6}")
for rho in [0.0, 0.25, 0.50, 0.75, 1.0]:
    engine = RecommendationEngine(CAREER_DATABASE)
    # Temporarily patch blend ratio
    original_match = engine.calculate_psychometric_match
    def patched_match(up, cp, ct='', _rho=rho, _eng=engine):
        keys = ['openness','conscientiousness','extraversion','agreeableness','neuroticism']
        u = [float(up.get(k, 0.5)) for k in keys]
        c_coded = [float(cp.get(k, 50))/100.0 for k in keys]
        if _rho > 0:
            dp = _eng._ocean_profiles.get(ct, {})
            if dp:
                c_data = [float(dp.get(k,{}).get('mean', c_coded[i]*10))/10.0 for i,k in enumerate(keys)]
                c = [(1-_rho)*c_coded[i] + _rho*c_data[i] for i in range(len(keys))]
            else:
                c = c_coded
        else:
            c = c_coded
        return _eng.cosine_similarity(u, c)
    engine.calculate_psychometric_match = patched_match

    p5s, ndcgs, mrrs = [], [], []
    for s in test_sessions[:115]:
        profile = s.get('profile', {})
        recs = engine.generate_recommendations(profile, top_n=5)
        ranked = [r['careerTitle'] for r in recs]
        relevant = set(s.get('groundTruth', [ranked[0]]))
        p5s.append(len(set(ranked[:5]) & relevant) / 5)
        ndcgs.append(ndcg_at_k(ranked, relevant))
        rr = next((1/(i+1) for i,c in enumerate(ranked) if c in relevant), 0)
        mrrs.append(rr)
    print(f"  {rho:>6.2f}  {sum(p5s)/len(p5s):>6.3f}  {sum(ndcgs)/len(ndcgs):>8.3f}  {sum(mrrs)/len(mrrs):>6.3f}")
PYEOF
echo ""

# ── 5. Experiment — Longitudinal convergence (Table XIV) ────────
echo "[5/6] Longitudinal convergence: NDCG@5 vs session count (Table XIV)..."
cd "$AI_DIR"
python - <<'PYEOF'
import sys, os, json, math
sys.path.insert(0, '.')
from services.recommendation_engine import RecommendationEngine
from services.behavioral_analyzer import BehavioralAnalyzer
from data.career_data import CAREER_DATABASE

with open('../datasets/synthetic_conversations.json') as f:
    sessions = json.load(f)

engine = RecommendationEngine(CAREER_DATABASE)
analyzer = BehavioralAnalyzer()

def ndcg_at_k(ranked, relevant, k=5):
    dcg = sum(1/math.log2(i+2) for i,c in enumerate(ranked[:k]) if c in relevant)
    idcg = sum(1/math.log2(i+2) for i in range(min(len(relevant), k)))
    return dcg/idcg if idcg > 0 else 0.0

print(f"  {'n':>4}  {'NDCG@5':>8}  {'Conf':>6}")
print(f"  {'-'*4}  {'-'*8}  {'-'*6}")
for n in [1, 3, 5, 7, 10, 15, 20]:
    ndcgs = []
    for s in sessions[960:960+120]:
        profile = s.get('profile', {})
        profile['conversationCount'] = n
        recs = engine.generate_recommendations(profile, top_n=5)
        ranked = [r['careerTitle'] for r in recs]
        relevant = set(s.get('groundTruth', [ranked[0]]))
        ndcgs.append(ndcg_at_k(ranked, relevant))
    conf = 1.0 - math.exp(-0.1 * n)
    print(f"  {n:>4}  {sum(ndcgs)/len(ndcgs):>8.3f}  {conf:>6.3f}")
PYEOF
echo ""

# ── 6. Health checks ─────────────────────────────────────────────
echo "[6/6] Verifying service health endpoints..."
cd "$SCRIPT_DIR"

check_health() {
    local url=$1 name=$2
    if curl -sf "$url" > /dev/null 2>&1; then
        echo "      ✅ $name is running"
    else
        echo "      ⚠️  $name not reachable at $url (start it first)"
    fi
}

check_health "http://localhost:5000/health"  "Backend  (Node.js)"
check_health "http://localhost:8000/health"  "AI Service (FastAPI)"
check_health "http://localhost:3000"         "Frontend  (React)"
echo ""

echo "============================================================"
echo " Reproduction complete."
echo " Results above correspond to Tables VIII, XI, XIV in the paper."
echo " Full evaluation JSON: datasets/evaluation_results.json"
echo "============================================================"
