import os
import requests
from typing import List, Dict, Optional
from dotenv import load_dotenv
import time

load_dotenv()

class GroqLLMClient:
    def __init__(self):
        self.api_key = os.getenv('GROQ_API_KEY')
        if not self.api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables. Get one at https://console.groq.com/keys")
        
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.3-70b-versatile"
        self.max_retries = 3
        self.retry_delay = 1
    
    def generate_response(
        self, 
        system_prompt: str, 
        user_message: str, 
        conversation_history: Optional[List[Dict]] = None,
        max_tokens: int = 500,
        temperature: float = 0.7
    ) -> str:
        """Generate response using Groq API with retry logic"""
        
        messages = [{"role": "system", "content": system_prompt}]
        
        if conversation_history:
            for msg in conversation_history[-5:]:
                messages.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "")
                })
        
        messages.append({"role": "user", "content": user_message})
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature
        }
        
        # Retry logic for API failures
        for attempt in range(self.max_retries):
            try:
                response = requests.post(
                    self.base_url, 
                    json=payload, 
                    headers=headers, 
                    timeout=30
                )
                response.raise_for_status()
                result = response.json()
                return result['choices'][0]['message']['content']
                
            except requests.exceptions.Timeout:
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay * (attempt + 1))
                    continue
                return self._fallback_response()
                
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 429:  # Rate limit
                    if attempt < self.max_retries - 1:
                        time.sleep(self.retry_delay * 2 * (attempt + 1))
                        continue
                return self._fallback_response()
                
            except Exception as e:
                print(f"LLM Error (attempt {attempt + 1}/{self.max_retries}): {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                    continue
                return self._fallback_response()
        
        return self._fallback_response()
    
    def _fallback_response(self) -> str:
        """Fallback response when API is unavailable"""
        return "I'm here to help you explore your career path. Could you tell me more about what interests you?"
    
    def validate_api_key(self) -> bool:
        """Validate that the API key works"""
        try:
            response = requests.post(
                self.base_url,
                json={
                    "model": self.model,
                    "messages": [{"role": "user", "content": "test"}],
                    "max_tokens": 5
                },
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                timeout=10
            )
            return response.status_code == 200
        except:
            return False
