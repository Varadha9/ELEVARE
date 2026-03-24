"""
Synthetic Conversation Dataset Generator
Generates 1,200 labeled conversations for ELEVARE training/evaluation.
Output: datasets/synthetic_conversations.json
"""

import json
import random
import os

random.seed(42)

# 6 persona archetypes mapped to dominant OCEAN + traits + target careers
PERSONAS = [
    {
        "id": "analytical_introvert",
        "label": "Analytical Introvert",
        "ocean": {"openness": 7.5, "conscientiousness": 8.5, "extraversion": 3.0, "agreeableness": 5.5, "neuroticism": 4.0},
        "traits": ["analyticalThinking", "problemSolving", "motivation"],
        "target_careers": ["Software Engineer", "Data Scientist", "Financial Analyst", "Cybersecurity Analyst"],
        "emotion_bias": ["joy", "surprise"],
        "message_pool": [
            "I really enjoy solving complex algorithm problems in my free time.",
            "I spent the weekend debugging a tricky memory leak in my project.",
            "I love working with data and finding patterns that others miss.",
            "I prefer working alone on deep technical problems rather than meetings.",
            "I find it satisfying when I optimize code and see the performance improve.",
            "I have been learning machine learning and find the math behind it fascinating.",
            "I like breaking down big problems into smaller logical steps.",
            "Numbers and statistics make more sense to me than abstract concepts.",
            "I built a personal finance tracker app just for fun last month.",
            "I get excited when I find an elegant solution to a hard problem.",
            "I tend to overthink things but it usually leads to better solutions.",
            "I enjoy reading research papers on algorithms and data structures.",
        ]
    },
    {
        "id": "creative_expressive",
        "label": "Creative Expressive",
        "ocean": {"openness": 9.0, "conscientiousness": 5.5, "extraversion": 6.5, "agreeableness": 7.0, "neuroticism": 5.5},
        "traits": ["creativity", "communication", "empathy"],
        "target_careers": ["UX/UI Designer", "Graphic Designer", "Content Writer", "Architect"],
        "emotion_bias": ["joy", "love"],
        "message_pool": [
            "I love sketching UI mockups and thinking about how users will feel using an app.",
            "I spent hours redesigning my portfolio website just because I wanted it to feel right.",
            "I get inspired by everyday objects and try to find beauty in simple things.",
            "Writing stories and creating visual content is how I express myself best.",
            "I care deeply about how things look and feel, not just how they work.",
            "I enjoy brainstorming sessions where wild ideas are welcome.",
            "I redesigned my room layout three times until it felt perfect.",
            "I love combining colors and typography to create something that feels alive.",
            "I find it hard to work in environments that have no room for creativity.",
            "I made a short film last summer just to experiment with visual storytelling.",
            "I enjoy illustrating concepts that are hard to explain with words alone.",
            "I feel most alive when I am creating something from scratch.",
        ]
    },
    {
        "id": "empathetic_helper",
        "label": "Empathetic Helper",
        "ocean": {"openness": 7.0, "conscientiousness": 7.5, "extraversion": 6.0, "agreeableness": 9.0, "neuroticism": 3.5},
        "traits": ["empathy", "communication", "stressTolerance"],
        "target_careers": ["Clinical Psychologist", "Social Worker", "Teacher", "Nurse Practitioner"],
        "emotion_bias": ["love", "joy"],
        "message_pool": [
            "I feel most fulfilled when I help someone work through a difficult situation.",
            "I volunteered at a mental health helpline and it was the most meaningful thing I have done.",
            "People often come to me when they need someone to talk to.",
            "I notice when someone in a group is feeling left out and try to include them.",
            "I want a career where I can make a real difference in people's lives.",
            "I find it hard to ignore someone who is struggling even if I am busy.",
            "I worked as a peer counselor in college and loved every moment of it.",
            "I am good at staying calm when others are stressed or upset.",
            "I believe listening is the most underrated skill in any profession.",
            "I get emotionally invested in the wellbeing of people around me.",
            "I tutored underprivileged students on weekends and it changed my perspective.",
            "I want to understand why people behave the way they do.",
        ]
    },
    {
        "id": "ambitious_leader",
        "label": "Ambitious Leader",
        "ocean": {"openness": 8.0, "conscientiousness": 8.0, "extraversion": 8.5, "agreeableness": 6.0, "neuroticism": 3.0},
        "traits": ["leadership", "motivation", "problemSolving"],
        "target_careers": ["Product Manager", "Entrepreneur", "Marketing Manager", "Human Resources Manager"],
        "emotion_bias": ["joy", "surprise"],
        "message_pool": [
            "I led a team of 10 people for our college fest and we broke all previous records.",
            "I am always thinking about how to make processes more efficient.",
            "I started a small online business last year and learned so much from it.",
            "I enjoy taking ownership of projects and driving them to completion.",
            "I get energized by presenting ideas to a room full of people.",
            "I like setting ambitious goals and working backwards to achieve them.",
            "I organized a fundraiser that raised more than we expected.",
            "I am comfortable making decisions under pressure.",
            "I thrive in fast-paced environments where things change quickly.",
            "I enjoy mentoring juniors and watching them grow.",
            "I read biographies of entrepreneurs to understand how they think.",
            "I believe the best leaders listen more than they speak.",
        ]
    },
    {
        "id": "detail_oriented_planner",
        "label": "Detail Oriented Planner",
        "ocean": {"openness": 5.5, "conscientiousness": 9.5, "extraversion": 4.0, "agreeableness": 6.5, "neuroticism": 3.5},
        "traits": ["analyticalThinking", "stressTolerance", "motivation"],
        "target_careers": ["Accountant", "Financial Analyst", "Civil Engineer", "Pharmacist"],
        "emotion_bias": ["joy", "fear"],
        "message_pool": [
            "I always plan my week in advance and stick to a detailed schedule.",
            "I enjoy auditing financial records and finding discrepancies.",
            "I like knowing exactly what is expected of me before I start a task.",
            "I keep detailed notes and checklists for everything I work on.",
            "I find satisfaction in completing tasks accurately and on time.",
            "I am the person in my group who tracks deadlines and reminds everyone.",
            "I enjoy working with spreadsheets and structured data.",
            "I prefer clear rules and processes over ambiguous open-ended work.",
            "I double-check my work multiple times before submitting.",
            "I find it stressful when plans change at the last minute.",
            "I enjoy the precision required in engineering calculations.",
            "I like understanding the fine print in contracts and agreements.",
        ]
    },
    {
        "id": "curious_explorer",
        "label": "Curious Explorer",
        "ocean": {"openness": 9.5, "conscientiousness": 6.0, "extraversion": 5.5, "agreeableness": 7.0, "neuroticism": 4.5},
        "traits": ["creativity", "analyticalThinking", "motivation"],
        "target_careers": ["Environmental Scientist", "Journalist", "Economist", "Game Developer"],
        "emotion_bias": ["surprise", "joy"],
        "message_pool": [
            "I love learning about topics completely outside my field just out of curiosity.",
            "I read about climate science, economics, and philosophy in the same week.",
            "I enjoy asking why things work the way they do rather than just accepting them.",
            "I started learning a new language last month just because it seemed interesting.",
            "I find myself going down research rabbit holes for hours.",
            "I enjoy connecting ideas from different fields to solve problems.",
            "I wrote a blog post about the economics of video games just for fun.",
            "I get bored quickly if I am not learning something new.",
            "I love traveling and observing how different cultures approach the same problems.",
            "I enjoy thought experiments and hypothetical scenarios.",
            "I find environmental issues fascinating and want to contribute to solutions.",
            "I like interviewing people and understanding their unique perspectives.",
        ]
    }
]

# Coach response templates per turn
COACH_TURN1 = [
    "That is really interesting! It sounds like you genuinely enjoy {domain}. Can you tell me more about a specific moment when you felt most engaged?",
    "I can sense your enthusiasm for {domain}. What draws you to it the most?",
    "It sounds like {domain} is something you connect with deeply. When did you first realize this about yourself?",
]

COACH_TURN2 = [
    "That experience tells me a lot about your strengths. Would you say you prefer working independently or collaborating with others?",
    "That is a great example. How do you usually handle situations where things do not go as planned?",
    "Interesting. Do you find yourself more energized by creative challenges or structured analytical ones?",
]

COACH_TURN3 = [
    "Based on what you have shared, it seems like you have strong {trait} tendencies. Does that resonate with you?",
    "You clearly have a natural inclination toward {trait}. How has that shown up in your academic or work life?",
    "Your responses suggest {trait} is one of your core strengths. Can you think of a time it helped you succeed?",
]

COACH_TURN4 = [
    "Given everything you have told me, careers like {career} seem like a strong fit. What do you think about that direction?",
    "Your profile aligns well with roles in {career}. Does that excite you or surprise you?",
    "I would suggest exploring {career} as a potential path. It matches your strengths and interests closely.",
]

USER_FOLLOWUP = [
    "That makes sense. I have actually thought about that before.",
    "Honestly I had not considered that but it does sound like me.",
    "Yes, I think that is accurate. I do tend to gravitate toward that.",
    "I am not sure yet but I am open to exploring it further.",
    "That resonates with me a lot actually.",
    "I would love to know more about what that career involves.",
]


def pick(lst):
    return random.choice(lst)


def build_conversation(persona, conv_index):
    msg_pool = persona["message_pool"]
    random.shuffle(msg_pool)
    msgs = msg_pool[:4]

    trait = pick(persona["traits"])
    career = pick(persona["target_careers"])
    domain = trait.replace("analyticalThinking", "analytical thinking").replace(
        "problemSolving", "problem solving").replace(
        "stressTolerance", "staying calm under pressure")

    turns = [
        {"role": "user", "content": msgs[0]},
        {"role": "assistant", "content": pick(COACH_TURN1).format(domain=domain)},
        {"role": "user", "content": msgs[1]},
        {"role": "assistant", "content": pick(COACH_TURN2)},
        {"role": "user", "content": msgs[2]},
        {"role": "assistant", "content": pick(COACH_TURN3).format(trait=trait)},
        {"role": "user", "content": pick(USER_FOLLOWUP)},
        {"role": "assistant", "content": pick(COACH_TURN4).format(career=career)},
        {"role": "user", "content": msgs[3]},
        {"role": "assistant", "content": pick(USER_FOLLOWUP)},
    ]

    emotion = pick(persona["emotion_bias"])

    return {
        "id": f"conv_{conv_index:04d}",
        "persona_id": persona["id"],
        "persona_label": persona["label"],
        "target_career": career,
        "dominant_trait": trait,
        "dominant_emotion": emotion,
        "ocean_profile": persona["ocean"],
        "turns": turns,
        "turn_count": len(turns),
        "word_count": sum(len(t["content"].split()) for t in turns)
    }


def main():
    conversations = []
    total = 1200
    per_persona = total // len(PERSONAS)  # 200 each

    for persona in PERSONAS:
        for i in range(per_persona):
            idx = len(conversations)
            conversations.append(build_conversation(persona, idx))

    random.shuffle(conversations)

    # Re-assign sequential IDs after shuffle
    for i, c in enumerate(conversations):
        c["id"] = f"conv_{i:04d}"

    # Split into train/val/test: 80/10/10
    n = len(conversations)
    train_end = int(n * 0.8)
    val_end = int(n * 0.9)

    output = {
        "metadata": {
            "total": n,
            "train": train_end,
            "val": val_end - train_end,
            "test": n - val_end,
            "personas": len(PERSONAS),
            "per_persona": per_persona,
            "avg_turns": 10,
            "source": "synthetically generated for ELEVARE research paper evaluation"
        },
        "train": conversations[:train_end],
        "val": conversations[train_end:val_end],
        "test": conversations[val_end:]
    }

    out_path = os.path.join(os.path.dirname(__file__), "synthetic_conversations.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print("Generated", n, "conversations")
    print("Train:", train_end, "| Val:", val_end - train_end, "| Test:", n - val_end)
    print("Saved to:", out_path)


if __name__ == "__main__":
    main()
