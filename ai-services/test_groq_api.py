"""
Simple test script for Groq API key validation
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.llm_client import GroqLLMClient

def test_api_key():
    """Test Groq API key"""
    print("\n" + "="*60)
    print("GROQ API KEY TEST")
    print("="*60)
    
    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        print("[ERROR] GROQ_API_KEY not found in .env file")
        return False
    
    print(f"[OK] API Key found: {api_key[:20]}...")
    print(f"[OK] Key length: {len(api_key)} characters")
    
    return True

def test_simple_request():
    """Test simple API request"""
    print("\n" + "="*60)
    print("GROQ API REQUEST TEST")
    print("="*60)
    
    client = GroqLLMClient()
    print(f"[OK] Model: {client.model}")
    print(f"[OK] Endpoint: {client.base_url}")
    
    print("\n[TEST] Sending test message...")
    print("User: I enjoy solving coding problems")
    
    try:
        response = client.generate_response(
            system_prompt="You are a helpful career coach.",
            user_message="I enjoy solving coding problems",
            temperature=0.7,
            max_tokens=200
        )
        
        print("\n[RESPONSE]")
        print(response)
        print("\n[SUCCESS] API is working correctly!")
        return True
        
    except Exception as e:
        print(f"\n[ERROR] {str(e)}")
        return False

def main():
    """Run tests"""
    print("\n" + "="*60)
    print("ELEVARE - GROQ API INTEGRATION TEST")
    print("="*60)
    
    # Test 1: API Key
    if not test_api_key():
        print("\n[FAILED] API key test failed")
        return
    
    # Test 2: API Request
    if not test_simple_request():
        print("\n[FAILED] API request test failed")
        return
    
    print("\n" + "="*60)
    print("ALL TESTS PASSED!")
    print("="*60)
    print("\nYour Groq API key is working correctly.")
    print("You can now use ELEVARE AI services.")
    print("\nNext steps:")
    print("1. Start backend: cd ../backend && npm start")
    print("2. Start AI service: python main.py")
    print("3. Start frontend: cd ../frontend && npm run dev")

if __name__ == "__main__":
    main()
