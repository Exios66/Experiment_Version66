/*************************** 
 * Demo_Eye_Tracking2 Test *
 ***************************/

import { core, data, sound, util, visual } from '../lib/psychojs-2021.2.3.js';
const { PsychoJS } = core;
const { TrialHandler } = data;
const { Scheduler } = util;
//some handy aliases as in the psychopy scripts;
const { abs, sin, cos, PI: pi, sqrt } = Math;
const { round } = util;

// Make sure webgazer is available
if (typeof window.webgazer === 'undefined') {
  console.warn('WebGazer not found in window. Will attempt to load it during experiment initialization.');
}

// Global variables for tracking state
let t;
let frameN;
let continueRoutine;
let initializeEyetrackingComponents;
let _inst1_resp_allKeys;
let inst1Components;
let gotValidClick;
let calibrationIntroComponents;
let prevButtonState;
let _mouseButtons;
let tracking_square;
let trackingTxt;
let tracking_resp;
let trackingTrialComponents;
let webcamWarning;
let instruction1Txt;
let inst1_resp;
let calibrationTxt;
let calibrationMouse;
let globalClock;
let routineTimer;
let initializeEyetrackingClock;
let inst1Clock;
let calibrationIntroClock;

// store info about the experiment session:
let expName = 'extended_session_experiment';  // from the Builder filename that created this script
let expInfo = {'participant': '', 'session': '001'};

// Start code blocks for 'Before Experiment'
// init psychoJS:
const psychoJS = new PsychoJS({
  debug: true,
  pavlovia: { 
    URL: 'https://pavlovia.org',
    gitlabURL: 'https://gitlab.pavlovia.org'
  },
  collectIP: false,
  topLevelStatus: true
});

// Add window event listeners for crash protection
window.addEventListener('beforeunload', function(event) {
  // Force data export before the page unloads
  if (window.gazeDataBuffer && window.gazeDataBuffer.length > 0) {
    try {
      // Create emergency backup of data
      const emergencyData = {
        timestamp: Date.now(),
        sessionId: expInfo.participant + '_' + expInfo.session,
        reason: 'page_unload',
        gazePoints: window.gazeDataBuffer,
        masterData: window.masterGazeData || []
      };
      
      // Use synchronous localStorage as a last resort to save data
      localStorage.setItem('emergency_gaze_data', JSON.stringify(emergencyData));
      console.log('Emergency data saved to localStorage');
      
      // Try to save to experiment data if possible
      if (psychoJS && psychoJS.experiment) {
        psychoJS.experiment.addData('emergencyGazeData', JSON.stringify(emergencyData));
        // Force synchronous save attempt
        psychoJS.experiment.save();
      }
    } catch (e) {
      console.error('Failed to save emergency data:', e);
    }
  }
});

// Add error event listener for crash detection
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.message);
  // Save data on critical errors
  if (window.gazeDataBuffer && window.gazeDataBuffer.length > 0) {
    try {
      const crashData = {
        timestamp: Date.now(),
        sessionId: expInfo.participant + '_' + expInfo.session,
        reason: 'crash',
        errorMessage: event.message,
        errorStack: event.error ? event.error.stack : null,
        gazePoints: window.gazeDataBuffer,
        masterData: window.masterGazeData || []
      };
      
      // Save to localStorage
      localStorage.setItem('crash_gaze_data', JSON.stringify(crashData));
      
      // Try to save to experiment data
      if (psychoJS && psychoJS.experiment) {
        psychoJS.experiment.addData('crashGazeData', JSON.stringify(crashData));
        psychoJS.experiment.save();
      }
    } catch (e) {
      console.error('Failed to save crash data:', e);
    }
  }
});

// Add handler for unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled Promise Rejection:', event.reason);
  
  // Save data on promise rejection
  if (window.gazeDataBuffer && window.gazeDataBuffer.length > 0) {
    try {
      const rejectionData = {
        timestamp: Date.now(),
        sessionId: expInfo.participant + '_' + expInfo.session,
        reason: 'promise_rejection',
        errorMessage: event.reason ? (event.reason.message || String(event.reason)) : 'Unknown promise rejection',
        errorStack: event.reason && event.reason.stack ? event.reason.stack : null,
        gazePoints: window.gazeDataBuffer,
        masterData: window.masterGazeData || []
      };
      
      // Save to localStorage
      localStorage.setItem('promise_rejection_data', JSON.stringify(rejectionData));
      
      // Try to save to experiment data
      if (psychoJS && psychoJS.experiment) {
        psychoJS.experiment.addData('promiseRejectionData', JSON.stringify(rejectionData));
        psychoJS.experiment.save();
      }
    } catch (e) {
      console.error('Failed to save promise rejection data:', e);
    }
  }
});

// open window:
psychoJS.openWindow({
  fullscr: true,
  color: new util.Color([(- 1), (- 1), (- 1)]),
  units: 'height',
  waitBlanking: true
});

// schedule the experiment:
psychoJS.schedule(psychoJS.gui.DlgFromDict({
  dictionary: expInfo,
  title: expName
}));

const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);
psychoJS.scheduleCondition(function() { return (psychoJS.gui.dialogComponent.button === 'OK'); }, flowScheduler, dialogCancelScheduler);

// flowScheduler gets run if the participants presses OK
flowScheduler.add(updateInfo); // add timeStamp
flowScheduler.add(experimentInit);
flowScheduler.add(initializeEyetrackingRoutineBegin());
flowScheduler.add(initializeEyetrackingRoutineEachFrame());
flowScheduler.add(initializeEyetrackingRoutineEnd());
flowScheduler.add(inst1RoutineBegin());
flowScheduler.add(inst1RoutineEachFrame());
flowScheduler.add(inst1RoutineEnd());
flowScheduler.add(calibrationIntroRoutineBegin());
flowScheduler.add(calibrationIntroRoutineEachFrame());
flowScheduler.add(calibrationIntroRoutineEnd());
const trialsLoopScheduler = new Scheduler(psychoJS);
flowScheduler.add(trialsLoopBegin(trialsLoopScheduler));
flowScheduler.add(trialsLoopScheduler);
flowScheduler.add(trialsLoopEnd);
flowScheduler.add(trackingTrialRoutineBegin());
flowScheduler.add(trackingTrialRoutineEachFrame());
flowScheduler.add(trackingTrialRoutineEnd());
flowScheduler.add(quitPsychoJS, '', true);

// quit if user presses Cancel in dialog box:
dialogCancelScheduler.add(quitPsychoJS, '', false);

psychoJS.start({
  expName: expName,
  expInfo: expInfo,
  resources: [
    {'name': 'calibration_trials.csv', 'path': '../data/calibration_trials.csv'},
    {'name': 'webgazer-2.0.1.js', 'path': '../lib/webgazer-2.0.1.js'},
    {'name': 'webgazer-2.0.1.tp.js', 'path': '../lib/webgazer-2.0.1.tp.js'},
    {'name': 'lib/psychojs-2021.2.3.js', 'path': '../lib/psychojs-2021.2.3.js'},
    {'name': 'lib/psychojs-2021.2.3.css', 'path': '../lib/psychojs-2021.2.3.css'},
    {'name': 'extended_session_experiment.js', 'path': './extended_session_experiment.js'}
  ]
});

psychoJS.experimentLogger.setLevel(core.Logger.ServerLevel.EXP);


var frameDur;
async function updateInfo() {
  expInfo['date'] = util.MonotonicClock.getDateStr();  // add a simple timestamp
  expInfo['expName'] = expName;
  expInfo['psychopyVersion'] = '2021.2.3';
  expInfo['OS'] = window.navigator.platform;

  // store frame rate of monitor if we can measure it successfully
  expInfo['frameRate'] = psychoJS.window.getActualFrameRate();
  if (typeof expInfo['frameRate'] !== 'undefined')
    frameDur = 1.0 / Math.round(expInfo['frameRate']);
  else
    frameDur = 1.0 / 60.0; // couldn't get a reliable measure so guess

  // add info from the URL:
  util.addInfoFromUrl(expInfo);
  
  return Scheduler.Event.NEXT;
}


async function experimentInit() {
  // Initialize components for Routine "initializeEyetracking"
  initializeEyetrackingClock = new util.Clock();
  //initialize params of the webgazer package (used for eye tracking)
  
  // Initialize global array to store all gaze data points
  window.allGazeData = [];
  
  // Initialize x and y arrays; we use these to calculate running averages of 
  // current gaze position; the longer the window, the slower, but more fluent
  // the updates
  let averagingWindow = 10;
  window.xGazes = new Array(averagingWindow ).fill(0);
  window.yGazes = new Array(averagingWindow ).fill(0);
  
  // Setup data collection for live export
  window.gazeDataBuffer = [];
  window.gazeExportInterval = 5000; // Export data every 5 seconds
  window.lastExportTime = Date.now();
  window.eyesReturnedDelay = 1000; // 1 second delay before hiding webcam thumbnail
  window.eyesExitedTimestamp = Date.now();
  window.gazeExportTimer = null; // Initialize timer reference for cleanup
  window.exportFunctionActive = true; // Flag to control export function
  window.autoSaveEnabled = true; // Enable automatic data saving
  window.autoSaveInterval = 10000; // Auto-save every 10 seconds
  
  // Setup auto-save timer for experiment data
  window.autoSaveTimer = setInterval(() => {
    if (window.autoSaveEnabled && psychoJS.experiment) {
      console.log('Auto-saving experiment data...');
      psychoJS.experiment.save();
    }
  }, window.autoSaveInterval);
  
  // Check for any emergency data from previous sessions
  try {
    // List of all possible emergency data keys
    const emergencyDataKeys = [
      'emergency_gaze_data',
      'crash_gaze_data',
      'promise_rejection_data'
    ];
    
    // Check for any custom keys that might have been used
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('gaze') || key.includes('eye') || key.includes('track') || 
                 key.includes('crash') || key.includes('emergency') || key.includes('webgazer'))) {
        allKeys.push(key);
      }
    }
    
    // Combine standard and detected keys
    const keysToCheck = [...new Set([...emergencyDataKeys, ...allKeys])];
    let recoveredDataCount = 0;
    
    // Process all emergency data
    for (const key of keysToCheck) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          // Parse the data to ensure it's valid JSON
          const parsedData = JSON.parse(data);
          
          // Add to experiment data with metadata
          psychoJS.experiment.addData('recovered_data_type', key);
          psychoJS.experiment.addData('recovered_data_timestamp', Date.now());
          psychoJS.experiment.addData(`recovered_${key}`, data);
          
          // Log recovery
          console.log(`Recovered data from localStorage key: ${key}`);
          recoveredDataCount++;
          
          // Remove from localStorage after recovery
          localStorage.removeItem(key);
        } catch (parseError) {
          console.error(`Error parsing recovered data from key ${key}:`, parseError);
          // Still remove invalid data
          localStorage.removeItem(key);
        }
      }
    }
    
    // Log summary of recovery
    if (recoveredDataCount > 0) {
      console.log(`Successfully recovered ${recoveredDataCount} data items from previous sessions`);
      psychoJS.experiment.addData('recovered_data_count', recoveredDataCount);
      
      // Force a save of the recovered data
      psychoJS.experiment.save();
    }
  } catch (e) {
    console.error('Error recovering previous session data:', e);
  }
  
  // Initialize storage for calibration data
  window.calibrationPoints = [];
  window.trackingAccuracy = { x: 0, y: 0 };
  
  // Initialize coordinate plane for user's screen
  window.screenCoordinatePlane = {
    initialized: false,
    topLeft: { x: 0, y: 0 },
    topRight: { x: 0, y: 0 },
    bottomLeft: { x: 0, y: 0 },
    bottomRight: { x: 0, y: 0 },
    centerPoint: { x: 0, y: 0 },
    width: 0,
    height: 0
  };
  
  // Function to construct coordinate plane from calibration points
  window.constructCoordinatePlane = function() {
    if (window.calibrationPoints.length < 5) {
      console.warn('Not enough calibration points to construct coordinate plane');
      return false;
    }
    
    // Find extreme points for coordinate plane
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let sumX = 0, sumY = 0;
    
    window.calibrationPoints.forEach(point => {
      const x = point.expected[0];
      const y = point.expected[1];
      
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      
      sumX += x;
      sumY += y;
    });
    
    // Construct the coordinate plane
    window.screenCoordinatePlane = {
      initialized: true,
      topLeft: { x: minX, y: maxY },
      topRight: { x: maxX, y: maxY },
      bottomLeft: { x: minX, y: minY },
      bottomRight: { x: maxX, y: minY },
      centerPoint: { x: sumX / window.calibrationPoints.length, y: sumY / window.calibrationPoints.length },
      width: maxX - minX,
      height: maxY - minY
    };
    
    console.log('Coordinate plane constructed:', window.screenCoordinatePlane);
    psychoJS.experiment.addData('coordinatePlaneConstructed', true);
    psychoJS.experiment.addData('coordinatePlane', JSON.stringify(window.screenCoordinatePlane));
    
    return true;
  };
  
  webcamWarning = new visual.TextStim({
    win: psychoJS.window,
    name: 'webcamWarning',
    text: 'This experiment uses eye tracking. \n\nYou should see your web-browser request access to your webcam. You might need to click on this text to make that happen. Please permit access, and wait a little while. Your webcam video should appear in the top-left of the screen.',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], height: 0.05,  wrapWidth: undefined, ori: 0.0,
    color: new util.Color('white'),  opacity: undefined,
    depth: -1.0 
  });
  
  // Initialize components for Routine "inst1"
  inst1Clock = new util.Clock();
  instruction1Txt = new visual.TextStim({
    win: psychoJS.window,
    name: 'instruction1Txt',
    text: 'Webgazer initialized. \nPress space to move on',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], height: 0.05,  wrapWidth: undefined, ori: 0.0,
    color: new util.Color('white'),  opacity: undefined,
    depth: -1.0 
  });
  
  inst1_resp = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  // Initialize components for Routine "calibrationIntro"
  calibrationIntroClock = new util.Clock();
  calibrationTxt = new visual.TextStim({
    win: psychoJS.window,
    name: 'calibrationTxt',
    text: "OK great! we are almost ready to get started. \n\nFirst we need to calibrate the eye tracker. Please try to keep your head still. If you move your head too far away, you'r webcam will appear in the top left corner. If this happens, please move back into view. \n\nWhite squares will appear at different locations on the screen. Please click each square with your mouse.\n\nClick anywhere with the mouse to continue...",
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], height: 0.05,  wrapWidth: undefined, ori: 0.0,
    color: new util.Color('white'),  opacity: undefined,
    depth: 0.0 
  });
  
  calibrationMouse = new core.Mouse({
    win: psychoJS.window,
  });
  calibrationMouse.mouseClock = new util.Clock();
  // Initialize components for Routine "calibration"
  calibrationClock = new util.Clock();
  calibration_square = new visual.Rect ({
    win: psychoJS.window, name: 'calibration_square', 
    width: [0.02, 0.02][0], height: [0.02, 0.02][1],
    ori: 0.0, pos: [0, 0],
    lineWidth: 1.0, lineColor: new util.Color('white'),
    fillColor: new util.Color('white'),
    opacity: undefined, depth: -1, interpolate: true,
  });
  
  calibrationClick = new core.Mouse({
    win: psychoJS.window,
  });
  calibrationClick.mouseClock = new util.Clock();
  // Initialize components for Routine "trackingTrial"
  trackingTrialClock = new util.Clock();
  tracking_square = new visual.Rect ({
    win: psychoJS.window, name: 'tracking_square', 
    width: [0.02, 0.02][0], height: [0.02, 0.02][1],
    ori: 0.0, pos: [0, 0],
    lineWidth: 1.0, lineColor: new util.Color('white'),
    fillColor: new util.Color('white'),
    opacity: undefined, depth: 0, interpolate: true,
  });
  
  trackingTxt = new visual.TextStim({
    win: psychoJS.window,
    name: 'trackingTxt',
    text: 'Great! we are now tracking your eye movements! look around the screen to see how it works! \n\nPlease remember is important for you to keep your head still during the experiment. \n\nPress space to start',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], height: 0.05,  wrapWidth: undefined, ori: 0.0,
    color: new util.Color('white'),  opacity: undefined,
    depth: -1.0 
  });
  
  tracking_resp = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  // Create some handy timers
  globalClock = new util.Clock();  // to track the time since experiment started
  routineTimer = new util.CountdownTimer();  // to track time remaining of each (non-slip) routine
  
  return Scheduler.Event.NEXT;
}


/** 
 * This function initializes the eye tracking component of the experiment
 * It has been updated to incorporate a simpler version for compatibility with older experiment versions
 */
function initializeEyetrackingRoutineBegin(snapshot) {
  return async function () {
    // Ensure TrialHandler is defined
    if (typeof TrialHandler === 'undefined') {
      console.error('TrialHandler is not defined. Make sure the main experiment file is loaded first.');
      return;
    }
    
    if (snapshot) {
      TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    }
    
    //------Prepare to start Routine 'initializeEyetracking'-------
    t = 0;
    initializeEyetrackingClock.reset(); // clock
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    
    // Ensure WebGazer is properly loaded
    if (typeof window.webgazer === 'undefined') {
      console.error('WebGazer is not loaded. Attempting to load it again...');
      try {
        // Load WebGazer dynamically if it's not available
        await psychoJS.serverManager.prepareResource('webgazer-2.0.1.js');
        console.log('WebGazer loaded successfully');
      } catch (error) {
        console.error('Failed to load WebGazer:', error);
      }
    }
    
    // update component parameters for each repeat
    // Show webcam thumbnail and face feedback box, but not face overlay and gaze dot
    if (window.webgazer) {
      window.webgazer.params.showVideoPreview = true;
      window.webgazer.params.showFaceFeedbackBox = true;
      window.webgazer.params.showFaceOverlay = false;
      window.webgazer.params.showGazeDot = false;
    } else {
      console.error('WebGazer is still not available after loading attempt');
    }
    
    // Configure data collection
    const exportGazeData = () => {
      try {
        if (window.gazeDataBuffer && window.gazeDataBuffer.length > 0) {
          // Add current batch of gaze data to experiment data
          const batchData = {
            timestamp: Date.now(),
            sessionId: expInfo.participant + '_' + expInfo.session,
            frameRate: expInfo.frameRate,
            gazePoints: window.gazeDataBuffer,
            bufferSize: window.gazeDataBuffer.length
          };
          
          // Add batch to experiment data with unique identifier
          const batchKey = 'gazeBatch_' + batchData.timestamp;
          psychoJS.experiment.addData(batchKey, JSON.stringify(batchData));
          
          // Log export details
          console.log(`Exported gaze data batch at ${new Date(batchData.timestamp).toISOString()}: ${batchData.gazePoints.length} points`);
          
          // Clear buffer after successful export
          window.gazeDataBuffer = [];
          window.lastExportTime = Date.now();
          
          // Record export success in experiment data
          psychoJS.experiment.addData('gazeExportSuccess', true);
          psychoJS.experiment.addData('gazeExportTimestamp', batchData.timestamp);
          psychoJS.experiment.addData('gazeExportSize', batchData.bufferSize);
          
          // Trigger a save after each export to ensure data is persisted
          if (window.autoSaveEnabled) {
            psychoJS.experiment.save();
          }
        } else {
          console.log('No gaze data to export at', new Date().toISOString());
        }
      } catch (error) {
        // Handle export errors gracefully
        console.error('Error exporting gaze data:', error);
        psychoJS.experiment.addData('gazeExportError', error.message);
        
        // Attempt recovery by clearing buffer
        window.gazeDataBuffer = [];
        window.lastExportTime = Date.now();
      }
    };
    
    // Set up periodic export
    window.gazeExportTimer = setInterval(() => {
      exportGazeData();
    }, window.gazeExportInterval);
    
    // Start eye tracking with enhanced data collection
    window.webgazer
        // Called on each eye tracking update
        .setGazeListener(function(data, clock) {
          if (data !== null) {
            // Remove first element from gazes array, add current gaze at the end
            window.xGazes.shift();
            window.xGazes.push(data.x);
            window.yGazes.shift();
            window.yGazes.push(data.y);
            
            // Store gaze data for export
            window.gazeDataBuffer.push({
              timestamp: Date.now(),
              x: data.x,
              y: data.y,
              eyeFeatures: data.eyeFeatures || null,
              trialIndex: psychoJS.experiment.thisN || -1,
              trialPhase: psychoJS.experiment.currentScheduler?.taskName || 'unknown'
            });
            
            // Add to master data store for persistence
            if (!window.masterGazeData) {
              window.masterGazeData = [];
            }
            window.masterGazeData.push({
              timestamp: Date.now(),
              x: data.x,
              y: data.y,
              eyeFeatures: data.eyeFeatures || null,
              trialIndex: psychoJS.experiment.thisN || -1,
              trialPhase: psychoJS.experiment.currentScheduler?.taskName || 'unknown'
            });
            
            // Export if buffer gets too large or time interval has passed
            if (window.gazeDataBuffer.length > 100 || 
                (Date.now() - window.lastExportTime) > window.gazeExportInterval) {
              exportGazeData();
            }
          }
        })
        .begin();
    
    // keep track of which components have finished
    initializeEyetrackingComponents = [];
    initializeEyetrackingComponents.push(webcamWarning);
    
    for (const thisComponent of initializeEyetrackingComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function initializeEyetrackingRoutineEachFrame() {
  return async function () {
    //------Loop for each frame of Routine 'initializeEyetracking'-------
    // get current time
    t = initializeEyetrackingClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    // Finish routine once everything is ready
    continueRoutine = 
      !window.webgazer.isReady() || 
      document.getElementById('webgazerFaceFeedbackBox') === null ||
      document.getElementById('webgazerVideoFeed') === null;
    
    // *webcamWarning* updates
    if (t >= 0.0 && webcamWarning.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      webcamWarning.tStart = t;  // (not accounting for frame time here)
      webcamWarning.frameNStart = frameN;  // exact frame index
      
      webcamWarning.setAutoDraw(true);
    }

    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of initializeEyetrackingComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function initializeEyetrackingRoutineEnd() {
  return async function () {
    //------Ending Routine 'initializeEyetracking'-------
    for (const thisComponent of initializeEyetrackingComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    
    // Start gaze data logging now that eye tracking is initialized
    if (window.webgazer && typeof startGazeLogging === 'function') {
      console.log('Starting gaze logging after eye tracking initialization');
      startGazeLogging();
    } else {
      console.warn('Could not start gaze logging - WebGazer not initialized or startGazeLogging not available');
    }
    
    // the Routine "initializeEyetracking" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    return Scheduler.Event.NEXT;
  };
}


function inst1RoutineBegin(snapshot) {
  return async function () {
    if (snapshot) {
      TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    }
    
    //------Prepare to start Routine 'inst1'-------
    t = 0;
    inst1Clock.reset(); // clock
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // update component parameters for each repeat
    if (document.getElementById('webgazerFaceFeedbackBox')) {
      document.getElementById('webgazerFaceFeedbackBox').style.display = 'none';
    }
    if (document.getElementById('webgazerVideoFeed')) {
      document.getElementById('webgazerVideoFeed').style.display = 'none';
    }
    inst1_resp.keys = undefined;
    inst1_resp.rt = undefined;
    _inst1_resp_allKeys = [];
    // keep track of which components have finished
    inst1Components = [];
    inst1Components.push(instruction1Txt);
    inst1Components.push(inst1_resp);
    
    for (const thisComponent of inst1Components)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function inst1RoutineEachFrame() {
  return async function () {
    //------Loop for each frame of Routine 'inst1'-------
    // get current time
    t = inst1Clock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *instruction1Txt* updates
    if (t >= 0.0 && instruction1Txt.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      instruction1Txt.tStart = t;  // (not accounting for frame time here)
      instruction1Txt.frameNStart = frameN;  // exact frame index
      
      instruction1Txt.setAutoDraw(true);
    }

    
    // *inst1_resp* updates
    if (t >= 0.0 && inst1_resp.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      inst1_resp.tStart = t;  // (not accounting for frame time here)
      inst1_resp.frameNStart = frameN;  // exact frame index
      
      // keyboard checking is just starting
      psychoJS.window.callOnFlip(function() { inst1_resp.clock.reset(); });  // t=0 on next screen flip
      psychoJS.window.callOnFlip(function() { inst1_resp.start(); }); // start on screen flip
      psychoJS.window.callOnFlip(function() { inst1_resp.clearEvents(); });
    }

    if (inst1_resp.status === PsychoJS.Status.STARTED) {
      let theseKeys = inst1_resp.getKeys({keyList: ['space'], waitRelease: false});
      _inst1_resp_allKeys = _inst1_resp_allKeys.concat(theseKeys);
      if (_inst1_resp_allKeys.length > 0) {
        inst1_resp.keys = _inst1_resp_allKeys[_inst1_resp_allKeys.length - 1].name;  // just the last key pressed
        inst1_resp.rt = _inst1_resp_allKeys[_inst1_resp_allKeys.length - 1].rt;
        // a response ends the routine
        continueRoutine = false;
      }
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of inst1Components)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function inst1RoutineEnd() {
  return async function () {
    //------Ending Routine 'inst1'-------
    for (const thisComponent of inst1Components) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    psychoJS.experiment.addData('inst1_resp.keys', inst1_resp.keys);
    if (typeof inst1_resp.keys !== 'undefined') {  // we had a response
        psychoJS.experiment.addData('inst1_resp.rt', inst1_resp.rt);
        routineTimer.reset();
        }
    
    inst1_resp.stop();
    // the Routine "inst1" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    return Scheduler.Event.NEXT;
  };
}


function calibrationIntroRoutineBegin(snapshot) {
  return async function () {
    if (snapshot) {
      TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    }
    
    //------Prepare to start Routine 'calibrationIntro'-------
    t = 0;
    calibrationIntroClock.reset(); // clock
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // update component parameters for each repeat
    // setup some python lists for storing info about the calibrationMouse
    gotValidClick = false; // until a click is received
    // keep track of which components have finished
    calibrationIntroComponents = [];
    calibrationIntroComponents.push(calibrationTxt);
    calibrationIntroComponents.push(calibrationMouse);
    
    for (const thisComponent of calibrationIntroComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function calibrationIntroRoutineEachFrame() {
  return async function () {
    //------Loop for each frame of Routine 'calibrationIntro'-------
    // get current time
    t = calibrationIntroClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *calibrationTxt* updates
    if (t >= 0.0 && calibrationTxt.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      calibrationTxt.tStart = t;  // (not accounting for frame time here)
      calibrationTxt.frameNStart = frameN;  // exact frame index
      
      calibrationTxt.setAutoDraw(true);
    }

    // *calibrationMouse* updates
    if (t >= 0.0 && calibrationMouse.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      calibrationMouse.tStart = t;  // (not accounting for frame time here)
      calibrationMouse.frameNStart = frameN;  // exact frame index
      
      calibrationMouse.status = PsychoJS.Status.STARTED;
      calibrationMouse.mouseClock.reset();
      prevButtonState = calibrationMouse.getPressed();  // if button is down already this ISN'T a new click
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of calibrationIntroComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  }
}


function trackingTrialRoutineBegin(snapshot) {
  return async function () {
    if (snapshot) {
      TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    }
    
    // Initialize tracking_square and components
    tracking_square = new visual.Rect({
      win: psychoJS.window,
      name: 'tracking_square',
      width: 0.05,
      height: 0.05,
      fillColor: new util.Color('white'),
      opacity: undefined, 
      depth: 0, 
      interpolate: true
    });
    
    trackingTxt = new visual.TextStim({
      win: psychoJS.window,
      name: 'trackingTxt',
      text: 'Great! we are now tracking your eye movements! look around the screen to see how it works! \n\nPlease remember is important for you to keep your head still during the experiment. \n\nPress space to start',
      font: 'Arial',
      units: undefined, 
      pos: [0, 0], height: 0.05,  wrapWidth: undefined, ori: 0.0,
      color: new util.Color('white'),  opacity: undefined,
      depth: -1.0 
    });
    
    tracking_resp = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
    
    // keep track of which components have finished
    trackingTrialComponents = [tracking_square, trackingTxt, tracking_resp];
    for (const thisComponent of trackingTrialComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    
    return Scheduler.Event.NEXT;
  }
}


function trackingTrialRoutineEnd() {
  return async function () {
    //------Ending Routine 'trackingTrial'-------
    for (const thisComponent of trackingTrialComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    psychoJS.experiment.addData('trackingTrial_resp.keys', tracking_resp.keys);
    if (typeof tracking_resp.keys !== 'undefined') {  // we had a response
        psychoJS.experiment.addData('trackingTrial_resp.rt', tracking_resp.rt);
        routineTimer.reset();
    }
    
    tracking_resp.stop();
    // the Routine "trackingTrial" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    return Scheduler.Event.NEXT;
  };
}

// Helper Functions
function startGazeLogging() {
  console.log('Starting gaze data logging');
  
  // Initialize gaze data storage if not already done
  if (!window.gazeDataBuffer) {
    window.gazeDataBuffer = [];
  }
  
  // Set up last export timestamp if not existing
  if (!window.lastExportTime) {
    window.lastExportTime = Date.now();
  }
  
  // Export on a regular interval
  if (!window.gazeExportInterval) {
    window.gazeExportInterval = 2000; // Default to 2 seconds
  }
  
  // Start WebGazer if it exists but hasn't been started
  if (window.webgazer && !window.webgazer.isReady()) {
    window.webgazer.begin();
  }
  
  // Create a download link for manual data export
  const createDownloadLink = () => {
    if (!window.masterGazeData || window.masterGazeData.length === 0) {
      console.log('No gaze data available for manual export');
      return;
    }
    
    try {
      // Convert data to CSV format
      const headers = ['timestamp', 'x', 'y', 'trialIndex', 'trialPhase'];
      const csvRows = [headers.join(',')];
      
      window.masterGazeData.forEach(point => {
        const row = [
          point.timestamp,
          point.x,
          point.y,
          point.trialIndex || -1,
          point.trialPhase || 'unknown'
        ];
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `gaze_data_${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Manual data export completed');
    } catch (error) {
      console.error('Error during manual data export:', error);
    }
  };
  
  // Add keyboard shortcut for manual data export (Ctrl+Shift+E)
  document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'E') {
      console.log('Manual data export triggered by keyboard shortcut');
      createDownloadLink();
    }
  });
  
  return true;
}

function quitPsychoJS(message, isCompleted) {
  console.log('Quitting experiment with message:', message, 'isCompleted:', isCompleted);
  
  // Force final data export
  try {
    // Export any remaining gaze data
    if (window.gazeDataBuffer && window.gazeDataBuffer.length > 0) {
      const finalBatchData = {
        timestamp: Date.now(),
        sessionId: expInfo.participant + '_' + expInfo.session,
        frameRate: expInfo.frameRate,
        gazePoints: window.gazeDataBuffer,
        isFinal: true,
        bufferSize: window.gazeDataBuffer.length
      };
      
      // Add final batch to experiment data
      const batchKey = 'finalGazeBatch_' + finalBatchData.timestamp;
      psychoJS.experiment.addData(batchKey, JSON.stringify(finalBatchData));
      console.log('Exported final gaze data batch:', finalBatchData.bufferSize, 'points');
      
      // Clear buffer after export
      window.gazeDataBuffer = [];
    }
    
    // Export master data store if available
    if (window.masterGazeData && window.masterGazeData.length > 0) {
      // Create a summary to save space
      const summary = {
        totalPoints: window.masterGazeData.length,
        startTime: window.masterGazeData[0].timestamp,
        endTime: window.masterGazeData[window.masterGazeData.length - 1].timestamp,
        duration: window.masterGazeData[window.masterGazeData.length - 1].timestamp - window.masterGazeData[0].timestamp,
        sampleRate: window.masterGazeData.length / ((window.masterGazeData[window.masterGazeData.length - 1].timestamp - window.masterGazeData[0].timestamp) / 1000)
      };
      
      psychoJS.experiment.addData('masterGazeDataSummary', JSON.stringify(summary));
      
      // Save the full data in chunks if it's large
      const chunkSize = 1000; // Adjust based on data size
      if (window.masterGazeData.length > chunkSize) {
        for (let i = 0; i < window.masterGazeData.length; i += chunkSize) {
          const chunk = window.masterGazeData.slice(i, i + chunkSize);
          psychoJS.experiment.addData(`masterGazeData_chunk_${i/chunkSize}`, JSON.stringify(chunk));
        }
      } else {
        psychoJS.experiment.addData('masterGazeData', JSON.stringify(window.masterGazeData));
      }
      
      console.log('Exported master gaze data store:', window.masterGazeData.length, 'points');
    }
    
    // Force a final save
    psychoJS.experiment.save();
  } catch (error) {
    console.error('Error during final data export:', error);
    
    // Emergency backup to localStorage
    try {
      const emergencyData = {
        timestamp: Date.now(),
        sessionId: expInfo.participant + '_' + expInfo.session,
        reason: 'quit_error',
        errorMessage: error.message,
        gazeBuffer: window.gazeDataBuffer || [],
        masterData: window.masterGazeData || []
      };
      
      localStorage.setItem('emergency_gaze_data', JSON.stringify(emergencyData));
      console.log('Emergency data saved to localStorage due to quit error');
    } catch (e) {
      console.error('Failed to save emergency data during quit:', e);
    }
  }
  
  // Clean up timers
  if (window.gazeExportTimer) {
    clearInterval(window.gazeExportTimer);
    window.gazeExportTimer = null;
  }
  
  if (window.autoSaveTimer) {
    clearInterval(window.autoSaveTimer);
    window.autoSaveTimer = null;
  }
  
  // Clean up WebGazer if it exists
  if (window.webgazer) {
    try {
      window.webgazer.end();
      console.log('WebGazer ended successfully');
    } catch (err) {
      console.error('Error stopping WebGazer:', err);
    }
  }
  
  // Present quit message to participant
  psychoJS.window.close();
  psychoJS.quit({message: message, isCompleted: isCompleted});
  
  return Scheduler.Event.QUIT;
}
