# ELEVARE - Project Structure

```
ELEVARE/
│
├── 📱 frontend/                    # React Application (Port 3000)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx           # Chat interface
│   │   │   └── Dashboard.jsx      # Analytics dashboard
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Register.jsx       # Registration page
│   │   │   └── Home.jsx           # Main application
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Authentication state
│   │   ├── services/
│   │   │   └── api.js             # API client
│   │   ├── App.jsx                # Root component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── 🔧 backend/                     # Node.js API (Port 5000)
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── conversationController.js
│   │   ├── profileController.js
│   │   └── recommendationController.js
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── UserProfile.js         # Profile schema
│   │   ├── Conversation.js        # Conversation schema
│   │   ├── Recommendation.js      # Recommendation schema
│   │   └── Career.js              # Career schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── conversationRoutes.js
│   │   ├── profileRoutes.js
│   │   └── recommendationRoutes.js
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication
│   │   └── validate.js            # Input validation
│   ├── server.js                  # Main server file
│   ├── package.json
│   └── .env.example
│
├── 🤖 ai-services/                 # Python AI (Port 8000)
│   ├── services/
│   │   ├── nlp_processor.py       # NLP pipeline
│   │   ├── behavioral_analyzer.py # Trait analysis
│   │   ├── conversational_agent.py # AI agent
│   │   └── recommendation_engine.py # Career matching
│   ├── data/
│   │   └── career_data.py         # Career database (50+ careers)
│   ├── utils/
│   │   └── database.py            # MongoDB utilities
│   ├── main.py                    # FastAPI server
│   ├── requirements.txt
│   └── .env
│
├── 📚 docs/                        # Documentation
│   ├── API.md                     # API reference
│   ├── ARCHITECTURE.md            # System design
│   └── DEPLOYMENT.md              # Deployment guide
│
├── 📊 datasets/                    # Dataset preprocessing
│   └── README.md                  # Dataset guide
│
├── 📄 README.md                    # Main documentation
├── ⚙️ setup.bat                    # Setup script
├── ▶️ start-all.bat                # Start all services
└── 🚫 .gitignore                   # Git ignore rules
```

## File Count Summary

- **Total Files:** 60+
- **Frontend Files:** 15
- **Backend Files:** 20
- **AI Service Files:** 10
- **Documentation Files:** 4

## Key Files

### Configuration Files
- `backend/.env` - Backend configuration
- `ai-services/.env` - AI service configuration
- `frontend/vite.config.js` - Vite configuration
- `frontend/tailwind.config.js` - TailwindCSS configuration

### Entry Points
- `frontend/src/main.jsx` - Frontend entry
- `backend/server.js` - Backend entry
- `ai-services/main.py` - AI service entry

### Core Components
- `frontend/src/components/Chat.jsx` - Chat interface
- `frontend/src/components/Dashboard.jsx` - Analytics dashboard
- `backend/controllers/conversationController.js` - Chat logic
- `ai-services/services/nlp_processor.py` - NLP processing

## Technology Distribution

```
Frontend:  React, Vite, TailwindCSS, Recharts
Backend:   Node.js, Express, MongoDB, JWT
AI:        Python, FastAPI, NLTK, TextBlob
Database:  MongoDB
```
