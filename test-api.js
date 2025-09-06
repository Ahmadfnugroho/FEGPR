import axios from 'axios';

const API_BASE_URL = 'https://admin.globalphotorental.com/api';
const API_KEY = 'gbTnWu4oBizYlgeZ0OPJlbpnG11ARjsf';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-API-KEY': API_KEY,
  },
  timeout: 10000,
});

async function testEndpoints() {
  console.log('🔄 Testing API endpoints...\n');

  const endpoints = [
    '/categories',
    '/brands-premiere',
    '/brands',
    '/sub-categories'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`🚀 Testing ${API_BASE_URL}${endpoint}`);
      const response = await axiosInstance.get(endpoint);
      console.log(`✅ SUCCESS: ${response.status} - ${endpoint}`);
      console.log(`   Data structure:`, typeof response.data);
      
      if (response.data && response.data.data) {
        console.log(`   Items count: ${Array.isArray(response.data.data) ? response.data.data.length : 'Not an array'}`);
      } else if (Array.isArray(response.data)) {
        console.log(`   Items count: ${response.data.length}`);
      }
      
      console.log(`   Sample data:`, JSON.stringify(response.data, null, 2).slice(0, 200) + '...');
      console.log('');
      
    } catch (error) {
      console.log(`❌ FAILED: ${endpoint}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status} - ${error.response.statusText}`);
        console.log(`   Data:`, error.response.data);
      } else if (error.request) {
        console.log('   Network error - no response received');
      } else {
        console.log(`   Error: ${error.message}`);
      }
      console.log('');
    }
  }
}

// Run the test
testEndpoints().then(() => {
  console.log('🏁 API endpoint testing completed');
}).catch((error) => {
  console.error('💥 Test script error:', error);
});
