// goalkicklive/scripts/test-api-simple.js
// Simple script to test the highlights API endpoints

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testAPI() {
    console.log('🧪 Testing Highlights API Endpoints\n');

    try {
        // Test 1: Filters endpoint
        console.log('1. Testing /api/highlights/filters...');
        const filtersResponse = await fetch('http://localhost:3000/api/highlights/filters');
        if (filtersResponse.ok) {
            const data = await filtersResponse.json();
            console.log('✅ SUCCESS: Filters endpoint working');
            console.log(`   - Competitions: ${data.competitions?.length || 0}`);
            console.log(`   - Teams: ${data.teams?.length || 0}`);
        } else {
            console.log('❌ FAILED: Filters endpoint returned', filtersResponse.status);
        }
    } catch (error) {
        console.log('❌ ERROR: Filters endpoint -', error.message);
    }

    try {
        // Test 2: Main highlights endpoint
        console.log('\n2. Testing /api/highlights...');
        const highlightsResponse = await fetch('http://localhost:3000/api/highlights');
        if (highlightsResponse.ok) {
            const data = await highlightsResponse.json();
            console.log('✅ SUCCESS: Highlights endpoint working');
            console.log(`   - Highlights count: ${data.highlights?.length || 0}`);
            console.log(`   - Total count: ${data.totalCount || 0}`);
        } else {
            console.log('❌ FAILED: Highlights endpoint returned', highlightsResponse.status);
        }
    } catch (error) {
        console.log('❌ ERROR: Highlights endpoint -', error.message);
    }

    try {
        // Test 3: Highlights with pagination
        console.log('\n3. Testing /api/highlights?page=1&pageSize=5...');
        const paginatedResponse = await fetch('http://localhost:3000/api/highlights?page=1&pageSize=5');
        if (paginatedResponse.ok) {
            const data = await paginatedResponse.json();
            console.log('✅ SUCCESS: Pagination working');
            console.log(`   - Page: ${data.page}`);
            console.log(`   - Page size: ${data.pageSize}`);
            console.log(`   - Has more: ${data.hasMore}`);
        } else {
            console.log('❌ FAILED: Pagination test returned', paginatedResponse.status);
        }
    } catch (error) {
        console.log('❌ ERROR: Pagination test -', error.message);
    }

    console.log('\n📋 Usage:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Run this script: node scripts/test-api-simple.js');
    console.log('3. Check the output for API endpoint status');
}

// Run the tests
testAPI().catch(console.error);
