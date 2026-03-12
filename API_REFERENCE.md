# ELEVARE API Documentation

## 🌐 Base URL
```
Development: http://localhost:5000/api
Production: https://api.elevare.com/api
```

## 🔐 Authentication
All protected endpoints require JWT token:
```
Authorization: Bearer <your_jwt_token>
```

## 📋 Core Endpoints

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### User Profile
```http
GET /api/profile
PUT /api/profile
```

### Conversations
```http
POST /api/conversations/message
GET /api/conversations/history
```

### Recommendations
```http
POST /api/recommendations/generate
GET /api/recommendations
```

### Analytics
```http
GET /api/analytics/traits
GET /api/analytics/personality
```

## 📊 Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

## ❌ Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## 🔒 Rate Limits
- General API: 100 requests/15 minutes
- Authentication: 5 requests/15 minutes
- AI Processing: 10 requests/minute

For complete API documentation, see [docs/API.md](docs/API.md)