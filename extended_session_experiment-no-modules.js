/*************************** 
 * Demo_Eye_Tracking2 Test *
 ***************************/

// Use global psychoJS object directly without destructuring
// Store info about the experiment session:
let expName = 'extended_session_experiment';  // from the Builder filename that created this script
let expInfo = {'participant': '', 'session': '001'};

// Some handy aliases as in the psychopy scripts
const { abs, sin, cos, PI: pi, sqrt } = Math;

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize PsychoJS
  const psychoJSInstance = new psychoJS.core.PsychoJS({
    debug: true
  });

  // Start the experiment
  psychoJSInstance.start({
    expName: expName,
    expInfo: expInfo,
    resources: [
      {'name': 'calibration_trials.xlsx', 'path': './calibration_trials.xlsx'},
      {'name': 'webgazer-2.0.1.js', 'path': './webgazer-2.0.1.js'},
      {'name': 'webgazer-2.0.1.tp.js', 'path': './webgazer-2.0.1.tp.js'},
      {'name': 'lib/psychojs-2021.2.3.js', 'path': './lib/psychojs-2021.2.3.js'},
      {'name': 'lib/psychojs-2021.2.3.css', 'path': './lib/psychojs-2021.2.3.css'}
    ]
  });

  // Initialize WebGazer if available
  if (typeof webgazer !== 'undefined') {
    console.log('Setting up WebGazer');
    webgazer.setGazeListener(function(data, elapsedTime) {
      if (data == null) {
        return;
      }
      // Log gaze data
      console.log('Gaze data:', data.x, data.y);
    });
    
    // Start WebGazer
    webgazer.begin();
  } else {
    console.error('WebGazer not loaded or not available');
  }
}); 