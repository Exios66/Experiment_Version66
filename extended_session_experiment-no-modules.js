/*************************** 
 * Demo_Eye_Tracking2 Test *
 ***************************/

// Store info about the experiment session
let expName = 'extended_session_experiment';
let expInfo = {'participant': '', 'session': '001'};

// Access debug helpers safely
function debug(message) {
  console.log(message);
  if (typeof window.addDebugMessage === 'function') {
    try {
      window.addDebugMessage('EXP: ' + message);
    } catch (e) {
      // Silent fail
    }
  }
}

// Safe error reporting
function reportError(message, error) {
  const errorMsg = message + (error ? ': ' + (error.message || String(error)) : '');
  console.error(errorMsg);
  
  if (typeof window.showError === 'function') {
    try {
      window.showError(errorMsg);
    } catch (e) {
      // Fallback to basic alert if showError fails
      alert('Error: ' + errorMsg);
    }
  }
}

// Initialize experiment
debug('Experiment script starting');

try {
  // Basic math helpers
  const { abs, sin, cos, PI: pi, sqrt } = Math;
  
  // Check for jQuery
  if (typeof window.jQuery === 'undefined') {
    reportError('jQuery is not loaded');
    throw new Error('jQuery dependency missing');
  }
  
  // Check for PsychoJS
  if (typeof window.psychoJS === 'undefined') {
    reportError('PsychoJS is not loaded');
    throw new Error('PsychoJS dependency missing');
  }
  
  debug('Dependencies verified');
  
  // Get PsychoJS instance
  let psychoJSInstance = null;
  debug('Setting up PsychoJS instance');
  
  try {
    // Try to use PsychoJS constructor if available
    if (window.psychoJS.core && typeof window.psychoJS.core.PsychoJS === 'function') {
      debug('Using PsychoJS constructor');
      psychoJSInstance = new window.psychoJS.core.PsychoJS({
        debug: true
      });
    } else {
      debug('Using global psychoJS object');
      psychoJSInstance = window.psychoJS;
    }
    
    // Verify we have a start method
    if (typeof psychoJSInstance.start !== 'function') {
      debug('Adding dummy start method');
      psychoJSInstance.start = function(params) {
        debug('Experiment started with params: ' + JSON.stringify(params));
        return true;
      };
    }
  } catch (err) {
    reportError('Failed to initialize PsychoJS', err);
    throw err; // Re-throw to stop execution
  }
  
  // Start the experiment with minimal resources
  debug('Starting experiment with PsychoJS');
  try {
    const result = psychoJSInstance.start({
      expName: expName,
      expInfo: expInfo,
      resources: [
        {'name': 'calibration_trials.xlsx', 'path': './calibration_trials.xlsx'}
      ]
    });
    debug('PsychoJS start returned: ' + result);
  } catch (err) {
    reportError('Failed to start experiment', err);
    throw err;
  }
  
  // Setup WebGazer (eye tracking) - optional
  debug('Checking for WebGazer');
  if (typeof window.webgazer !== 'undefined') {
    debug('WebGazer found, initializing');
    try {
      // Set up a minimal gaze listener
      window.webgazer.setGazeListener(function(data, elapsedTime) {
        if (data === null) return;
        
        // Only log occasionally
        if (Math.random() < 0.005) { // Log only 0.5% of gaze events
          debug('Gaze at: x=' + data.x + ', y=' + data.y);
        }
      });
      
      // Begin eye tracking
      window.webgazer.begin();
      debug('WebGazer initialized successfully');
    } catch (err) {
      reportError('Eye tracking initialization failed', err);
      debug('Continuing without eye tracking');
    }
  } else {
    debug('WebGazer not found, continuing without eye tracking');
  }
  
  // Finalize initialization
  debug('Experiment initialization complete');
  
} catch (mainError) {
  reportError('Fatal error in experiment initialization', mainError);
  debug('Experiment failed to initialize properly');
} 