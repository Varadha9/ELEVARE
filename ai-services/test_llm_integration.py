import sys
sys.path.append('.')

from utils.llm_client import GroqLLMClient
from prompts.career_coach_prompts import get_career_coach_system_prompt

print("Testing Groq LLM Integration...\n")

# Test 1: Basic connection
print("[TEST 1] Testing LLM Connection")
client = GroqLLMClient()
print(f"  API Key: {client.api_key[:20]}...")
print(f"  Model: {client.model}")

# Test 2: Simple response
print("\n[TEST 2] Testing Simple Response")
system_prompt = get_career_coach_system_prompt()
user_message = "I really enjoy solving complex coding problems and building software"

try:
    response = client.generate_response(
        system_prompt=system_prompt,
        user_message=user_message
    )
    print(f"  User: {user_message}")
    print(f"  AI: {response}")
    print("  [SUCCESS] LLM response generated!")
except Exception as e:
    print(f"  [ERROR] {e}")

# Test 3: With conversation history
print("\n[TEST 3] Testing With Conversation History")
history = [
    {"role": "user", "content": "I like helping people"},
    {"role": "assistant", "content": "That's wonderful! What kind of help do you enjoy providing most?"}
]

try:
    response = client.generate_response(
        system_prompt=system_prompt,
        user_message="I enjoy teaching and explaining complex topics",
        conversation_history=history
    )
    print(f"  AI: {response}")
    print("  [SUCCESS] Context-aware response generated!")
except Exception as e:
    print(f"  [ERROR] {e}")

print("\n[COMPLETE] LLM Integration Test Finished!")
