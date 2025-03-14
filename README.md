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
/docs          - Documentation files
  DATA_EXPORT.md         - Technical details of data export system
  DATA_RECOVERY_GUIDE.md - User guide for data recovery
/start.js      - Startup script
```

## Getting Started

1. Make sure you have Node.js installed on your system
2. Clone or download this repository
3. Start the server:

```bash
node start.js
```

4. Access the experiment at <http://localhost:8080> (or another port if 8080 is in use)

## Available Test Pages

- WebGazer Test: <http://localhost:8080/tests/webgazer-test.html>
- Resource Test: <http://localhost:8080/tests/resource-test.html>

## Features

- **Eye Tracking**: Uses WebGazer.js to track eye movements via webcam
- **Calibration**: Calibration routines to ensure accurate gaze tracking
- **Data Collection**: Collection and storage of gaze data for analysis
- **Debugging Tools**: Built-in debugging panel and error reporting
- **Module Support**: ES module compatibility with fallback options

### Data Export & Crash Recovery (New in v2.1.0)

The experiment now includes robust data protection mechanisms:

- **Auto-Save**: Experiment data is automatically saved every 10 seconds
- **Crash Protection**: Multiple event listeners detect potential crashes and save data:
  - Page unload events (when browser closes/refreshes)
  - JavaScript errors
  - Unhandled promise rejections
- **Emergency Backup**: Data is saved to localStorage if normal saving fails
- **Data Recovery**: Automatically recovers and imports data from previous crashed sessions
- **Manual Export**: Press Ctrl+Shift+E to manually export eye tracking data as CSV
- **Chunked Saving**: Large datasets are automatically split into manageable chunks
- **Comprehensive Cleanup**: All resources are properly released when experiment ends

For detailed information, see [Data Export Documentation](docs/DATA_EXPORT.md) and [Data Recovery Guide](docs/DATA_RECOVERY_GUIDE.md).

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

### Data Storage

The experiment uses a multi-layered approach to data storage:

1. **In-Memory Buffer**: Collects gaze data points in real-time
2. **PsychoJS Experiment Data**: Primary storage for all experiment data
3. **localStorage Backup**: Emergency backup if normal saving fails
4. **CSV Export**: Manual export option for easy data analysis

### Browser Requirements

- Modern web browser (Chrome, Firefox, Edge recommended)
- Webcam access for eye tracking functionality
- JavaScript enabled
- localStorage enabled (for emergency data backup)

## Troubleshooting

If you encounter issues:

1. Check browser console for error messages
2. Use the debug panel (toggle button in the bottom-right corner)
3. Verify webcam permissions are granted
4. Ensure all files are properly located in their respective directories
5. Check localStorage for any recovered data from previous sessions

### Data Recovery

If an experiment crashes, the system will automatically attempt to recover data when restarted:

1. Look for a message in the console about recovered data
2. The recovered data will be included in the next data export
3. You can also check localStorage directly in browser DevTools

For a complete guide to data recovery, see [Data Recovery Guide](docs/DATA_RECOVERY_GUIDE.md).

## Documentation

- [Data Export Documentation](docs/DATA_EXPORT.md) - Technical details of the data export system
- [Data Recovery Guide](docs/DATA_RECOVERY_GUIDE.md) - User guide for recovering data after crashes
- [Changelog](CHANGELOG.md) - Detailed list of changes and improvements

## License

See LICENSE file for details.
