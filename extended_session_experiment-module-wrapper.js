/**
 * Module wrapper for the extended session experiment
 * This file loads the experiment script properly as a module
 */

// Initialize global state needed by PsychoJS
window.experimentModuleLoaded = false;
window.experimentLoadAttempts = 0;
window.maxLoadAttempts = 3;

// Create a function to dynamically import the module
window.loadExperimentModule = function() {
  console.log('Loading experiment as ES6 module...');
  window.experimentLoadAttempts++;
  
  // Import the module dynamically
  import('./extended_session_experiment.js')
    .then(module => {
      console.log('Module loaded successfully!');
      window.experimentModuleLoaded = true;
      
      // Store a reference to the module
      window.experimentModule = module;
      
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
      
      if (window.experimentLoadAttempts < window.maxLoadAttempts) {
        // Try again with a delay
        console.log(`Retry attempt ${window.experimentLoadAttempts}/${window.maxLoadAttempts}...`);
        setTimeout(window.loadExperimentModule, 500);
        return;
      }
      
      // After max attempts, try the non-module version as fallback
      console.log('Trying non-module version as fallback...');
      loadNonModuleVersion();
    });
};

// Function to load the non-module version as fallback
function loadNonModuleVersion() {
  const script = document.createElement('script');
  script.src = './extended_session_experiment-no-modules.js';
  
  script.onload = function() {
    console.log('Non-module version loaded successfully');
    
    // Notify the page that the experiment is ready
    window.experimentModuleLoaded = true;
    
    // Dispatch an event to notify listeners
    const event = new CustomEvent('experimentNonModuleLoaded');
    window.dispatchEvent(event);
  };
  
  script.onerror = function(e) {
    console.error('Failed to load non-module version:', e);
    
    // Final fallback: Show error message
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="color: red; margin: 20px; font-family: sans-serif;">
          <h2>Failed to Load Experiment</h2>
          <p>The experiment script could not be loaded after multiple attempts.</p>
          <p>Please try:</p>
          <ul>
            <li>Refreshing the page</li>
            <li>Clearing your browser cache</li>
            <li>Using a different browser (Chrome or Firefox recommended)</li>
          </ul>
          <p>Error details:</p>
          <pre style="background: #f8f8f8; padding: 10px; border-radius: 5px; overflow: auto; font-size: 12px;">${e ? e.message || 'Unknown error' : 'Unknown error'}</pre>
        </div>
      `;
    }
  };
  
  document.head.appendChild(script);
}

// Set up a timeout to ensure we don't hang
setTimeout(function() {
  if (!window.experimentModuleLoaded) {
    console.warn('Experiment module not loaded after timeout, trying fallback...');
    loadNonModuleVersion();
  }
}, 5000);

// Load the module when this script executes
window.loadExperimentModule(); 