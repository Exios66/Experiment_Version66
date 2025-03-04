# Eye Tracking Experiment

A PsychoJS experiment for eye tracking using WebGazer.js.

## Overview

This experiment demonstrates eye tracking capabilities in a web browser using the WebGazer.js library integrated with PsychoJS. It includes calibration routines and a simple interactive demo of eye tracking functionality.

## Setup

1. Make sure all files are in their correct locations:
   - `webgazer-2.0.1.js` - The WebGazer eye tracking library
   - `calibration_trials.xlsx` - Contains the positions for calibration points
   - `index.html` - Main HTML file that loads the experiment
   - `extended_session_experiment.js` - Main experiment script
   - `extended_session/` - Directory containing components for extended sessions

2. Required libraries (in the `lib/` directory):
   - `psychojs-2021.2.3.js`
   - `psychojs-2021.2.3.css`
   - `psychojs-2021.2.3.iife.js` (for legacy browsers)

3. Browser requirements:
   - Modern web browser with webcam access
   - Permission to use webcam
   - JavaScript enabled

## Running the Experiment

1. Serve the files using a web server (required for webcam access)
2. Open the index.html file in a browser
3. Follow the on-screen instructions for:
   - Webcam initialization
   - Calibration procedure
   - Eye tracking demo

## Code Structure

- `index.html` - Entry point for the experiment
- `extended_session_experiment.js` - Main experiment code
- `extended_session/extended_session_experiment.js` - Extended functionality for longer sessions
- `webgazer-2.0.1.js` - WebGazer library for eye tracking

## Data Collection

This experiment collects and stores:
- Calibration points and accuracy
- Gaze position data
- Response times
- Webcam status

Data is exported in batch format to prevent data loss and ensure comprehensive tracking.

## Troubleshooting

- If webcam doesn't initialize, check browser permissions
- For 404 errors, ensure all resource files are present in the correct locations
- If calibration isn't working, try in a well-lit environment with clear face visibility 
