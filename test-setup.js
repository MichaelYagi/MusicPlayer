#!/usr/bin/env node

// Simple test runner to verify setup
console.log('🧪 Setting up Music Player tests...\n');

// Check if dependencies are available
try {
    require('mocha');
    console.log('✅ Mocha available');
} catch (e) {
    console.log('❌ Mocha not found. Run: npm install');
    process.exit(1);
}

try {
    require('chai');
    console.log('✅ Chai available');
} catch (e) {
    console.log('❌ Chai not found. Run: npm install');
    process.exit(1);
}

try {
    require('jsdom');
    console.log('✅ JSDOM available');
} catch (e) {
    console.log('❌ JSDOM not found. Run: npm install');
    process.exit(1);
}

// Check if test files exist
const fs = require('fs');
const path = require('path');

const testFiles = [
    'test/setup.js',
    'test/storage.test.js',
    'test/main.test.js',
    'test/audio-engine.test.js',
    'test/midi-parser.test.js',
    'test/integration.test.js',
    'test/runner.html',
    'test/README.md'
];

testFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} missing`);
    }
});

// Check if source files have module exports
const sourceFiles = [
    'js/storage.js',
    'js/main.js',
    'js/audio-engine.js',
    'js/midi-parser.js'
];

console.log('\n📦 Checking module exports...');

sourceFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('module.exports')) {
            console.log(`✅ ${file} has module.exports`);
        } else {
            console.log(`❌ ${file} missing module.exports`);
        }
    } catch (e) {
        console.log(`❌ Could not read ${file}: ${e.message}`);
    }
});

console.log('\n🚀 Test setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm test');
console.log('2. Or: npm run test:browser and open test/runner.html');
console.log('3. Or: npm run test:watch for continuous testing');