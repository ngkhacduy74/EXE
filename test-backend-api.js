// Test Backend API Endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:4000';
const TEST_TOKEN = 'your-test-token-here'; // Replace with actual test token

async function testBackendAPI() {
  console.log('🧪 Testing Backend API Endpoints...\n');

  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing Server Connection...');
    const response = await fetch(`${BASE_URL}/api/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Response Status:', response.status);
    console.log('📡 Response Headers:', response.headers.get('content-type'));

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend API working');
      console.log('📊 Data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Backend API failed:', response.status);
      console.log('📄 Error Response:', errorText.substring(0, 200));
    }

    // Test 2: Test GA4 endpoint
    console.log('\n2️⃣ Testing GA4 Endpoint...');
    const ga4Response = await fetch(`${BASE_URL}/api/dashboard/ga4`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (ga4Response.ok) {
      const ga4Data = await ga4Response.json();
      console.log('✅ GA4 endpoint working');
      console.log('📊 GA4 Data:', JSON.stringify(ga4Data, null, 2));
    } else {
      console.log('❌ GA4 endpoint failed:', ga4Response.status);
    }

    // Test 3: Test Real-time endpoint
    console.log('\n3️⃣ Testing Real-time Endpoint...');
    const realtimeResponse = await fetch(`${BASE_URL}/api/dashboard/realtime`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (realtimeResponse.ok) {
      const realtimeData = await realtimeResponse.json();
      console.log('✅ Real-time endpoint working');
      console.log('📊 Real-time Data:', JSON.stringify(realtimeData, null, 2));
    } else {
      console.log('❌ Real-time endpoint failed:', realtimeResponse.status);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure backend is running: cd backend && npm start');
    console.log('2. Check if MongoDB is connected');
    console.log('3. Verify the port (should be 4000)');
    console.log('4. Check if all routes are properly configured');
  }
}

// Manual test instructions
console.log('📋 Manual Testing Instructions:');
console.log('1. Start backend: cd backend && npm start');
console.log('2. Check MongoDB connection');
console.log('3. Run this test: node test-backend-api.js');
console.log('4. Check console for API responses');

// Run tests if called directly
if (require.main === module) {
  testBackendAPI();
}

module.exports = { testBackendAPI }; 