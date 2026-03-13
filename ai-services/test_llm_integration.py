"""
Test script for ELEVARE LLM Integration
Tests Groq API connection and conversational agent
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.llm_client import GroqLLMClient
from services.conversational_agent import ConversationalAgent
from services.nlp_processor import NLPProcessor

def test_llm_connection():
    """Test 1: Basic LLM connection"""
    print("\n" + "="*60)
    print("[TEST 1] Testing LLM Connection")
    print("="*60)
    
    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        print("❌ ERROR: GROQ_API_KEY not found in .env file")
        return False
    
    print(f"✅ API Key: {api_key[:20]}...")
    
    client = GroqLLMClient()
    print(f"✅ Model: {client.model}")
    print(f"✅ Base URL: {client.base_url}")
    
    return True

def test_simple_response():
    """Test 2: Generate simple response"""
    print("\n" + "="*60)
    print("[TEST 2] Testing Simple Response")
    print("="*60)
    
    client = GroqLLMClient()
    
    system_prompt = "You are a helpful career coach."
    user_message = "I really enjoy solving complex coding problems"
    
    print(f"\n📝 User: {user_message}")
    print("\n🤖 AI: ", end="", flush=True)
    
    try:
        response = client.generate_response(
            system_prompt=system_prompt,
            user_message=user_message,
            temperature=0.7
        )
        print(response)
        print("\n✅ [SUCCESS] LLM response generated!")
        return True
    except Exception as e:
        print(f"\n❌ [ERROR] {str(e)}")
        return False

def test_with_conversation_history():
    """Test 3: Response with conversation history"""
    print("\n" + "="*60)
    print("[TEST 3] Testing With Conversation History")
    print("="*60)
    
    client = GroqLLMClient()
    
    system_prompt = "You are ELEVARE Career Coach, helping students discover careers."
    
    conversation_history = [
        {"role": "user", "content": "I enjoy coding"},
        {"role": "assistant", "content": "That's great! What kind of coding projects excite you most?"},
        {"role": "user", "content": "I like building web applications"}
    ]
    
    user_message = "I also enjoy designing user interfaces"
    
    print("\n📜 Conversation History:")
    for msg in conversation_history:
        role = "👤 User" if msg["role"] == "user" else "🤖 AI"
        print(f"  {role}: {msg['content']}")
    
    print(f"\n📝 User: {user_message}")
    print("\n🤖 AI: ", end="", flush=True)
    
    try:
        response = client.generate_response(
            system_prompt=system_prompt,
            user_message=user_message,
            conversation_history=conversation_history,
            temperature=0.7
        )
        print(response)
        print("\n✅ [SUCCESS] Context-aware response generated!")
        return True
    except Exception as e:
        print(f"\n❌ [ERROR] {str(e)}")
        return False

def test_full_pipeline():
    """Test 4: Full NLP + LLM pipeline"""
    print("\n" + "="*60)
    print("[TEST 4] Testing Full Pipeline (NLP + LLM)")
    print("="*60)
    
    nlp_processor = NLPProcessor()
    conversational_agent = ConversationalAgent()
    
    user_message = "I love helping people solve their problems and teaching them new skills"
    
    print(f"\n📝 User: {user_message}")
    
    # NLP Analysis
    print("\n🔍 NLP Analysis:")
    analysis = nlp_processor.process_message(user_message)
    print(f"  Sentiment: {analysis['sentiment']}")
    print(f"  Keywords: {', '.join(analysis['keywords'][:5])}")
    print(f"  Detected Traits: {', '.join(analysis['detectedTraits'].keys())}")
    
    # Mock user profile
    user_profile = {
        "behavioralTraits": {
            "empathy": 75,
            "communication": 70,
            "creativity": 60
        }
    }
    
    # Generate LLM response
    print("\n🤖 AI: ", end="", flush=True)
    try:
        response = conversational_agent.generate_response(
            user_message=user_message,
            nlp_analysis=analysis,
            conversation_history=[],
            user_profile=user_profile
        )
        print(response)
        print("\n✅ [SUCCESS] Full pipeline working!")
        return True
    except Exception as e:
        print(f"\n❌ [ERROR] {str(e)}")
        return False

def main():
    """Run all tests"""
    print("\n" + "🚀"*30)
    print("ELEVARE LLM INTEGRATION TEST SUITE")
    print("🚀"*30)
    
    results = []
    
    # Run tests
    results.append(("LLM Connection", test_llm_connection()))
    results.append(("Simple Response", test_simple_response()))
    results.append(("Conversation History", test_with_conversation_history()))
    results.append(("Full Pipeline", test_full_pipeline()))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\n📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! LLM integration is working perfectly!")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    main()
