/**
 * Patch for PreloadJS to handle ES6 modules
 * This script patches the PreloadJS library to properly handle ES6 module imports
 */

(function() {
  // Wait for the preloadjs library to load
  function checkAndPatchPreload() {
    if (window.createjs && window.createjs.LoadQueue) {
      console.log('Patching PreloadJS for ES6 module support');
      
      // Patch the LoadQueue class to handle ES6 modules
      const originalLoadJavascript = window.createjs.LoadQueue.prototype._loadJavascript;
      window.createjs.LoadQueue.prototype._loadJavascript = function(item) {
        // Check if this is a module
        if (item.src && (
          item.src.includes('extended_session_experiment.js') || 
          item.src.includes('module-wrapper') ||
          // Any other module files you want to handle
          item.type === 'module'
        )) {
          console.log('Redirecting module file load:', item.src);
          
          // Replace with the non-module version
          if (item.src.includes('extended_session_experiment.js')) {
            console.log('Redirecting to non-modules version');
            item.src = item.src.replace('extended_session_experiment.js', 'extended_session_experiment-no-modules.js');
          }
          
          // Create a proper module script
          const script = document.createElement('script');
          script.type = 'module';
          script.src = item.src;
          
          // Use our own load handler
          const self = this;
          script.onload = function() {
            console.log('Module loaded successfully:', item.src);
            item.result = true;
            self._handleFileComplete(item);
          };
          
          script.onerror = function(event) {
            console.error('Module failed to load:', item.src);
            item.result = false;
            self._handleFileError(item, event);
          };
          
          // Append the script to the document
          document.head.appendChild(script);
          
          // Return true to indicate we're handling this ourselves
          return true;
        }
        
        // For non-modules, use the original method
        return originalLoadJavascript.call(this, item);
      };
      
      // Also patch the JavaScriptLoader class
      if (window.createjs.JavaScriptLoader) {
        const originalJSLoader = window.createjs.JavaScriptLoader.prototype._createTag;
        window.createjs.JavaScriptLoader.prototype._createTag = function(item) {
          // Check if this might be a module
          if (item.src && (
            item.src.includes('extended_session_experiment.js') || 
            item.src.includes('module-wrapper')
          )) {
            console.log('Creating module script tag for:', item.src);
            
            // Substitute the file for the non-module version
            if (item.src.includes('extended_session_experiment.js')) {
              console.log('Redirecting to non-modules version in tag creation');
              item.src = item.src.replace('extended_session_experiment.js', 'extended_session_experiment-no-modules.js');
            }
            
            // Create a proper script tag for modules
            var script = document.createElement("script");
            script.src = item.src;
            script.type = 'text/javascript'; // Explicitly not a module
            return script;
          }
          
          // For regular scripts, use the original method
          return originalJSLoader.call(this, item);
        };
      }
      
      console.log('PreloadJS successfully patched for module support');
    } else {
      // If preloadjs isn't loaded yet, try again in a moment
      setTimeout(checkAndPatchPreload, 50);
    }
  }
  
  // Start checking for preloadjs
  checkAndPatchPreload();
})(); 