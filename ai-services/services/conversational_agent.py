import random
from datetime import datetime

class ConversationalAgent:
    def __init__(self):
        self.question_bank = {
            'interests': [
                "What activity made you feel most productive today?",
                "What subject or topic excites you the most right now?",
                "If you could spend an entire day doing one thing, what would it be?",
                "What type of problems do you enjoy solving?",
                "What makes you lose track of time when you're doing it?"
            ],
            'skills': [
                "What do people often ask for your help with?",
                "What skill have you developed that you're proud of?",
                "What comes naturally to you that others find difficult?",
                "What would you like to become better at?",
                "Describe a recent accomplishment that made you feel capable."
            ],
            'values': [
                "What kind of impact do you want to make in the world?",
                "What causes or issues do you care deeply about?",
                "What does success mean to you personally?",
                "What would make you feel like your work matters?",
                "What values are non-negotiable for you in a career?"
            ],
            'emotions': [
                "How did you feel during your most engaging activity today?",
                "What situations make you feel energized vs. drained?",
                "When do you feel most confident?",
                "What type of stress do you handle well?",
                "Describe a moment when you felt truly satisfied with your work."
            ],
            'social': [
                "Do you prefer working alone or with others? Why?",
                "How do you like to communicate your ideas?",
                "What role do you naturally take in group settings?",
                "How important is social interaction in your ideal day?",
                "Describe your ideal work environment."
            ]
        }
        
        self.followup_templates = [
            "That's interesting! Can you tell me more about {topic}?",
            "What specifically about {topic} appeals to you?",
            "How long have you been interested in {topic}?",
            "What would you like to explore more about {topic}?"
        ]
    
    def get_daily_question(self, conversation_count, user_profile=None):
        """Generate contextual daily question"""
        # Rotate through question categories
        categories = list(self.question_bank.keys())
        category = categories[conversation_count % len(categories)]
        
        questions = self.question_bank[category]
        return random.choice(questions)
    
    def generate_response(self, user_message, analysis, conversation_history):
        """Generate contextual AI response"""
        # Extract key information
        emotions = analysis.get('emotions', [])
        sentiment = analysis.get('sentiment', 'neutral')
        keywords = analysis.get('keywords', [])
        
        # Build empathetic response
        response_parts = []
        
        # Acknowledge emotion
        if emotions and emotions[0]['score'] > 0.5:
            emotion = emotions[0]['emotion']
            if emotion in ['joy', 'happiness']:
                response_parts.append("I can sense your enthusiasm!")
            elif emotion in ['sadness', 'anger']:
                response_parts.append("I appreciate you sharing that with me.")
            else:
                response_parts.append("Thank you for that thoughtful response.")
        
        # Reflect on content
        if keywords:
            key_topic = keywords[0] if keywords else "that"
            response_parts.append(f"Your interest in {key_topic} is noted.")
        
        # Ask follow-up or new question
        if len(conversation_history) < 3:
            # Early conversation - ask follow-up
            if keywords:
                followup = random.choice(self.followup_templates).format(topic=keywords[0])
                response_parts.append(followup)
        else:
            # Continue with new question
            response_parts.append("Let me ask you something else:")
            new_question = self.get_daily_question(len(conversation_history))
            response_parts.append(new_question)
        
        return " ".join(response_parts)
    
    def generate_welcome_message(self, user_name):
        """Generate personalized welcome message"""
        return f"""Hello {user_name}! 👋

I'm your AI career discovery companion. Over the coming weeks, I'll get to know you through daily conversations about your interests, strengths, and aspirations.

There are no right or wrong answers - just share your honest thoughts and feelings. The more we talk, the better I can help you discover careers that truly align with who you are.

Let's start with a simple question: What activity made you feel most engaged or productive recently?"""
    
    def generate_summary_prompt(self, days_active):
        """Generate periodic summary prompts"""
        if days_active == 7:
            return "You've been with me for a week! Let's reflect: What patterns have you noticed in what energizes you?"
        elif days_active == 30:
            return "One month together! What have you learned about yourself through our conversations?"
        return None
