# Experiment Version 66 Changelog

## Version 1.0.0 - 2025-03-04

### Major Restructuring and Debugging

- Reorganized project files into a more logical directory structure:
  - `/src/js/` - JavaScript application files
  - `/src/lib/` - External libraries and dependencies
  - `/src/modules/` - ES module wrapper files
  - `/src/data/` - Data files like calibration trials
  - `/src/tests/` - Testing files and utility pages
  - `/src/css/` - Stylesheets (placeholder for future use)

### Server Improvements

- Created enhanced Node.js server (`src/server.js`) with:
  - Better MIME type handling for various file extensions
  - Improved module detection and handling
  - More robust source map file handling
  - Better error handling and reporting
  - Path resolution for reorganized file structure
  - CORS headers for all responses
  - Automatic port selection if default port is in use

### Module System Fixes

- Fixed issues with ES modules not loading correctly
  - Added module wrapper that properly handles module imports
  - Improved auto-detection of module scripts
  - Added fallback to non-module version when needed

### Resource Path Corrections

- Updated all resource paths in HTML and JavaScript files
- Fixed relative paths in ES modules

### Debugging Tools

- Added comprehensive debug logging system in the web application
- Added debug panel toggle for real-time monitoring
- Added error display for improved debugging experience

### WebGazer Integration Improvements

- Enhanced WebGazer initialization and configuration
- Fixed webcam access and display issues
- Added willReadFrequently attribute to WebGazer canvas elements for better performance
- Improved gaze data collection and export

### Startup Improvements

- Added new start.js script for easier experiment launch
- Simplified server startup process

### Known Issues

- Some files may have incomplete implementations due to size limitations
- The calibration function in the experiment file needs completion
