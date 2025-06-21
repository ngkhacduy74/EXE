const axios = require('axios');

// Test dashboard API
async function testDashboardAPI() {
  const baseURL = 'http://localhost:4000';
  
  try {
    console.log('🧪 Testing Dashboard API...');
    
    // Test 1: Check if server is running
    console.log('\n1️⃣ Testing server connection...');
    try {
      const healthCheck = await axios.get(`${baseURL}/auth`);
      console.log('✅ Server is running');
    } catch (error) {
      console.log('❌ Server is not running or not accessible');
      console.log('Please start the backend server first: cd backend && npm start');
      return;
    }

    // Test 2: Test dashboard endpoint without auth
    console.log('\n2️⃣ Testing dashboard endpoint without authentication...');
    try {
      await axios.get(`${baseURL}/dashboard/stats`);
      console.log('❌ Dashboard should require authentication');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Dashboard correctly requires authentication');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    // Test 3: Test with invalid token
    console.log('\n3️⃣ Testing dashboard endpoint with invalid token...');
    try {
      await axios.get(`${baseURL}/dashboard/stats`, {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });
      console.log('❌ Should reject invalid token');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Correctly rejected invalid token');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    console.log('\n📋 Test Summary:');
    console.log('- Make sure backend server is running on port 4000');
    console.log('- Make sure you have MongoDB connected');
    console.log('- Make sure you have at least one admin user in the database');
    console.log('- Login with admin account to get valid token');
    console.log('- Check browser console for detailed API call logs');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Create test data script
async function createTestData() {
  console.log('\n📝 To create test data, you can:');
  console.log('1. Register a new user through the frontend');
  console.log('2. Create some posts through the admin panel');
  console.log('3. Create some products through the admin panel');
  console.log('4. Create some banners through the admin panel');
  console.log('\nOr use MongoDB Compass to manually add data to your collections.');
}

// Run tests
testDashboardAPI();
createTestData(); 