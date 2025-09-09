const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Bundle analysis and optimization script
async function analyzeBundle() {
  console.log('🔍 Analyzing bundle size and optimizing imports...\n');

  try {
    // Build the project to generate bundle stats
    console.log('📦 Building project for analysis...');
    execSync('npm run build', { stdio: 'inherit' });

    // Analyze bundle size using Next.js built-in analyzer
    console.log('\n📊 Running bundle analysis...');

    // Check if @next/bundle-analyzer is available
    try {
      execSync('npx @next/bundle-analyzer@latest', { stdio: 'inherit' });
    } catch (error) {
      console.log('📦 Installing bundle analyzer...');
      execSync('npm install --save-dev @next/bundle-analyzer', { stdio: 'inherit' });
    }

    // Generate bundle analysis report
    const analyzeCmd = 'ANALYZE=true npm run build';
    console.log('\n📈 Generating bundle analysis report...');
    execSync(analyzeCmd, { stdio: 'inherit' });

    // Check for large dependencies
    console.log('\n🔎 Checking for large dependencies...');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    const largeDeps = [];
    for (const [dep, version] of Object.entries(dependencies)) {
      try {
        const depPath = path.join('node_modules', dep);
        if (fs.existsSync(depPath)) {
          const stats = fs.statSync(depPath);
          const sizeMB = stats.size / (1024 * 1024);
          if (sizeMB > 5) { // Dependencies larger than 5MB
            largeDeps.push({ name: dep, size: sizeMB.toFixed(2) + 'MB' });
          }
        }
      } catch (error) {
        // Skip if dependency doesn't exist or can't be accessed
      }
    }

    if (largeDeps.length > 0) {
      console.log('\n⚠️  Large dependencies found:');
      largeDeps.forEach(dep => {
        console.log(`   - ${dep.name}: ${dep.size}`);
      });
    }

    // Check for duplicate dependencies
    console.log('\n🔍 Checking for duplicate packages...');
    try {
      execSync('npx duplicate-package-checker-webpack-plugin', { stdio: 'inherit' });
    } catch (error) {
      // Plugin not installed, continue
    }

    // Generate optimization recommendations
    console.log('\n💡 Optimization Recommendations:');
    console.log('   1. Use dynamic imports for heavy components');
    console.log('   2. Implement code splitting for routes');
    console.log('   3. Optimize images with next/image');
    console.log('   4. Use tree-shakable icon libraries');
    console.log('   5. Consider lazy loading for below-the-fold content');
    console.log('   6. Implement service worker for caching');
    console.log('   7. Use CDN for static assets');

    // Create bundle optimization report
    const report = {
      timestamp: new Date().toISOString(),
      largeDependencies: largeDeps,
      recommendations: [
        'Implement dynamic imports for video player components',
        'Add route-based code splitting',
        'Optimize image loading with next/image',
        'Use tree-shakable icon imports',
      ]
    };

    fs.writeFileSync('bundle-analysis-report.json', JSON.stringify(report, null, 2));
    console.log('\n✅ Bundle analysis complete! Report saved to bundle-analysis-report.json');

  } catch (error) {
    console.error('❌ Bundle analysis failed:', error.message);
    process.exit(1);
  }
}

// Run the analysis
analyzeBundle().catch(console.error);
