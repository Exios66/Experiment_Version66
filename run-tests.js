#!/usr/bin/env node

/**
 * Extended Session Gaze Tracking Test Runner
 * 
 * This script runs the test suite for the extended session gaze tracking experiment.
 * It can be executed from the command line with: node run-tests.js
 */

// Import the test suite
const testSuite = require('./test-suite');

// Parse command line arguments
const args = process.argv.slice(2);
const runSpecificTest = args.length > 0 ? args[0] : null;

// Run tests
console.log('=== Extended Session Gaze Tracking Test Runner ===');

if (runSpecificTest) {
  // Run a specific test if specified
  if (testSuite.tests[runSpecificTest]) {
    console.log(`Running test: ${runSpecificTest}`);
    try {
      testSuite.tests[runSpecificTest]();
      console.log(`\n✓ Test ${runSpecificTest} passed`);
    } catch (error) {
      console.error(`\n✗ Test ${runSpecificTest} failed:`, error);
      process.exit(1);
    }
  } else {
    console.error(`Test "${runSpecificTest}" not found. Available tests:`);
    Object.keys(testSuite.tests).forEach(testName => {
      console.log(`- ${testName}`);
    });
    process.exit(1);
  }
} else {
  // Run all tests
  console.log('Running all tests...\n');
  let passedTests = 0;
  let totalTests = Object.keys(testSuite.tests).length;
  
  for (const [testName, testFn] of Object.entries(testSuite.tests)) {
    console.log(`Running test: ${testName}`);
    try {
      testFn();
      passedTests++;
      console.log(`✓ Test ${testName} passed\n`);
    } catch (error) {
      console.error(`✗ Test ${testName} failed:`, error);
      console.log(''); // Empty line for readability
    }
  }
  
  console.log(`=== Test Results: ${passedTests}/${totalTests} tests passed ===`);
  
  // Exit with appropriate code
  if (passedTests < totalTests) {
    process.exit(1);
  }
}

console.log('Test run completed.'); 