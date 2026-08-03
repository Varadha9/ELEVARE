from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import os
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        mongo_uri = os.getenv('MONGODB_URI')
        if not mongo_uri:
            raise RuntimeError('MONGODB_URI environment variable is not set')
        try:
            self.client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
            # Verify connection is reachable at startup
            self.client.admin.command('ping')
            self.db = self.client['elevare']
            logger.info('\u2705 AI service connected to MongoDB')
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f'\u274c Failed to connect to MongoDB: {e}')
            raise RuntimeError(f'Cannot connect to MongoDB: {e}') from e
        
    def get_user_profile(self, user_id):
        """Fetch user profile from database by userId"""
        profile = self.db.userprofiles.find_one({'userId': user_id})
        return profile
    
    def update_user_profile(self, user_id, updates):
        """Update user profile with new trait/personality/ikigai values
        Uses $set to only update specified fields, not replace the whole document"""
        self.db.userprofiles.update_one(
            {'userId': user_id},
            {'$set': updates}
        )
    
    def get_career_database(self):
        """Fetch all careers from the careers collection"""
        careers = list(self.db.careers.find({}))
        return careers
    
    def save_conversation_analysis(self, conversation_id, analysis):
        """Save NLP analysis results to a specific conversation document"""
        self.db.conversations.update_one(
            {'_id': conversation_id},
            {'$set': {'analysis': analysis}}
        )
    
    def get_conversation_history(self, user_id, limit=10):
        """Get recent conversation history for a user, sorted newest first"""
        conversations = self.db.conversations.find(
            {'userId': user_id}
        ).sort('sessionDate', -1).limit(limit)
        return list(conversations)
