// Test chat endpoint with authentication
async function testChat() {
  console.log('🧪 Testing Chat Endpoint...\n');
  
  const BASE_URL = 'http://localhost:5000/api';
  
  // Step 1: Login to get token
  console.log('1️⃣ Logging in...');
  try {
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('⚠️  Login failed, trying to register...');
      
      const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@test.com',
          password: 'test123',
          age: 22,
          education: 'undergraduate'
        })
      });
      
      if (!registerResponse.ok) {
        const error = await registerResponse.json();
        console.error('❌ Registration failed:', error);
        return;
      }
      
      const registerData = await registerResponse.json();
      var token = registerData.data.token;
      console.log('✅ Registered successfully');
    } else {
      const loginData = await loginResponse.json();
      var token = loginData.data.token;
      console.log('✅ Logged in successfully');
    }
    
    // Step 2: Send a message
    console.log('\n2️⃣ Sending message...');
    const messageResponse = await fetch(`${BASE_URL}/conversations/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: 'I love coding and solving complex problems'
      })
    });
    
    if (!messageResponse.ok) {
      const error = await messageResponse.json();
      console.error('❌ Message failed:', error);
      return;
    }
    
    const messageData = await messageResponse.json();
    console.log('✅ Message sent successfully\n');
    console.log('📝 Response structure:', JSON.stringify(messageData, null, 2));
    console.log('\n🤖 AI Response:', messageData.data.conversation.aiResponse);
    console.log('📊 Analysis:', messageData.data.analysis);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testChat();
