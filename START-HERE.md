# PsychoJS Eye Tracking Experiment

This document explains how to run the eye tracking experiment locally on your computer.

## Quick Start

Choose the appropriate option for your operating system:

### On Windows:
- Double-click the `start-experiment.bat` file
- OR open Command Prompt and run: `node start-experiment.js`

### On macOS/Linux:
- Double-click the `start-experiment.sh` file (if your system allows)
- OR open Terminal and run: `./start-experiment.sh`
- OR run: `node start-experiment.js`

## Requirements

- **Node.js** (version 12 or later) - [Download here](https://nodejs.org/)
- A modern web browser (Chrome or Firefox recommended)
- A webcam for eye tracking

## Troubleshooting

### If you encounter the "Cannot use import statement outside a module" error:
This has been fixed in the latest version. If you still see this error:
1. Make sure you're using the updated `index.html` file
2. Check that your browser supports ES modules
3. Verify that the file paths in `index.html` are correct

### If the webcam doesn't start:
1. Make sure your browser has permission to access the camera
2. Try using a different browser (Chrome is recommended)
3. Ensure the WebGazer library is loaded properly

### If resources fail to load:
1. Visit http://localhost:8080/resource-test.html to diagnose which resources are failing
2. Check that all files mentioned in the error message exist in the correct locations

## Manual Server Start

If the automatic scripts don't work, you can start the server manually:

1. Open a terminal or command prompt
2. Navigate to the experiment directory
3. Run: `node start-experiment.js`
4. Open a browser and go to: http://localhost:8080/

## Understanding the Files

- `start-experiment.js` - Node.js script that starts the server and launches the experiment
- `start-experiment.sh` - Shell script for macOS/Linux to launch the experiment
- `start-experiment.bat` - Batch file for Windows to launch the experiment
- `index.html` - Main HTML file that loads all dependencies and starts the experiment
- `resource-test.html` - Diagnostic page to check if all resources are loading correctly

## Need Help?

If you continue to experience issues:
1. Check the browser console for error messages (F12 or right-click > Inspect > Console)
2. Verify that all required files are present
3. Contact the experiment designer with specific error messages and screenshots 