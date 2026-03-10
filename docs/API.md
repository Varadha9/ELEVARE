# ELEVARE - API Documentation

## 🌐 Base URL
```
Development: http://localhost:5000/api
Production: https://api.elevare.com/api
```

## 🔐 Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Token Lifecycle
- **Expiration**: 7 days (configurable)
- **Refresh**: Automatic on valid requests
- **Revocation**: Logout endpoint

---

## 📋 API Endpoints Overview

| Category | Endpoint | Method | Auth | Description |
|----------|----------|--------|------|-------------|
| **Auth** | `/auth/register` | POST | ❌ | User registration |
| **Auth** | `/auth/login` | POST | ❌ | User login |
| **Auth** | `/auth/logout` | POST | ✅ | User logout |
| **Profile** | `/profile` | GET | ✅ | Get user profile |
| **Profile** | `/profile` | PUT | ✅ | Update profile |
| **Chat** | `/conversations/message` | POST | ✅ | Send message |
| **Chat** | `/conversations/history` | GET | ✅ | Get chat history |
| **Recommendations** | `/recommendations/generate` | POST | ✅ | Generate recommendations |
| **Recommendations** | `/recommendations` | GET | ✅ | Get recommendations |
| **Analytics** | `/analytics/traits` | GET | ✅ | Get behavioral traits |
| **Analytics** | `/analytics/personality` | GET | ✅ | Get personality data |

---

## 🔑 Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 22,
  "education": "undergraduate"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 22,
      "education": "undergraduate",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `age`: Required, 16-100 years
- `education`: Required, enum: ["high_school", "undergraduate", "graduate", "postgraduate"]

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Logout User
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 👤 Profile Endpoints

### Get User Profile
```http
GET /api/profile
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 22,
      "education": "undergraduate",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "profile": {
      "behavioralTraits": {
        "creativity": 7.2,
        "analyticalThinking": 8.1,
        "leadership": 6.5,
        "teamwork": 7.8,
        "communication": 7.0,
        "problemSolving": 8.3,
        "adaptability": 6.9,
        "empathy": 7.5
      },
      "personality": {
        "openness": 0.75,
        "conscientiousness": 0.82,
        "extraversion": 0.68,
        "agreeableness": 0.71,
        "neuroticism": 0.35
      },
      "ikigai": {
        "whatYouLove": ["technology", "problem-solving", "creativity"],
        "whatYoureGoodAt": ["programming", "analysis", "communication"],
        "whatTheWorldNeeds": ["innovation", "efficiency", "accessibility"],
        "whatYouCanBePaidFor": ["software development", "consulting", "teaching"]
      },
      "conversationCount": 15,
      "lastActive": "2024-01-20T14:30:00.000Z",
      "profileCompleteness": 85
    }
  }
}
```

### Update User Profile
```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "age": 23,
  "education": "graduate"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Smith",
      "email": "john@example.com",
      "age": 23,
      "education": "graduate"
    }
  }
}
```

---

## 💬 Conversation Endpoints

### Send Message
```http
POST /api/conversations/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I really enjoyed working on the coding project today. It was challenging but rewarding."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
      "userMessage": "I really enjoyed working on the coding project today. It was challenging but rewarding.",
      "aiResponse": "That's wonderful to hear! It sounds like you found a great balance between challenge and achievement. What specific aspects of the coding project did you find most engaging?",
      "analysis": {
        "sentiment": 0.8,
        "emotions": {
          "joy": 0.7,
          "satisfaction": 0.8,
          "engagement": 0.9
        },
        "keywords": ["coding", "project", "challenging", "rewarding"],
        "traitIndicators": {
          "problemSolving": 0.8,
          "creativity": 0.6,
          "analyticalThinking": 0.7
        }
      },
      "timestamp": "2024-01-20T14:30:00.000Z"
    },
    "updatedTraits": {
      "problemSolving": 8.4,
      "creativity": 7.3,
      "analyticalThinking": 8.2
    }
  }
}
```

### Get Conversation History
```http
GET /api/conversations/history?page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)
- `startDate`: Filter from date (ISO format)
- `endDate`: Filter to date (ISO format)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "userMessage": "I really enjoyed working on the coding project today.",
        "aiResponse": "That's wonderful to hear! What specific aspects did you find most engaging?",
        "sentiment": 0.8,
        "timestamp": "2024-01-20T14:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 🎯 Recommendation Endpoints

### Generate Recommendations
```http
POST /api/recommendations/generate
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Recommendations generated successfully",
  "data": {
    "recommendations": [
      {
        "career": "Software Engineer",
        "matchScore": 0.92,
        "confidence": 0.88,
        "reasoning": {
          "strengths": [
            "High analytical thinking (8.2/10)",
            "Strong problem-solving skills (8.4/10)",
            "Good creativity scores (7.3/10)"
          ],
          "ikigaiAlignment": {
            "love": 0.9,
            "good": 0.95,
            "need": 0.85,
            "paid": 0.9
          },
          "personalityFit": {
            "openness": "High creativity and innovation",
            "conscientiousness": "Detail-oriented and reliable",
            "extraversion": "Good for team collaboration"
          }
        },
        "careerDetails": {
          "description": "Design, develop, and maintain software applications",
          "averageSalary": "$95,000",
          "growthRate": "22%",
          "requiredSkills": ["Programming", "Problem Solving", "Teamwork"],
          "educationLevel": "Bachelor's Degree",
          "workEnvironment": "Office/Remote"
        }
      }
    ],
    "generatedAt": "2024-01-20T14:30:00.000Z",
    "basedOnConversations": 15
  }
}
```

### Get Recommendations
```http
GET /api/recommendations?page=1&limit=5
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "career": "Software Engineer",
        "matchScore": 0.92,
        "confidence": 0.88,
        "feedback": null,
        "createdAt": "2024-01-20T14:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 8
    }
  }
}
```

### Provide Recommendation Feedback
```http
POST /api/recommendations/:id/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "helpful": true,
  "comments": "Very accurate recommendation, matches my interests well"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Feedback recorded successfully",
  "data": {
    "recommendation": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "feedback": {
        "rating": 4,
        "helpful": true,
        "comments": "Very accurate recommendation, matches my interests well",
        "submittedAt": "2024-01-20T15:00:00.000Z"
      }
    }
  }
}
```

---

## 📊 Analytics Endpoints

### Get Behavioral Traits
```http
GET /api/analytics/traits?period=30d
Authorization: Bearer <token>
```

**Query Parameters:**
- `period`: Time period (7d, 30d, 90d, all)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "currentTraits": {
      "creativity": 7.3,
      "analyticalThinking": 8.2,
      "leadership": 6.5,
      "teamwork": 7.8,
      "communication": 7.0,
      "problemSolving": 8.4,
      "adaptability": 6.9,
      "empathy": 7.5
    },
    "traitHistory": [
      {
        "date": "2024-01-15",
        "traits": {
          "creativity": 7.0,
          "analyticalThinking": 8.0,
          "problemSolving": 8.1
        }
      }
    ],
    "traitTrends": {
      "creativity": 0.3,
      "analyticalThinking": 0.2,
      "problemSolving": 0.3
    }
  }
}
```

### Get Personality Analysis
```http
GET /api/analytics/personality
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "personality": {
      "openness": {
        "score": 0.75,
        "description": "High openness to experience",
        "traits": ["Creative", "Curious", "Open-minded"]
      },
      "conscientiousness": {
        "score": 0.82,
        "description": "Highly conscientious",
        "traits": ["Organized", "Reliable", "Goal-oriented"]
      },
      "extraversion": {
        "score": 0.68,
        "description": "Moderately extraverted",
        "traits": ["Social", "Energetic", "Assertive"]
      },
      "agreeableness": {
        "score": 0.71,
        "description": "Highly agreeable",
        "traits": ["Cooperative", "Trusting", "Helpful"]
      },
      "neuroticism": {
        "score": 0.35,
        "description": "Low neuroticism",
        "traits": ["Calm", "Stable", "Confident"]
      }
    },
    "personalityType": "ENFJ",
    "lastUpdated": "2024-01-20T14:30:00.000Z"
  }
}
```

---

## ❌ Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### HTTP Status Codes

| Code | Description | Common Causes |
|------|-------------|---------------|
| **400** | Bad Request | Invalid input, validation errors |
| **401** | Unauthorized | Missing/invalid token |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Duplicate email, resource conflict |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Server-side errors |

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `AUTHENTICATION_ERROR` | Invalid credentials |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_RESOURCE` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server-side error |

---

## 🔒 Rate Limiting

### Limits
- **Authentication**: 5 requests per minute
- **General API**: 100 requests per 15 minutes
- **AI Processing**: 10 requests per minute

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
```

---

## 📝 Request/Response Examples

### cURL Examples

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "age": 22,
    "education": "undergraduate"
  }'
```

**Send Message:**
```bash
curl -X POST http://localhost:5000/api/conversations/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "I enjoyed coding today"
  }'
```

### JavaScript Examples

**Using Fetch API:**
```javascript
// Register user
const registerUser = async (userData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Send message with authentication
const sendMessage = async (message, token) => {
  const response = await fetch('/api/conversations/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });
  return response.json();
};
```

### Python Examples

**Using Requests:**
```python
import requests

# Register user
def register_user(user_data):
    response = requests.post(
        'http://localhost:5000/api/auth/register',
        json=user_data
    )
    return response.json()

# Send message
def send_message(message, token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.post(
        'http://localhost:5000/api/conversations/message',
        json={'message': message},
        headers=headers
    )
    return response.json()
```

---

## 🧪 Testing

### Postman Collection
Import the Postman collection from `docs/postman/ELEVARE.postman_collection.json`

### Test Environment Variables
```json
{
  "baseUrl": "http://localhost:5000/api",
  "authToken": "{{token}}",
  "userId": "{{userId}}"
}
```

### Automated Tests
```bash
# Run API tests
cd backend
npm test

# Run specific test suite
npm test -- --grep "Authentication"
```

---

## 📚 Additional Resources

### OpenAPI Specification
- [Swagger UI](http://localhost:5000/api-docs) (when server is running)
- [OpenAPI JSON](./openapi.json)

### SDKs and Libraries
- [JavaScript SDK](./sdks/javascript/)
- [Python SDK](./sdks/python/)
- [React Hooks](./sdks/react-hooks/)

### Webhooks
- [Webhook Documentation](./WEBHOOKS.md)
- [Event Types](./EVENTS.md)

---

**📞 Support**

For API support and questions:
- [GitHub Issues](https://github.com/Varadha9/ELEVARE/issues)
- [API Discussion Forum](https://github.com/Varadha9/ELEVARE/discussions)
- Email: api-support@elevare.com