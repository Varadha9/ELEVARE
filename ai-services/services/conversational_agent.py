import sys
import os
import re
# Add parent directory to path so we can import from utils/
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Groq LLM client — wraps the Groq API (Llama 3.3 70B)
from utils.llm_client import GroqLLMClient
# Dynamic system prompt builder — personalizes the AI coach based on user profile
from prompts.career_coach_prompts import get_career_coach_system_prompt
from typing import List, Dict

class ConversationalAgent:
    def __init__(self):
        # Initialize the Groq LLM client — reads API key from .env
        self.llm_client = GroqLLMClient()
    
    def generate_response(
        self, 
        user_message: str, 
        nlp_analysis: dict,
        conversation_history: List[Dict],
        user_profile: dict = None
    ) -> str:
        """Generate intelligent response using LLM + NLP insights"""
        
        # Build a personalized system prompt based on the user's current profile
        # If the user has 3+ conversations, the prompt includes career suggestions
        system_prompt = get_career_coach_system_prompt(user_profile)
        
        # Enrich the user message with NLP context (sentiment, emotions, keywords)
        # This helps the LLM give more relevant and empathetic responses
        enhanced_context = self._build_context(user_message, nlp_analysis)
        
        # Call the Groq API with the system prompt, enriched message, and chat history
        response = self.llm_client.generate_response(
            system_prompt=system_prompt,
            user_message=enhanced_context,
            conversation_history=conversation_history,
            temperature=0.7  # Moderate creativity — not too random, not too rigid
        )
        
        return response
    
    def _sanitize(self, text: str) -> str:
        """Strip HTML/script tags from user input before embedding in LLM context"""
        return re.sub(r'<[^>]*>', '', str(text))

    def _build_context(self, message: str, nlp_analysis: dict) -> str:
        """Build enriched context string for the LLM
        
        Appends NLP metadata as structured tags so the LLM can use them
        without the user seeing them directly
        """
        context = f"User message: {self._sanitize(message)}\n\n"
        
        # Add sentiment so the LLM can match the user's emotional tone
        sentiment = self._sanitize(nlp_analysis.get('sentiment', 'neutral'))
        emotions  = nlp_analysis.get('emotions', [])
        keywords  = [self._sanitize(k) for k in nlp_analysis.get('keywords', [])]
        
        context += f"[Sentiment: {sentiment}]\n"
        
        # Add the dominant emotion to help the LLM respond empathetically
        if emotions:
            context += f"[Emotion: {self._sanitize(emotions[0]['emotion'])}]\n"
        
        # Add key topics so the LLM can reference them in its response
        if keywords:
            context += f"[Topics: {', '.join(keywords[:5])}]\n"
        
        # Add detected traits so the LLM can acknowledge the user's strengths
        detected_traits = nlp_analysis.get('detectedTraits', {})
        if detected_traits:
            safe_traits = [self._sanitize(t) for t in detected_traits.keys()]
            context += f"[Traits: {', '.join(safe_traits)}]\n"
        
        return context
