import sys
sys.path.append('../ai-services')

from data.career_data import CAREER_DATABASE

print("Testing Career Dataset...\n")

# Test 1: Dataset loaded
print(f"[TEST] Dataset Loading")
print(f"  Total careers: {len(CAREER_DATABASE)}")

# Test 2: Validate structure
print(f"\n[TEST] Data Structure Validation")
required_fields = ['title', 'category', 'description', 'requiredTraits', 'personalityFit', 'skills', 'education', 'averageSalary', 'growthRate', 'ikigaiMapping']

all_valid = True
for idx, career in enumerate(CAREER_DATABASE):
    missing = [field for field in required_fields if field not in career]
    if missing:
        print(f"  [ERROR] Career {idx} missing: {missing}")
        all_valid = False

if all_valid:
    print(f"  [OK] All {len(CAREER_DATABASE)} careers have required fields")

# Test 3: Validate traits
print(f"\n[TEST] Trait Validation")
trait_fields = ['analyticalThinking', 'problemSolving', 'creativity', 'communication', 'empathy', 'leadership', 'motivation', 'stressTolerance']
personality_fields = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']

for career in CAREER_DATABASE:
    # Check trait values are in range 0-100
    for trait, value in career['requiredTraits'].items():
        if not (0 <= value <= 100):
            print(f"  [ERROR] {career['title']}: {trait} = {value} (out of range)")
            all_valid = False
    
    # Check personality values
    for trait, value in career['personalityFit'].items():
        if not (0 <= value <= 100):
            print(f"  [ERROR] {career['title']}: {trait} = {value} (out of range)")
            all_valid = False

if all_valid:
    print(f"  [OK] All trait values are valid (0-100)")

# Test 4: Category distribution
print(f"\n[TEST] Category Distribution")
categories = {}
for career in CAREER_DATABASE:
    cat = career['category']
    categories[cat] = categories.get(cat, 0) + 1

for cat, count in categories.items():
    print(f"  {cat}: {count} careers")

# Test 5: Skills coverage
print(f"\n[TEST] Skills Coverage")
all_skills = set()
for career in CAREER_DATABASE:
    all_skills.update(career['skills'])
print(f"  Total unique skills: {len(all_skills)}")
print(f"  Sample skills: {list(all_skills)[:10]}")

# Test 6: Salary ranges
print(f"\n[TEST] Salary Information")
for career in CAREER_DATABASE:
    print(f"  {career['title']}: {career['averageSalary']}")

# Test 7: Ikigai mapping
print(f"\n[TEST] Ikigai Mapping")
ikigai_dimensions = ['passionArea', 'talentArea', 'demandArea', 'profitArea']
for career in CAREER_DATABASE:
    ikigai = career['ikigaiMapping']
    missing_dims = [dim for dim in ikigai_dimensions if dim not in ikigai]
    if missing_dims:
        print(f"  [ERROR] {career['title']} missing: {missing_dims}")
        all_valid = False

if all_valid:
    print(f"  [OK] All careers have complete Ikigai mapping")

# Summary
print(f"\n{'='*50}")
if all_valid:
    print("[SUCCESS] All dataset tests passed!")
    print(f"\nDataset Summary:")
    print(f"  - {len(CAREER_DATABASE)} careers")
    print(f"  - {len(categories)} categories")
    print(f"  - {len(all_skills)} unique skills")
    print(f"  - Complete trait mappings")
    print(f"  - Complete personality profiles")
    print(f"  - Complete Ikigai mappings")
else:
    print("[ERROR] Some tests failed!")
