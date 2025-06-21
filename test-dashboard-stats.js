// Test Dashboard Stats API
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:4000';
const TEST_TOKEN = 'your-test-token-here'; // Replace with actual test token

async function testDashboardStats() {
  console.log('🧪 Testing Dashboard Stats API...\n');

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
      console.log('✅ Dashboard API working');
      console.log('📊 Summary Data:');
      console.log('   - Total Users:', data.data.summary.totalUsers);
      console.log('   - Total Posts:', data.data.summary.totalPosts);
      console.log('   - Total Products:', data.data.summary.totalProducts);
      console.log('   - Total Banners:', data.data.summary.totalBanners);
      console.log('   - Active Users:', data.data.summary.activeUsers);
      console.log('   - Today New Users:', data.data.summary.todayNewUsers);
      console.log('   - Today New Posts:', data.data.summary.todayNewPosts);
      console.log('   - Today New Products:', data.data.summary.todayNewProducts);
      console.log('   - Today Page Views:', data.data.summary.todayPageViews);
      
      console.log('\n📈 Charts Data:');
      console.log('   - Posts by Month:', data.data.charts.postsByMonth);
      console.log('   - User Growth:', data.data.charts.userGrowth);
      console.log('   - Registration Trend:', data.data.charts.registrationTrend);
      
      console.log('\n📝 Recent Posts:', data.data.recentPosts?.length || 0);
      console.log('🏷️ Top Categories:', data.data.topCategories?.length || 0);
      
    } else {
      const errorText = await response.text();
      console.log('❌ Dashboard API failed:', response.status);
      console.log('📄 Error Response:', errorText.substring(0, 500));
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure backend is running: cd backend && npm start');
    console.log('2. Check if MongoDB is connected');
    console.log('3. Verify the port (should be 4000)');
    console.log('4. Check if you have valid authentication token');
  }
}

// Manual test instructions
console.log('📋 Manual Testing Instructions:');
console.log('1. Start backend: cd backend && npm start');
console.log('2. Check MongoDB connection');
console.log('3. Get a valid token by logging in');
console.log('4. Update TEST_TOKEN in this script');
console.log('5. Run: node test-dashboard-stats.js');

// Run tests if called directly
if (require.main === module) {
  testDashboardStats();
}

module.exports = { testDashboardStats }; 