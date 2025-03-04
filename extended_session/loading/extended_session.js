// extended_session_experiment.js
// This experiment file extends the demo_eye_tracking2 structure ( [oai_citation:1‡demo_eye_tracking2.js](file-service://file-Q5EQCjxZZypmKpwroWvpPS))
// to add an extended duration live eye tracking recording session.
// Place this file in the extended_session subdirectory.

import { core, data, util, visual } from './lib/psychojs-2021.2.3.js';
const { PsychoJS } = core;
const { Scheduler } = util;

// Experiment info
let expName = 'extended_session_experiment';
let expInfo = { 'participant': '', 'session': '001' };

// Initialize PsychoJS
const psychoJS = new PsychoJS({ debug: true });
psychoJS.openWindow({
  fullscr: true,
  color: new util.Color([-1, -1, -1]),
  units: 'height'
});

// Display a dialog box for experiment info
psychoJS.schedule(psychoJS.gui.DlgFromDict({ dictionary: expInfo, title: expName }));

// Create schedulers
const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);
psychoJS.scheduleCondition(() => (psychoJS.gui.dialogComponent.button === 'OK'), flowScheduler, dialogCancelScheduler);

// Add routines to the flow
flowScheduler.add(updateInfo);
flowScheduler.add(experimentInit);
flowScheduler.add(calibrationRoutine);
flowScheduler.add(initializationRoutine);
flowScheduler.add(extendedRecordingRoutine);
flowScheduler.add(dataExportRoutine);
flowScheduler.add(quitPsychoJS);

// Routine: update experiment info
async function updateInfo() {
  expInfo['date'] = util.MonotonicClock.getDateStr(); // add timestamp
  expInfo['expName'] = expName;
  // Attempt to record the monitor frame rate (default to 60 if unavailable)
  expInfo['frameRate'] = psychoJS.window.getActualFrameRate() || 60;
  return Scheduler.Event.NEXT;
}

// Global container for recorded gaze data
let gazeData = [];

// Routine: experiment initialization (e.g., pre-loading resources, setting up variables)
async function experimentInit() {
  // (Any additional initialization code can go here)
  console.log("Experiment initialization complete.");
  return Scheduler.Event.NEXT;
}

// Routine: calibration
async function calibrationRoutine() {
  // This routine should present calibration instructions and stimuli.
  // For demonstration, we simulate a calibration delay.
  console.log("Calibration routine started...");
  // (In a real experiment, display calibration squares and collect user input)
  await util.sleep(2000);
  console.log("Calibration routine completed.");
  return Scheduler.Event.NEXT;
}

// Routine: initialization (start the eye tracker)
async function initializationRoutine() {
  console.log("Initializing eye tracking...");
  // Set up the WebGazer tracker (as in the demo,  [oai_citation:2‡demo_eye_tracking2.js](file-service://file-Q5EQCjxZZypmKpwroWvpPS))
  // Example configuration: set regression model and begin tracking.
  webgazer.setGazeListener(function(data, timestamp) {
    // This listener could be used to update on-screen indicators if desired.
  }).begin();
  // Allow some time for the tracker to start
  await util.sleep(1000);
  console.log("Eye tracking initialized.");
  return Scheduler.Event.NEXT;
}

// Routine: extended recording session
// Records live gaze data from the calibrated coordinate plane for a set duration.
let recordingDuration = 60; // in seconds
async function extendedRecordingRoutine() {
  console.log("Extended recording session started for " + recordingDuration + " seconds.");
  const startTime = performance.now();
  const frameInterval = 1000 / expInfo['frameRate'];
  // Continuously poll for gaze prediction until duration elapses.
  while ((performance.now() - startTime) < recordingDuration * 1000) {
    // Retrieve the current gaze prediction from WebGazer.
    const prediction = webgazer.getCurrentPrediction();
    const timestamp = performance.now();
    if (prediction) {
      // Record the timestamp and gaze coordinates (x, y).
      gazeData.push({ timestamp: timestamp, x: prediction.x, y: prediction.y });
    }
    // Wait until next frame
    await util.sleep(frameInterval);
  }
  console.log("Extended recording session ended.");
  return Scheduler.Event.NEXT;
}

// Routine: data export
async function dataExportRoutine() {
  console.log("Exporting gaze data...");
  // Convert the gaze data array to a JSON string and add it to experiment data.
  // (Alternatively, you could format as CSV if preferred.)
  psychoJS.experiment.addData("gazeData", JSON.stringify(gazeData));
  // Trigger a data save/export (as used in the demo,  [oai_citation:3‡demo_eye_tracking2.js](file-service://file-Q5EQCjxZZypmKpwroWvpPS)).
  psychoJS.experiment.save({ stim: true });
  console.log("Data export completed.");
  return Scheduler.Event.NEXT;
}

// Routine: quit the experiment
async function quitPsychoJS() {
  await psychoJS.quit();
  return Scheduler.Event.QUIT;
}

// Start the experiment with necessary resources
psychoJS.start({
  expName: expName,
  expInfo: expInfo,
  resources: [
    { 'name': 'webgazer-2.0.1.tp.js', 'path': 'webgazer-2.0.1.tp.js' }
    // (Include any additional resources required for calibration or instructions)
  ]
});