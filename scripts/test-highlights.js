// goalkicklive/scripts/test-highlights.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test the highlights API endpoints
async function testHighlightsAPI() {
  console.log('🧪 Testing Highlights API Endpoints\n');

  // Test 1: Check if filters endpoint works
  console.log('1. Testing /api/highlights/filters endpoint...');
  try {
    const filtersResponse = await fetch('http://localhost:3000/api/highlights/filters');
    if (filtersResponse.ok) {
      const filtersData = await filtersResponse.json();
      console.log('✅ Filters endpoint working');
      console.log(`   - Competitions: ${filtersData.competitions?.length || 0}`);
      console.log(`   - Teams: ${filtersData.teams?.length || 0}`);
      console.log(`   - Date range: ${filtersData.dateRange?.min} to ${filtersData.dateRange?.max}`);
    } else {
      console.log('❌ Filters endpoint failed:', filtersResponse.status);
    }
  } catch (error) {
    console.log('❌ Filters endpoint error:', error.message);
  }

  // Test 2: Check if main highlights endpoint works
  console.log('\n2. Testing /api/highlights endpoint...');
  try {
    const highlightsResponse = await fetch('http://localhost:3000/api/highlights');
    if (highlightsResponse.ok) {
      const highlightsData = await highlightsResponse.json();
      console.log('✅ Highlights endpoint working');
      console.log(`   - Highlights count: ${highlightsData.highlights?.length || 0}`);
      console.log(`   - Total count: ${highlightsData.totalCount || 0}`);
    } else {
      console.log('❌ Highlights endpoint failed:', highlightsResponse.status);
    }
  } catch (error) {
    console.log('❌ Highlights endpoint error:', error.message);
  }

  // Test 3: Test with query parameters
  console.log('\n3. Testing /api/highlights with query parameters...');
  try {
    const testResponse = await fetch('http://localhost:3000/api/highlights?page=1&pageSize=5');
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ Query parameters working');
      console.log(`   - Page: ${testData.page}`);
      console.log(`   - Page size: ${testData.pageSize}`);
      console.log(`   - Has more: ${testData.hasMore}`);
    } else {
      console.log('❌ Query parameters failed:', testResponse.status);
    }
  } catch (error) {
    console.log('❌ Query parameters error:', error.message);
  }

  console.log('\n📋 Summary:');
  console.log('Run this script while the development server is running:');
  console.log('  npm run dev');
  console.log('  node scripts/test-highlights.js');
}

// Run the tests
testHighlightsAPI().catch(console.error);
