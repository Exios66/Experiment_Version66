/**
 * This is the legacy-browser compatible version of the extended session experiment
 * It requires the PsychoJS IIFE build (non-module format) to run on older browsers.
 * 
 * It will be loaded automatically on browsers that don't support ES6 modules.
 * The main functionality is implemented in the primary experiment.js file.
 * 
 * This file is placed in the root directory to ensure proper loading paths.
 */

(function() {
  // When the document is fully loaded:
  document.addEventListener('DOMContentLoaded', function() {
    // Display a message for legacy browsers
    console.log('Running extended session experiment on legacy browser');
    
    // Add a small delay to ensure the library has time to load
    setTimeout(function() {
      // Check if the main script was loaded
      if (typeof window.psychoJS !== 'undefined') {
        console.log('Successfully loaded PsychoJS');
        
        // Create a global error handler for better diagnostics
        window.addEventListener('error', function(e) {
          console.error('Runtime error:', e.message);
          if (document.getElementById('root')) {
            document.getElementById('root').innerHTML += '<div style="color: red; padding: 10px; border: 1px solid red; margin: 10px; font-family: sans-serif;">' +
              '<h3>JavaScript Error</h3>' +
              '<p>' + e.message + '</p>' +
              '</div>';
          }
        });
      } else {
        console.error('Failed to load PsychoJS. Please check if the library is available.');
        if (document.getElementById('root')) {
          document.getElementById('root').innerHTML = '<div style="color: red; margin: 20px; font-family: sans-serif;">' +
            '<h1>Error Loading PsychoJS</h1>' +
            '<p>The experiment library could not be loaded.</p>' +
            '<p>Please check that the PsychoJS library is correctly included in your HTML.</p>' +
            '</div>';
        }
      }
    }, 500); // 500ms delay
  });
})(); 