/**
 * Dashboard API Test Script
 * 
 * This script tests all 6 dashboard endpoints
 * 
 * Usage:
 * 1. Update the JWT_TOKEN variable with your valid token
 * 2. Run: node test-dashboard-api.js
 */

const BASE_URL = 'http://localhost:3001/api';
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Update this after login

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT_TOKEN}`,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

// Test all endpoints
async function testAllEndpoints() {
  console.log('🚀 Testing Dashboard API Endpoints\n');
  console.log('=' .repeat(60));

  // 1. Test Stats Endpoint
  console.log('\n1️⃣  Testing GET /api/dashboard/stats');
  console.log('-'.repeat(60));
  const stats = await apiCall('/dashboard/stats');
  console.log('Status:', stats.status);
  console.log('Response:', JSON.stringify(stats.data, null, 2));

  // 2. Test Weekly Data
  console.log('\n2️⃣  Testing GET /api/dashboard/weekly');
  console.log('-'.repeat(60));
  const weekly = await apiCall('/dashboard/weekly');
  console.log('Status:', weekly.status);
  console.log('Response:', JSON.stringify(weekly.data, null, 2));

  // 3. Test Monthly Data
  console.log('\n3️⃣  Testing GET /api/dashboard/monthly');
  console.log('-'.repeat(60));
  const monthly = await apiCall('/dashboard/monthly');
  console.log('Status:', monthly.status);
  console.log('Response:', JSON.stringify(monthly.data, null, 2));

  // 4. Test Activity Breakdown
  console.log('\n4️⃣  Testing GET /api/dashboard/activity-breakdown');
  console.log('-'.repeat(60));
  const breakdown = await apiCall('/dashboard/activity-breakdown');
  console.log('Status:', breakdown.status);
  console.log('Response:', JSON.stringify(breakdown.data, null, 2));

  // 5. Test Weekly Summary
  console.log('\n5️⃣  Testing GET /api/dashboard/summary/weekly');
  console.log('-'.repeat(60));
  const weeklySummary = await apiCall('/dashboard/summary/weekly');
  console.log('Status:', weeklySummary.status);
  console.log('Response:', JSON.stringify(weeklySummary.data, null, 2));

  // 6. Test Monthly Summary
  console.log('\n6️⃣  Testing GET /api/dashboard/summary/monthly');
  console.log('-'.repeat(60));
  const monthlySummary = await apiCall('/dashboard/summary/monthly');
  console.log('Status:', monthlySummary.status);
  console.log('Response:', JSON.stringify(monthlySummary.data, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('✅ All tests completed!');
}

// Run tests
if (JWT_TOKEN === 'YOUR_JWT_TOKEN_HERE') {
  console.error('❌ Error: Please update JWT_TOKEN in the script first!');
  console.log('\nTo get a token:');
  console.log('1. Login via POST /api/auth/login');
  console.log('2. Copy the access_token from the response');
  console.log('3. Update JWT_TOKEN variable in this script');
} else {
  testAllEndpoints();
}
