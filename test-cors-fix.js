// Test CORS Fix for GA4 API
const fetch = require('node-fetch');

const BASE_URL = 'https://exe-08k7.onrender.com';
const TEST_TOKEN = 'your-test-token-here'; // Replace with actual test token

async function testCORSFix() {
  console.log('🧪 Testing CORS Fix for GA4 API...\n');

  try {
    // Test 1: Preflight OPTIONS request
    console.log('1️⃣ Testing Preflight OPTIONS Request...');
    const optionsResponse = await fetch(`${BASE_URL}/api/dashboard/ga4`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://vinsaky.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization, Content-Type'
      }
    });

    console.log('📡 OPTIONS Response Status:', optionsResponse.status);
    console.log('📡 CORS Headers:');
    console.log('  Access-Control-Allow-Origin:', optionsResponse.headers.get('Access-Control-Allow-Origin'));
    console.log('  Access-Control-Allow-Methods:', optionsResponse.headers.get('Access-Control-Allow-Methods'));
    console.log('  Access-Control-Allow-Headers:', optionsResponse.headers.get('Access-Control-Allow-Headers'));

    if (optionsResponse.status === 200) {
      console.log('✅ Preflight request successful');
    } else {
      console.log('❌ Preflight request failed');
    }

    // Test 2: Actual GET request with Authorization
    console.log('\n2️⃣ Testing Actual GET Request...');
    const getResponse = await fetch(`${BASE_URL}/api/dashboard/ga4`, {
      method: 'GET',
      headers: {
        'Origin': 'https://vinsaky.com',
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 GET Response Status:', getResponse.status);
    console.log('📡 CORS Headers:');
    console.log('  Access-Control-Allow-Origin:', getResponse.headers.get('Access-Control-Allow-Origin'));

    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('✅ GET request successful');
      console.log('📊 GA4 Data received:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await getResponse.text();
      console.log('❌ GET request failed:', getResponse.status);
      console.log('📄 Error Response:', errorText.substring(0, 200));
    }

    // Test 3: Real-time endpoint
    console.log('\n3️⃣ Testing Real-time Endpoint...');
    const realtimeResponse = await fetch(`${BASE_URL}/api/dashboard/realtime`, {
      method: 'GET',
      headers: {
        'Origin': 'https://vinsaky.com',
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Real-time Response Status:', realtimeResponse.status);

    if (realtimeResponse.ok) {
      const realtimeData = await realtimeResponse.json();
      console.log('✅ Real-time request successful');
      console.log('📊 Real-time Data:', JSON.stringify(realtimeData, null, 2));
    } else {
      const errorText = await realtimeResponse.text();
      console.log('❌ Real-time request failed:', realtimeResponse.status);
      console.log('📄 Error Response:', errorText.substring(0, 200));
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCORSFix(); 