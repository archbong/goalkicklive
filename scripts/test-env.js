// goalkicklive/scripts/test-env.js
const { config } = require("dotenv");
const path = require("path");

// Load environment variables
config({ path: path.resolve(process.cwd(), ".env.local") });

console.log("🔍 Testing Environment Variables");
console.log("================================");

// Check required variables
const requiredVars = [
  "DATABASE_URL",
  "REDIS_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
];

let allPassed = true;

requiredVars.forEach((variable) => {
  const value = process.env[variable];
  if (value) {
    console.log(`✅ ${variable}: Set`);
    // Mask sensitive values
    if (variable.includes("SECRET") || variable.includes("PASSWORD")) {
      console.log(`   Value: ${value.substring(0, 10)}... (masked)`);
    } else if (variable === "DATABASE_URL") {
      // Mask database password
      const maskedUrl = value.replace(/:[^:@]+@/, ":****@");
      console.log(`   Value: ${maskedUrl}`);
    } else {
      console.log(`   Value: ${value}`);
    }
  } else {
    console.log(`❌ ${variable}: NOT SET`);
    allPassed = false;
  }
});

console.log("\n📋 Optional Variables");
console.log("=====================");

const optionalVars = [
  "SCOREBAT_API_TOKEN",
  "SUPERSPORT_API_KEY",
  "CACHE_TTL",
  "NODE_ENV",
];

optionalVars.forEach((variable) => {
  const value = process.env[variable];
  if (value) {
    console.log(`✅ ${variable}: Set`);
    if (variable.includes("TOKEN") || variable.includes("KEY")) {
      console.log(`   Value: ${value.substring(0, 10)}... (masked)`);
    } else {
      console.log(`   Value: ${value}`);
    }
  } else {
    console.log(`⚠️  ${variable}: Not set (optional)`);
  }
});

console.log("\n📊 Summary");
console.log("===========");
console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
console.log(`All required variables set: ${allPassed ? "✅ Yes" : "❌ No"}`);

if (!allPassed) {
  console.log("\n💡 Recommendations:");
  console.log("• Check that .env.local file exists in the project root");
  console.log("• Verify the file contains all required variables");
  console.log("• Restart your terminal/IDE after adding environment variables");
  process.exit(1);
} else {
  console.log("\n🎉 Environment is properly configured!");
  process.exit(0);
}
