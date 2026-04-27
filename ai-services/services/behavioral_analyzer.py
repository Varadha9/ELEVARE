class BehavioralAnalyzer:
    def __init__(self):
        # λ (lambda) decay factor from Paper Section III-B
        # Controls how much weight is given to historical vs new observations
        # 0.85 means 85% old value + 15% new signal — slow, stable updates
        self.lambda_decay = 0.85
        self.learning_rate = 1 - self.lambda_decay  # = 0.15

    # ------------------------------------------------------------------
    # Paper Eq. (7): P_i(t) = λ·P_i(t-1) + (1-λ)·P̂_i(t)
    # EWMA (Exponentially Weighted Moving Average) update for traits
    # Prevents single conversations from drastically changing the profile
    # ------------------------------------------------------------------
    def update_traits(self, current_traits, detected_traits):
        """EWMA update for behavioral traits (0-10 scale)."""
        updated = {}
        for trait, current in current_traits.items():
            if trait in detected_traits:
                new_signal = float(detected_traits[trait])
                # Blend: 85% old value + 15% new signal
                updated[trait] = self.lambda_decay * current + self.learning_rate * new_signal
                # Clamp to valid range 0-10
                updated[trait] = max(0.0, min(10.0, updated[trait]))
            else:
                # No signal detected — keep current value unchanged
                updated[trait] = current
        return updated

    def update_personality(self, current_personality, personality_signals):
        """EWMA update for Big Five personality traits (0-1 scale)."""
        updated = {}
        for trait, current in current_personality.items():
            if trait in personality_signals:
                # NLP signals come in 0-10 scale → normalize to 0-1 for personality
                new_signal = float(personality_signals[trait]) / 10.0
                updated[trait] = self.lambda_decay * current + self.learning_rate * new_signal
                # Clamp to valid range 0-1
                updated[trait] = max(0.0, min(1.0, updated[trait]))
            else:
                updated[trait] = current
        return updated

    # ------------------------------------------------------------------
    # Ikigai dimension mapping
    # Maps behavioral traits and personality scores to the four Ikigai dimensions:
    # What you Love, What you're Good At, What the World Needs, What you can be Paid For
    # ------------------------------------------------------------------
    def calculate_ikigai_alignment(self, user_profile, interests):
        """Map behavioral traits to Ikigai dimensions using correct key names."""
        traits      = user_profile.get('behavioralTraits', {})
        personality = user_profile.get('personality', {})

        # Helper functions to safely get trait/personality values with defaults
        def t(key): return float(traits.get(key, 5.0))       # 0-10 scale
        def p(key): return float(personality.get(key, 0.5))  # 0-1 scale

        # Initialize all four Ikigai dimensions as empty lists
        ikigai = {
            'whatYouLove':         [],
            'whatYouAreGoodAt':    [],
            'whatTheWorldNeeds':   [],
            'whatYouCanBePaidFor': [],
        }

        # What you love — driven by openness, creativity, empathy, and leadership
        if p('openness') > 0.6:
            ikigai['whatYouLove'].extend(['creative work', 'learning new things'])
        if t('creativity') > 6:
            ikigai['whatYouLove'].append('artistic expression')
        if t('empathy') > 6:
            ikigai['whatYouLove'].append('helping others')
        if t('leadership') > 6:
            ikigai['whatYouLove'].append('leading and inspiring people')

        # What you are good at — driven by high trait scores (threshold: 6.5/10)
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

        # What the world needs — driven by empathy, agreeableness, and analytical skills
        if t('empathy') > 6:
            ikigai['whatTheWorldNeeds'].extend(['healthcare', 'education'])
        if p('agreeableness') > 0.6:
            ikigai['whatTheWorldNeeds'].append('community building')
        if t('analyticalThinking') > 6:
            ikigai['whatTheWorldNeeds'].append('data-driven solutions')
        if t('creativity') > 6:
            ikigai['whatTheWorldNeeds'].append('innovative design')

        # What you can be paid for — practical skills that have market value
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
        """Returns the top N traits sorted by score — used for recommendation explanations"""
        sorted_traits = sorted(traits.items(), key=lambda x: x[1], reverse=True)
        return sorted_traits[:top_n]
