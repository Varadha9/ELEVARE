// Simple in-memory database for development
// This allows ELEVARE to run without MongoDB installation

const users = new Map();
const userProfiles = new Map();
const conversations = new Map();
const recommendations = new Map();

class MemoryDatabase {
  constructor() {
    this.collections = {
      users,
      userProfiles,
      conversations,
      recommendations
    };
  }

  // User operations
  async createUser(userData) {
    const id = Date.now().toString();
    const user = {
      _id: id,
      ...userData,
      createdAt: new Date()
    };
    this.collections.users.set(id, user);
    return user;
  }

  async findUserByEmail(email) {
    for (const [id, user] of this.collections.users) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id) {
    return this.collections.users.get(id) || null;
  }

  // Profile operations
  async createUserProfile(userId, profileData) {
    const profile = {
      _id: Date.now().toString(),
      userId,
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.collections.userProfiles.set(userId, profile);
    return profile;
  }

  async findUserProfile(userId) {
    return this.collections.userProfiles.get(userId) || null;
  }

  async updateUserProfile(userId, updates) {
    const existing = this.collections.userProfiles.get(userId);
    if (existing) {
      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date()
      };
      this.collections.userProfiles.set(userId, updated);
      return updated;
    }
    return null;
  }

  // Conversation operations
  async saveConversation(conversationData) {
    const id = Date.now().toString();
    const conversation = {
      _id: id,
      ...conversationData,
      timestamp: new Date()
    };
    
    // Store by user ID for easy retrieval
    const userConversations = this.collections.conversations.get(conversationData.userId) || [];
    userConversations.push(conversation);
    this.collections.conversations.set(conversationData.userId, userConversations);
    
    return conversation;
  }

  async getUserConversations(userId, limit = 10) {
    const conversations = this.collections.conversations.get(userId) || [];
    return conversations.slice(-limit).reverse(); // Get latest conversations
  }

  // Recommendation operations
  async saveRecommendations(userId, recommendationsData) {
    const data = {
      _id: Date.now().toString(),
      userId,
      recommendations: recommendationsData,
      createdAt: new Date()
    };
    this.collections.recommendations.set(userId, data);
    return data;
  }

  async getUserRecommendations(userId) {
    return this.collections.recommendations.get(userId) || null;
  }

  // Utility methods
  async clearAll() {
    this.collections.users.clear();
    this.collections.userProfiles.clear();
    this.collections.conversations.clear();
    this.collections.recommendations.clear();
  }

  async getStats() {
    return {
      users: this.collections.users.size,
      profiles: this.collections.userProfiles.size,
      conversations: Array.from(this.collections.conversations.values()).reduce((sum, convs) => sum + convs.length, 0),
      recommendations: this.collections.recommendations.size
    };
  }
}

// Export singleton instance
const memoryDB = new MemoryDatabase();

// Initialize with some sample data for testing
const initSampleData = () => {
  console.log('🗄️  Initializing in-memory database with sample data...');
  
  // Sample user
  const sampleUser = {
    name: 'Demo User',
    email: 'demo@elevare.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // password123
    age: 22,
    education: 'undergraduate'
  };
  
  memoryDB.createUser(sampleUser).then(user => {
    // Sample profile
    const sampleProfile = {
      behavioralTraits: {
        creativity: 7.5,
        analyticalThinking: 8.0,
        leadership: 6.5,
        teamwork: 7.8,
        communication: 7.2,
        problemSolving: 8.3,
        adaptability: 7.0,
        empathy: 7.5
      },
      personality: {
        openness: 0.75,
        conscientiousness: 0.82,
        extraversion: 0.68,
        agreeableness: 0.71,
        neuroticism: 0.35
      },
      ikigai: {
        whatYouLove: ['technology', 'problem-solving', 'creativity'],
        whatYoureGoodAt: ['programming', 'analysis', 'communication'],
        whatTheWorldNeeds: ['innovation', 'efficiency', 'accessibility'],
        whatYouCanBePaidFor: ['software development', 'consulting', 'teaching']
      },
      conversationCount: 0,
      profileCompleteness: 85
    };
    
    return memoryDB.createUserProfile(user._id, sampleProfile);
  }).then(() => {
    console.log('✅ Sample data initialized');
    console.log('📧 Demo login: demo@elevare.com / password123');
  }).catch(err => {
    console.error('❌ Error initializing sample data:', err);
  });
};

// Initialize sample data
setTimeout(initSampleData, 1000);

module.exports = memoryDB;