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

        # Traits are stored 0-10, personality 0-1
        def t(key): return traits.get(key, 5.0)
        def p(key): return personality.get(key, 0.5)

        ikigai = {
            'whatYouLove': [],
            'whatYouAreGoodAt': [],
            'whatTheWorldNeeds': [],
            'whatYouCanBePaidFor': []
        }

        # What you love
        if p('openness') > 0.6:
            ikigai['whatYouLove'].extend(['creative work', 'learning new things'])
        if t('creativity') > 6:
            ikigai['whatYouLove'].append('artistic expression')
        if t('empathy') > 6:
            ikigai['whatYouLove'].append('helping others')
        if t('leadership') > 6:
            ikigai['whatYouLove'].append('leading and inspiring people')

        # What you are good at
        if t('analyticalThinking') > 6.5:
            ikigai['whatYouAreGoodAt'].append('analytical problem solving')
        if t('communication') > 6.5:
            ikigai['whatYouAreGoodAt'].append('communication and presentation')
        if t('leadership') > 6.5:
            ikigai['whatYouAreGoodAt'].append('leadership and management')
        if t('creativity') > 6.5:
            ikigai['whatYouAreGoodAt'].append('creative thinking')
        if t('problemSolving') > 6.5:
            ikigai['whatYouAreGoodAt'].append('solving complex problems')

        # What the world needs
        if t('empathy') > 6:
            ikigai['whatTheWorldNeeds'].extend(['healthcare', 'education'])
        if p('agreeableness') > 0.6:
            ikigai['whatTheWorldNeeds'].append('community building')
        if t('analyticalThinking') > 6:
            ikigai['whatTheWorldNeeds'].append('data-driven solutions')
        if t('creativity') > 6:
            ikigai['whatTheWorldNeeds'].append('innovative design')

        # What you can be paid for
        if t('problemSolving') > 6:
            ikigai['whatYouCanBePaidFor'].append('technical expertise')
        if t('analyticalThinking') > 6:
            ikigai['whatYouCanBePaidFor'].append('data analysis')
        if t('communication') > 6:
            ikigai['whatYouCanBePaidFor'].append('consulting and advising')
        if t('leadership') > 6:
            ikigai['whatYouCanBePaidFor'].append('management roles')
        if t('creativity') > 6:
            ikigai['whatYouCanBePaidFor'].append('design and creative services')

        return ikigai
    
    def get_dominant_traits(self, traits, top_n=5):
        """Get top N dominant traits"""
        sorted_traits = sorted(traits.items(), key=lambda x: x[1], reverse=True)
        return sorted_traits[:top_n]
