from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn
import os
import logging
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(
    level=getattr(logging, os.getenv('LOG_LEVEL', 'INFO')),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import AI service modules
from services.nlp_processor import NLPProcessor
from services.behavioral_analyzer import BehavioralAnalyzer
from services.conversational_agent import ConversationalAgent
from services.recommendation_engine import RecommendationEngine
from utils.database import DatabaseManager
from data.career_data import CAREER_DATABASE

# BSON ObjectId handling for MongoDB IDs
from bson import ObjectId
from bson.errors import InvalidId

# parse_user_id — converts string user IDs to MongoDB ObjectId format
# Falls back to the original string if conversion fails (for in-memory DB mode)
def parse_user_id(user_id: str):
    try:
        return ObjectId(user_id)
    except (InvalidId, Exception):
        return user_id

app = FastAPI(
    title="ELEVARE AI Services",
    version="1.0.0",
    docs_url="/docs" if os.getenv('ENVIRONMENT') != 'production' else None,
    redoc_url="/redoc" if os.getenv('ENVIRONMENT') != 'production' else None
)

# Startup validation
@app.on_event("startup")
async def startup_event():
    logger.info("Starting ELEVARE AI Services...")
    
    # Validate Groq API key
    groq_key = os.getenv('GROQ_API_KEY')
    if not groq_key or groq_key == 'your_groq_api_key_here':
        logger.warning("⚠️  GROQ_API_KEY not set. AI responses will use fallback mode.")
    else:
        logger.info("✅ GROQ_API_KEY configured")
    
    # Validate MongoDB connection
    mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/elevare')
    logger.info(f"📊 MongoDB URI configured")
    logger.info("✅ ELEVARE AI Services ready")

# Initialize all AI service components once at startup
# These are reused across all requests for efficiency
nlp_processor = NLPProcessor()
behavioral_analyzer = BehavioralAnalyzer()
conversational_agent = ConversationalAgent()
db_manager = DatabaseManager()
recommendation_engine = RecommendationEngine(CAREER_DATABASE)

# Pydantic models define the expected request body structure
# FastAPI automatically validates incoming JSON against these schemas
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

# Root endpoint — returns service status
@app.get("/")
def root():
    return {"message": "ELEVARE AI Services", "status": "running"}

# /process — main endpoint called by the backend for every user message
# Runs NLP analysis, updates behavioral traits, and generates an LLM response
@app.post("/process")
async def process_message(request: ProcessMessageRequest):
    """Process user message with NLP and generate AI response"""
    try:
        # Step 1: Run NLP analysis on the user's message
        # Extracts emotions, sentiment, keywords, and detected traits
        analysis = nlp_processor.process_message(request.message)
        
        # Step 2: Fetch the user's current profile from MongoDB
        user_profile = db_manager.get_user_profile(parse_user_id(request.userId))

        # Fallback profile if DB is unavailable — ensures LLM still responds
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
        
        # Step 3: Update behavioral traits using EWMA (Exponentially Weighted Moving Average)
        # Blends current trait values with newly detected signals
        current_traits = user_profile.get('behavioralTraits', {})
        detected_traits = analysis.get('detectedTraits', {})
        updated_traits = behavioral_analyzer.update_traits(current_traits, detected_traits)
        
        # Step 4: Update Big Five personality traits using the same EWMA approach
        current_personality = user_profile.get('personality', {})
        personality_signals = analysis.get('personalitySignals', {})
        updated_personality = behavioral_analyzer.update_personality(
            current_personality, 
            personality_signals
        )
        
        # Step 5: Recalculate Ikigai alignment based on updated traits
        interests = user_profile.get('interests', [])
        updated_ikigai = behavioral_analyzer.calculate_ikigai_alignment(
            user_profile,
            interests
        )

        # Step 6: Persist all updates to MongoDB
        db_manager.update_user_profile(parse_user_id(request.userId), {
            'behavioralTraits': updated_traits,
            'personality': updated_personality,
            'ikigai': updated_ikigai
        })
        
        # Step 7: Generate AI response using Groq LLM (Llama 3.3 70B)
        # Passes NLP analysis and user profile for context-aware responses
        response = conversational_agent.generate_response(
            request.message,
            analysis,
            request.conversationHistory,
            user_profile
        )
        
        # Return the AI response, NLP analysis, and trait updates to the backend
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

# /recommend — generates career recommendations based on the user's profile
@app.post("/recommend")
async def generate_recommendations(request: RecommendationRequest):
    """Generate career recommendations based on user profile"""
    try:
        # Fetch the user's profile from MongoDB
        user_profile = db_manager.get_user_profile(parse_user_id(request.userId))
        
        if not user_profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        # Run the recommendation engine — computes psychometric, Ikigai, and market scores
        recommendations = recommendation_engine.generate_recommendations(user_profile)
        
        return {"recommendations": recommendations}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# /feedback — processes user feedback on career recommendations
# Used to improve future recommendations via the feedback loop
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
    health_status = {
        "status": "healthy",
        "services": ["nlp", "behavioral", "recommendation"],
        "groq_api_configured": bool(os.getenv('GROQ_API_KEY') and os.getenv('GROQ_API_KEY') != 'your_groq_api_key_here'),
        "mongodb_configured": bool(os.getenv('MONGODB_URI')),
        "environment": os.getenv('ENVIRONMENT', 'development')
    }
    return health_status

# Entry point — starts the Uvicorn server when running this file directly
if __name__ == "__main__":
    print("🤖 Starting ELEVARE AI Services...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
