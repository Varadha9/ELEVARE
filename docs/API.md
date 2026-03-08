# ELEVARE API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 22,
  "education": "undergraduate"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token"
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token"
}
```

### Get Profile
**GET** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "age": 22,
  "education": "undergraduate",
  "conversationStreak": 5
}
```

---

## Conversation Endpoints

### Send Message
**POST** `/conversations/message`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "I really enjoyed working on a coding project today",
  "conversationId": "optional_conversation_id"
}
```

**Response:**
```json
{
  "conversationId": "conversation_id",
  "message": "That's great! What specifically about coding excites you?",
  "analysis": {
    "emotions": [
      { "emotion": "joy", "score": 0.85 }
    ],
    "sentiment": "positive",
    "keywords": ["coding", "project", "enjoyed"],
    "detectedTraits": [
      { "trait": "analyticalThinking", "value": 5 }
    ]
  }
}
```

### Get Conversations
**GET** `/conversations`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "conversation_id",
    "userId": "user_id",
    "messages": [...],
    "sessionDate": "2024-01-15T10:00:00Z",
    "completed": false
  }
]
```

---

## Profile Endpoints

### Get User Profile
**GET** `/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "userId": "user_id",
  "personality": {
    "openness": 75,
    "conscientiousness": 68,
    "extraversion": 55,
    "agreeableness": 72,
    "neuroticism": 45
  },
  "behavioralTraits": {
    "creativity": 70,
    "analyticalThinking": 85,
    "communication": 60,
    "leadership": 55,
    "empathy": 75,
    "motivation": 80,
    "stressTolerance": 65,
    "problemSolving": 82
  },
  "ikigai": {
    "loves": ["technology", "problem solving"],
    "goodAt": ["logical thinking", "coding"],
    "worldNeeds": ["software development"],
    "paidFor": ["tech industry"]
  }
}
```

### Get Trait History
**GET** `/profile/history`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "date": "2024-01-15T10:00:00Z",
    "traits": {
      "creativity": 68,
      "analyticalThinking": 82
    }
  }
]
```

### Update Ikigai
**PUT** `/profile/ikigai`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "loves": ["coding", "design"],
  "goodAt": ["problem solving"],
  "worldNeeds": ["technology"],
  "paidFor": ["software"]
}
```

---

## Recommendation Endpoints

### Generate Recommendations
**POST** `/recommendations/generate`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "recommendation_id",
  "userId": "user_id",
  "recommendations": [
    {
      "careerTitle": "Software Engineer",
      "careerCategory": "Technology",
      "confidenceScore": 87.5,
      "explanation": {
        "summary": "Strong match based on analytical thinking...",
        "matchingTraits": ["analyticalThinking", "problemSolving"],
        "ikigaiAlignment": {
          "loves": 85,
          "goodAt": 90,
          "worldNeeds": 80,
          "paidFor": 88
        }
      },
      "careerDetails": {
        "description": "Design and develop software...",
        "requiredSkills": ["Programming", "Problem Solving"],
        "averageSalary": "$90,000 - $150,000",
        "growthOutlook": "22% growth"
      }
    }
  ],
  "generatedAt": "2024-01-15T10:00:00Z"
}
```

### Get Recommendations
**GET** `/recommendations`

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of recommendation objects

### Submit Feedback
**POST** `/recommendations/feedback`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "recommendationId": "recommendation_id",
  "careerTitle": "Software Engineer",
  "interested": true,
  "rating": 5,
  "comment": "This matches my interests perfectly"
}
```

---

## Error Responses

All endpoints may return error responses:

**400 Bad Request**
```json
{
  "message": "Validation error",
  "errors": [...]
}
```

**401 Unauthorized**
```json
{
  "message": "Not authorized, no token"
}
```

**404 Not Found**
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "message": "Something went wrong!"
}
```

---

## Rate Limiting
- 100 requests per 15 minutes per IP
- Applies to all `/api/*` endpoints
