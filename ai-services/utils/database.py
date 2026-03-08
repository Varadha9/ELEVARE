from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

class DatabaseManager:
    def __init__(self):
        self.client = MongoClient(os.getenv('MONGODB_URI'))
        self.db = self.client['elevare']
        
    def get_user_profile(self, user_id):
        """Fetch user profile from database"""
        profile = self.db.userprofiles.find_one({'userId': user_id})
        return profile
    
    def update_user_profile(self, user_id, updates):
        """Update user profile with new trait values"""
        self.db.userprofiles.update_one(
            {'userId': user_id},
            {'$set': updates}
        )
    
    def get_career_database(self):
        """Fetch all careers from database"""
        careers = list(self.db.careers.find({}))
        return careers
    
    def save_conversation_analysis(self, conversation_id, analysis):
        """Save NLP analysis results"""
        self.db.conversations.update_one(
            {'_id': conversation_id},
            {'$set': {'analysis': analysis}}
        )
    
    def get_conversation_history(self, user_id, limit=10):
        """Get recent conversation history"""
        conversations = self.db.conversations.find(
            {'userId': user_id}
        ).sort('sessionDate', -1).limit(limit)
        return list(conversations)
