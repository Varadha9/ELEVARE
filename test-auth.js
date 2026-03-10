const axios = require('axios');

async function testBackend() {
  console.log('Testing ELEVARE Backend...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✓ Backend is running:', healthResponse.data);
    
    // Test registration
    console.log('\n2. Testing registration...');
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      age: 25,
      education: 'undergraduate'
    };
    
    try {
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', testUser);
      console.log('✓ Registration successful:', registerResponse.data);
    } catch (regError) {
      if (regError.response?.status === 400 && regError.response?.data?.message === 'User already exists') {
        console.log('✓ Registration endpoint working (user already exists)');
      } else {
        console.log('✗ Registration failed:', regError.response?.data || regError.message);
      }
    }
    
    // Test login
    console.log('\n3. Testing login...');
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('✓ Login successful:', loginResponse.data);
    } catch (loginError) {
      console.log('✗ Login failed:', loginError.response?.data || loginError.message);
    }
    
  } catch (error) {
    console.log('✗ Backend connection failed:', error.message);
    console.log('Make sure the backend is running on port 5000');
  }
}

testBackend();