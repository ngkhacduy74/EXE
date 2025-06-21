// Test Google Analytics 4 Integration
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';
const TEST_TOKEN = 'your-test-token-here'; // Replace with actual test token

async function testGA4Integration() {
  console.log('🧪 Testing Google Analytics 4 Integration...\n');

  try {
    // Test 1: Check if GA4 script is loaded in frontend
    console.log('1️⃣ Testing GA4 Script Loading...');
    const response = await fetch(`${BASE_URL}/`);
    const html = await response.text();
    
    if (html.includes('G-0DRKJH48YN')) {
      console.log('✅ GA4 script found in HTML');
    } else {
      console.log('❌ GA4 script not found in HTML');
    }

    // Test 2: Test GA4 API endpoint
    console.log('\n2️⃣ Testing GA4 API Endpoint...');
    const ga4Response = await fetch(`${BASE_URL}/api/dashboard/ga4`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (ga4Response.ok) {
      const ga4Data = await ga4Response.json();
      console.log('✅ GA4 API endpoint working');
      console.log('📊 GA4 Data:', JSON.stringify(ga4Data, null, 2));
    } else {
      console.log('❌ GA4 API endpoint failed:', ga4Response.status);
    }

    // Test 3: Test Real-time Analytics
    console.log('\n3️⃣ Testing Real-time Analytics...');
    const realtimeResponse = await fetch(`${BASE_URL}/api/dashboard/realtime`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (realtimeResponse.ok) {
      const realtimeData = await realtimeResponse.json();
      console.log('✅ Real-time analytics working');
      console.log('📊 Real-time Data:', JSON.stringify(realtimeData, null, 2));
    } else {
      console.log('❌ Real-time analytics failed:', realtimeResponse.status);
    }

    // Test 4: Check console for GA4 events
    console.log('\n4️⃣ GA4 Event Tracking Check...');
    console.log('ℹ️ Open browser console and check for:');
    console.log('   - "✅ GA4 đã được khởi tạo toàn cục với ID: G-0DRKJH48YN"');
    console.log('   - "📊 GA4 Event tracked: dashboard_loaded"');
    console.log('   - "📊 Đã gửi event dashboard_loaded đến GA4"');

    // Test 5: Network requests check
    console.log('\n5️⃣ Network Requests Check...');
    console.log('ℹ️ In browser Developer Tools > Network, look for:');
    console.log('   - Requests to googletagmanager.com');
    console.log('   - Requests to google-analytics.com');
    console.log('   - Requests to /api/dashboard/ga4');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Manual test instructions
console.log('📋 Manual Testing Instructions:');
console.log('1. Start frontend: cd frontend && npm start');
console.log('2. Start backend: cd backend && npm start');
console.log('3. Open browser to http://localhost:3000');
console.log('4. Login to admin dashboard');
console.log('5. Open Developer Tools (F12)');
console.log('6. Check Console tab for GA4 messages');
console.log('7. Check Network tab for GA4 requests');
console.log('8. Check GA4 dashboard for real-time data');

// Run tests if called directly
if (require.main === module) {
  testGA4Integration();
}

module.exports = { testGA4Integration }; 