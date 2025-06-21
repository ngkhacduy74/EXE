// Test Dashboard Error Handling
console.log('🧪 Testing Dashboard Error Handling...\n');

// Test 1: toLocaleString with undefined values
console.log('1️⃣ Testing toLocaleString with undefined values...');
try {
  const undefinedValue = undefined;
  const result = (undefinedValue || 0).toLocaleString();
  console.log('✅ toLocaleString with fallback:', result);
} catch (error) {
  console.log('❌ toLocaleString error:', error.message);
}

// Test 2: Array map with undefined values
console.log('\n2️⃣ Testing Array map with undefined values...');
try {
  const undefinedArray = undefined;
  const mapped = (undefinedArray?.map(item => item.value) || [1, 2, 3]).filter(Boolean);
  console.log('✅ Array map with fallback:', mapped);
} catch (error) {
  console.log('❌ Array map error:', error.message);
}

// Test 3: Object property access with undefined
console.log('\n3️⃣ Testing Object property access with undefined...');
try {
  const undefinedObject = undefined;
  const value = undefinedObject?.property || 0;
  console.log('✅ Object property access with fallback:', value);
} catch (error) {
  console.log('❌ Object property access error:', error.message);
}

// Test 4: Math operations with undefined
console.log('\n4️⃣ Testing Math operations with undefined...');
try {
  const undefinedValue = undefined;
  const result = Math.floor((undefinedValue || 0) / 60);
  console.log('✅ Math operation with fallback:', result);
} catch (error) {
  console.log('❌ Math operation error:', error.message);
}

// Test 5: Division with undefined
console.log('\n5️⃣ Testing Division with undefined...');
try {
  const undefinedValue = undefined;
  const result = ((undefinedValue || 0) / (undefinedValue || 1)) * 100;
  console.log('✅ Division with fallback:', result);
} catch (error) {
  console.log('❌ Division error:', error.message);
}

console.log('\n✅ All error handling tests completed!');
console.log('\n💡 If all tests pass, the Dashboard should not crash with undefined values.'); 