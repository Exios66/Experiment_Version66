# Data Export & Crash Recovery Documentation

## Overview

The experiment includes a comprehensive data protection system designed to ensure that eye tracking data is never lost, even in the event of crashes, browser closures, or other unexpected interruptions. This document explains the technical details of this system and how to use it effectively.

## Key Components

### 1. Auto-Save System

The experiment automatically saves data at regular intervals:

- **Auto-Save Timer**: Saves experiment data every 10 seconds
- **Buffer Export**: Exports gaze data buffer when it reaches 100 points or after 5 seconds
- **Forced Save**: Triggers immediate save after important events (calibration, trial completion)

Configuration variables:
```javascript
window.autoSaveEnabled = true;        // Enable/disable auto-save
window.autoSaveInterval = 10000;      // Auto-save interval in milliseconds
window.gazeExportInterval = 5000;     // Gaze data export interval in milliseconds
```

### 2. Crash Detection

The system monitors for potential crash scenarios using event listeners:

- **Page Unload**: `beforeunload` event - Triggered when user closes/refreshes the page
- **JavaScript Errors**: `error` event - Catches uncaught exceptions
- **Promise Rejections**: `unhandledrejection` event - Catches failed async operations

Each listener triggers an emergency data save when activated.

### 3. Emergency Backup

When a crash is detected, data is saved to multiple locations:

- **PsychoJS Experiment Data**: Primary storage (if still accessible)
- **localStorage**: Browser's persistent storage as fallback
- **Console Logs**: Detailed error information for debugging

Emergency data includes:
- Current gaze data buffer
- Master data store (if available)
- Error details (message, stack trace)
- Session metadata (participant ID, timestamp)

### 4. Data Recovery

When the experiment starts, it automatically checks for emergency data:

- Scans localStorage for any keys containing experiment data
- Imports and processes all found data
- Adds recovered data to the current experiment session
- Cleans up localStorage after successful recovery

Recovery process:
```javascript
// List of standard emergency data keys
const emergencyDataKeys = [
  'emergency_gaze_data',
  'crash_gaze_data',
  'promise_rejection_data'
];

// Also scans for any custom keys that might contain relevant data
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && (key.includes('gaze') || key.includes('eye') || 
             key.includes('track') || key.includes('crash') || 
             key.includes('emergency') || key.includes('webgazer'))) {
    // Process this key
  }
}
```

### 5. Manual Export

Users can manually export data at any time:

- **Keyboard Shortcut**: Press `Ctrl+Shift+E` to trigger manual export
- **CSV Format**: Data is exported as CSV file for easy analysis
- **Download**: File is automatically downloaded to the user's computer

CSV format includes:
- Timestamp (milliseconds since epoch)
- X and Y coordinates
- Trial index
- Trial phase

### 6. Enhanced Quit Function

The `quitPsychoJS` function has been completely redesigned:

- Forces final data export of all remaining data
- Creates data summary for efficient storage
- Chunks large datasets to prevent memory issues
- Cleans up all timers and resources
- Handles errors during the quit process

## How to Use

### For Experimenters

1. **Monitor Console**: Check browser console for messages about data export and recovery
2. **Check Data Quality**: Review exported data for completeness after each session
3. **Recover Lost Data**: If a session crashes, restart it to automatically recover data
4. **Manual Export**: Use Ctrl+Shift+E to manually export data at any point

### For Developers

1. **Configuration**: Adjust auto-save and export intervals in `experimentInit` function
2. **Custom Events**: Add additional event listeners for specific crash scenarios
3. **Data Processing**: Modify the data format in the gaze listener function
4. **Storage Options**: Add additional storage backends if needed

## Troubleshooting

### Common Issues

1. **Data Not Saving**:
   - Check if localStorage is enabled in the browser
   - Verify that PsychoJS is properly initialized
   - Check console for error messages

2. **Recovery Not Working**:
   - Ensure localStorage wasn't cleared between sessions
   - Check for error messages during recovery process
   - Verify that the same browser is being used

3. **Large Data Sets**:
   - If experiencing performance issues with large datasets, adjust chunk size
   - Consider increasing export frequency for very long sessions

### Debugging

To debug data export and recovery:

1. Open browser developer tools (F12)
2. Go to Application tab > Storage > Local Storage
3. Look for keys starting with 'emergency_', 'crash_', etc.
4. Check console for detailed logs of export and recovery operations

## Technical Implementation

### Data Flow

1. WebGazer collects eye tracking data points
2. Data points are added to in-memory buffer and master store
3. Buffer is periodically exported to PsychoJS experiment data
4. On crash, current buffer is saved to localStorage
5. On restart, localStorage is checked for previous data
6. Recovered data is added to current experiment session

### Data Format

Each gaze data point includes:
```javascript
{
  timestamp: Date.now(),
  x: data.x,
  y: data.y,
  eyeFeatures: data.eyeFeatures || null,
  trialIndex: psychoJS.experiment.thisN || -1,
  trialPhase: psychoJS.experiment.currentScheduler?.taskName || 'unknown'
}
```

Emergency data format:
```javascript
{
  timestamp: Date.now(),
  sessionId: expInfo.participant + '_' + expInfo.session,
  reason: 'crash|page_unload|promise_rejection',
  errorMessage: error.message,
  errorStack: error.stack,
  gazePoints: window.gazeDataBuffer,
  masterData: window.masterGazeData
}
```

## Future Improvements

Potential enhancements for future versions:

1. **Server-Side Backup**: Add option to send emergency data to server
2. **IndexedDB Storage**: Use IndexedDB for larger datasets
3. **Compression**: Compress large datasets before storage
4. **Encryption**: Add encryption for sensitive data
5. **Offline Mode**: Improve offline data collection and synchronization 