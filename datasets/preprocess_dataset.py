"""
ELEVARE Dataset Preprocessor
Converts career_dataset.csv into career_data.py format
Run: python preprocess_dataset.py
"""

import csv
import os
import sys

CSV_PATH = os.path.join(os.path.dirname(__file__), 'career_dataset.csv')
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'ai-services', 'data', 'career_data.py')


def parse_list(value):
    return [item.strip() for item in value.split(',') if item.strip()]


def build_career(row):
    return {
        "title": row['title'],
        "category": row['category'],
        "description": row['description'],
        "requiredTraits": {
            "analyticalThinking": int(row['analytical_thinking']),
            "problemSolving":     int(row['problem_solving']),
            "creativity":         int(row['creativity']),
            "communication":      int(row['communication']),
            "leadership":         int(row['leadership']),
            "empathy":            int(row['empathy']),
            "motivation":         int(row['motivation']),
            "stressTolerance":    int(row['stress_tolerance']),
        },
        "personalityFit": {
            "openness":          int(row['openness']),
            "conscientiousness": int(row['conscientiousness']),
            "extraversion":      int(row['extraversion']),
            "agreeableness":     int(row['agreeableness']),
            "neuroticism":       int(row['neuroticism']),
        },
        "skills":    parse_list(row['skills']),
        "education": parse_list(row['education']),
        "averageSalary": f"${int(row['salary_min']):,} - ${int(row['salary_max']):,}",
        "growthRate": f"{row['growth_rate']}% growth",
        "ikigaiMapping": {
            "passionArea": parse_list(row['passion_area']),
            "talentArea":  parse_list(row['talent_area']),
            "demandArea":  parse_list(row['demand_area']),
            "profitArea":  parse_list(row['profit_area']),
        }
    }


def format_python(careers):
    lines = ["CAREER_DATABASE = ["]
    for i, c in enumerate(careers):
        lines.append("    {")
        lines.append(f'        "title": {repr(c["title"])},')
        lines.append(f'        "category": {repr(c["category"])},')
        lines.append(f'        "description": {repr(c["description"])},')

        lines.append('        "requiredTraits": {')
        for k, v in c["requiredTraits"].items():
            lines.append(f'            "{k}": {v},')
        lines.append('        },')

        lines.append('        "personalityFit": {')
        for k, v in c["personalityFit"].items():
            lines.append(f'            "{k}": {v},')
        lines.append('        },')

        lines.append(f'        "skills": {c["skills"]},')
        lines.append(f'        "education": {c["education"]},')
        lines.append(f'        "averageSalary": {repr(c["averageSalary"])},')
        lines.append(f'        "growthRate": {repr(c["growthRate"])},')

        lines.append('        "ikigaiMapping": {')
        for k, v in c["ikigaiMapping"].items():
            lines.append(f'            "{k}": {v},')
        lines.append('        }')

        comma = "," if i < len(careers) - 1 else ""
        lines.append(f"    }}{comma}")

    lines.append("]")
    return "\n".join(lines)


def main():
    if not os.path.exists(CSV_PATH):
        print(f"[ERROR] CSV not found: {CSV_PATH}")
        sys.exit(1)

    careers = []
    with open(CSV_PATH, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                careers.append(build_career(row))
            except Exception as e:
                print(f"[SKIP] {row.get('title', '?')}: {e}")

    if not careers:
        print("[ERROR] No careers parsed.")
        sys.exit(1)

    output = format_python(careers)

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(output + "\n")

    print(f"[OK] Written {len(careers)} careers to {OUTPUT_PATH}")

    # Quick validation
    categories = {}
    for c in careers:
        categories[c['category']] = categories.get(c['category'], 0) + 1

    print(f"\nSummary:")
    print(f"  Total careers : {len(careers)}")
    print(f"  Categories    : {len(categories)}")
    for cat, count in sorted(categories.items()):
        print(f"    {cat}: {count}")


if __name__ == "__main__":
    main()
