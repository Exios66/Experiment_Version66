# Experiment Version 66

An eye-tracking experiment using WebGazer.js and PsychoJS.

## Overview

This project implements a web-based eye-tracking experiment using WebGazer.js for eye tracking functionality and PsychoJS for experiment control and data collection. The experiment includes calibration routines, gaze tracking visualization, and data collection capabilities.

## Project Structure

The project has been reorganized into a more modular and maintainable structure:

```
/src
  /js          - Core JavaScript experiment files
  /lib         - External libraries (WebGazer, PsychoJS)
  /modules     - ES module wrapper files
  /data        - Experiment data files
  /tests       - Testing utilities and diagnostic pages
  /css         - Stylesheets (placeholder for future use)
  server.js    - Enhanced Node.js server
  index.html   - Main experiment entry point
/start.js      - Startup script
```

## Getting Started

1. Make sure you have Node.js installed on your system
2. Clone or download this repository
3. Start the server:

```bash
node start.js
```

4. Access the experiment at http://localhost:8080 (or another port if 8080 is in use)

## Available Test Pages

- WebGazer Test: http://localhost:8080/tests/webgazer-test.html
- Resource Test: http://localhost:8080/tests/resource-test.html

## Features

- **Eye Tracking**: Uses WebGazer.js to track eye movements via webcam
- **Calibration**: Calibration routines to ensure accurate gaze tracking
- **Data Collection**: Collection and storage of gaze data for analysis
- **Debugging Tools**: Built-in debugging panel and error reporting
- **Module Support**: ES module compatibility with fallback options

## Technical Details

### Server

The custom Node.js server provides:
- Automatic routing for reorganized file structure
- Proper MIME type handling for all file types
- Module detection and appropriate headers
- Error handling and source map support
- Port selection fallback if default port is in use

### Module System

The experiment supports ES modules with:
- Automatic module detection
- Module wrapper for compatibility
- Fallback to non-module version when needed

### Browser Requirements

- Modern web browser (Chrome, Firefox, Edge recommended)
- Webcam access for eye tracking functionality
- JavaScript enabled

## Troubleshooting

If you encounter issues:

1. Check browser console for error messages
2. Use the debug panel (toggle button in the bottom-right corner)
3. Verify webcam permissions are granted
4. Ensure all files are properly located in their respective directories

## License

See LICENSE file for details.

## Changelog

See CHANGELOG.md for detailed list of changes and improvements.
