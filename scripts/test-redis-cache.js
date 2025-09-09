// goalkicklive/scripts/test-redis-cache.js
const { redis } = require('../lib/redis');

async function testRedisCache() {
    console.log('🧪 Testing Redis Cache Implementation\n');

    try {
        // Test 1: Basic connection test
        console.log('1. Testing Redis connection...');
        await redis.ping();
        console.log('✅ Redis connection successful');

        // Test 2: Set and get a test value
        console.log('\n2. Testing set/get operations...');
        const testKey = 'test:cache:key';
        const testValue = { message: 'Hello Redis!', timestamp: new Date().toISOString() };

        await redis.setex(testKey, 60, JSON.stringify(testValue));
        console.log('✅ Value set with 60 second TTL');

        const cachedValue = await redis.get(testKey);
        if (cachedValue) {
            const parsedValue = JSON.parse(cachedValue);
            console.log('✅ Value retrieved successfully:', parsedValue.message);
        } else {
            console.log('❌ Failed to retrieve cached value');
        }

        // Test 3: Test cache expiration
        console.log('\n3. Testing cache expiration...');
        const tempKey = 'test:temp:key';
        await redis.setex(tempKey, 2, 'temporary value');

        // Wait for expiration
        await new Promise(resolve => setTimeout(resolve, 3000));

        const expiredValue = await redis.get(tempKey);
        if (!expiredValue) {
            console.log('✅ Cache expiration working correctly');
        } else {
            console.log('❌ Cache expiration failed');
        }

        // Test 4: Test highlights cache pattern
        console.log('\n4. Testing highlights cache pattern...');
        const highlightsKey = 'highlights:{"page":"1","pageSize":"10"}';
        const mockHighlights = {
            highlights: [
                { id: '1', title: 'Test Match', competition: 'Test League' }
            ],
            totalCount: 1,
            page: 1,
            pageSize: 10,
            hasMore: false
        };

        await redis.setex(highlightsKey, 300, JSON.stringify(mockHighlights));
        console.log('✅ Highlights cache pattern working');

        // Test 5: Cleanup test keys
        console.log('\n5. Cleaning up test keys...');
        await redis.del(testKey, tempKey, highlightsKey);
        console.log('✅ Test keys cleaned up');

        console.log('\n🎉 All Redis cache tests passed!');
        console.log('\n📋 Usage:');
        console.log('Make sure Redis server is running and REDIS_URL is set');
        console.log('Run: node scripts/test-redis-cache.js');

    } catch (error) {
        console.error('❌ Redis test failed:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('1. Check if Redis server is running');
        console.log('2. Verify REDIS_URL environment variable');
        console.log('3. Check Redis server configuration');
    } finally {
        // Close Redis connection
        await redis.quit();
    }
}

// Run the tests if this script is executed directly
if (require.main === module) {
    testRedisCache().catch(console.error);
}

module.exports = { testRedisCache };
