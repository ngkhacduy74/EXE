const axios = require('axios');

async function testBackendConnection() {
  try {
    console.log('🔍 Testing backend connection...');
    
    // Test backend health
    const response = await axios.get('http://localhost:4000/auth/test', {
      timeout: 5000
    });
    
    console.log('✅ Backend is running and accessible');
    console.log('📊 Response:', response.status, response.statusText);
    
    return true;
  } catch (error) {
    console.log('❌ Backend connection failed');
    console.log('🔍 Error details:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure backend is running on port 4000');
    }
    
    return false;
  }
}

async function testFrontendConnection() {
  try {
    console.log('🔍 Testing frontend connection...');
    
    const response = await axios.get('http://localhost:3000', {
      timeout: 5000
    });
    
    console.log('✅ Frontend is running and accessible');
    console.log('📊 Response:', response.status, response.statusText);
    
    return true;
  } catch (error) {
    console.log('❌ Frontend connection failed');
    console.log('🔍 Error details:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure frontend is running on port 3000');
    }
    
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting connection tests...\n');
  
  const backendOk = await testBackendConnection();
  console.log('');
  
  const frontendOk = await testFrontendConnection();
  console.log('');
  
  if (backendOk && frontendOk) {
    console.log('🎉 Both services are running correctly!');
    console.log('🔗 Frontend should be able to connect to backend');
  } else {
    console.log('⚠️  Some services are not running properly');
    console.log('📋 Troubleshooting steps:');
    console.log('   1. Make sure backend is running: npm start (in backend folder)');
    console.log('   2. Make sure frontend is running: npm start (in frontend folder)');
    console.log('   3. Check if ports 3000 and 4000 are available');
    console.log('   4. Check firewall settings');
  }
}

runTests(); 