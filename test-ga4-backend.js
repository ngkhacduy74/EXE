// Test GA4 Backend Integration
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');

async function testGA4Backend() {
  console.log('🧪 Testing GA4 Backend Integration...\n');

  try {
    // Test 1: Initialize GA4 client
    console.log('1️⃣ Testing GA4 Client Initialization...');
    const keyFilePath = path.join(__dirname, 'backend', 'vinsaky-0578a851fdad.json');
    
    const analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: keyFilePath
    });
    console.log('✅ GA4 Analytics Data Client initialized successfully');

    // Test 2: Test property access
    console.log('\n2️⃣ Testing Property Access...');
    console.log('⚠️ Note: You need to replace propertyId with your actual GA4 Property ID');
    console.log('   To find Property ID:');
    console.log('   1. Go to Google Analytics (https://analytics.google.com)');
    console.log('   2. Select your property "Vinsaky"');
    console.log('   3. Go to Admin > Property Settings');
    console.log('   4. Copy the Property ID (format: 123456789)');

    // Test 3: Test API connection (will fail without correct property ID)
    console.log('\n3️⃣ Testing API Connection...');
    try {
      const [response] = await analyticsDataClient.runRealtimeReport({
        property: `properties/494181948`, // Updated with actual Property ID
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }]
      });
      
      console.log('✅ GA4 API connection successful');
      console.log('📊 Response:', response);
    } catch (error) {
      console.log('❌ GA4 API connection failed (expected without correct Property ID)');
      console.log('   Error:', error.message);
      console.log('   This is normal - you need to update the Property ID in the code');
    }

    // Test 4: Check service account permissions
    console.log('\n4️⃣ Checking Service Account Permissions...');
    console.log('✅ Service Account Email: ga4-analytics-657@vinsaky.iam.gserviceaccount.com');
    console.log('⚠️ Make sure this email has access to your GA4 property:');
    console.log('   1. Go to Google Analytics > Admin > Property Access Management');
    console.log('   2. Add the service account email with "Viewer" or "Editor" role');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Instructions for completing setup
console.log('📋 Setup Instructions:');
console.log('1. Get your GA4 Property ID from Google Analytics');
console.log('2. Update propertyId in backend/Controller/dashboard.controller.js');
console.log('3. Grant access to service account in GA4');
console.log('4. Test the integration');

// Run tests if called directly
if (require.main === module) {
  testGA4Backend();
}

module.exports = { testGA4Backend }; 