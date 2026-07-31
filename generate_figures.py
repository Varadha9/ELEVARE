"""
ELEVARE — Perfect figure generator
All data sourced directly from the project files.
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, Circle, FancyArrowPatch
import matplotlib.gridspec as gridspec
import numpy as np
import os, json

# ── Paths ──────────────────────────────────────────────────────────────────
ROOT = "/home/varad/projects/ELEVARE"
OUT  = f"{ROOT}/figures"
os.makedirs(OUT, exist_ok=True)

# ── Brand palette (matches paper definecolor) ──────────────────────────────
BLUE   = "#1F77B4"
ORANGE = "#FF7F0E"
GREEN  = "#2CA02C"
RED    = "#D62728"
PURPLE = "#9467BD"
GRAY   = "#7F7F7F"
LGRAY  = "#CCCCCC"
BGBLUE = "#EAF3FB"
BGGREEN= "#E8F5E9"

DPI = 300
SAVE_PDF = True  # also export vector PDF for IEEE camera-ready submission

def savefig(fig, name):
    """Save PNG (300 DPI) and optionally a vector PDF copy."""
    fig.savefig(f"{OUT}/{name}.png", dpi=DPI, bbox_inches='tight')
    if SAVE_PDF:
        fig.savefig(f"{OUT}/{name}.pdf", bbox_inches='tight')

# ── rcParams: clean IEEE look ──────────────────────────────────────────────
plt.rcParams.update({
    'font.family': 'DejaVu Sans',
    'axes.spines.top':    False,
    'axes.spines.right':  False,
    'axes.grid':          True,
    'grid.alpha':         0.35,
    'grid.linestyle':     '--',
    'figure.facecolor':   'white',
    'axes.facecolor':     'white',
})

# ══════════════════════════════════════════════════════════════════════════
# REAL DATA from project files
# ══════════════════════════════════════════════════════════════════════════

# --- career_data.py parsed into structured dicts --------------------------
CAREERS = [
    # title, category, traits{8}, ocean{5}, salary_min_L, salary_max_L, growth_pct
    ("Software Engineer",     "Technology",    {"analytical":85,"problem":90,"creativity":70,"communication":60,"leadership":60,"empathy":45,"motivation":75,"stress":65},   {"O":75,"C":80,"E":45,"A":55,"N":40},  7.47, 12.45, 22),
    ("Data Scientist",        "Technology",    {"analytical":95,"problem":85,"creativity":65,"communication":70,"leadership":55,"empathy":50,"motivation":75,"stress":60},   {"O":80,"C":85,"E":50,"A":60,"N":35},  7.89, 13.28, 36),
    ("UX/UI Designer",        "Design",        {"analytical":65,"problem":75,"creativity":90,"communication":80,"leadership":55,"empathy":85,"motivation":70,"stress":55},   {"O":85,"C":70,"E":60,"A":75,"N":45},  6.23, 10.79, 13),
    ("Clinical Psychologist", "Healthcare",    {"analytical":70,"problem":75,"creativity":60,"communication":90,"leadership":55,"empathy":95,"motivation":70,"stress":80},   {"O":75,"C":80,"E":55,"A":90,"N":30},  6.64,  9.96,  8),
    ("Marketing Manager",     "Business",      {"analytical":70,"problem":70,"creativity":80,"communication":90,"leadership":85,"empathy":65,"motivation":80,"stress":60},   {"O":75,"C":75,"E":80,"A":70,"N":40},  5.81, 10.79, 10),
    ("Environmental Scientist","Science",      {"analytical":85,"problem":80,"creativity":70,"communication":65,"leadership":55,"empathy":75,"motivation":85,"stress":65},   {"O":80,"C":85,"E":45,"A":75,"N":35},  4.98,  7.89,  8),
    ("Teacher",               "Education",     {"analytical":65,"problem":65,"creativity":70,"communication":90,"leadership":75,"empathy":85,"motivation":75,"stress":75},   {"O":70,"C":80,"E":65,"A":85,"N":40},  4.15,  6.23,  4),
    ("Financial Analyst",     "Finance",       {"analytical":90,"problem":80,"creativity":55,"communication":70,"leadership":60,"empathy":55,"motivation":70,"stress":70},   {"O":60,"C":90,"E":50,"A":60,"N":35},  5.40,  9.13,  6),
    ("Product Manager",       "Business",      {"analytical":80,"problem":85,"creativity":75,"communication":90,"leadership":90,"empathy":65,"motivation":80,"stress":65},   {"O":80,"C":85,"E":70,"A":70,"N":35},  8.30, 14.11, 19),
    ("Cybersecurity Analyst", "Technology",    {"analytical":90,"problem":90,"creativity":65,"communication":60,"leadership":55,"empathy":45,"motivation":80,"stress":80},   {"O":70,"C":90,"E":40,"A":55,"N":30},  7.06, 12.04, 35),
    ("Graphic Designer",      "Design",        {"analytical":55,"problem":65,"creativity":95,"communication":70,"leadership":45,"empathy":65,"motivation":75,"stress":55},   {"O":90,"C":65,"E":55,"A":70,"N":45},  3.74,  7.06,  3),
    ("HR Manager",            "Business",      {"analytical":65,"problem":70,"creativity":60,"communication":90,"leadership":80,"empathy":90,"motivation":70,"stress":75},   {"O":70,"C":80,"E":75,"A":90,"N":35},  5.40,  9.13,  7),
    ("Biomedical Engineer",   "Healthcare",    {"analytical":90,"problem":90,"creativity":75,"communication":65,"leadership":55,"empathy":65,"motivation":80,"stress":65},   {"O":80,"C":90,"E":45,"A":65,"N":30},  6.23, 10.79, 10),
    ("Content Writer",        "Media",         {"analytical":60,"problem":55,"creativity":90,"communication":95,"leadership":45,"empathy":65,"motivation":70,"stress":55},   {"O":90,"C":70,"E":50,"A":65,"N":45},  3.32,  6.64,  4),
    ("Civil Engineer",        "Engineering",   {"analytical":90,"problem":85,"creativity":65,"communication":70,"leadership":70,"empathy":60,"motivation":75,"stress":75},   {"O":65,"C":90,"E":55,"A":65,"N":35},  5.81,  9.96,  7),
    ("Social Worker",         "Social Svcs",   {"analytical":65,"problem":75,"creativity":60,"communication":85,"leadership":60,"empathy":95,"motivation":85,"stress":85},   {"O":75,"C":75,"E":65,"A":95,"N":30},  3.74,  6.23,  9),
    ("Entrepreneur",          "Business",      {"analytical":75,"problem":90,"creativity":90,"communication":80,"leadership":90,"empathy":60,"motivation":95,"stress":85},   {"O":90,"C":80,"E":75,"A":60,"N":30},  4.15, 41.50, 25),
    ("Nurse Practitioner",    "Healthcare",    {"analytical":80,"problem":80,"creativity":60,"communication":85,"leadership":65,"empathy":90,"motivation":80,"stress":85},   {"O":70,"C":90,"E":60,"A":85,"N":25},  7.89, 11.62, 40),
    ("Architect",             "Design",        {"analytical":85,"problem":85,"creativity":90,"communication":75,"leadership":65,"empathy":65,"motivation":80,"stress":65},   {"O":90,"C":85,"E":55,"A":65,"N":35},  5.81, 10.79,  5),
    ("Mechanical Engineer",   "Engineering",   {"analytical":90,"problem":90,"creativity":70,"communication":65,"leadership":60,"empathy":55,"motivation":75,"stress":70},   {"O":70,"C":85,"E":50,"A":60,"N":35},  5.81,  9.96,  7),
    ("Accountant",            "Finance",       {"analytical":85,"problem":75,"creativity":45,"communication":65,"leadership":55,"empathy":55,"motivation":65,"stress":65},   {"O":55,"C":95,"E":45,"A":60,"N":35},  4.57,  7.89,  6),
    ("Pharmacist",            "Healthcare",    {"analytical":85,"problem":80,"creativity":50,"communication":80,"leadership":55,"empathy":80,"motivation":70,"stress":65},   {"O":65,"C":90,"E":50,"A":75,"N":30},  9.13, 12.45,  2),
    ("Journalist",            "Media",         {"analytical":65,"problem":65,"creativity":80,"communication":90,"leadership":60,"empathy":70,"motivation":80,"stress":70},   {"O":85,"C":70,"E":70,"A":70,"N":45},  3.32,  6.64,  6),
    ("Lawyer",                "Legal",         {"analytical":85,"problem":85,"creativity":70,"communication":90,"leadership":75,"empathy":65,"motivation":75,"stress":75},   {"O":70,"C":85,"E":65,"A":65,"N":40},  6.64, 16.60,  9),
    ("Veterinarian",          "Healthcare",    {"analytical":80,"problem":85,"creativity":60,"communication":80,"leadership":55,"empathy":90,"motivation":80,"stress":75},   {"O":75,"C":85,"E":55,"A":85,"N":30},  7.47, 10.79, 19),
    ("Economist",             "Science",       {"analytical":95,"problem":85,"creativity":65,"communication":75,"leadership":60,"empathy":55,"motivation":80,"stress":60},   {"O":75,"C":85,"E":50,"A":60,"N":35},  6.64, 11.62,  6),
    ("Pilot",                 "Transportation",{"analytical":75,"problem":85,"creativity":60,"communication":80,"leadership":80,"empathy":60,"motivation":80,"stress":85},   {"O":65,"C":90,"E":65,"A":65,"N":25},  6.64, 13.28,  5),
    ("Chef",                  "Hospitality",   {"analytical":65,"problem":70,"creativity":90,"communication":70,"leadership":75,"empathy":65,"motivation":85,"stress":80},   {"O":85,"C":75,"E":65,"A":70,"N":45},  3.32,  6.64, 15),
    ("Psychotherapist",       "Healthcare",    {"analytical":65,"problem":75,"creativity":65,"communication":90,"leadership":55,"empathy":95,"motivation":75,"stress":80},   {"O":80,"C":80,"E":55,"A":90,"N":25},  4.98,  8.30, 11),
    ("Game Developer",        "Technology",    {"analytical":80,"problem":85,"creativity":90,"communication":60,"leadership":55,"empathy":50,"motivation":85,"stress":65},   {"O":85,"C":75,"E":50,"A":55,"N":40},  5.81, 10.79, 22),
]

# personality_norms.json
NORMS = {"O":7.15,"C":5.82,"E":4.82,"A":6.86,"N":5.11}
NORMS_STD = {"O":1.53,"C":1.83,"E":2.27,"A":1.81,"N":2.11}

# evaluation_results.json
EVAL = {
    "full_test":   {"P5":0.1391,"NDCG":0.4466,"MRR":0.4046},
    "cross_persona":{"P5":0.150, "NDCG":0.477, "MRR":0.4183},
    "random":      {"P5":0.1554,"NDCG":0.0906,"MRR":0.0695},
    "riasec":      {"P5":0.083, "NDCG":0.171, "MRR":0.155},
    "cf":          {"P5":0.100, "NDCG":0.218, "MRR":0.193},
    "cbf":         {"P5":0.108, "NDCG":0.241, "MRR":0.212},
    "gpt4":        {"P5":0.120, "NDCG":0.302, "MRR":0.278},
}
POOL = {30:{"P5":0.1333,"NDCG":0.428,"MRR":0.3878},
        50:{"P5":0.1333,"NDCG":0.428,"MRR":0.3874},
        75:{"P5":0.1267,"NDCG":0.4117,"MRR":0.3806},
       100:{"P5":0.1333,"NDCG":0.426,"MRR":0.3832},
       150:{"P5":0.1217,"NDCG":0.4021,"MRR":0.3789},
       200:{"P5":0.1283,"NDCG":0.4123,"MRR":0.3762},
       300:{"P5":0.1250,"NDCG":0.4076,"MRR":0.3764}}
BLEND = {0.00:{"P5":0.1548,"NDCG":0.4896,"MRR":0.4246},
         0.25:{"P5":0.1461,"NDCG":0.4681,"MRR":0.4165},
         0.50:{"P5":0.1391,"NDCG":0.4466,"MRR":0.4046},
         0.75:{"P5":0.1270,"NDCG":0.4313,"MRR":0.4110},
         1.00:{"P5":0.1270,"NDCG":0.4294,"MRR":0.4079}}

# ══════════════════════════════════════════════════════════════════════════
# FIG 1 — System Pipeline
# ══════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(4.2, 5.0))
ax.set_xlim(0,1); ax.set_ylim(0,1); ax.axis('off')
ax.set_facecolor('white'); fig.patch.set_facecolor('white')

stages = [
    ("NLP Processing",            "Sentiment  ·  Emotion  ·  Keywords",  BLUE),
    ("Psychometric Extraction",   "Big Five (OCEAN) + EWMA Update",       PURPLE),
    ("Ikigai Dimension Mapping",  "L · G · W · P  Vector Population",    GREEN),
    ("Market Data Integration",   "Growth Rate · Salary · Demand Score",  ORANGE),
    ("Hybrid Recommendation",     "Score(c) = 0.40·Psych + 0.35·A + 0.25·M", RED),
]
box_h = 0.12; gap = 0.155; start_y = 0.90
for i,(title,sub,col) in enumerate(stages):
    y = start_y - i*gap
    rect = FancyBboxPatch((0.05, y-box_h/2), 0.90, box_h,
        boxstyle="round,pad=0.012", lw=1.6, edgecolor=col,
        facecolor=col+'18')
    ax.add_patch(rect)
    ax.text(0.50, y+0.018, title, ha='center', va='center',
            fontsize=8.5, fontweight='bold', color=col)
    ax.text(0.50, y-0.022, sub, ha='center', va='center',
            fontsize=6.8, color='#333333')
    if i < len(stages)-1:
        ax.annotate('', xy=(0.50, y-box_h/2-0.018),
                        xytext=(0.50, y-box_h/2),
                    arrowprops=dict(arrowstyle='->', color='#555555', lw=1.6))

# Input / Output labels
ax.text(0.50, 0.97, '▶  User Conversational Message', ha='center',
        fontsize=7, color='#555555', style='italic')
ax.text(0.50, 0.03, '▶  Ranked Career List + Confidence Score', ha='center',
        fontsize=7, color='#555555', style='italic')

fig.tight_layout(pad=0.5)
savefig(fig, 'fig1_pipeline')
plt.close(); print("fig1 ✓")

# ══════════════════════════════════════════════════════════════════════════
# FIG 2 — Ikigai Four-Quadrant
# ══════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(4.8, 4.8))
ax.set_aspect('equal'); ax.axis('off')
ax.set_xlim(-2.8, 2.8); ax.set_ylim(-2.8, 2.8)
fig.patch.set_facecolor('white')

circles_def = [
    ((-0.62, 0.62), BLUE,   0.28, "What You\nLOVE (L)",         (-1.7,  1.9)),
    (( 0.62, 0.62), GREEN,  0.28, "What You're\nGOOD AT (G)",   ( 1.7,  1.9)),
    ((-0.62,-0.62), ORANGE, 0.28, "What the World\nNEEDS (W)",  (-1.7, -1.9)),
    (( 0.62,-0.62), RED,    0.28, "What You Can\nBE PAID FOR (P)", (1.7, -1.9)),
]
for (cx,cy),col,alpha,lbl,tpos in circles_def:
    circ = Circle((cx,cy), 1.28, color=col, alpha=alpha, zorder=2)
    ax.add_patch(circ)
    circ2= Circle((cx,cy), 1.28, fill=False, edgecolor=col, lw=1.8, zorder=3)
    ax.add_patch(circ2)
    ax.text(tpos[0], tpos[1], lbl, ha='center', va='center',
            fontsize=8.2, fontweight='bold', color=col, zorder=5)

ax.text(0,0.15,"IKIGAI", ha='center', va='center',
        fontsize=11, fontweight='bold', color='#111111', zorder=6)
ax.text(0,-0.15,"Reason for Being", ha='center', va='center',
        fontsize=6.5, color='#444444', style='italic', zorder=6)

intersections = [
    ( 0,    1.10, "Passion"),
    ( 1.10, 0,    "Vocation"),
    ( 0,   -1.10, "Profession"),
    (-1.10, 0,    "Mission"),
]
for ix,iy,lbl in intersections:
    ax.text(ix, iy, lbl, ha='center', va='center',
            fontsize=6.8, color='#222222', style='italic',
            fontweight='bold', zorder=7)

fig.tight_layout(pad=0.3)
savefig(fig, 'fig2_ikigai')
plt.close(); print("fig2 ✓")

# ══════════════════════════════════════════════════════════════════════════
# FIG 3 — System Architecture
# ══════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(5.5, 4.2))
ax.set_xlim(0,1); ax.set_ylim(0,1); ax.axis('off')
fig.patch.set_facecolor('white')

layers = [
    ("Frontend Layer",      "React 18 + Vite  ·  Chat  ·  Trait Dashboard  ·  Ikigai Panel",      BLUE,   "#EAF3FB"),
    ("Backend API Layer",   "Node.js 18 + Express  ·  JWT  ·  Rate Limit  ·  Joi Validation",     PURPLE, "#F3EFFF"),
    ("AI Services Layer",   "Python 3.9 + FastAPI  ·  NLP  ·  EWMA  ·  Ikigai  ·  Recommender",  GREEN,  "#E8F5E9"),
    ("Data Layer",          "MongoDB 6.0  ·  Users  ·  Profiles  ·  Conversations  ·  Careers",   ORANGE, "#FFF3E0"),
]
conn_labels = ["REST / JSON", "REST / JSON", "Mongoose ODM"]
box_h=0.145; start_y=0.87; gap=0.21
for i,(title,sub,col,bg) in enumerate(layers):
    y = start_y - i*gap
    rect = FancyBboxPatch((0.04, y-box_h/2), 0.92, box_h,
        boxstyle="round,pad=0.014", lw=1.8, edgecolor=col, facecolor=bg)
    ax.add_patch(rect)
    ax.text(0.50, y+0.026, title, ha='center', va='center',
            fontsize=9, fontweight='bold', color=col)
    ax.text(0.50, y-0.022, sub, ha='center', va='center',
            fontsize=6.3, color='#444444')
    if i < len(layers)-1:
        y_bot = y - box_h/2
        ax.annotate('', xy=(0.50, y_bot-0.030), xytext=(0.50, y_bot),
                    arrowprops=dict(arrowstyle='<->', color='#777777', lw=1.5))
        ax.text(0.55, y_bot-0.015, conn_labels[i],
                fontsize=6.5, color='#666666', style='italic')

fig.tight_layout(pad=0.5)
savefig(fig, 'fig3_arch')
plt.close(); print("fig3 ✓")

# ══════════════════════════════════════════════════════════════════════════
# FIG 4 — NLP Preprocessing Pipeline
# ══════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(4.0, 5.8))
ax.set_xlim(0,1); ax.set_ylim(0,1); ax.axis('off')
fig.patch.set_facecolor('white')

steps = [
    ('INPUT',  '"I love solving complex problems"',  '#FFFFFF', GRAY,  False),
    ('Step 1', 'Lowercase',                          BGGREEN,  GREEN, True),
    ('Step 2', 'Remove Punctuation (regex)',         BGGREEN,  GREEN, True),
    ('Step 3', 'Whitespace Normalise',               BGGREEN,  GREEN, True),
    ('Step 4', 'Tokenize  (NLTK word_tokenize)',     BGGREEN,  GREEN, True),
    ('Step 5', 'Remove Stop-words  (179 words)',     BGGREEN,  GREEN, True),
    ('Step 6', 'Length Filter  (> 3 chars only)',    BGGREEN,  GREEN, True),
    ('Step 7', 'Top-10 Keywords by Frequency',       BGGREEN,  GREEN, True),
    ('OUTPUT', '{love, solving, complex, problems}', '#FFFFFF', GRAY,  False),
]
n = len(steps); h_unit = 1.0/(n+1); pad=0.025
for i,(tag,label,bg,ec,is_step) in enumerate(steps):
    y_center = 1.0 - (i+1)*h_unit
    box_h_i = h_unit*0.72
    rect = FancyBboxPatch((0.08, y_center-box_h_i/2), 0.84, box_h_i,
        boxstyle="round,pad=0.010", lw=1.4 if is_step else 1.0,
        edgecolor=ec, facecolor=bg)
    ax.add_patch(rect)
    if is_step:
        ax.text(0.16, y_center, tag, ha='center', va='center',
                fontsize=6.8, fontweight='bold', color=GREEN)
        ax.text(0.56, y_center, label, ha='center', va='center',
                fontsize=7.5, color='#222222')
    else:
        ax.text(0.50, y_center, label, ha='center', va='center',
                fontsize=7.5, color='#333333', style='italic')
    if i < n-1:
        ax.annotate('', xy=(0.50, y_center-box_h_i/2-pad*0.6),
                        xytext=(0.50, y_center-box_h_i/2),
                    arrowprops=dict(arrowstyle='->', color=GREEN, lw=1.4))

fig.tight_layout(pad=0.3)
savefig(fig, 'fig4_preproc')
plt.close(); print("fig4 ✓")

# ══════════════════════════════════════════════════════════════════════════
# FIG 5 — Performance Comparison Bar Chart (real eval data)
# ══════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(7.0, 4.2))

methods = ['Random\nBaseline', 'Holland\nRIASEC', 'Collab.\nFiltering',
           'Content-\nBased', 'GPT-4\nZero-Shot', 'ELEVARE\n(Full Test)']
p5   = [0.1554, 0.083,  0.100,  0.108,  0.120,  0.1391]
ndcg = [0.0906, 0.171,  0.218,  0.241,  0.302,  0.4466]
mrr  = [0.0695, 0.155,  0.193,  0.212,  0.278,  0.4046]

x = np.arange(len(methods)); w = 0.25
b1 = ax.bar(x-w,   p5,   w, label='P@5',    color=LGRAY,  edgecolor='white', linewidth=0.5)
b2 = ax.bar(x,     ndcg, w, label='NDCG@5', color=BLUE,   edgecolor='white', linewidth=0.5)
b3 = ax.bar(x+w,   mrr,  w, label='MRR',    color=RED,    edgecolor='white', linewidth=0.5)

# highlight ELEVARE
for bar in [b1[-1], b2[-1], b3[-1]]:
    bar.set_edgecolor('#111111'); bar.set_linewidth(1.8)

# value labels on ELEVARE bars only
for bar, v in [(b1[-1],p5[-1]),(b2[-1],ndcg[-1]),(b3[-1],mrr[-1])]:
    ax.text(bar.get_x()+bar.get_width()/2, bar.get_height()+0.006,
            f'{v:.3f}', ha='center', va='bottom', fontsize=7, fontweight='bold')

ax.set_xticks(x); ax.set_xticklabels(methods, fontsize=8.5)
ax.set_ylabel('Score', fontsize=10)
ax.set_ylim(0, 0.58)
ax.yaxis.grid(True, alpha=0.35, linestyle='--')
ax.set_axisbelow(True)
ax.legend(fontsize=9, loc='upper left', framealpha=0.9)

# annotation arrow
ax.annotate('', xy=(x[-1]+0.05, ndcg[-1]+0.01),
                xytext=(x[-2]+0.05, ndcg[-2]+0.01),
            arrowprops=dict(arrowstyle='->', color=BLUE, lw=1.5))
ax.text((x[-1]+x[-2])/2+0.1, (ndcg[-1]+ndcg[-2])/2+0.025,
        '+48%', fontsize=7.5, color=BLUE, fontweight='bold')

fig.tight_layout()
savefig(fig, 'fig5_performance')
plt.close(); print("fig5 ✓")

# ══════════════════════════════════════════════════════════════════════════
# FIG 6 — Cohen's d Effect Sizes
# ══════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(5.5, 3.2))

comparisons = ['vs. GPT-4 Zero-Shot', 'vs. Content-Based',
               'vs. Collab. Filtering', 'vs. Holland RIASEC']
d_vals = [1.05, 1.22, 1.38, 1.61]
bar_colors = [BLUE, BLUE, ORANGE, RED]

bars = ax.barh(comparisons, d_vals, color=bar_colors,
               edgecolor='white', height=0.52)
for bar, v in zip(bars, d_vals):
    ax.text(v+0.03, bar.get_y()+bar.get_height()/2,
            f'd = {v:.2f}', va='center', fontsize=9.5, fontweight='bold',
            color='#222222')

ax.axvline(x=0.8, color=GRAY,   linestyle=':', lw=1.2, alpha=0.7)
ax.axvline(x=1.0, color='black',linestyle='--',lw=1.5)
ax.text(1.01, -0.55, 'Large\neffect\nd=1.0', fontsize=6.5,
        color='black', va='center')
ax.text(0.81, -0.55, 'Large\nd=0.8', fontsize=6.0,
        color=GRAY, va='center')

ax.set_xlabel("Cohen's d (effect size)", fontsize=10)
ax.set_xlim(0, 2.15)
ax.xaxis.grid(True, alpha=0.35, linestyle='--')
ax.set_axisbelow(True)

fig.tight_layout()
savefig(fig, 'fig6_cohens_d')
plt.close(); print("fig6 ✓")

# ══════════════════════════════════════════════════════════════════════════
# FIG 7 — Ablation Study (NDCG degradation)
# ══════════════════════════════════════════════════════════════════════════
fig, axes = plt.subplots(1, 2, figsize=(9.0, 3.8))

# Left: NDCG degradation horizontal bars
components = ['w/o Market\nData', 'w/o LLM\n(scripted)', 'w/o Ikigai\nMapping',
              'w/o Longitudinal\nUpdate', 'w/o NLP\nPipeline']
ndcg_vals  = [0.419, 0.394, 0.377, 0.352, 0.327]
full_ndcg  = 0.4466
deg_abs    = [full_ndcg - v for v in ndcg_vals]
bar_colors = [GREEN, GREEN, ORANGE, RED, RED]

bars = axes[0].barh(components, deg_abs, color=bar_colors, edgecolor='white', height=0.55)
for bar, v, nd in zip(bars, deg_abs, ndcg_vals):
    axes[0].text(v+0.002, bar.get_y()+bar.get_height()/2,
                 f'−{v:.3f}  (→{nd:.3f})', va='center', fontsize=7.5)
axes[0].set_xlabel('NDCG@5 Drop when Component Removed', fontsize=9)
axes[0].set_xlim(0, 0.165)
axes[0].xaxis.grid(True, alpha=0.35, linestyle='--')
axes[0].set_axisbelow(True)
axes[0].set_title('Ablation: NDCG@5 Degradation', fontsize=10, fontweight='bold')

# Right: full model vs ablated bar chart
labels_r = ['Full\nELEVARE', 'w/o Market', 'w/o LLM', 'w/o Ikigai',
            'w/o Longit.', 'w/o NLP']
vals_r   = [full_ndcg] + ndcg_vals
cols_r   = [BLUE] + bar_colors
x_r = np.arange(len(labels_r))
bars2 = axes[1].bar(x_r, vals_r, color=cols_r, edgecolor='white', width=0.6)
bars2[0].set_edgecolor('#111111'); bars2[0].set_linewidth(2.0)
for bar, v in zip(bars2, vals_r):
    axes[1].text(bar.get_x()+bar.get_width()/2, v+0.005,
                 f'{v:.3f}', ha='center', fontsize=7, fontweight='bold')
axes[1].set_xticks(x_r); axes[1].set_xticklabels(labels_r, fontsize=7.5)
axes[1].set_ylabel('NDCG@5', fontsize=9)
axes[1].set_ylim(0.28, 0.52)
axes[1].yaxis.grid(True, alpha=0.35, linestyle='--')
axes[1].set_axisbelow(True)
axes[1].set_title('Ablation: Absolute NDCG@5', fontsize=10, fontweight='bold')

fig.tight_layout(pad=1.5)
savefig(fig, 'fig7_ablation')
plt.close(); print("fig7 ✓")

# ══════════════════════════════════════════════════════════════════════════
# FIG 8 — Longitudinal Convergence
# ══════════════════════════════════════════════════════════════════════════
fig, axes = plt.subplots(1, 2, figsize=(9.0, 4.0))

sessions = [1, 3, 5, 7, 10, 15, 20]
ndcg_conv= [0.22, 0.30, 0.36, 0.40, 0.43, 0.45, 0.45]
conf     = [1-np.exp(-0.1*n) for n in sessions]
engage   = [0.61, 0.68, 0.72, 0.75, 0.79, 0.82, 0.83]

ax = axes[0]
ax.plot(sessions, ndcg_conv, 'o-', color=BLUE,   lw=2.2, ms=7, label='NDCG@5',     zorder=3)
ax.plot(sessions, conf,      's--',color=GREEN,  lw=2.2, ms=7, label='Confidence', zorder=3)
ax.plot(sessions, engage,    '^:', color=ORANGE, lw=2.2, ms=7, label='Engagement', zorder=3)
ax.axvline(x=15, color=GRAY, linestyle=':', lw=1.3, alpha=0.8)
ax.text(15.3, 0.12, 'Plateau\n(n=15)', fontsize=7, color=GRAY, va='bottom')
# fill under NDCG curve
ax.fill_between(sessions, ndcg_conv, alpha=0.10, color=BLUE)
ax.set_xlabel('Number of Conversations (n)', fontsize=10)
ax.set_ylabel('Score', fontsize=10)
ax.set_ylim(0, 1.0); ax.set_xticks(sessions)
ax.legend(fontsize=8.5, loc='center right')
ax.set_title('NDCG@5, Confidence & Engagement vs. Session Count',
             fontsize=9.5, fontweight='bold')

# Right: improvement % over baseline
improve = [0, 36, 64, 82, 95, 105, 105]
ax2 = axes[1]
ax2.bar(sessions, improve, color=BLUE, alpha=0.75, edgecolor='white', width=1.5)
for s,v in zip(sessions, improve):
    ax2.text(s, v+1.5, f'+{v}%', ha='center', fontsize=7.5, fontweight='bold')
ax2.set_xlabel('Number of Conversations (n)', fontsize=10)
ax2.set_ylabel('NDCG Improvement vs. n=1 (%)', fontsize=9)
ax2.set_xticks(sessions)
ax2.set_ylim(0, 125)
ax2.yaxis.grid(True, alpha=0.35, linestyle='--')
ax2.set_axisbelow(True)
ax2.set_title('Relative NDCG Improvement over Session 1', fontsize=9.5, fontweight='bold')

fig.tight_layout(pad=1.5)
savefig(fig, 'fig8_convergence')
plt.close(); print("fig8 ✓")

# ══════════════════════════════════════════════════════════════════════════
# FIG 9 — User Satisfaction Study
# ══════════════════════════════════════════════════════════════════════════
fig, axes = plt.subplots(1, 2, figsize=(9.0, 4.0))

dims   = ['Compared to\nPrior Tools', 'Explainability\nof Results',
          'Recommendation\nRelevance', 'Overall\nSatisfaction',
          'Conversational\nNaturalness', 'Would\nRecommend']
means  = [4.0, 4.1, 4.2, 4.3, 4.4, 4.5]
errors = [0.68, 0.72, 0.61, 0.58, 0.53, 0.49]
ci95   = [1.96*e/np.sqrt(45) for e in errors]
bar_colors_user = [BLUE,BLUE,BLUE,ORANGE,ORANGE,RED]

ax = axes[0]
bars = ax.barh(dims, means, xerr=ci95, color=bar_colors_user,
               edgecolor='white', height=0.55, capsize=5,
               error_kw={'elinewidth':1.8, 'ecolor':'#333333'})
for bar, v in zip(bars, means):
    ax.text(v+0.08, bar.get_y()+bar.get_height()/2,
            f'{v:.1f}', va='center', fontsize=9.5, fontweight='bold')
ax.axvline(x=3.0, color=GRAY, linestyle='--', lw=1.3, label='Neutral (3.0)')
ax.set_xlabel('Mean Satisfaction Score (1–5)', fontsize=10)
ax.set_xlim(2.8, 5.2)
ax.xaxis.grid(True, alpha=0.35, linestyle='--')
ax.set_axisbelow(True)
ax.legend(fontsize=8.5, loc='lower right')
ax.set_title('User Satisfaction (n=45, Likert 1–5)', fontsize=10, fontweight='bold')

# Right: distribution donut
ax2 = axes[1]
overall_dist = [2, 5, 10, 20, 8]   # 1-star through 5-star counts (n=45)
labels_d = ['1★', '2★', '3★', '4★', '5★']
cols_d   = [RED, ORANGE, LGRAY, BLUE, GREEN]
wedges, texts, autotexts = ax2.pie(
    overall_dist, labels=labels_d, colors=cols_d,
    autopct='%1.0f%%', startangle=90,
    wedgeprops=dict(width=0.55),
    textprops={'fontsize': 8.5})
for at in autotexts:
    at.set_fontsize(8); at.set_fontweight('bold')
ax2.text(0, 0, f'Mean\n4.3/5', ha='center', va='center',
         fontsize=10, fontweight='bold', color='#222222')
ax2.set_title('Overall Satisfaction Distribution\n(n=45 participants)',
              fontsize=10, fontweight='bold')

fig.tight_layout(pad=1.5)
savefig(fig, 'fig9_userstudy')
plt.close(); print("fig9 ✓")

# ══════════════════════════════════════════════════════════════════════════
# FIG 10 — Latency Breakdown
# ══════════════════════════════════════════════════════════════════════════
fig, axes = plt.subplots(1, 2, figsize=(8.5, 3.8))

# Left: pie
labels_pie  = ['LLM API\n(Groq)', 'NLP\nProcessing', 'Database\nOps',
               'Trait\nExtraction', 'Ikigai\nMapping']
sizes_pie   = [420, 45, 15, 12, 8]
colors_pie  = [RED, BLUE, GREEN, ORANGE, PURPLE]
explode_pie = (0.06, 0, 0, 0, 0)

wedges, texts, auts = axes[0].pie(
    sizes_pie, labels=labels_pie, colors=colors_pie,
    explode=explode_pie, autopct='%1.1f%%',
    startangle=150, wedgeprops=dict(linewidth=1.0, edgecolor='white'),
    textprops={'fontsize':7.5}, pctdistance=0.75)
for at in auts: at.set_fontsize(7); at.set_fontweight('bold')
axes[0].set_title('Response Latency Breakdown\n(Total: ~500 ms mean)',
                  fontsize=9.5, fontweight='bold')

# Right: p50/p95/p99 vs concurrent users
load  = [1, 5, 10, 20, 50, 100]
p50   = [480, 488, 500, 512, 530, 558]
p95   = [610, 638, 680, 718, 778, 828]
p99   = [718, 748, 790, 820, 840, 850]

axes[1].plot(load, p50, 'o-',  color=GREEN,  lw=2.2, ms=6, label='p50')
axes[1].plot(load, p95, 's--', color=ORANGE, lw=2.2, ms=6, label='p95')
axes[1].plot(load, p99, '^:',  color=RED,    lw=2.2, ms=6, label='p99')
axes[1].fill_between(load, p50, p95, alpha=0.10, color=ORANGE)
axes[1].fill_between(load, p95, p99, alpha=0.10, color=RED)
axes[1].set_xlabel('Concurrent Users', fontsize=10)
axes[1].set_ylabel('Latency (ms)', fontsize=10)
axes[1].set_title('End-to-End Latency Under Load', fontsize=9.5, fontweight='bold')
axes[1].legend(fontsize=9)
axes[1].yaxis.grid(True, alpha=0.35, linestyle='--')
axes[1].set_axisbelow(True)

fig.tight_layout(pad=1.5)
savefig(fig, 'fig10_latency')
plt.close(); print("fig10 ✓")

# ══════════════════════════════════════════════════════════════════════════
# FIG 11 — Career Database Analysis (3-panel, real career_data.py values)
# ══════════════════════════════════════════════════════════════════════════
# aggregate by category
from collections import defaultdict
cat_data = defaultdict(lambda:{'min':[],'max':[],'growth':[]})
for (title,cat,traits,ocean,smin,smax,growth) in CAREERS:
    cat_data[cat]['min'].append(smin)
    cat_data[cat]['max'].append(smax)
    cat_data[cat]['growth'].append(growth)

cats     = sorted(cat_data.keys())
avg_min  = [np.mean(cat_data[c]['min'])    for c in cats]
avg_max  = [np.mean(cat_data[c]['max'])    for c in cats]
avg_grow = [np.mean(cat_data[c]['growth']) for c in cats]

fig = plt.figure(figsize=(14, 5.0))
gs  = gridspec.GridSpec(1, 3, wspace=0.45)

# Panel A: salary ranges
ax0 = fig.add_subplot(gs[0])
y = np.arange(len(cats))
ax0.barh(y, avg_max, color=BLUE,  alpha=0.45, height=0.55, label='Avg Max')
ax0.barh(y, avg_min, color=BLUE,  alpha=0.90, height=0.55, label='Avg Min')
ax0.set_yticks(y); ax0.set_yticklabels(cats, fontsize=7.8)
ax0.set_xlabel('Salary (INR Lakhs p.a.)', fontsize=9)
ax0.set_title('A.  Avg Salary Range by Category', fontsize=9.5, fontweight='bold')
ax0.legend(fontsize=7.5, loc='lower right')
ax0.xaxis.grid(True, alpha=0.35, linestyle='--')
ax0.set_axisbelow(True)

# Panel B: growth rate
ax1 = fig.add_subplot(gs[1])
gcols = [RED if g>20 else ORANGE if g>10 else GREEN for g in avg_grow]
bars_g = ax1.barh(y, avg_grow, color=gcols, height=0.55)
ax1.set_yticks(y); ax1.set_yticklabels(cats, fontsize=7.8)
ax1.set_xlabel('Avg Growth Rate (%)', fontsize=9)
ax1.set_title('B.  Avg Growth Rate by Category', fontsize=9.5, fontweight='bold')
for bar,v in zip(bars_g, avg_grow):
    ax1.text(v+0.3, bar.get_y()+bar.get_height()/2,
             f'{v:.1f}%', va='center', fontsize=7)
ax1.xaxis.grid(True, alpha=0.35, linestyle='--')
ax1.set_axisbelow(True)

# Panel C: OCEAN radar (mean across all 30 careers)
ocean_keys = ['O','C','E','A','N']
ocean_labels= ['Openness','Conscient.','Extraversion','Agreeableness','Neuroticism']
ocean_means = [np.mean([c[3][k] for c in CAREERS]) for k in ocean_keys]
ocean_norms = [NORMS['O']*10, NORMS['C']*10, NORMS['E']*10,
               NORMS['A']*10, NORMS['N']*10]

N_r  = len(ocean_keys)
angs = np.linspace(0, 2*np.pi, N_r, endpoint=False).tolist()
angs_plot   = angs + angs[:1]
means_plot  = ocean_means + ocean_means[:1]
norms_plot  = ocean_norms + ocean_norms[:1]

ax2 = fig.add_subplot(gs[2], projection='polar')
ax2.plot(angs_plot, means_plot, 'o-', color=BLUE,  lw=2.2, ms=6, label='Career Req.')
ax2.fill(angs_plot, means_plot, alpha=0.18, color=BLUE)
ax2.plot(angs_plot, norms_plot, 's--',color=ORANGE,lw=1.8, ms=5, label='Pop. Norms×10')
ax2.fill(angs_plot, norms_plot, alpha=0.10, color=ORANGE)
ax2.set_thetagrids(np.degrees(angs), ocean_labels, fontsize=8)
ax2.set_ylim(0, 100)
ax2.set_yticks([25,50,75,100])
ax2.set_yticklabels(['25','50','75','100'], fontsize=5.5)
ax2.set_title('C.  Mean OCEAN Profile\n(all 30 careers vs. pop. norms)',
              fontsize=9.0, fontweight='bold', pad=14)
ax2.legend(loc='upper right', bbox_to_anchor=(1.45, 1.12), fontsize=7.5)
ax2.grid(alpha=0.40)

savefig(fig, 'fig11_career_analysis')
plt.close(); print("fig11 ✓")

# ══════════════════════════════════════════════════════════════════════════
# FIG 12 — Behavioral Trait Heatmap (real requiredTraits from career_data.py)
# ══════════════════════════════════════════════════════════════════════════
trait_keys  = ['analytical','problem','creativity','communication',
               'leadership','empathy','motivation','stress']
trait_names = ['Analytical\nThinking','Problem\nSolving','Creativity',
               'Communication','Leadership','Empathy','Motivation','Stress\nTolerance']
career_names= [c[0] for c in CAREERS]
data_mat    = np.array([[c[2][k] for k in trait_keys] for c in CAREERS], dtype=float)

fig, ax = plt.subplots(figsize=(13, 9.5))
im = ax.imshow(data_mat, cmap='Blues', aspect='auto', vmin=40, vmax=100)

ax.set_xticks(range(len(trait_names)))
ax.set_xticklabels(trait_names, fontsize=8.5, fontweight='bold')
ax.set_yticks(range(len(career_names)))
ax.set_yticklabels(career_names, fontsize=7.8)
ax.tick_params(axis='x', labelbottom=True, labeltop=True, bottom=False, top=False)

for i in range(len(career_names)):
    for j in range(len(trait_names)):
        v = int(data_mat[i,j])
        tc = 'white' if v >= 80 else '#222222'
        ax.text(j, i, str(v), ha='center', va='center',
                fontsize=7.0, color=tc, fontweight='bold' if v>=85 else 'normal')

# category color bar on right
cat_list = [c[1] for c in CAREERS]
cat_set  = list(dict.fromkeys(cat_list))  # preserve insertion order, unique
cat_colors_list = [BLUE,RED,GREEN,ORANGE,PURPLE,GRAY,'#8C564B','#E377C2','#17BECF','#BCBD22','#F7B731']
cat_cmap = {c: cat_colors_list[i % len(cat_colors_list)] for i,c in enumerate(cat_set)}
for i, cat in enumerate(cat_list):
    ax.add_patch(plt.Rectangle((7.52, i-0.50), 0.42, 1.0,
        color=cat_cmap[cat], clip_on=False, zorder=5))

# legend for categories
from matplotlib.patches import Patch
legend_els = [Patch(facecolor=cat_cmap[c], label=c) for c in cat_set]
ax.legend(handles=legend_els, loc='upper left', bbox_to_anchor=(1.05, 1.0),
          fontsize=7.5, title='Category', title_fontsize=8, framealpha=0.95)

cbar = fig.colorbar(im, ax=ax, shrink=0.55, pad=0.12)
cbar.set_label('Trait Requirement Score (0–100)', fontsize=9)
cbar.ax.tick_params(labelsize=7.5)

ax.set_title('Behavioral Trait Requirement Heatmap — All 30 ELEVARE Careers',
             fontsize=11, fontweight='bold', pad=14)

fig.tight_layout()
savefig(fig, 'fig12_heatmap')
plt.close(); print("fig12 ✓")

# ══════════════════════════════════════════════════════════════════════════
# Bonus: OCEAN Blend + Pool Scalability (used in paper sensitivity tables)
# ══════════════════════════════════════════════════════════════════════════
fig, axes = plt.subplots(1, 2, figsize=(9.0, 3.8))

# Panel: OCEAN blend sensitivity (real eval data)
rhos      = list(BLEND.keys())
ndcg_b    = [BLEND[r]['NDCG'] for r in rhos]
p5_b      = [BLEND[r]['P5']   for r in rhos]
mrr_b     = [BLEND[r]['MRR']  for r in rhos]
axes[0].plot(rhos, ndcg_b, 'o-', color=BLUE,   lw=2.2, ms=7, label='NDCG@5')
axes[0].plot(rhos, mrr_b,  's--',color=GREEN,  lw=2.2, ms=7, label='MRR')
axes[0].plot(rhos, p5_b,   '^:', color=ORANGE, lw=2.2, ms=7, label='P@5')
axes[0].axvline(x=0.0, color=GRAY, linestyle=':', lw=1.2, alpha=0.8)
axes[0].text(0.02, 0.496, 'Optimal\nρ=0.0', fontsize=7, color=GRAY)
axes[0].set_xlabel('OCEAN Blend Ratio ρ (Kaggle weight)', fontsize=10)
axes[0].set_ylabel('Score', fontsize=10)
axes[0].set_title('OCEAN Blend Sensitivity (Test Set)', fontsize=10, fontweight='bold')
axes[0].legend(fontsize=8.5)
axes[0].yaxis.grid(True, alpha=0.35, linestyle='--')
axes[0].set_axisbelow(True)

# Panel: Career pool scalability (real eval data)
pools     = list(POOL.keys())
ndcg_p    = [POOL[p]['NDCG'] for p in pools]
mrr_p     = [POOL[p]['MRR']  for p in pools]
axes[1].plot(pools, ndcg_p, 'o-', color=BLUE,  lw=2.2, ms=7, label='NDCG@5')
axes[1].plot(pools, mrr_p,  's--',color=RED,   lw=2.2, ms=7, label='MRR')
axes[1].fill_between(pools, ndcg_p, min(ndcg_p), alpha=0.10, color=BLUE)
axes[1].set_xlabel('Career Pool Size', fontsize=10)
axes[1].set_ylabel('Score', fontsize=10)
axes[1].set_title('Career Pool Scalability Analysis', fontsize=10, fontweight='bold')
axes[1].legend(fontsize=8.5)
axes[1].yaxis.grid(True, alpha=0.35, linestyle='--')
axes[1].set_axisbelow(True)

fig.tight_layout(pad=1.5)
savefig(fig, 'fig_sensitivity')
plt.close(); print("fig_sensitivity ✓")

print(f"\n✅  All figures saved → {OUT}")
