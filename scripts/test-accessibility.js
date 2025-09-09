// goalkicklive/scripts/test-accessibility.js
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class AccessibilityTester {
  constructor() {
    this.results = [];
    this.failures = 0;
  }

  async runTests() {
    console.log('🏗️  Building application for accessibility testing...\n');

    try {
      // Build the application
      execSync('npm run build', { stdio: 'inherit' });

      // Start the production server
      console.log('🚀 Starting production server...');
      const server = spawn('npm', ['run', 'start'], {
        stdio: 'pipe',
        env: { ...process.env, PORT: '3001' }
      });

      // Wait for server to start
      await new Promise(resolve => setTimeout(resolve, 5000));

      console.log('\n🧪 Running accessibility tests...\n');

      // Run pa11y-ci tests
      try {
        execSync('npx pa11y-ci --config .pa11yci.json', { stdio: 'inherit' });
      } catch (error) {
        console.log('\n❌ Accessibility tests failed');
        this.failures++;
      }

      // Run additional axe-core tests
      console.log('\n🔍 Running additional axe-core tests...');
      this.runAxeCoreTests();

      // Stop the server
      server.kill();

      console.log('\n📊 Generating accessibility report...');
      this.generateReport();

      if (this.failures > 0) {
        console.log(`\n❌ Accessibility testing completed with ${this.failures} failures`);
        process.exit(1);
      } else {
        console.log('\n✅ All accessibility tests passed!');
      }

    } catch (error) {
      console.error('❌ Accessibility testing failed:', error.message);
      process.exit(1);
    }
  }

  runAxeCoreTests() {
    const testUrls = [
      'http://localhost:3001/en',
      'http://localhost:3001/en/highlights',
      'http://localhost:3001/en/about'
    ];

    testUrls.forEach(url => {
      try {
        console.log(`\n📋 Testing: ${url}`);
        const result = execSync(`npx axe ${url} --timeout=30000 --tags wcag2a,wcag2aa --rules color-contrast,image-alt,button-name,link-name`, {
          encoding: 'utf-8'
        });
        console.log(result);
      } catch (error) {
        console.log('❌ Accessibility issues found');
        this.failures++;
      }
    });
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      failures: this.failures,
      summary: {
        totalPages: 7, // From .pa11yci.json
        testedPages: 7,
        successRate: this.failures === 0 ? '100%' : `${Math.round((1 - this.failures / 7) * 100)}%`
      },
      recommendations: [
        'Ensure all images have alt text',
        'Maintain proper color contrast ratios',
        'Provide meaningful link text',
        'Use semantic HTML elements',
        'Ensure keyboard navigation works',
        'Test with screen readers',
        'Check focus indicators'
      ]
    };

    fs.writeFileSync('accessibility-report.json', JSON.stringify(report, null, 2));
    console.log('📄 Accessibility report saved to accessibility-report.json');
  }
}

// Run the tests
const tester = new AccessibilityTester();
tester.runTests().catch(console.error);
