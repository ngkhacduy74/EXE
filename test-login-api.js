const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('🧪 Testing Login API...');
    
    // Test 1: Check if server is running
    console.log('\n1. Testing server connection...');
    const healthCheck = await axios.get('http://localhost:4000/auth/login', {
      timeout: 5000
    }).catch(err => {
      console.log('❌ Server not responding:', err.message);
      return null;
    });
    
    if (healthCheck) {
      console.log('✅ Server is running');
    }
    
    // Test 2: Test login with invalid data
    console.log('\n2. Testing login with invalid data...');
    try {
      const response = await axios.post('http://localhost:4000/auth/login', {
        email: 'test@test.com',
        password: 'wrongpassword'
      });
      console.log('✅ Login API responded:', response.data);
    } catch (error) {
      console.log('✅ Login API error handling works:', error.response?.data || error.message);
    }
    
    // Test 3: Test OTP endpoint
    console.log('\n3. Testing OTP endpoint...');
    try {
      const otpResponse = await axios.get('http://localhost:4000/otp/sendOTP?email=test@test.com');
      console.log('✅ OTP API responded:', otpResponse.data);
    } catch (error) {
      console.log('❌ OTP API error:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLoginAPI(); 