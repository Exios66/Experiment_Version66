# Changelog

## Version 2.1.0 - 2025-03-14

### Added

- Comprehensive crash recovery system with multiple backup mechanisms
- Auto-export functionality that saves data even when sessions end abruptly
- Event listeners for all potential crash scenarios:
  - Page unload events (beforeunload)
  - JavaScript errors (error event)
  - Unhandled promise rejections
- Smart localStorage backup system that preserves data across sessions
- Manual data export via keyboard shortcut (Ctrl+Shift+E)
- CSV export option for easier data analysis

### Enhanced

- Completely redesigned quitPsychoJS function with robust data saving
- Improved data chunking for large datasets to prevent memory issues
- Auto-save timer that regularly persists experiment data (every 10 seconds)
- Better error handling and recovery throughout the application

## Version 2.0.0 - 2025-03-04

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

### Fixed

- Resolved duplicate variable declarations throughout the codebase
- Fixed issues with PsychoJS library loading
- Improved error handling in WebGazer initialization
- Enhanced cleanup of resources when experiment ends

## Version 1.2.0 - 2024-11-15

### New Features

- Enhanced data collection with trial phase information
- Improved coordinate plane construction for better spatial tracking
- Added master data store for complete experiment history

### Improvements

- Better WebGazer initialization with improved error handling
- Enhanced gaze data collection with more metadata
- Improved cleanup of WebGazer resources

## Version 1.1.0 - 2024-08-20

### Added Features

- Improved calibration with multi-point system
- Added coordinate plane construction for better spatial tracking
- Enhanced data collection with trial phase information

### Bug Fixes

- Resolved issues with WebGazer initialization
- Fixed calibration point display issues

## Version 1.0.0 - 2024-06-10

### Initial Features

- Initial release of the extended session experiment
- Basic eye tracking functionality using WebGazer
- Calibration routine for eye tracking
- Simple data collection and export
