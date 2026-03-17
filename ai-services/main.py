from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn
from services.nlp_processor import NLPProcessor
from services.behavioral_analyzer import BehavioralAnalyzer
from services.conversational_agent import ConversationalAgent
from services.recommendation_engine import RecommendationEngine
from utils.database import DatabaseManager
from data.career_data import CAREER_DATABASE
from bson import ObjectId
from bson.errors import InvalidId

def parse_user_id(user_id: str):
    try:
        return ObjectId(user_id)
    except (InvalidId, Exception):
        return user_id

app = FastAPI(title="ELEVARE AI Services", version="1.0.0")

# Initialize services
nlp_processor = NLPProcessor()
behavioral_analyzer = BehavioralAnalyzer()
conversational_agent = ConversationalAgent()
db_manager = DatabaseManager()
recommendation_engine = RecommendationEngine(CAREER_DATABASE)

# Request models
class ProcessMessageRequest(BaseModel):
    userId: str
    message: str
    conversationHistory: List[Dict]

class RecommendationRequest(BaseModel):
    userId: str

class FeedbackRequest(BaseModel):
    userId: str
    careerTitle: str
    interested: bool
    rating: Optional[int] = None

@app.get("/")
def root():
    return {"message": "ELEVARE AI Services", "status": "running"}

@app.post("/process")
async def process_message(request: ProcessMessageRequest):
    """Process user message with NLP and generate AI response"""
    try:
        # NLP Processing
        analysis = nlp_processor.process_message(request.message)
        
        # Get user profile
        user_profile = db_manager.get_user_profile(parse_user_id(request.userId))

        # Fall back to default profile so LLM still responds even without DB
        if not user_profile:
            user_profile = {
                'behavioralTraits': {
                    'creativity': 5.0, 'analyticalThinking': 5.0, 'leadership': 5.0,
                    'teamwork': 5.0, 'communication': 5.0, 'problemSolving': 5.0,
                    'adaptability': 5.0, 'empathy': 5.0
                },
                'personality': {
                    'openness': 0.5, 'conscientiousness': 0.5, 'extraversion': 0.5,
                    'agreeableness': 0.5, 'neuroticism': 0.5
                },
                'interests': []
            }
        
        # Update behavioral traits
        current_traits = user_profile.get('behavioralTraits', {})
        detected_traits = analysis.get('detectedTraits', {})
        updated_traits = behavioral_analyzer.update_traits(current_traits, detected_traits)
        
        # Update personality
        current_personality = user_profile.get('personality', {})
        personality_signals = analysis.get('personalitySignals', {})
        updated_personality = behavioral_analyzer.update_personality(
            current_personality, 
            personality_signals
        )
        
        # Update Ikigai
        interests = user_profile.get('interests', [])
        updated_ikigai = behavioral_analyzer.calculate_ikigai_alignment(
            user_profile,
            interests
        )

        # Save all updates to database
        db_manager.update_user_profile(parse_user_id(request.userId), {
            'behavioralTraits': updated_traits,
            'personality': updated_personality,
            'ikigai': updated_ikigai
        })
        
        # Generate AI response with LLM
        response = conversational_agent.generate_response(
            request.message,
            analysis,
            request.conversationHistory,
            user_profile  # Pass user profile for context
        )
        
        return {
            "response": response,
            "analysis": {
                "emotions": analysis['emotions'],
                "sentiment": analysis['sentiment'],
                "keywords": analysis['keywords'],
                "detectedTraits": [
                    {"trait": k, "value": v} for k, v in detected_traits.items()
                ]
            },
            "traitUpdates": {
                "behavioralTraits": updated_traits,
                "personality": updated_personality,
                "ikigai": updated_ikigai
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend")
async def generate_recommendations(request: RecommendationRequest):
    """Generate career recommendations based on user profile"""
    try:
        # Get user profile
        user_profile = db_manager.get_user_profile(parse_user_id(request.userId))
        
        if not user_profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        # Generate recommendations
        recommendations = recommendation_engine.generate_recommendations(user_profile)
        
        return {"recommendations": recommendations}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/feedback")
async def process_feedback(request: FeedbackRequest):
    """Process user feedback on recommendations"""
    try:
        feedback_data = recommendation_engine.update_from_feedback(
            request.userId,
            request.careerTitle,
            request.interested,
            request.rating
        )
        
        return {"status": "success", "feedback": feedback_data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy", "services": ["nlp", "behavioral", "recommendation"]}

if __name__ == "__main__":
    print("🤖 Starting ELEVARE AI Services...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
