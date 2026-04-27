import os
# requests — HTTP library used to call the Groq REST API
import requests
from typing import List, Dict
from dotenv import load_dotenv

# Load GROQ_API_KEY from .env
load_dotenv()

class GroqLLMClient:
    def __init__(self):
        # API key for authenticating with Groq — get one free at console.groq.com
        self.api_key  = os.getenv('GROQ_API_KEY')
        # Groq's OpenAI-compatible chat completions endpoint
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        # Llama 3.3 70B — powerful open-source model hosted on Groq's fast inference
        self.model    = "llama-3.3-70b-versatile"
    
    def generate_response(
        self, 
        system_prompt: str, 
        user_message: str, 
        conversation_history: List[Dict] = None,
        max_tokens: int = 500,
        temperature: float = 0.7
    ) -> str:
        """Generate response using Groq API (Llama 3.3 70B)"""
        
        # Build the messages array — starts with the system prompt
        messages = [{"role": "system", "content": system_prompt}]
        
        # Append the last 5 messages from conversation history for context
        # Limiting to 5 keeps the context window manageable and reduces latency
        if conversation_history:
            for msg in conversation_history[-5:]:
                messages.append({
                    "role":    msg.get("role", "user"),
                    "content": msg.get("content", "")
                })
        
        # Append the current user message (enriched with NLP context)
        messages.append({"role": "user", "content": user_message})
        
        # Authorization header using Bearer token format
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type":  "application/json"
        }
        
        # Request payload following OpenAI chat completions format
        payload = {
            "model":       self.model,
            "messages":    messages,
            "max_tokens":  max_tokens,  # Limit response length for concise coaching replies
            "temperature": temperature  # 0.7 = balanced creativity and coherence
        }
        
        try:
            # 30s timeout — prevents hanging if Groq is slow
            response = requests.post(self.base_url, json=payload, headers=headers, timeout=30)
            response.raise_for_status()  # Raises exception for 4xx/5xx responses
            result = response.json()
            # Extract the assistant's reply from the choices array
            return result['choices'][0]['message']['content']
        except Exception as e:
            print(f"LLM Error: {e}")
            # Fallback response — keeps the conversation going even if the API fails
            return "I'm here to help you explore your career path. Could you tell me more about what interests you?"
