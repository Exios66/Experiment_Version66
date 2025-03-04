/**
 * This is the legacy-browser compatible version of the extended session experiment
 * It requires the PsychoJS IIFE build (non-module format) to run on older browsers.
 * 
 * It will be loaded automatically on browsers that don't support ES6 modules.
 * The main functionality is implemented in the primary experiment.js file.
 */

(function() {
  // When the document is fully loaded:
  document.addEventListener('DOMContentLoaded', function() {
    // Display a message for legacy browsers
    console.log('Running extended session experiment on legacy browser');
    
    // Redirect to the main experiment handler
    if (typeof initializeEyetrackingRoutineBegin === 'function') {
      console.log('Successfully loaded eye tracking functions');
    } else {
      console.error('Failed to load eye tracking functions. Please check your browser compatibility.');
    }
  });
})(); 