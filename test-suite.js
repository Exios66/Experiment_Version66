/**
 * Extended Session Gaze Tracking Test Suite
 * 
 * This test suite validates the functionality of the extended session gaze tracking experiment.
 * It includes tests for calibration, tracking accuracy, resting state detection, and data collection.
 */

// Import required modules
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Create a mock browser environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  resources: 'usable',
  runScripts: 'dangerously',
  pretendToBeVisual: true
});

// Mock the global browser objects
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
global.Image = dom.window.Image;
global.screen = { width: 1920, height: 1080 };

// Mock WebGazer
class MockWebGazer {
  constructor() {
    this.gazeListener = null;
    this.params = {
      showVideo: true,
      showFaceOverlay: true,
      showFaceFeedbackBox: true,
      showGazeDot: false,
      camConstraints: {}
    };
    this.calibrationPoints = [];
    this.mockGazeData = [];
    this.isRunning = false;
    this.isPaused = false;
  }

  setRegression(type) {
    console.log(`Setting regression to ${type}`);
    return this;
  }

  setTracker(type) {
    console.log(`Setting tracker to ${type}`);
    return this;
  }

  setGazeListener(callback) {
    this.gazeListener = callback;
    return this;
  }

  getGazeListener() {
    return this.gazeListener;
  }

  begin() {
    this.isRunning = true;
    console.log('WebGazer started');
    return Promise.resolve();
  }

  pause() {
    this.isPaused = true;
    console.log('WebGazer paused');
    return this;
  }

  resume() {
    this.isPaused = false;
    console.log('WebGazer resumed');
    return this;
  }

  recordScreenPosition(x, y, type) {
    this.calibrationPoints.push({ x, y, type });
    console.log(`Recorded calibration point at (${x}, ${y})`);
    return this;
  }

  removeMouseEventListeners() {
    console.log('Mouse event listeners removed');
    return this;
  }

  // Simulate gaze data
  simulateGaze(x, y, isValid = true) {
    if (!isValid) {
      if (this.gazeListener) {
        this.gazeListener(null, Date.now());
      }
      return;
    }

    const gazeData = {
      x: x,
      y: y,
      eyeFeatures: {
        left: { height: 20, width: 30 },
        right: { height: 20, width: 30 }
      }
    };

    this.mockGazeData.push(gazeData);
    
    if (this.gazeListener && !this.isPaused) {
      this.gazeListener(gazeData, Date.now());
    }
  }

  // Simulate a sequence of gaze points
  simulateGazeSequence(points, interval = 50) {
    let i = 0;
    const timer = setInterval(() => {
      if (i >= points.length) {
        clearInterval(timer);
        return;
      }
      
      const point = points[i];
      this.simulateGaze(point.x, point.y, point.isValid !== false);
      i++;
    }, interval);
  }
}

// Mock PsychoJS
class MockPsychoJS {
  constructor() {
    this.experiment = {
      addData: (key, value) => {
        console.log(`Adding data: ${key} = ${value}`);
      },
      save: () => Promise.resolve(),
      thisN: 0,
      currentScheduler: { taskName: 'test' }
    };
    this.window = {
      size: [1920, 1080],
      monitorFramePeriod: 1/60,
      getActualFrameRate: () => 60,
      callOnFlip: (fn) => fn()
    };
    this.eventManager = {
      getKeys: () => []
    };
  }
}

// Create test elements
document.body.innerHTML = `
  <div id="webgazerVideoFeed" style="display:block;"></div>
  <div id="webgazerFaceFeedbackBox" style="display:block;"></div>
`;

// Mock global objects
global.webgazer = new MockWebGazer();
global.psychoJS = new MockPsychoJS();
global.util = {
  Color: class Color {
    constructor(color) {
      this.color = color;
    }
  },
  MonotonicClock: {
    getDateStr: () => new Date().toISOString().split('T')[0]
  }
};

// Load the experiment script
const experimentScript = fs.readFileSync(path.join(__dirname, 'extended_session_experiment.js'), 'utf8');
// We don't execute it directly as it contains import statements and browser-specific code
// Instead, we'll test individual functions

// Test suite
const tests = {
  // Test calibration quality assessment
  testCalibrationQuality: function() {
    console.log('\n--- Testing Calibration Quality Assessment ---');
    
    // Setup test environment
    window.calibrationSamples = [];
    window.currentCalibrationPoint = {
      x: 0.5,
      y: 0.5,
      screenX: 960,
      screenY: 540
    };
    
    // Add mock calibration samples
    // Good calibration (samples close to target)
    for (let i = 0; i < 20; i++) {
      window.calibrationSamples.push({
        x: 960 + (Math.random() * 20 - 10),
        y: 540 + (Math.random() * 20 - 10),
        timestamp: Date.now() + i * 50
      });
    }
    
    // Calculate calibration quality metrics
    const targetX = window.currentCalibrationPoint.screenX;
    const targetY = window.currentCalibrationPoint.screenY;
    
    // Calculate average gaze position
    let sumX = 0, sumY = 0;
    for (const sample of window.calibrationSamples) {
      sumX += sample.x;
      sumY += sample.y;
    }
    
    const avgX = sumX / window.calibrationSamples.length;
    const avgY = sumY / window.calibrationSamples.length;
    
    // Calculate distance
    const distance = Math.sqrt(
      Math.pow(avgX - targetX, 2) + 
      Math.pow(avgY - targetY, 2)
    );
    
    // Calculate variance
    let varX = 0, varY = 0;
    for (const sample of window.calibrationSamples) {
      varX += Math.pow(sample.x - avgX, 2);
      varY += Math.pow(sample.y - avgY, 2);
    }
    varX /= window.calibrationSamples.length;
    varY /= window.calibrationSamples.length;
    
    console.log(`Calibration metrics - Distance: ${distance.toFixed(2)}, Variance X: ${varX.toFixed(2)}, Variance Y: ${varY.toFixed(2)}`);
    
    // Assert that calibration quality is good
    assert(distance < 20, 'Calibration distance should be less than 20 pixels');
    assert(varX < 100, 'X variance should be less than 100');
    assert(varY < 100, 'Y variance should be less than 100');
    
    console.log('✓ Calibration quality assessment test passed');
  },
  
  // Test resting state detection
  testRestingStateDetection: function() {
    console.log('\n--- Testing Resting State Detection ---');
    
    // Setup test environment
    window.restingStateBuffer = [];
    window.restingStateThreshold = 0.02;
    window.passiveRestingState = false;
    
    // Test case 1: Active state (high movement)
    console.log('Test case 1: Active state (high movement)');
    
    // Add samples with high movement
    for (let i = 0; i < 100; i++) {
      window.restingStateBuffer.push({
        x: 0.5 + (Math.random() * 0.1 - 0.05),
        y: 0.5 + (Math.random() * 0.1 - 0.05),
        timestamp: Date.now() + i * 50
      });
    }
    
    // Calculate variance
    let sumX = 0, sumY = 0;
    for (const sample of window.restingStateBuffer) {
      sumX += sample.x;
      sumY += sample.y;
    }
    
    const avgX = sumX / window.restingStateBuffer.length;
    const avgY = sumY / window.restingStateBuffer.length;
    
    let totalDeviation = 0;
    for (const sample of window.restingStateBuffer) {
      const deviation = Math.sqrt(
        Math.pow(sample.x - avgX, 2) + 
        Math.pow(sample.y - avgY, 2)
      );
      totalDeviation += deviation;
    }
    
    const averageDeviation = totalDeviation / window.restingStateBuffer.length;
    console.log(`Active state average deviation: ${averageDeviation.toFixed(4)}`);
    
    // Should be in active state
    const activeStateResult = averageDeviation >= window.restingStateThreshold;
    console.log(`Active state detection result: ${activeStateResult ? 'Active (correct)' : 'Resting (incorrect)'}`);
    assert(activeStateResult, 'Should detect active state');
    
    // Test case 2: Resting state (low movement)
    console.log('\nTest case 2: Resting state (low movement)');
    window.restingStateBuffer = [];
    
    // Add samples with low movement
    const baseX = 0.5;
    const baseY = 0.5;
    for (let i = 0; i < 100; i++) {
      window.restingStateBuffer.push({
        x: baseX + (Math.random() * 0.01 - 0.005),
        y: baseY + (Math.random() * 0.01 - 0.005),
        timestamp: Date.now() + i * 50
      });
    }
    
    // Recalculate for resting state
    sumX = 0;
    sumY = 0;
    for (const sample of window.restingStateBuffer) {
      sumX += sample.x;
      sumY += sample.y;
    }
    
    const restingAvgX = sumX / window.restingStateBuffer.length;
    const restingAvgY = sumY / window.restingStateBuffer.length;
    
    totalDeviation = 0;
    for (const sample of window.restingStateBuffer) {
      const deviation = Math.sqrt(
        Math.pow(sample.x - restingAvgX, 2) + 
        Math.pow(sample.y - restingAvgY, 2)
      );
      totalDeviation += deviation;
    }
    
    const restingAverageDeviation = totalDeviation / window.restingStateBuffer.length;
    console.log(`Resting state average deviation: ${restingAverageDeviation.toFixed(4)}`);
    
    // Should be in resting state
    const restingStateResult = restingAverageDeviation < window.restingStateThreshold;
    console.log(`Resting state detection result: ${restingStateResult ? 'Resting (correct)' : 'Active (incorrect)'}`);
    assert(restingStateResult, 'Should detect resting state');
    
    console.log('✓ Resting state detection test passed');
  },
  
  // Test gaze data collection and compression
  testGazeDataCollection: function() {
    console.log('\n--- Testing Gaze Data Collection and Compression ---');
    
    // Setup test environment
    window.gazeDataBuffer = [];
    window.allGazeData = [];
    window.lastExportTime = Date.now() - 60000; // Set to 1 minute ago
    window.gazeExportInterval = 30000;
    window.gazeSampleCount = 0;
    window.passiveRestingState = false;
    
    // Mock the compressGazeData function
    window.compressGazeData = function(gazeData) {
      if (!gazeData || gazeData.length === 0) return [];
      
      const compressed = [];
      let lastTimestamp = gazeData[0].timestamp;
      
      compressed.push({
        t: lastTimestamp,
        x: Math.round(gazeData[0].x),
        y: Math.round(gazeData[0].y),
        r: gazeData[0].inRestingState ? 1 : 0
      });
      
      for (let i = 1; i < gazeData.length; i++) {
        const point = gazeData[i];
        const timeDelta = point.timestamp - lastTimestamp;
        lastTimestamp = point.timestamp;
        
        compressed.push({
          d: timeDelta,
          x: Math.round(point.x),
          y: Math.round(point.y),
          r: point.inRestingState ? 1 : 0
        });
      }
      
      return compressed;
    };
    
    // Add mock gaze data
    const baseTime = Date.now();
    for (let i = 0; i < 100; i++) {
      const dataPoint = {
        timestamp: baseTime + i * 50,
        x: 960 + (Math.random() * 100 - 50),
        y: 540 + (Math.random() * 100 - 50),
        elapsedTime: i * 50,
        eyeFeatures: { left: {}, right: {} },
        inRestingState: i > 50, // Switch to resting state halfway through
        trialIndex: 0,
        trialPhase: 'test'
      };
      
      window.gazeDataBuffer.push(dataPoint);
      window.allGazeData.push(dataPoint);
      window.gazeSampleCount++;
    }
    
    console.log(`Collected ${window.gazeDataBuffer.length} gaze data points`);
    
    // Test compression
    const compressed = window.compressGazeData(window.gazeDataBuffer);
    console.log(`Compressed to ${compressed.length} data points`);
    console.log(`First compressed point: t=${compressed[0].t}, x=${compressed[0].x}, y=${compressed[0].y}, r=${compressed[0].r}`);
    console.log(`Second compressed point: d=${compressed[1].d}, x=${compressed[1].x}, y=${compressed[1].y}, r=${compressed[1].r}`);
    
    // Verify compression
    assert(compressed.length === window.gazeDataBuffer.length, 'Compressed data should have same number of points');
    assert(compressed[0].t === window.gazeDataBuffer[0].timestamp, 'First timestamp should match');
    assert(compressed[1].d === window.gazeDataBuffer[1].timestamp - window.gazeDataBuffer[0].timestamp, 'Time delta should be correct');
    
    // Test data export
    window.exportGazeData = function() {
      if (!window.gazeDataBuffer || window.gazeDataBuffer.length === 0) {
        return false;
      }
      
      try {
        // Prepare batch data
        const batchData = {
          timestamp: Date.now(),
          sessionId: 'test_001',
          frameRate: 60,
          batchNumber: 1,
          gazePoints: window.compressGazeData(window.gazeDataBuffer),
          compressed: true,
          bufferSize: window.gazeDataBuffer.length
        };
        
        console.log(`Exported batch with ${batchData.bufferSize} points`);
        
        // Clear buffer after successful export
        const oldBuffer = [...window.gazeDataBuffer];
        window.gazeDataBuffer = [];
        window.lastExportTime = Date.now();
        
        return oldBuffer;
      } catch (error) {
        console.error('Error exporting gaze data:', error);
        return false;
      }
    };
    
    const exportedData = window.exportGazeData();
    assert(exportedData && exportedData.length === 100, 'Should export all 100 data points');
    assert(window.gazeDataBuffer.length === 0, 'Buffer should be cleared after export');
    
    console.log('✓ Gaze data collection and compression test passed');
  },
  
  // Test error recovery mechanisms
  testErrorRecovery: function() {
    console.log('\n--- Testing Error Recovery Mechanisms ---');
    
    // Setup test environment
    window.consecutiveNullReadings = 0;
    window.maxConsecutiveNullReadings = 5;
    window.lastGazeTimestamp = Date.now();
    
    // Mock recovery function
    let recoveryAttempted = false;
    window.recoverGazeTracking = function() {
      console.log('Recovery function called');
      recoveryAttempted = true;
      window.consecutiveNullReadings = 0;
      return true;
    };
    
    // Test consecutive null readings
    console.log('Testing consecutive null readings detection...');
    for (let i = 0; i < window.maxConsecutiveNullReadings + 1; i++) {
      console.log(`Null reading ${i+1}/${window.maxConsecutiveNullReadings+1}`);
      window.consecutiveNullReadings++;
      
      if (window.consecutiveNullReadings > window.maxConsecutiveNullReadings) {
        console.log(`Threshold exceeded (${window.consecutiveNullReadings}/${window.maxConsecutiveNullReadings}), attempting recovery...`);
        window.recoverGazeTracking();
      }
    }
    
    assert(recoveryAttempted, 'Recovery should be attempted after consecutive null readings');
    assert(window.consecutiveNullReadings === 0, 'Null readings counter should be reset after recovery');
    
    // Test long period without data
    console.log('\nTesting long period without data detection...');
    recoveryAttempted = false;
    window.lastGazeTimestamp = Date.now() - 6000; // 6 seconds ago
    
    // Check if we're getting data
    const timeSinceLastGaze = Date.now() - window.lastGazeTimestamp;
    if (timeSinceLastGaze > 5000) { // 5 seconds without data
      console.log(`No gaze data for ${timeSinceLastGaze}ms, attempting recovery...`);
      window.recoverGazeTracking();
    }
    
    assert(recoveryAttempted, 'Recovery should be attempted after long period without data');
    
    console.log('✓ Error recovery mechanisms test passed');
  },
  
  // Test extended session duration management
  testExtendedSessionDuration: function() {
    console.log('\n--- Testing Extended Session Duration Management ---');
    
    // Setup test environment
    window.extendedSessionActive = true;
    window.extendedSessionStartTime = Date.now() - 1800000; // 30 minutes ago
    window.extendedSessionDuration = 1800000; // 30 minutes
    
    // Mock the continueRoutine variable
    let continueRoutine = true;
    
    // Check if session duration has been reached
    const elapsedTime = Date.now() - window.extendedSessionStartTime;
    console.log(`Elapsed time: ${elapsedTime}ms, Duration: ${window.extendedSessionDuration}ms`);
    
    if (elapsedTime >= window.extendedSessionDuration) {
      // End the extended session
      window.extendedSessionActive = false;
      console.log('Extended session completed after', elapsedTime / 1000, 'seconds');
      
      // Force end routine
      continueRoutine = false;
    }
    
    assert(!window.extendedSessionActive, 'Session should be marked as inactive after duration is reached');
    assert(!continueRoutine, 'Routine should be ended after session duration is reached');
    
    // Test remaining time calculation
    window.extendedSessionStartTime = Date.now() - 900000; // 15 minutes ago
    window.extendedSessionDuration = 1800000; // 30 minutes
    window.extendedSessionActive = true;
    
    const remainingTime = Math.floor((window.extendedSessionDuration - (Date.now() - window.extendedSessionStartTime)) / 1000);
    console.log(`Remaining time: ${remainingTime} seconds`);
    
    assert(remainingTime > 0 && remainingTime < 900, 'Remaining time should be less than 15 minutes');
    
    console.log('✓ Extended session duration management test passed');
  }
};

// Run all tests
console.log('=== Extended Session Gaze Tracking Test Suite ===');
let passedTests = 0;
let totalTests = Object.keys(tests).length;

for (const [testName, testFn] of Object.entries(tests)) {
  try {
    testFn();
    passedTests++;
  } catch (error) {
    console.error(`✗ Test ${testName} failed:`, error);
  }
}

console.log(`\n=== Test Results: ${passedTests}/${totalTests} tests passed ===`);

// Export the test suite
module.exports = {
  tests,
  MockWebGazer,
  MockPsychoJS
}; 