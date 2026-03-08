import numpy as np

class RecommendationEngine:
    def __init__(self, career_database):
        self.careers = career_database
    
    def cosine_similarity(self, vec1, vec2):
        """Simple cosine similarity calculation"""
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        if norm1 == 0 or norm2 == 0:
            return 0
        return dot_product / (norm1 * norm2)
        
    def calculate_trait_match(self, user_traits, career_traits):
        """Calculate similarity between user and career traits"""
        user_vector = np.array([user_traits.get(trait, 50) for trait in career_traits.keys()])
        career_vector = np.array(list(career_traits.values()))
        
        # Normalize to 0-1 scale
        user_vector = user_vector / 100
        career_vector = career_vector / 100
        
        # Calculate cosine similarity
        similarity = self.cosine_similarity(user_vector, career_vector)
        return similarity * 100
    
    def calculate_personality_match(self, user_personality, career_personality):
        """Calculate Big Five personality fit"""
        if not career_personality:
            return 50  # Neutral if no data
        
        user_vector = np.array([user_personality.get(trait, 50) for trait in career_personality.keys()])
        career_vector = np.array(list(career_personality.values()))
        
        user_vector = user_vector / 100
        career_vector = career_vector / 100
        
        similarity = self.cosine_similarity(user_vector, career_vector)
        return similarity * 100
    
    def calculate_ikigai_score(self, user_ikigai, career_ikigai):
        """Calculate Ikigai framework alignment"""
        scores = []
        
        # Check overlap in each dimension
        for dimension in ['loves', 'goodAt', 'worldNeeds', 'paidFor']:
            user_items = set(user_ikigai.get(dimension, []))
            career_items = set(career_ikigai.get(dimension, []))
            
            if user_items and career_items:
                overlap = len(user_items & career_items)
                total = len(user_items | career_items)
                scores.append(overlap / total if total > 0 else 0)
            else:
                scores.append(0.5)  # Neutral
        
        return np.mean(scores) * 100
    
    def generate_recommendations(self, user_profile, top_n=5):
        """Generate career recommendations using hybrid approach"""
        recommendations = []
        
        user_traits = user_profile.get('behavioralTraits', {})
        user_personality = user_profile.get('personality', {})
        user_ikigai = user_profile.get('ikigai', {})
        
        for career in self.careers:
            # Calculate multiple scores
            trait_score = self.calculate_trait_match(
                user_traits, 
                career.get('requiredTraits', {})
            )
            
            personality_score = self.calculate_personality_match(
                user_personality,
                career.get('personalityFit', {})
            )
            
            ikigai_score = self.calculate_ikigai_score(
                user_ikigai,
                career.get('ikigaiMapping', {})
            )
            
            # Weighted combination
            confidence = (
                trait_score * 0.4 +
                personality_score * 0.3 +
                ikigai_score * 0.3
            )
            
            # Generate explanation
            explanation = self._generate_explanation(
                career, user_traits, user_personality, confidence
            )
            
            recommendations.append({
                'careerTitle': career['title'],
                'careerCategory': career.get('category', 'General'),
                'confidenceScore': round(confidence, 1),
                'explanation': explanation,
                'careerDetails': {
                    'description': career.get('description', ''),
                    'requiredSkills': career.get('skills', []),
                    'averageSalary': career.get('averageSalary', 'Varies'),
                    'growthOutlook': career.get('growthRate', 'Stable'),
                    'educationPath': career.get('education', [])
                }
            })
        
        # Sort by confidence and return top N
        recommendations.sort(key=lambda x: x['confidenceScore'], reverse=True)
        return recommendations[:top_n]
    
    def _generate_explanation(self, career, user_traits, user_personality, confidence):
        """Generate human-readable explanation"""
        # Find matching traits
        career_traits = career.get('requiredTraits', {})
        matching_traits = []
        
        for trait, required_value in career_traits.items():
            user_value = user_traits.get(trait, 50)
            if abs(user_value - required_value) < 20:
                matching_traits.append(trait.replace('_', ' '))
        
        summary = f"This career aligns well with your profile. "
        
        if matching_traits:
            traits_str = ', '.join(matching_traits[:3])
            summary += f"Your strengths in {traits_str} are particularly relevant. "
        
        if confidence > 80:
            summary += "This is a strong match based on your behavioral patterns and personality."
        elif confidence > 60:
            summary += "This career shows good compatibility with your interests and skills."
        else:
            summary += "This career could be worth exploring as you develop related skills."
        
        return {
            'summary': summary,
            'matchingTraits': matching_traits[:5],
            'ikigaiAlignment': {
                'loves': round(confidence * 0.25, 1),
                'goodAt': round(confidence * 0.25, 1),
                'worldNeeds': round(confidence * 0.25, 1),
                'paidFor': round(confidence * 0.25, 1)
            }
        }
    
    def update_from_feedback(self, user_id, career_title, interested, rating):
        """Update recommendation model based on user feedback"""
        # In production, this would update ML model weights
        # For now, we log the feedback for future training
        feedback_data = {
            'user_id': user_id,
            'career': career_title,
            'interested': interested,
            'rating': rating,
            'timestamp': np.datetime64('now')
        }
        return feedback_data
