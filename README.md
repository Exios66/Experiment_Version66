# Eye Tracking Experiment

A PsychoJS experiment for eye tracking using WebGazer.js.

## Overview

This experiment demonstrates eye tracking capabilities in a web browser using the WebGazer.js library integrated with PsychoJS. It includes calibration routines and a simple interactive demo of eye tracking functionality.

## Files and Structure

The experiment consists of the following main files:

- `index.html` - The entry point for the experiment
- `extended_session_experiment.js` - The main experiment script
- `webgazer-2.0.1.js` - The WebGazer eye tracking library
- `webgazer-2.0.1.tp.js` - A symbolic link to the WebGazer library (for compatibility)
- `calibration_trials.xlsx` - Calibration data for the experiment
- `lib/` - Directory containing PsychoJS library files

## Setup Instructions

### Running Locally

1. Ensure all files are present in the correct locations
2. Start a local web server:

   ```bash
   python -m http.server 8000
   ```

3. Open a browser and navigate to `http://localhost:8000`

### Running on Pavlovia

1. Upload all files to your Pavlovia repository
2. Ensure the file structure matches the local setup
3. Check that WebGazer files are correctly uploaded
4. Follow standard Pavlovia deployment procedures

## Common Issues and Troubleshooting

### 404 Errors

If you see 404 errors in the console:

1. Check that all files are present in the correct locations
2. Verify that `webgazer-2.0.1.js` is accessible
3. Ensure paths in `index.html` match your file structure

### WebGazer Initialization Issues

If the webcam doesn't initialize:

1. Make sure you're using a secure context (HTTPS or localhost)
2. Grant camera permissions when prompted
3. Check browser console for specific error messages

### Path Issues

If resources don't load correctly:

1. Check that all paths in `index.html` and `extended_session_experiment.js` are correct
2. Verify that symbolic links are working properly
3. Ensure no files are missing or misnamed

## Browser Compatibility

This experiment works best in:

- Chrome (latest version)
- Firefox (latest version)
- Edge (latest version)

Safari has known issues with WebGazer and may not function correctly.

## Camera Requirements

- A functional webcam is required
- Camera permissions must be granted
- Good, consistent lighting is recommended for best results

## Data Collection

Eye tracking data is collected throughout the experiment. The data includes:

- Eye positions (x, y coordinates)
- Timestamps
- Calibration accuracy

## License

This project is licensed under the terms included in the LICENSE file.

## Acknowledgments

- WebGazer.js library developed by Brown University
- PsychoJS framework developed by PsychoPy
- Additional modifications by Thomas Pronk
