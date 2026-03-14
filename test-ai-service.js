// Quick test script to verify AI service connectivity
// Uses native fetch (Node 18+)

async function testAIService() {
  console.log('🧪 Testing AI Service Connection...\n');
  
  const AI_SERVICE_URL = 'http://localhost:8000';
  
  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${AI_SERVICE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.log('\n⚠️  Make sure AI service is running: cd ai-services && python main.py\n');
    return;
  }
  
  // Test 2: Process Message
  try {
    console.log('\n2️⃣ Testing message processing...');
    const testMessage = {
      userId: '507f1f77bcf86cd799439011',
      message: 'I love coding and solving complex problems',
      conversationHistory: []
    };
    
    const processResponse = await fetch(`${AI_SERVICE_URL}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testMessage)
    });
    
    const processData = await processResponse.json();
    console.log('✅ AI Response:', processData.response);
    console.log('✅ Analysis:', processData.analysis);
  } catch (error) {
    console.error('❌ Message processing failed:', error.message);
  }
  
  console.log('\n✨ Test complete!');
}

testAIService();
