# PyMongo — official MongoDB driver for Python
from pymongo import MongoClient
import os
# dotenv — loads environment variables from .env file
from dotenv import load_dotenv

# Load .env so MONGODB_URI is available
load_dotenv()

class DatabaseManager:
    def __init__(self):
        # Connect to MongoDB using the URI from .env
        self.client = MongoClient(os.getenv('MONGODB_URI'))
        # Select the 'elevare' database
        self.db = self.client['elevare']
        
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
