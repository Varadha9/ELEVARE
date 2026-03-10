# ELEVARE - Project Structure

## 📁 Complete Directory Structure

```
ELEVARE/
│
├── 📁 .github/                     # GitHub Configuration
│   ├── workflows/                  # CI/CD Pipelines
│   │   └── ci-cd.yml              # Main CI/CD workflow
│   ├── ISSUE_TEMPLATE/            # Issue templates
│   ├── PULL_REQUEST_TEMPLATE.md   # PR template
│   └── CODEOWNERS                 # Code ownership
│
├── 📁 backend/                     # Node.js Express API Server
│   ├── 📁 config/                 # Configuration files
│   │   └── db.js                  # Database connection
│   ├── 📁 controllers/            # Business logic controllers
│   │   ├── authController.js      # Authentication logic
│   │   ├── conversationController.js # Chat functionality
│   │   ├── profileController.js   # User profile management
│   │   └── recommendationController.js # Career recommendations
│   ├── 📁 middleware/             # Express middleware
│   │   ├── auth.js               # JWT authentication
│   │   ├── validate.js           # Input validation
│   │   ├── rateLimiter.js        # Rate limiting
│   │   └── errorHandler.js       # Error handling
│   ├── 📁 models/                # MongoDB schemas
│   │   ├── User.js               # User model
│   │   ├── UserProfile.js        # User profile model
│   │   ├── Conversation.js       # Chat conversation model
│   │   ├── Recommendation.js     # Career recommendation model
│   │   └── Career.js             # Career database model
│   ├── 📁 routes/                # API route definitions
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   ├── conversationRoutes.js # Chat endpoints
│   │   ├── profileRoutes.js      # Profile endpoints
│   │   └── recommendationRoutes.js # Recommendation endpoints
│   ├── 📁 utils/                 # Utility functions
│   │   ├── logger.js             # Winston logger setup
│   │   ├── helpers.js            # Helper functions
│   │   └── constants.js          # Application constants
│   ├── 📁 tests/                 # Test files
│   │   ├── auth.test.js          # Authentication tests
│   │   ├── conversation.test.js  # Chat functionality tests
│   │   └── integration.test.js   # Integration tests
│   ├── 📁 logs/                  # Application logs
│   ├── .env                      # Environment variables
│   ├── .env.example              # Environment template
│   ├── package.json              # Dependencies and scripts
│   ├── package-lock.json         # Dependency lock file
│   └── server.js                 # Main server entry point
│
├── 📁 frontend/                   # React Application
│   ├── 📁 public/                # Static assets
│   │   ├── index.html            # Main HTML template
│   │   ├── favicon.ico           # Site favicon
│   │   └── manifest.json         # PWA manifest
│   ├── 📁 src/                   # Source code
│   │   ├── 📁 components/        # React components
│   │   │   ├── 📁 ui/            # Reusable UI components
│   │   │   │   ├── Button.jsx    # Button component
│   │   │   │   ├── Card.jsx      # Card component
│   │   │   │   ├── Badge.jsx     # Badge component
│   │   │   │   └── Progress.jsx  # Progress bar component
│   │   │   ├── 📁 layout/        # Layout components
│   │   │   │   ├── Navbar.jsx    # Navigation bar
│   │   │   │   ├── Sidebar.jsx   # Sidebar navigation
│   │   │   │   └── DashboardLayout.jsx # Dashboard layout
│   │   │   ├── 📁 charts/        # Data visualization components
│   │   │   │   ├── TraitsRadarChart.jsx # Behavioral traits chart
│   │   │   │   ├── PersonalityRadarChart.jsx # Personality chart
│   │   │   │   └── ProgressLineChart.jsx # Progress tracking chart
│   │   │   ├── Chat.jsx          # Main chat interface
│   │   │   ├── Dashboard.jsx     # Analytics dashboard
│   │   │   └── FloatingChat.jsx  # Floating chat widget
│   │   ├── 📁 pages/             # Page components
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── Dashboard.jsx     # Main dashboard page
│   │   │   ├── Reflection.jsx    # Reflection/chat page
│   │   │   ├── Personality.jsx   # Personality insights page
│   │   │   ├── Careers.jsx       # Career recommendations page
│   │   │   ├── Ikigai.jsx        # Ikigai framework page
│   │   │   ├── ProgressTracking.jsx # Progress tracking page
│   │   │   └── Settings.jsx      # User settings page
│   │   ├── 📁 context/           # React context providers
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── 📁 hooks/             # Custom React hooks
│   │   │   ├── useAuth.js        # Authentication hook
│   │   │   ├── useChat.js        # Chat functionality hook
│   │   │   └── useAnalytics.js   # Analytics hook
│   │   ├── 📁 services/          # API service layer
│   │   │   └── api.js            # API client configuration
│   │   ├── 📁 utils/             # Utility functions
│   │   │   ├── helpers.js        # Helper functions
│   │   │   └── constants.js      # Frontend constants
│   │   ├── 📁 lib/               # Library configurations
│   │   │   └── utils.js          # Utility library
│   │   ├── App.jsx               # Main App component
│   │   ├── main.jsx              # Application entry point
│   │   └── index.css             # Global styles
│   ├── 📁 tests/                 # Frontend tests
│   │   ├── components/           # Component tests
│   │   └── integration/          # Integration tests
│   ├── package.json              # Frontend dependencies
│   ├── package-lock.json         # Dependency lock file
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # TailwindCSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── FRONTEND_README.md        # Frontend-specific documentation
│   └── TESTING_CHECKLIST.md     # Testing guidelines
│
├── 📁 ai-services/               # Python AI Microservices
│   ├── 📁 services/              # AI service modules
│   │   ├── nlp_processor.py      # Natural language processing
│   │   ├── behavioral_analyzer.py # Behavioral trait analysis
│   │   ├── conversational_agent.py # AI conversation logic
│   │   └── recommendation_engine.py # Career recommendation engine
│   ├── 📁 models/                # AI model files
│   │   ├── personality_model.py  # Personality analysis model
│   │   └── trait_classifier.py   # Behavioral trait classifier
│   ├── 📁 data/                  # Data and datasets
│   │   └── career_data.py        # Career database and mappings
│   ├── 📁 utils/                 # Utility modules
│   │   ├── database.py           # Database utilities
│   │   └── llm_client.py         # LLM integration client
│   ├── 📁 prompts/               # AI prompt templates
│   │   └── career_coach_prompts.py # Conversation prompts
│   ├── 📁 tests/                 # AI service tests
│   │   ├── test_nlp.py           # NLP processing tests
│   │   ├── test_behavioral.py    # Behavioral analysis tests
│   │   └── test_recommendations.py # Recommendation tests
│   ├── 📁 logs/                  # AI service logs
│   ├── main.py                   # FastAPI server entry point
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # AI service environment variables
│   ├── test_services.py          # Service integration tests
│   ├── test_llm_integration.py   # LLM integration tests
│   └── LLM_UPGRADE.md           # LLM upgrade documentation
│
├── 📁 docs/                      # Documentation
│   ├── PROJECT_OVERVIEW.md       # Project overview and mission
│   ├── INSTALLATION.md           # Detailed installation guide
│   ├── API.md                    # Complete API documentation
│   ├── ARCHITECTURE.md           # System architecture guide
│   ├── DEPLOYMENT.md             # Production deployment guide
│   ├── 📁 images/                # Documentation images
│   │   ├── architecture-diagram.png # System architecture
│   │   ├── chat-demo.png         # Chat interface screenshot
│   │   ├── dashboard-demo.png    # Dashboard screenshot
│   │   └── recommendations-demo.png # Recommendations screenshot
│   └── 📁 postman/               # API testing
│       └── ELEVARE.postman_collection.json # Postman collection
│
├── 📁 datasets/                  # Data processing and datasets
│   ├── README.md                 # Dataset documentation
│   └── test_dataset.py           # Dataset processing scripts
│
├── 📁 data/                      # Local data storage
│   └── 📁 db/                    # MongoDB data directory
│
├── 📁 scripts/                   # Utility scripts
│   ├── setup.bat                 # Windows setup script
│   ├── setup.sh                  # Linux/Mac setup script
│   ├── start-all.bat             # Windows start script
│   ├── start-all.sh              # Linux/Mac start script
│   ├── health-check.bat          # Health check script
│   └── launch-elevare.bat        # Quick launch script
│
├── 📁 docker/                    # Docker configuration
│   ├── Dockerfile.backend        # Backend Docker image
│   ├── Dockerfile.frontend       # Frontend Docker image
│   ├── Dockerfile.ai-services    # AI services Docker image
│   ├── docker-compose.yml        # Development compose file
│   ├── docker-compose.prod.yml   # Production compose file
│   └── docker-compose.test.yml   # Testing compose file
│
├── 📁 deployment/                # Deployment configurations
│   ├── 📁 aws/                   # AWS deployment files
│   │   ├── cloudformation/       # CloudFormation templates
│   │   ├── terraform/            # Terraform configurations
│   │   └── ecs/                  # ECS task definitions
│   ├── 📁 kubernetes/            # Kubernetes manifests
│   │   ├── backend-deployment.yml # Backend K8s deployment
│   │   ├── frontend-deployment.yml # Frontend K8s deployment
│   │   └── ai-services-deployment.yml # AI services K8s deployment
│   └── 📁 nginx/                 # Nginx configurations
│       ├── nginx.conf            # Main Nginx config
│       └── ssl/                  # SSL certificates
│
├── 📁 monitoring/                # Monitoring and observability
│   ├── prometheus.yml            # Prometheus configuration
│   ├── grafana/                  # Grafana dashboards
│   └── alerts/                   # Alert configurations
│
├── 📁 security/                  # Security configurations
│   ├── .gitignore               # Git ignore patterns
│   ├── .env.example             # Environment template
│   └── security-policy.md       # Security guidelines
│
├── 📄 README.md                  # Main project documentation
├── 📄 CONTRIBUTING.md            # Contribution guidelines
├── 📄 CHANGELOG.md               # Version history and changes
├── 📄 LICENSE                    # MIT license
├── 📄 PROJECT_REPORT.md          # Academic project report
├── 📄 PROJECT_STRUCTURE.md       # This file
├── 📄 QUICKSTART.md              # Quick start guide
├── 📄 TROUBLESHOOTING.md         # Common issues and solutions
├── 📄 .gitignore                 # Git ignore file
└── 📄 package.json               # Root package configuration
```

## 🏗️ Architecture Overview

### 🎯 **Core Components**

| Component | Technology | Purpose | Port |
|-----------|------------|---------|------|
| **Frontend** | React + Vite | User interface and experience | 3000 |
| **Backend API** | Node.js + Express | Business logic and data management | 5000 |
| **AI Services** | Python + FastAPI | AI processing and analysis | 8000 |
| **Database** | MongoDB | Data persistence | 27017 |
| **Cache** | Redis (Optional) | Performance optimization | 6379 |

### 🔄 **Data Flow**

```
User Interface (React)
        ↓ HTTP/REST
Backend API (Express)
        ↓ HTTP
AI Services (FastAPI)
        ↓ MongoDB Driver
Database (MongoDB)
```

### 📊 **File Organization Principles**

1. **Separation of Concerns**: Each directory has a specific purpose
2. **Modular Structure**: Components are organized by functionality
3. **Scalability**: Structure supports growth and new features
4. **Maintainability**: Clear naming and organization
5. **Documentation**: Each major component is documented

## 🔧 **Key Configuration Files**

### Backend Configuration
- `backend/package.json` - Dependencies and scripts
- `backend/.env` - Environment variables
- `backend/server.js` - Main application entry point

### Frontend Configuration
- `frontend/package.json` - Frontend dependencies
- `frontend/vite.config.js` - Build tool configuration
- `frontend/tailwind.config.js` - Styling configuration

### AI Services Configuration
- `ai-services/requirements.txt` - Python dependencies
- `ai-services/main.py` - FastAPI application
- `ai-services/.env` - AI service environment variables

### Development Tools
- `.github/workflows/ci-cd.yml` - CI/CD pipeline
- `docker-compose.yml` - Local development environment
- `.gitignore` - Version control exclusions

## 📝 **File Naming Conventions**

### JavaScript/React Files
- **Components**: PascalCase (e.g., `UserProfile.jsx`)
- **Utilities**: camelCase (e.g., `apiHelpers.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

### Python Files
- **Modules**: snake_case (e.g., `nlp_processor.py`)
- **Classes**: PascalCase (e.g., `BehavioralAnalyzer`)
- **Functions**: snake_case (e.g., `analyze_sentiment`)

### Documentation Files
- **Guides**: UPPERCASE (e.g., `README.md`, `CONTRIBUTING.md`)
- **Specific docs**: descriptive names (e.g., `api-documentation.md`)

## 🚀 **Getting Started with the Structure**

### For New Developers

1. **Start with README.md** - Understand the project overview
2. **Review docs/INSTALLATION.md** - Set up development environment
3. **Explore backend/server.js** - Understand API structure
4. **Check frontend/src/App.jsx** - Understand UI structure
5. **Look at ai-services/main.py** - Understand AI processing

### For Contributors

1. **Read CONTRIBUTING.md** - Understand contribution guidelines
2. **Check .github/workflows/** - Understand CI/CD process
3. **Review tests/** directories - Understand testing approach
4. **Explore docs/** - Understand documentation standards

### For Deployment

1. **Review docs/DEPLOYMENT.md** - Understand deployment options
2. **Check docker/** directory - Container configurations
3. **Explore deployment/** - Infrastructure as code
4. **Review monitoring/** - Observability setup

## 📊 **Code Statistics**

| Directory | Files | Lines of Code | Purpose |
|-----------|-------|---------------|---------|
| `backend/` | 25+ | 5,000+ | API server and business logic |
| `frontend/` | 40+ | 6,000+ | User interface and experience |
| `ai-services/` | 15+ | 3,000+ | AI processing and analysis |
| `docs/` | 10+ | 2,000+ | Documentation and guides |
| `tests/` | 20+ | 1,500+ | Test suites and quality assurance |

## 🔍 **Quick Navigation**

### 🎯 **Want to...**

| Goal | Start Here | Key Files |
|------|------------|-----------|
| **Understand the project** | `README.md` | `docs/PROJECT_OVERVIEW.md` |
| **Set up development** | `docs/INSTALLATION.md` | `setup.bat`, `.env.example` |
| **Add a new feature** | `CONTRIBUTING.md` | Component directories |
| **Fix a bug** | `TROUBLESHOOTING.md` | Test files, logs |
| **Deploy to production** | `docs/DEPLOYMENT.md` | `docker/`, `deployment/` |
| **Understand the API** | `docs/API.md` | `backend/routes/` |
| **Modify the UI** | `frontend/src/` | `frontend/src/components/` |
| **Improve AI features** | `ai-services/` | `ai-services/services/` |

---

**📚 This structure is designed to be intuitive, scalable, and maintainable. Each directory serves a specific purpose and follows industry best practices for modern web application development.**