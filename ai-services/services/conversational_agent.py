import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.llm_client import GroqLLMClient
from prompts.career_coach_prompts import get_career_coach_system_prompt
from typing import List, Dict

class ConversationalAgent:
    def __init__(self):
        self.llm_client = GroqLLMClient()
    
    def generate_response(
        self, 
        user_message: str, 
        nlp_analysis: dict,
        conversation_history: List[Dict],
        user_profile: dict = None
    ) -> str:
        """Generate intelligent response using LLM + NLP insights"""
        
        system_prompt = get_career_coach_system_prompt(user_profile)
        enhanced_context = self._build_context(user_message, nlp_analysis)
        
        response = self.llm_client.generate_response(
            system_prompt=system_prompt,
            user_message=enhanced_context,
            conversation_history=conversation_history,
            temperature=0.7
        )
        
        return response
    
    def _build_context(self, message: str, nlp_analysis: dict) -> str:
        """Build enriched context for LLM"""
        
        context = f"User message: {message}\n\n"
        
        sentiment = nlp_analysis.get('sentiment', 'neutral')
        emotions = nlp_analysis.get('emotions', [])
        keywords = nlp_analysis.get('keywords', [])
        
        context += f"[Sentiment: {sentiment}]\n"
        
        if emotions:
            context += f"[Emotion: {emotions[0]['emotion']}]\n"
        
        if keywords:
            context += f"[Topics: {', '.join(keywords[:5])}]\n"
        
        detected_traits = nlp_analysis.get('detectedTraits', {})
        if detected_traits:
            context += f"[Traits: {', '.join(detected_traits.keys())}]\n"
        
        return context
