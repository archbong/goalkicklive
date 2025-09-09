// football-website/scripts/test-api.js
const { APIServiceFactory } = require("../lib/services/api-service-factory");
const {
  UnifiedVideoService,
} = require("../lib/services/unified-video-service");

// Test the API implementation
async function testAPI() {
  console.log("🧪 Testing Football Highlights API Implementation...\n");

  try {
    // Test 1: Service Factory Initialization
    console.log("1. Testing API Service Factory...");
    const providers = APIServiceFactory.createVideoService();
    console.log(
      `✅ Found ${providers.length} providers: ${providers.map((p) => p.getProviderName()).join(", ")}`,
    );

    // Test 2: Provider Availability
    console.log("\n2. Testing Provider Availability...");
    const availableProviders = APIServiceFactory.getAvailableProviders();
    console.log(`✅ Available providers: ${availableProviders.join(", ")}`);

    // Test 3: Unified Video Service
    console.log("\n3. Testing Unified Video Service...");
    const videoService = new UnifiedVideoService(providers);

    // Test 4: Get Highlights
    console.log("\n4. Testing Highlights Retrieval...");
    const highlights = await videoService.getHighlights({ pageSize: 5 });
    console.log(`✅ Retrieved ${highlights.length} highlights`);

    if (highlights.length > 0) {
      console.log("\n📋 Sample Highlights:");
      highlights.slice(0, 3).forEach((highlight, index) => {
        console.log(`\n  ${index + 1}. ${highlight.title}`);
        console.log(`     Competition: ${highlight.competition}`);
        console.log(
          `     Teams: ${highlight.teams.home} vs ${highlight.teams.away}`,
        );
        console.log(`     Provider: ${highlight.provider}`);
        console.log(`     Date: ${highlight.matchDate.toLocaleDateString()}`);
      });
    }

    // Test 5: Provider Statistics
    console.log("\n5. Testing Provider Statistics...");
    const stats = await videoService.getProviderStats();
    console.log("✅ Provider Statistics:");
    Object.entries(stats).forEach(([provider, stat]) => {
      console.log(
        `   - ${provider}: ${stat.status}, ${stat.highlightsCount} highlights`,
      );
    });

    // Test 6: Filter Testing
    console.log("\n6. Testing Filters...");
    const filteredHighlights = await videoService.getHighlights({
      pageSize: 3,
      provider: "all",
    });
    console.log(`✅ Filtered highlights: ${filteredHighlights.length} results`);

    console.log("\n🎉 All tests completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Providers: ${availableProviders.length}`);
    console.log(`   - Total Highlights: ${highlights.length}`);
    console.log(
      `   - Sample Data: ${highlights.length > 0 ? "✅ Available" : "❌ No data"}`,
    );
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

// Run the tests
testAPI().catch(console.error);
