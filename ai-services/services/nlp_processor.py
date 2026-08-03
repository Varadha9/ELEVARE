import re
import json
import os
# NLTK — Natural Language Toolkit for tokenization and stopword removal
import nltk
# TextBlob — simple library for sentiment analysis (polarity scoring)
from textblob import TextBlob

# Build path to the data directory relative to this file
_DATA_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', 'data'))

# _load_json — helper to safely load JSON data files
# Returns empty dict if the file doesn't exist (graceful degradation)
def _load_json(filename):
    path = os.path.realpath(os.path.join(_DATA_DIR, filename))
    if not path.startswith(_DATA_DIR + os.sep):
        return {}
    if os.path.exists(path):
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    return {}

class NLPProcessor:
    def __init__(self):
        # Download NLTK data if not already present
        # punkt_tab is required by NLTK 3.9+; punkt kept for older versions
        for resource, path in [
            ('tokenizers/punkt',     'punkt'),
            ('tokenizers/punkt_tab', 'punkt_tab'),
            ('corpora/stopwords',    'stopwords'),
        ]:
            try:
                nltk.data.find(resource)
            except LookupError:
                nltk.download(path, quiet=True)

        # Load emotion keyword signals from the Kaggle emotion detection dataset
        _emotion_data = _load_json('emotion_keywords.json')
        self._emotion_keywords = _emotion_data.get('keyword_signals', {})
        self._emotion_trait_signals = _emotion_data.get('trait_signals', {})
        
        # Keyword-to-trait mapping — used to detect behavioral traits from text
        # Each trait has a list of words that signal its presence
        self.trait_keywords = {
            'creativity':         ['creative', 'design', 'art', 'innovative', 'imagine', 'invent', 'original'],
            'analyticalThinking': ['analyze', 'logic', 'data', 'problem', 'solve', 'calculate', 'research'],
            'communication':      ['talk', 'present', 'explain', 'discuss', 'write', 'speak', 'communicate'],
            'leadership':         ['lead', 'manage', 'organize', 'coordinate', 'direct', 'guide', 'mentor'],
            'empathy':            ['help', 'care', 'understand', 'support', 'listen', 'compassion', 'feel'],
            'motivation':         ['achieve', 'goal', 'ambitious', 'driven', 'determined', 'passionate'],
            'stressTolerance':    ['calm', 'pressure', 'deadline', 'stress', 'handle', 'manage'],
            'problemSolving':     ['solve', 'fix', 'solution', 'challenge', 'overcome', 'resolve']
        }
        
        # Big Five (OCEAN) personality keyword mapping
        # Used to detect personality signals from conversation text
        self.personality_keywords = {
            'openness':          ['curious', 'creative', 'explore', 'new', 'learn', 'experience'],
            'conscientiousness': ['organized', 'plan', 'detail', 'careful', 'responsible', 'disciplined'],
            'extraversion':      ['social', 'outgoing', 'energetic', 'talk', 'people', 'party'],
            'agreeableness':     ['kind', 'cooperative', 'helpful', 'friendly', 'trust', 'compassionate'],
            'neuroticism':       ['anxious', 'worry', 'stress', 'nervous', 'emotional', 'upset']
        }
    
    def preprocess_text(self, text):
        """Clean and normalize text — lowercase and remove punctuation"""
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)  # Remove all non-word characters
        return text.strip()
    
    def extract_keywords(self, text):
        """Extract important keywords by removing stopwords and short words"""
        from nltk.corpus import stopwords
        from nltk.tokenize import word_tokenize
        
        stop_words = set(stopwords.words('english'))
        words = word_tokenize(self.preprocess_text(text))
        # Filter out stopwords and words shorter than 4 characters
        keywords = [w for w in words if w not in stop_words and len(w) > 3]
        return keywords[:10]  # Return top 10 keywords
    
    def detect_emotions(self, text):
        """Detect emotions using keyword signals from the emotion detection dataset"""
        text_lower = text.lower()
        detected = []

        # Count how many emotion keywords appear in the text
        for emotion, keywords in self._emotion_keywords.items():
            score = sum(1 for kw in keywords if kw in text_lower)
            if score > 0:
                # Scale score to 0-1 range, capped at 1.0
                detected.append({'emotion': emotion, 'score': min(score * 0.3, 1.0)})

        # Default to neutral if no emotions detected
        if not detected:
            detected = [{'emotion': 'neutral', 'score': 1.0}]

        # Return top 3 emotions sorted by score
        return sorted(detected, key=lambda x: x['score'], reverse=True)[:3]
    
    def analyze_sentiment(self, text):
        """Analyze sentiment polarity using TextBlob's pre-trained model"""
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity  # Range: -1 (negative) to +1 (positive)
        
        # Classify into three buckets with a ±0.1 neutral zone
        if polarity > 0.1:
            return 'positive'
        elif polarity < -0.1:
            return 'negative'
        return 'neutral'
    
    def extract_traits(self, text):
        """Extract behavioral traits by counting keyword matches in the text"""
        text_lower = text.lower()
        detected_traits = {}
        
        for trait, keywords in self.trait_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                # Scale to 0-10 range (multiply by 5, cap at 10)
                detected_traits[trait] = min(score * 5, 10)
        
        return detected_traits
    
    def extract_personality_signals(self, text):
        """Extract Big Five personality signals from text using keyword matching"""
        text_lower = text.lower()
        personality_signals = {}
        
        for trait, keywords in self.personality_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                personality_signals[trait] = min(score * 5, 10)
        
        return personality_signals
    
    def process_message(self, message):
        """Complete NLP pipeline — runs all analysis steps and returns combined results"""
        keywords    = self.extract_keywords(message)
        emotions    = self.detect_emotions(message)
        sentiment   = self.analyze_sentiment(message)
        traits      = self.extract_traits(message)
        personality = self.extract_personality_signals(message)
        
        return {
            'keywords':          keywords,
            'emotions':          emotions,
            'sentiment':         sentiment,
            'detectedTraits':    traits,
            'personalitySignals':personality
        }
