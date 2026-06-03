# API Reference

**Base URL:** `http://localhost:5000` (development) · `https://your-backend.com` (production)

All protected endpoints require:
```http
Authorization: Bearer <jwt_token>
```

---

## Authentication

### Register

```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass1",
  "age": 22,
  "education": "undergraduate"
}
```

Education values: `high_school` · `undergraduate` · `graduate` · `postgraduate` · `other`

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com" },
    "token": "<jwt>"
  }
}
```

**Validation rules:**
- `name` — 2–50 characters, letters and spaces only
- `email` — valid email format, unique
- `password` — min 8 chars, must include uppercase, lowercase, number
- `age` — integer 13–100
- `education` — one of the values above

---

### Login

```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "jane@example.com",
  "password": "SecurePass1"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com" },
    "token": "<jwt>"
  }
}
```

---

### Change Password

```http
PUT /api/auth/change-password
Authorization: Bearer <token>
```

**Body:**
```json
{
  "currentPassword": "OldPass1",
  "newPassword": "NewPass1"
}
```

---

### Delete Account

```http
DELETE /api/auth/account
Authorization: Bearer <token>
```

Permanently deletes the user, profile, and all conversations.

---

## Profile

### Get Profile

```http
GET /api/profile
Authorization: Bearer <token>
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...", "name": "Jane Doe", "email": "jane@example.com",
      "age": 22, "education": "undergraduate"
    },
    "profile": {
      "behavioralTraits": {
        "creativity": 6.8,
        "analyticalThinking": 7.2,
        "leadership": 5.5,
        "teamwork": 7.0,
        "communication": 6.5,
        "problemSolving": 7.8,
        "adaptability": 6.0,
        "empathy": 6.3
      },
      "personality": {
        "openness": 0.72,
        "conscientiousness": 0.68,
        "extraversion": 0.55,
        "agreeableness": 0.70,
        "neuroticism": 0.32
      },
      "ikigai": {
        "whatYouLove": ["technology", "problem-solving"],
        "whatYouAreGoodAt": ["programming", "analysis"],
        "whatTheWorldNeeds": ["innovation"],
        "whatYouCanBePaidFor": ["software development"]
      },
      "conversationCount": 12,
      "profileCompleteness": 75,
      "streak": 4
    }
  }
}
```

---

### Update Profile

```http
PUT /api/profile
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com"
}
```

---

### Export Data

```http
GET /api/profile/export
Authorization: Bearer <token>
```

Returns all user data including profile and conversation history (up to 100 conversations).

---

## Conversations

### Send Message

```http
POST /api/conversations/message
Authorization: Bearer <token>
```

**Body:**
```json
{
  "message": "I really enjoyed solving that algorithm problem today"
}
```

Message must be 1–2000 characters.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "...",
      "userMessage": "I really enjoyed solving that algorithm problem today",
      "aiResponse": "That sounds rewarding! What made that problem particularly satisfying to work through?",
      "timestamp": "2025-01-15T10:30:00.000Z"
    },
    "analysis": {
      "sentiment": 0.7,
      "emotions": { "joy": 0.6, "engagement": 0.8 },
      "keywords": ["algorithm", "problem", "solving"],
      "detectedTraits": [
        { "trait": "analyticalThinking", "value": 7.5 },
        { "trait": "problemSolving", "value": 8.0 }
      ]
    },
    "updatedTraits": {
      "creativity": 6.8,
      "analyticalThinking": 7.3,
      "problemSolving": 7.9
    }
  }
}
```

---

### Get Conversation History

```http
GET /api/conversations/history
Authorization: Bearer <token>
```

Returns up to 50 conversations, sorted oldest to newest.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "...",
        "userMessage": "I enjoyed coding today",
        "aiResponse": "That's great! What specifically did you enjoy?",
        "sentiment": 0.7,
        "timestamp": "2025-01-15T10:30:00.000Z"
      }
    ],
    "total": 12
  }
}
```

---

## Recommendations

### Get Recommendations

```http
GET /api/recommendations
Authorization: Bearer <token>
```

Returns recommendations based on the user's current profile. Requires at least 1 conversation.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "careerTitle": "Software Engineer",
      "category": "Technology",
      "confidenceScore": 87,
      "reasoning": "Strong analytical and problem-solving traits",
      "matchedTraits": ["analyticalThinking", "problemSolving", "creativity"],
      "requiredSkills": ["Programming", "Problem Solving", "Logical Thinking"],
      "averageSalary": "$95,000",
      "growthRate": "22%"
    }
  ]
}
```

---

### Generate Recommendations

```http
POST /api/recommendations/generate
Authorization: Bearer <token>
```

Triggers recommendation generation from the AI service. Requires at least 1 conversation.

---

## Health

```http
GET /health
```

**Response `200`:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "services": {
    "database": { "status": "healthy", "type": "mongodb" },
    "aiService": { "status": "healthy" }
  },
  "memory": {
    "heapUsed": "45 MB",
    "heapTotal": "75 MB"
  }
}
```

Status can be `healthy` (200) or `degraded` (503).

---

## AI Service Endpoints

**Base URL:** `http://localhost:8000`

### Process Message

```http
POST /process
```

**Body:**
```json
{
  "userId": "user_id",
  "message": "I love solving complex problems",
  "conversationHistory": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous response" }
  ]
}
```

---

### Generate Recommendations

```http
POST /recommend
```

**Body:**
```json
{
  "userId": "user_id"
}
```

---

### Submit Feedback

```http
POST /feedback
```

**Body:**
```json
{
  "userId": "user_id",
  "careerTitle": "Software Engineer",
  "interested": true,
  "rating": 4
}
```

---

### AI Health

```http
GET /health
```

```json
{
  "status": "healthy",
  "services": ["nlp", "behavioral", "recommendation"],
  "groq_api_configured": true,
  "mongodb_configured": true,
  "environment": "production"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Description of the error"
  }
}
```

Validation errors include a `details` array:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Please provide a valid email address" },
      { "field": "password", "message": "Password must be at least 8 characters long" }
    ]
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad request / validation failed |
| `401` | Unauthorized — missing or invalid token |
| `404` | Resource not found |
| `409` | Conflict — email already exists |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Auth routes (login/register) | 10 requests / 15 min |
| All other API routes | 100 requests / 15 min |

Rate limit headers are included on all responses:
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1642694400
```

---

## Code Examples

### JavaScript (fetch)

```javascript
// Register
const res = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'SecurePass1',
    age: 22,
    education: 'undergraduate'
  })
});
const { data } = await res.json();
const token = data.token;

// Send message
const msgRes = await fetch('http://localhost:5000/api/conversations/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ message: 'I enjoyed coding today' })
});
```

### Python (requests)

```python
import requests

BASE = 'http://localhost:5000/api'

# Login
res = requests.post(f'{BASE}/auth/login', json={
    'email': 'jane@example.com',
    'password': 'SecurePass1'
})
token = res.json()['data']['token']

# Get profile
profile = requests.get(f'{BASE}/profile', headers={
    'Authorization': f'Bearer {token}'
}).json()

# Send message
msg = requests.post(f'{BASE}/conversations/message',
    json={'message': 'I enjoy solving problems'},
    headers={'Authorization': f'Bearer {token}'}
).json()
```

### cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"SecurePass1","age":22,"education":"undergraduate"}'

# Login and save token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"SecurePass1"}' | jq -r '.data.token')

# Get profile
curl http://localhost:5000/api/profile \
  -H "Authorization: Bearer $TOKEN"

# Send message
curl -X POST http://localhost:5000/api/conversations/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message":"I love solving complex problems"}'
```
