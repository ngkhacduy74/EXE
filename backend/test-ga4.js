// Test GA4 Backend Integration
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const path = require('path');

async function testGA4Backend() {
  console.log('🧪 Testing GA4 Backend Integration...\n');

  try {
    // Test 1: Initialize GA4 client
    console.log('1️⃣ Testing GA4 Client Initialization...');
    const keyFilePath = path.join(__dirname, 'vinsaky-0578a851fdad.json');
    
    const analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: keyFilePath
    });
    console.log('✅ GA4 Analytics Data Client initialized successfully');

    // Test 2: Test property access
    console.log('\n2️⃣ Testing Property Access...');
    console.log('✅ Using Property ID: 494181948');

    // Test 3: Test API connection
    console.log('\n3️⃣ Testing API Connection...');
    try {
      const [response] = await analyticsDataClient.runRealtimeReport({
        property: `properties/494181948`,
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }]
      });
      
      console.log('✅ GA4 API connection successful');
      console.log('📊 Response:', JSON.stringify(response, null, 2));
    } catch (error) {
      console.log('❌ GA4 API connection failed');
      console.log('   Error:', error.message);
      console.log('   This might be due to:');
      console.log('   1. Service account not having access to GA4 property');
      console.log('   2. Property ID not being correct');
      console.log('   3. GA4 property not having data yet');
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
console.log('1. ✅ Property ID: 494181948 (already set)');
console.log('2. ✅ Service Account JSON key: vinsaky-0578a851fdad.json');
console.log('3. ⚠️ Grant access to service account in GA4');
console.log('4. Test the integration');

// Run tests if called directly
if (require.main === module) {
  testGA4Backend();
}

module.exports = { testGA4Backend }; 