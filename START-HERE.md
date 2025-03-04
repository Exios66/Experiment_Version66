# PsychoJS Eye Tracking Experiment

This document explains how to run the eye tracking experiment locally on your computer.

## Quick Start

Choose the appropriate option for your operating system:

### On Windows

- Double-click the `start-experiment.bat` file
- OR open Command Prompt and run: `node start-experiment.js`

### On macOS/Linux

- Double-click the `start-experiment.sh` file (if your system allows)
- OR open Terminal and run: `./start-experiment.sh`
- OR run: `node start-experiment.js`

## Requirements

- **Node.js** (version 12 or later) - [Download here](https://nodejs.org/)
- A modern web browser (Chrome or Firefox recommended)
- A webcam for eye tracking

## Fixed Version for Import Error

If you encounter the "Cannot use import statement outside a module" error, the system will now automatically use an improved loading approach. The fixed version:

1. Uses a better method to load ES modules
2. Shows a loading screen with detailed resource status
3. Properly handles module dependencies
4. Provides better error messages if something fails

You can manually access this fixed version at: <http://localhost:8080/import-fix.html>

## Troubleshooting

### If the webcam doesn't start

1. Make sure your browser has permission to access the camera
2. Try using a different browser (Chrome is recommended)
3. Ensure the WebGazer library is loaded properly

### If resources fail to load

1. Visit <http://localhost:8080/resource-test.html> to diagnose which resources are failing
2. Check that all files mentioned in the error message exist in the correct locations

### If you still see module import errors

1. Make sure your browser supports ES modules (use Chrome or Firefox)
2. Try clearing your browser cache
3. Verify that all JavaScript files are correctly downloaded and not corrupted

## Manual Server Start

If the automatic scripts don't work, you can start the server manually:

1. Open a terminal or command prompt
2. Navigate to the experiment directory
3. Run: `node start-experiment.js`
4. Open a browser and go to: <http://localhost:8080/>

## Understanding the Files

- `start-experiment.js` - Node.js script that starts the server and launches the experiment
- `start-experiment.sh` - Shell script for macOS/Linux to launch the experiment
- `start-experiment.bat` - Batch file for Windows to launch the experiment
- `import-fix.html` - **FIXED VERSION** that properly handles ES module imports
- `index.html` - Original HTML file (may have module import issues)
- `resource-test.html` - Diagnostic page to check if all resources are loading correctly

## Technical Details for Developers

### Module Import Error Solution

The original code was trying to load ES modules in a way that sometimes fails in certain browsers. The new approach:

1. Loads all non-module scripts first (jQuery, WebGazer, etc.)
2. Creates a module script element programmatically
3. Uses proper ES module imports within this script
4. Provides detailed error reporting

This solves the "Cannot use import statement outside a module" error that occurs when trying to use ES module imports in a non-module context.

## Need Help?

If you continue to experience issues:

1. Check the browser console for error messages (F12 or right-click > Inspect > Console)
2. Verify that all required files are present
3. Try the fixed version explicitly: <http://localhost:8080/import-fix.html>
4. Contact the experiment designer with specific error messages and screenshots
