/**
 * Module wrapper for the extended session experiment
 * This file loads the experiment script properly as a module
 */

// Initialize global state needed by PsychoJS
window.experimentModuleLoaded = false;
window.experimentLoadAttempts = 0;
window.maxLoadAttempts = 3;

// Import and expose PsychoJS modules globally
import { core, data, sound, util, visual } from '../lib/psychojs-2021.2.3.js';

// Make sure global variables are defined before loading experiment
window.core = core;
window.data = data;
window.sound = sound;
window.util = util;
window.visual = visual;

// Also define the PsychoJS class globally since it's commonly used
window.PsychoJS = core.PsychoJS;

// Log the modules were exposed
if (typeof addDebugMessage === 'function') {
  addDebugMessage('PsychoJS modules exposed globally in module wrapper');
}

// Delay the module loading to ensure globals are set
setTimeout(() => {
  // Create a function to dynamically import the module
  window.loadExperimentModule = function() {
    console.log('Loading experiment as ES6 module...');
    window.experimentLoadAttempts++;
    
    // Add message to debug log if available
    if (typeof addDebugMessage === 'function') {
      addDebugMessage(`Attempt ${window.experimentLoadAttempts} to load experiment module`);
    }
    
    // Import the module dynamically
    import('../js/extended_session_experiment.js')
      .then(module => {
        console.log('Module loaded successfully!');
        window.experimentModuleLoaded = true;
        
        // Store a reference to the module
        window.experimentModule = module;
        
        // Add message to debug log if available
        if (typeof addDebugMessage === 'function') {
          addDebugMessage('Experiment module loaded successfully');
        }
        
        // Notify any listeners that might be waiting for the module
        if (typeof window.onExperimentModuleLoaded === 'function') {
          window.onExperimentModuleLoaded(module);
        }
        
        // Dispatch a custom event
        const event = new CustomEvent('experimentModuleLoaded', { detail: module });
        window.dispatchEvent(event);
        
        // Register this file as a module for PreloadJS detection
        if (window.moduleScripts && !window.moduleScripts.includes('extended_session_experiment.js')) {
          window.moduleScripts.push('extended_session_experiment.js');
        }
      })
      .catch(error => {
        console.error('Failed to load experiment module:', error);
        
        // Add message to debug log if available
        if (typeof addDebugMessage === 'function') {
          addDebugMessage(`ERROR: Failed to load experiment module: ${error.message}`);
        }
        
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

  // Load the module after ensuring globals are set
  window.loadExperimentModule();
}, 100);

// Function to load the non-module version as fallback
function loadNonModuleVersion() {
  const script = document.createElement('script');
  script.src = '../js/extended_session_experiment-no-modules.js';
  
  script.onload = function() {
    console.log('Non-module version loaded successfully');
    
    // Add message to debug log if available
    if (typeof addDebugMessage === 'function') {
      addDebugMessage('Loaded non-module version of experiment');
    }
    
    // Notify the page that the experiment is ready
    window.experimentModuleLoaded = true;
    
    // Dispatch an event to notify listeners
    const event = new CustomEvent('experimentNonModuleLoaded');
    window.dispatchEvent(event);
  };
  
  script.onerror = function(e) {
    console.error('Failed to load non-module version:', e);
    
    // Add message to debug log if available
    if (typeof addDebugMessage === 'function') {
      addDebugMessage(`ERROR: Failed to load non-module fallback: ${e ? e.message || 'Unknown error' : 'Unknown error'}`);
    }
    
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

// Helper function to detect if we're in a context where createjs is available
function patchCreateJS() {
  if (window.createjs && window.createjs.LoadQueue) {
    console.log('Patching CreateJS from module wrapper');
    
    // Patch LoadQueue to handle modules
    if (!window.createJSPatched) {
      const originalLoadJavascript = window.createjs.LoadQueue.prototype._loadJavascript;
      
      window.createjs.LoadQueue.prototype._loadJavascript = function(item) {
        console.log(`CreateJS loading script: ${item.src}`);
        
        // Check if this is a module script
        if (item.src.includes('extended_session_experiment.js')) {
          console.log('CreateJS detected module file, redirecting to wrapper');
          
          // Redirect to this wrapper instead
          item.src = '../modules/extended_session_experiment-module-wrapper.js';
          
          // Handle the item directly
          const tag = document.createElement('script');
          tag.type = 'module';
          tag.src = item.src;
          
          tag.onload = function() {
            console.log('Module wrapper loaded via CreateJS');
            if (item.completeHandler) {
              item.completeHandler();
            }
          };
          
          tag.onerror = function(event) {
            console.error('Module wrapper failed to load via CreateJS');
            if (item.errorHandler) {
              item.errorHandler(event);
            }
          };
          
          document.body.appendChild(tag);
          return true;
        }
        
        return originalLoadJavascript.call(this, item);
      };
      
      window.createJSPatched = true;
    }
  }
}

// Try to patch CreateJS if available
patchCreateJS();

// Set up a timeout to ensure we don't hang
setTimeout(function() {
  if (!window.experimentModuleLoaded) {
    console.warn('Experiment module not loaded after timeout, trying fallback...');
    if (typeof addDebugMessage === 'function') {
      addDebugMessage('WARNING: Module load timeout, trying fallback');
    }
    loadNonModuleVersion();
  }
}, 5000);

// Try to patch CreateJS again after a delay (in case it loads after this script)
setTimeout(patchCreateJS, 1000);
