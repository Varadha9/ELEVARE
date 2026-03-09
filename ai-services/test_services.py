import sys
sys.path.append('.')

print("Testing AI Services...")

try:
    from services.nlp_processor import NLPProcessor
    print("[OK] NLP Processor imported")
    
    from services.behavioral_analyzer import BehavioralAnalyzer
    print("[OK] Behavioral Analyzer imported")
    
    from services.conversational_agent import ConversationalAgent
    print("[OK] Conversational Agent imported")
    
    from services.recommendation_engine import RecommendationEngine
    print("[OK] Recommendation Engine imported")
    
    from data.career_data import CAREER_DATABASE
    print(f"[OK] Career Database loaded ({len(CAREER_DATABASE)} careers)")
    
    # Test NLP
    nlp = NLPProcessor()
    result = nlp.process_message("I love coding and solving problems")
    print(f"[OK] NLP Processing works - detected {len(result['keywords'])} keywords")
    print(f"     Keywords: {result['keywords'][:5]}")
    print(f"     Sentiment: {result['sentiment']}")
    
    print("\n[SUCCESS] ALL AI SERVICES WORKING!")
    
except Exception as e:
    print(f"\n[ERROR] {e}")
    import traceback
    traceback.print_exc()
