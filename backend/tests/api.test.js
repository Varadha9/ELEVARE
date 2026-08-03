import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';

describe('ELEVARE Backend API Tests', () => {
  let authToken;

  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: process.env.TEST_USER_PASSWORD || 'Test1234!',
    age: 22,
    education: 'undergraduate'
  };

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toMatch(/healthy|degraded/);
    });
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      authToken = res.body.data.token;
    });

    it('should not register duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      expect(res.status).toBe(409);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wr0ng-pass-invalid' });
      expect(res.status).toBe(401);
    });
  });

  describe('Protected Routes', () => {
    it('should reject requests without token', async () => {
      const res = await request(app).get('/api/profile');
      expect(res.status).toBe(401);
    });

    it('should get profile with valid token', async () => {
      const res = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.profile).toBeDefined();
    });
  });

  describe('Conversations', () => {
    it('should send a message', async () => {
      const res = await request(app)
        .post('/api/conversations/message')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ message: 'I love solving complex problems' });

      expect(res.status).toBe(200);
      expect(res.body.data.conversation).toBeDefined();
      expect(res.body.data.analysis).toBeDefined();
    });

    it('should get conversation history', async () => {
      const res = await request(app)
        .get('/api/conversations/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.conversations)).toBe(true);
    });
  });

  describe('Recommendations', () => {
    it('should get recommendations', async () => {
      const res = await request(app)
        .get('/api/recommendations')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
