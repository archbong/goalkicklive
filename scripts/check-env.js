// goalkicklive/scripts/check-env.js
const fs = require('fs');
const path = require('path');

// Required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'REDIS_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
];

// Optional but recommended environment variables
const recommendedEnvVars = [
  'SCOREBAT_API_KEY',
  'SUPERSPORT_API_ENABLED',
  'CACHE_TTL'
];

function checkEnvironment() {
  console.log('🔍 Checking Environment Configuration\n');

  const env = process.env;
  let allRequiredPassed = true;
  let issuesFound = false;

  // Check required environment variables
  console.log('📋 Required Environment Variables:');
  requiredEnvVars.forEach(variable => {
    if (env[variable]) {
      console.log(`✅ ${variable}: Set`);
    } else {
      console.log(`❌ ${variable}: MISSING`);
      allRequiredPassed = false;
      issuesFound = true;
    }
  });

  // Check recommended environment variables
  console.log('\n📋 Recommended Environment Variables:');
  recommendedEnvVars.forEach(variable => {
    if (env[variable]) {
      console.log(`✅ ${variable}: Set`);
    } else {
      console.log(`⚠️  ${variable}: Not set (optional)`);
      issuesFound = true;
    }
  });

  // Check Node.js version
  console.log('\n📋 Runtime Environment:');
  console.log(`✅ Node.js: ${process.version}`);
  console.log(`✅ Platform: ${process.platform} ${process.arch}`);

  // Check if .env file exists
  const envFilePath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envFilePath)) {
    console.log(`✅ .env file: Found at ${envFilePath}`);
  } else {
    console.log(`⚠️  .env file: Not found at ${envFilePath}`);
    issuesFound = true;
  }

  // Check if .env.local exists (Next.js priority)
  const envLocalPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envLocalPath)) {
    console.log(`✅ .env.local file: Found at ${envLocalPath}`);
  }

  // Summary
  console.log('\n📊 Summary:');
  if (allRequiredPassed) {
    console.log('✅ All required environment variables are set!');
  } else {
    console.log('❌ Missing required environment variables');
  }

  if (issuesFound) {
    console.log('\n💡 Recommendations:');
    if (!fs.existsSync(envFilePath) && !fs.existsSync(envLocalPath)) {
      console.log('• Create a .env file with your environment variables');
      console.log('• Copy .env.example to .env and fill in the values');
    }

    requiredEnvVars.forEach(variable => {
      if (!env[variable]) {
        console.log(`• Set ${variable} in your environment`);
      }
    });

    console.log('\n📚 Documentation:');
    console.log('• Environment setup: Check README.md for setup instructions');
    console.log('• Database: Make sure PostgreSQL is running for DATABASE_URL');
    console.log('• Redis: Make sure Redis server is running for REDIS_URL');
  }

  return allRequiredPassed;
}

// Export for use in other scripts
module.exports = { checkEnvironment, requiredEnvVars, recommendedEnvVars };

// Run if executed directly
if (require.main === module) {
  const success = checkEnvironment();
  process.exit(success ? 0 : 1);
}
