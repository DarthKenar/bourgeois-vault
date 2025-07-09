#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(command) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error running: ${command}`);
    process.exit(1);
  }
}

function checkFiles() {
  const requiredFiles = [
    'dist/index.js',
    'dist/index.d.ts',
    'package.json',
    'README.md'
  ];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      console.error(`Error: Required file ${file} does not exist`);
      process.exit(1);
    }
  }
  
  console.log('✅ All required files exist');
}

function main() {
  console.log('🚀 Preparing BourgeoisVault for publication...\n');
  
  // Check if dist folder exists
  if (!fs.existsSync('dist')) {
    console.log('📦 Building project...');
    run('npm run build');
  } else {
    console.log('📦 Dist folder exists, skipping build');
  }
  
  // Run tests
  console.log('🧪 Running tests...');
  run('npm test');
  
  // Run linter
  console.log('🔍 Running linter...');
  run('npm run lint');
  
  // Check required files
  console.log('📋 Checking required files...');
  checkFiles();
  
  console.log('\n✅ BourgeoisVault is ready for publication!');
  console.log('\nTo publish:');
  console.log('  npm run publish:latest   # Publish to latest');
  console.log('  npm run publish:beta     # Publish to beta');
  console.log('\nTo version:');
  console.log('  npm run version:patch    # 0.1.0 → 0.1.1');
  console.log('  npm run version:minor    # 0.1.0 → 0.2.0');
  console.log('  npm run version:major    # 0.1.0 → 1.0.0');
}

main(); 