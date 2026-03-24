import re
import json
import os
import nltk
from textblob import TextBlob

_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')

def _load_json(filename):
    path = os.path.join(_DATA_DIR, filename)
    if os.path.exists(path):
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    return {}

class NLPProcessor:
    def __init__(self):
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt', quiet=True)
            nltk.download('stopwords', quiet=True)

        # Load emotion data from Kaggle emotion detection dataset
        _emotion_data = _load_json('emotion_keywords.json')
        self._emotion_keywords = _emotion_data.get('keyword_signals', {})
        self._emotion_trait_signals = _emotion_data.get('trait_signals', {})
        
        # Trait keywords mapping
        self.trait_keywords = {
            'creativity': ['creative', 'design', 'art', 'innovative', 'imagine', 'invent', 'original'],
            'analyticalThinking': ['analyze', 'logic', 'data', 'problem', 'solve', 'calculate', 'research'],
            'communication': ['talk', 'present', 'explain', 'discuss', 'write', 'speak', 'communicate'],
            'leadership': ['lead', 'manage', 'organize', 'coordinate', 'direct', 'guide', 'mentor'],
            'empathy': ['help', 'care', 'understand', 'support', 'listen', 'compassion', 'feel'],
            'motivation': ['achieve', 'goal', 'ambitious', 'driven', 'determined', 'passionate'],
            'stressTolerance': ['calm', 'pressure', 'deadline', 'stress', 'handle', 'manage'],
            'problemSolving': ['solve', 'fix', 'solution', 'challenge', 'overcome', 'resolve']
        }
        
        # Personality trait keywords (Big Five)
        self.personality_keywords = {
            'openness': ['curious', 'creative', 'explore', 'new', 'learn', 'experience'],
            'conscientiousness': ['organized', 'plan', 'detail', 'careful', 'responsible', 'disciplined'],
            'extraversion': ['social', 'outgoing', 'energetic', 'talk', 'people', 'party'],
            'agreeableness': ['kind', 'cooperative', 'helpful', 'friendly', 'trust', 'compassionate'],
            'neuroticism': ['anxious', 'worry', 'stress', 'nervous', 'emotional', 'upset']
        }
    
    def preprocess_text(self, text):
        """Clean and normalize text"""
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)
        return text.strip()
    
    def extract_keywords(self, text):
        """Extract important keywords"""
        from nltk.corpus import stopwords
        from nltk.tokenize import word_tokenize
        
        stop_words = set(stopwords.words('english'))
        words = word_tokenize(self.preprocess_text(text))
        keywords = [w for w in words if w not in stop_words and len(w) > 3]
        return keywords[:10]
    
    def detect_emotions(self, text):
        """Detect emotions using keyword signals from Kaggle emotion detection dataset."""
        text_lower = text.lower()
        detected = []

        for emotion, keywords in self._emotion_keywords.items():
            score = sum(1 for kw in keywords if kw in text_lower)
            if score > 0:
                detected.append({'emotion': emotion, 'score': min(score * 0.3, 1.0)})

        if not detected:
            detected = [{'emotion': 'neutral', 'score': 1.0}]

        return sorted(detected, key=lambda x: x['score'], reverse=True)[:3]
    
    def analyze_sentiment(self, text):
        """Analyze sentiment polarity"""
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        
        if polarity > 0.1:
            return 'positive'
        elif polarity < -0.1:
            return 'negative'
        return 'neutral'
    
    def extract_traits(self, text):
        """Extract behavioral traits from text"""
        text_lower = text.lower()
        detected_traits = {}
        
        for trait, keywords in self.trait_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                detected_traits[trait] = min(score * 5, 10)  # Scale to 0-10
        
        return detected_traits
    
    def extract_personality_signals(self, text):
        """Extract Big Five personality signals"""
        text_lower = text.lower()
        personality_signals = {}
        
        for trait, keywords in self.personality_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                personality_signals[trait] = min(score * 5, 10)
        
        return personality_signals
    
    def process_message(self, message):
        """Complete NLP processing pipeline"""
        keywords = self.extract_keywords(message)
        emotions = self.detect_emotions(message)
        sentiment = self.analyze_sentiment(message)
        traits = self.extract_traits(message)
        personality = self.extract_personality_signals(message)
        
        return {
            'keywords': keywords,
            'emotions': emotions,
            'sentiment': sentiment,
            'detectedTraits': traits,
            'personalitySignals': personality
        }
