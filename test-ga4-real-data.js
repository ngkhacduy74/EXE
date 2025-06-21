// Test GA4 Real Data API
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:4000';
const TEST_TOKEN = 'your-test-token-here'; // Replace with actual test token

async function testGA4RealData() {
  console.log('🧪 Testing GA4 Real Data API...\n');

  try {
    // Test GA4 endpoint
    console.log('1️⃣ Testing GA4 Endpoint...');
    const response = await fetch(`${BASE_URL}/api/dashboard/ga4`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Response Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ GA4 API working');
      console.log('📊 GA4 Data:', JSON.stringify(data, null, 2));
      
      // Verify the data matches expected real data
      const expectedData = {
        pageViews: {
          totalPageViews: 25,
          uniquePageViews: 4,
          avgSessionDuration: 1094,
          bounceRate: 0
        },
        topPages: [
          { page: '/', views: 13 },
          { page: '/admin', views: 3 },
          { page: '/home', views: 3 },
          { page: '/login', views: 2 },
          { page: '/manaProduct', views: 2 },
          { page: '/admin/', views: 1 },
          { page: '/otp', views: 1 }
        ],
        demographics: {
          regions: [
            { region: 'Hà Nội', percentage: 45, users: 12, coordinates: [21.0285, 105.8542] },
            { region: 'TP. Hồ Chí Minh', percentage: 35, users: 9, coordinates: [10.8231, 106.6297] },
            { region: 'Đà Nẵng', percentage: 8, users: 2, coordinates: [16.0544, 108.2022] },
            { region: 'Hải Phòng', percentage: 6, users: 1, coordinates: [20.8449, 106.6881] },
            { region: 'Cần Thơ', percentage: 4, users: 1, coordinates: [10.0452, 105.7469] },
            { region: 'Khác', percentage: 2, users: 1, coordinates: [16.0, 108.0] }
          ],
          devices: [
            { device: 'desktop', percentage: 100 }
          ],
          browsers: [
            { browser: 'Chrome', percentage: 65 },
            { browser: 'Safari', percentage: 20 },
            { browser: 'Firefox', percentage: 8 },
            { browser: 'Edge', percentage: 5 },
            { browser: 'Others', percentage: 2 }
          ]
        }
      };

      // Compare with expected data
      console.log('\n🔍 Comparing with expected real data...');
      
      if (JSON.stringify(data.data.pageViews) === JSON.stringify(expectedData.pageViews)) {
        console.log('✅ Page Views data matches expected');
      } else {
        console.log('❌ Page Views data does not match expected');
        console.log('Expected:', JSON.stringify(expectedData.pageViews, null, 2));
        console.log('Actual:', JSON.stringify(data.data.pageViews, null, 2));
      }

      if (JSON.stringify(data.data.topPages) === JSON.stringify(expectedData.topPages)) {
        console.log('✅ Top Pages data matches expected');
      } else {
        console.log('❌ Top Pages data does not match expected');
        console.log('Expected:', JSON.stringify(expectedData.topPages, null, 2));
        console.log('Actual:', JSON.stringify(data.data.topPages, null, 2));
      }

      if (JSON.stringify(data.data.demographics) === JSON.stringify(expectedData.demographics)) {
        console.log('✅ Demographics data matches expected');
      } else {
        console.log('❌ Demographics data does not match expected');
        console.log('Expected:', JSON.stringify(expectedData.demographics, null, 2));
        console.log('Actual:', JSON.stringify(data.data.demographics, null, 2));
      }

    } else {
      const errorText = await response.text();
      console.log('❌ GA4 API failed:', response.status);
      console.log('📄 Error Response:', errorText.substring(0, 200));
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testGA4RealData(); 