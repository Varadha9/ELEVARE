import numpy as np
from datetime import datetime

class BehavioralAnalyzer:
    def __init__(self):
        self.learning_rate = 0.15  # How quickly traits update
        
    def update_traits(self, current_traits, detected_traits):
        """Update behavioral traits based on new evidence"""
        updated = {}
        
        for trait, current_value in current_traits.items():
            if trait in detected_traits:
                # Gradual update using exponential moving average
                new_signal = detected_traits[trait]
                updated[trait] = current_value + (new_signal * self.learning_rate)
                updated[trait] = max(0, min(100, updated[trait]))  # Clamp 0-100
            else:
                updated[trait] = current_value
        
        return updated
    
    def update_personality(self, current_personality, personality_signals):
        """Update Big Five personality traits"""
        updated = {}
        
        for trait, current_value in current_personality.items():
            if trait in personality_signals:
                signal = personality_signals[trait]
                updated[trait] = current_value + (signal * self.learning_rate)
                updated[trait] = max(0, min(100, updated[trait]))
            else:
                updated[trait] = current_value
        
        return updated
    
    def calculate_ikigai_alignment(self, user_profile, interests):
        """Map behavioral traits to Ikigai dimensions"""
        traits = user_profile.get('behavioralTraits', {})
        personality = user_profile.get('personality', {})
        
        ikigai = {
            'loves': [],
            'goodAt': [],
            'worldNeeds': [],
            'paidFor': []
        }
        
        # What user loves (based on interests and openness)
        if personality.get('openness', 50) > 60:
            ikigai['loves'].extend(['creative work', 'learning', 'exploration'])
        if traits.get('creativity', 50) > 60:
            ikigai['loves'].append('artistic expression')
        
        # What user is good at (based on strong traits)
        if traits.get('analyticalThinking', 50) > 65:
            ikigai['goodAt'].append('analytical problem solving')
        if traits.get('communication', 50) > 65:
            ikigai['goodAt'].append('communication and presentation')
        if traits.get('leadership', 50) > 65:
            ikigai['goodAt'].append('leadership and management')
        
        # What world needs (based on empathy and social traits)
        if traits.get('empathy', 50) > 60:
            ikigai['worldNeeds'].extend(['healthcare', 'education', 'social services'])
        if personality.get('agreeableness', 50) > 60:
            ikigai['worldNeeds'].append('community building')
        
        # What can be paid for (marketable skills)
        if traits.get('problemSolving', 50) > 60:
            ikigai['paidFor'].append('technical expertise')
        if traits.get('analyticalThinking', 50) > 60:
            ikigai['paidFor'].append('data analysis')
        
        return ikigai
    
    def get_dominant_traits(self, traits, top_n=5):
        """Get top N dominant traits"""
        sorted_traits = sorted(traits.items(), key=lambda x: x[1], reverse=True)
        return sorted_traits[:top_n]
