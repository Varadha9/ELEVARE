import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.nlp_processor import NLPProcessor
from services.behavioral_analyzer import BehavioralAnalyzer

def test_nlp_processor():
    processor = NLPProcessor()
    result = processor.process_message("I love solving complex technical problems")
    
    assert 'sentiment' in result
    assert 'emotions' in result
    assert 'keywords' in result
    assert 'detectedTraits' in result
    assert isinstance(result['keywords'], list)

def test_behavioral_analyzer_traits():
    analyzer = BehavioralAnalyzer()
    
    current = {
        'creativity': 5.0,
        'analyticalThinking': 5.0,
        'problemSolving': 5.0
    }
    
    detected = {
        'analyticalThinking': 8.0,
        'problemSolving': 7.5
    }
    
    updated = analyzer.update_traits(current, detected)
    
    assert updated['analyticalThinking'] > 5.0
    assert updated['problemSolving'] > 5.0
    assert 0 <= updated['analyticalThinking'] <= 10

def test_behavioral_analyzer_personality():
    analyzer = BehavioralAnalyzer()
    
    current = {
        'openness': 0.5,
        'conscientiousness': 0.5,
        'extraversion': 0.5
    }
    
    signals = {
        'openness': 0.7,
        'extraversion': 0.6
    }
    
    updated = analyzer.update_personality(current, signals)
    
    assert updated['openness'] > 0.5
    assert updated['extraversion'] > 0.5
    assert 0 <= updated['openness'] <= 1

if __name__ == '__main__':
    pytest.main([__file__, '-v'])
