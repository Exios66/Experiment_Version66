# Data Recovery Guide

## What Happens When the Experiment Crashes?

If the experiment crashes, closes unexpectedly, or encounters an error, don't worry! The system is designed to automatically save your eye tracking data and recover it when you restart the experiment.

## Automatic Recovery Process

1. **When a crash occurs**: The system automatically saves current eye tracking data to your browser's localStorage.

2. **When you restart the experiment**: The system automatically checks for any saved data from previous sessions.

3. **Data recovery**: If found, the data is imported into the current session and will be included in the final results.

4. **Confirmation**: You'll see a message in the browser console confirming that data was recovered.

## Manual Data Export (At Any Time)

You can manually export the current eye tracking data at any point:

1. Press **Ctrl+Shift+E** on your keyboard
2. A CSV file containing all collected gaze data will be downloaded to your computer
3. This file can be opened in Excel, Google Sheets, or any data analysis software

## What to Do After a Crash

1. **Restart the experiment**: Simply reload the page or restart the experiment
2. **Continue as normal**: The system will automatically recover any saved data
3. **Check the console**: If you want to confirm recovery, open the browser console (F12) and look for recovery messages

## For Researchers and Lab Assistants

### Checking if Data Was Recovered

1. Open the browser developer tools:
   - Chrome/Edge: Press F12 or right-click and select "Inspect"
   - Firefox: Press F12 or right-click and select "Inspect Element"
   - Safari: Enable developer tools in preferences, then right-click and select "Inspect Element"

2. Go to the "Console" tab

3. Look for messages like:
   - "Found emergency data from previous session"
   - "Successfully recovered X data items from previous sessions"

### Manually Checking localStorage

If you need to verify that data is being saved:

1. Open browser developer tools (F12)
2. Go to "Application" tab (Chrome/Edge) or "Storage" tab (Firefox)
3. Select "Local Storage" in the left panel
4. Look for keys like:
   - emergency_gaze_data
   - crash_gaze_data
   - promise_rejection_data

### Troubleshooting Recovery Issues

If data isn't being recovered:

1. **Check if localStorage is enabled**: Some privacy settings or incognito mode may disable localStorage
2. **Same browser**: Make sure you're using the same browser as the crashed session
3. **Cleared cache**: If the browser cache was cleared between sessions, the data may be lost
4. **Different computer**: localStorage is specific to each device and browser

## Technical Details

- Data is saved to localStorage, which persists even when the browser is closed
- Each data point includes timestamp, x/y coordinates, and trial information
- The system can recover from various types of crashes: browser crashes, JavaScript errors, and network issues
- Recovery works across page reloads and browser restarts (as long as localStorage isn't cleared) 