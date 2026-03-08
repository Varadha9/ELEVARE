# ELEVARE - System Diagrams

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                              │
│                                                                           │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐   │
│  │  Login/Register│  │   Chat Page    │  │   Dashboard Page       │   │
│  │                │  │                │  │                        │   │
│  │  - Auth Form   │  │  - Messages    │  │  - Trait Charts        │   │
│  │  - Validation  │  │  - Input Box   │  │  - Recommendations     │   │
│  └────────────────┘  └────────────────┘  └────────────────────────┘   │
│                                                                           │
│                    React 18 + Vite + TailwindCSS                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY LAYER                              │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Express.js Backend API                         │  │
│  │                                                                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │  │
│  │  │   Auth   │  │   Chat   │  │ Profile  │  │Recommendation│    │  │
│  │  │  Routes  │  │  Routes  │  │  Routes  │  │   Routes     │    │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘    │  │
│  │                                                                    │  │
│  │  ┌──────────────────────────────────────────────────────────┐   │  │
│  │  │              Middleware Layer                             │   │  │
│  │  │  - JWT Authentication                                     │   │  │
│  │  │  - Input Validation                                       │   │  │
│  │  │  - Rate Limiting                                          │   │  │
│  │  │  - Error Handling                                         │   │  │
│  │  └──────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│                         Node.js + Express + JWT                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↕ HTTP
┌─────────────────────────────────────────────────────────────────────────┐
│                        AI PROCESSING LAYER                               │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Python FastAPI Service                         │  │
│  │                                                                    │  │
│  │  ┌─────────────────────┐        ┌─────────────────────┐         │  │
│  │  │   NLP Processor     │        │ Behavioral Analyzer │         │  │
│  │  │                     │        │                     │         │  │
│  │  │ • Text Preprocess   │        │ • Trait Updates     │         │  │
│  │  │ • Tokenization      │        │ • Personality Model │         │  │
│  │  │ • Emotion Detection │        │ • Ikigai Mapping    │         │  │
│  │  │ • Sentiment Analysis│        │ • Evolution Track   │         │  │
│  │  │ • Keyword Extract   │        │                     │         │  │
│  │  └─────────────────────┘        └─────────────────────┘         │  │
│  │                                                                    │  │
│  │  ┌─────────────────────┐        ┌─────────────────────┐         │  │
│  │  │ Conversational Agent│        │Recommendation Engine│         │  │
│  │  │                     │        │                     │         │  │
│  │  │ • Question Bank     │        │ • Trait Matching    │         │  │
│  │  │ • Context Aware     │        │ • Personality Fit   │         │  │
│  │  │ • Response Generate │        │ • Ikigai Alignment  │         │  │
│  │  │ • Empathy Model     │        │ • Hybrid Scoring    │         │  │
│  │  └─────────────────────┘        └─────────────────────┘         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│            Python + FastAPI + Transformers + Scikit-learn               │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↕
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATABASE LAYER                                 │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                         MongoDB                                   │  │
│  │                                                                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │  │
│  │  │  users   │  │ profiles │  │  convos  │  │recommendations│    │  │
│  │  │          │  │          │  │          │  │              │    │  │
│  │  │ • name   │  │ • traits │  │ • msgs   │  │ • careers    │    │  │
│  │  │ • email  │  │ • person │  │ • analysis│  │ • confidence │    │  │
│  │  │ • pass   │  │ • ikigai │  │ • date   │  │ • feedback   │    │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘    │  │
│  │                                                                    │  │
│  │  ┌──────────┐                                                     │  │
│  │  │ careers  │  Career Database (50+ careers)                     │  │
│  │  │          │                                                     │  │
│  │  │ • title  │                                                     │  │
│  │  │ • traits │                                                     │  │
│  │  │ • skills │                                                     │  │
│  │  └──────────┘                                                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│                            MongoDB 6+                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

## 2. Data Flow Diagram - Conversation Processing

```
┌──────────┐
│   USER   │
└────┬─────┘
     │ 1. Types message
     ↓
┌─────────────────┐
│  Chat Component │
└────┬────────────┘
     │ 2. POST /conversations/message
     ↓
┌──────────────────────┐
│  Backend API         │
│  (Express)           │
└────┬─────────────────┘
     │ 3. Forward to AI Service
     ↓
┌──────────────────────────────────────┐
│  AI Service (Python)                 │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 1. NLP Processing              │ │
│  │    • Tokenize                  │ │
│  │    • Detect emotions           │ │
│  │    • Analyze sentiment         │ │
│  │    • Extract keywords          │ │
│  └────────────┬───────────────────┘ │
│               ↓                      │
│  ┌────────────────────────────────┐ │
│  │ 2. Behavioral Analysis         │ │
│  │    • Extract traits            │ │
│  │    • Update personality        │ │
│  │    • Calculate Ikigai          │ │
│  └────────────┬───────────────────┘ │
│               ↓                      │
│  ┌────────────────────────────────┐ │
│  │ 3. Response Generation         │ │
│  │    • Context analysis          │ │
│  │    • Generate reply            │ │
│  │    • Select next question      │ │
│  └────────────┬───────────────────┘ │
└───────────────┼──────────────────────┘
                │ 4. Return response + analysis
                ↓
┌──────────────────────┐
│  Backend API         │
│  • Save to MongoDB   │
│  • Update profile    │
└────┬─────────────────┘
     │ 5. Return to frontend
     ↓
┌─────────────────┐
│  Chat Component │
│  • Display msg  │
└────┬────────────┘
     │ 6. Show to user
     ↓
┌──────────┐
│   USER   │
└──────────┘
```

## 3. Recommendation Generation Flow

```
┌──────────┐
│   USER   │ Clicks "Generate Recommendations"
└────┬─────┘
     ↓
┌─────────────────────────────────────────┐
│  Frontend Dashboard                     │
│  POST /recommendations/generate         │
└────┬────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────┐
│  Backend API                            │
│  • Authenticate user                    │
│  • Forward to AI service                │
└────┬────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────────────────────┐
│  AI Recommendation Engine                               │
│                                                          │
│  Step 1: Fetch User Profile                            │
│  ┌────────────────────────────────────────────────┐   │
│  │ • Behavioral traits (8 dimensions)             │   │
│  │ • Personality (Big Five)                       │   │
│  │ • Ikigai dimensions                            │   │
│  │ • Conversation history                         │   │
│  └────────────────────────────────────────────────┘   │
│                        ↓                                │
│  Step 2: Fetch Career Database                         │
│  ┌────────────────────────────────────────────────┐   │
│  │ • 50+ career profiles                          │   │
│  │ • Required traits per career                   │   │
│  │ • Personality fit data                         │   │
│  │ • Ikigai mappings                              │   │
│  └────────────────────────────────────────────────┘   │
│                        ↓                                │
│  Step 3: Calculate Scores for Each Career              │
│  ┌────────────────────────────────────────────────┐   │
│  │ For each career:                               │   │
│  │                                                 │   │
│  │ A. Trait Match Score (40%)                     │   │
│  │    • Cosine similarity                         │   │
│  │    • User traits vs Career traits              │   │
│  │                                                 │   │
│  │ B. Personality Fit Score (30%)                 │   │
│  │    • Big Five correlation                      │   │
│  │    • Statistical fit                           │   │
│  │                                                 │   │
│  │ C. Ikigai Alignment Score (30%)                │   │
│  │    • 4-dimension overlap                       │   │
│  │    • Jaccard similarity                        │   │
│  │                                                 │   │
│  │ Confidence = (A×0.4 + B×0.3 + C×0.3)          │   │
│  └────────────────────────────────────────────────┘   │
│                        ↓                                │
│  Step 4: Generate Explanations                         │
│  ┌────────────────────────────────────────────────┐   │
│  │ • Identify matching traits                     │   │
│  │ • Create human-readable summary                │   │
│  │ • Calculate Ikigai breakdown                   │   │
│  │ • Add career details                           │   │
│  └────────────────────────────────────────────────┘   │
│                        ↓                                │
│  Step 5: Rank and Return Top 5                         │
│  ┌────────────────────────────────────────────────┐   │
│  │ • Sort by confidence score                     │   │
│  │ • Select top 5 careers                         │   │
│  │ • Format response                              │   │
│  └────────────────────────────────────────────────┘   │
└────┬────────────────────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────┐
│  Backend API                            │
│  • Save recommendations to MongoDB      │
│  • Return to frontend                   │
└────┬────────────────────────────────────┘
     ↓
┌─────────────────────────────────────────┐
│  Dashboard Component                    │
│  • Display recommendations              │
│  • Show confidence scores               │
│  • Render matching traits               │
│  • Enable feedback                      │
└────┬────────────────────────────────────┘
     ↓
┌──────────┐
│   USER   │ Views personalized career recommendations
└──────────┘
```

## 4. Database Schema Relationships

```
┌─────────────────────┐
│       users         │
│─────────────────────│
│ _id (PK)            │
│ name                │
│ email (unique)      │
│ password (hashed)   │
│ age                 │
│ education           │
│ conversationStreak  │
│ lastActive          │
└──────┬──────────────┘
       │ 1:1
       ↓
┌─────────────────────┐
│   userprofiles      │
│─────────────────────│
│ _id (PK)            │
│ userId (FK)         │───────┐
│ personality {}      │       │
│ behavioralTraits {} │       │
│ ikigai {}           │       │
│ interests []        │       │
│ traitHistory []     │       │
└─────────────────────┘       │
                              │
       ┌──────────────────────┘
       │ 1:N
       ↓
┌─────────────────────┐
│   conversations     │
│─────────────────────│
│ _id (PK)            │
│ userId (FK)         │
│ messages []         │
│   - role            │
│   - content         │
│   - timestamp       │
│   - analysis {}     │
│ sessionDate         │
│ completed           │
└─────────────────────┘

       ┌──────────────────────┐
       │ 1:N                  │
       ↓                      ↓
┌─────────────────────┐  ┌─────────────────────┐
│  recommendations    │  │      careers        │
│─────────────────────│  │─────────────────────│
│ _id (PK)            │  │ _id (PK)            │
│ userId (FK)         │  │ title (unique)      │
│ recommendations []  │  │ category            │
│   - careerTitle     │  │ description         │
│   - confidence      │  │ requiredTraits {}   │
│   - explanation {}  │  │ personalityFit {}   │
│   - careerDetails {}│  │ skills []           │
│   - userFeedback {} │  │ education []        │
│ generatedAt         │  │ averageSalary       │
│ modelVersion        │  │ growthRate          │
└─────────────────────┘  │ ikigaiMapping {}    │
                         └─────────────────────┘
```

## 5. Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
│                                                          │
│  Layer 1: Frontend Security                             │
│  ┌────────────────────────────────────────────────┐    │
│  │ • Input sanitization                           │    │
│  │ • XSS prevention                               │    │
│  │ • Token storage (localStorage)                 │    │
│  │ • HTTPS enforcement                            │    │
│  └────────────────────────────────────────────────┘    │
│                        ↓                                 │
│  Layer 2: API Gateway Security                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ • CORS configuration                           │    │
│  │ • Rate limiting (100 req/15min)                │    │
│  │ • Request validation                           │    │
│  │ • JWT verification                             │    │
│  └────────────────────────────────────────────────┘    │
│                        ↓                                 │
│  Layer 3: Authentication                                │
│  ┌────────────────────────────────────────────────┐    │
│  │ • JWT tokens (7-day expiry)                    │    │
│  │ • Bcrypt hashing (12 rounds)                   │    │
│  │ • Password strength validation                 │    │
│  │ • Session management                           │    │
│  └────────────────────────────────────────────────┘    │
│                        ↓                                 │
│  Layer 4: Database Security                             │
│  ┌────────────────────────────────────────────────┐    │
│  │ • MongoDB authentication                       │    │
│  │ • Connection encryption                        │    │
│  │ • NoSQL injection prevention                   │    │
│  │ • Data encryption at rest                      │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## 6. Deployment Architecture (Production)

```
                    ┌─────────────────┐
                    │   CloudFlare    │
                    │   (CDN + SSL)   │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
         ┌──────────▼─────────┐  ┌───▼──────────────┐
         │   Vercel/Netlify   │  │   AWS ALB        │
         │   (Frontend)       │  │ (Load Balancer)  │
         └────────────────────┘  └───┬──────────────┘
                                     │
                          ┌──────────┴──────────┐
                          │                     │
                  ┌───────▼────────┐   ┌───────▼────────┐
                  │   EC2 Instance │   │  EC2 Instance  │
                  │   (Backend)    │   │  (AI Service)  │
                  │   Node.js      │   │  Python+GPU    │
                  └───────┬────────┘   └───────┬────────┘
                          │                     │
                          └──────────┬──────────┘
                                     │
                          ┌──────────▼──────────┐
                          │  MongoDB Atlas      │
                          │  (Replica Set)      │
                          │  - Primary          │
                          │  - Secondary        │
                          │  - Arbiter          │
                          └─────────────────────┘
```

---

These diagrams provide a complete visual understanding of the ELEVARE system architecture, data flows, and deployment strategy.
