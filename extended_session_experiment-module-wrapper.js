/**
 * Module wrapper for the extended session experiment
 * This file loads the experiment script properly as a module
 */

// Initialize global state needed by PsychoJS
window.experimentModuleLoaded = false;

// Create a function to dynamically import the module
window.loadExperimentModule = function() {
  console.log('Loading experiment as ES6 module...');
  
  // Import the module dynamically
  import('./extended_session_experiment.js')
    .then(module => {
      console.log('Module loaded successfully!');
      window.experimentModuleLoaded = true;
      
      // Notify any listeners that might be waiting for the module
      if (typeof window.onExperimentModuleLoaded === 'function') {
        window.onExperimentModuleLoaded(module);
      }
      
      // Dispatch a custom event
      const event = new CustomEvent('experimentModuleLoaded', { detail: module });
      window.dispatchEvent(event);
    })
    .catch(error => {
      console.error('Failed to load experiment module:', error);
      
      // Try loading the non-module version as fallback
      console.log('Trying non-module version as fallback...');
      const script = document.createElement('script');
      script.src = './extended_session_experiment-no-modules.js';
      script.onload = function() {
        console.log('Non-module version loaded successfully');
      };
      script.onerror = function() {
        console.error('Failed to load non-module version');
      };
      document.head.appendChild(script);
    });
};

// Load the module when this script executes
window.loadExperimentModule(); 