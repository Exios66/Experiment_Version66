/*************************** 
 * Demo_Eye_Tracking2 Test *
 ***************************/

import { core, data, sound, util, visual } from './lib/psychojs-2021.2.3.js';
const { PsychoJS } = core;
const { TrialHandler } = data;
const { Scheduler } = util;
//some handy aliases as in the psychopy scripts;
const { abs, sin, cos, PI: pi, sqrt } = Math;
const { round } = util;


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
    {'name': 'calibration_trials.csv', 'path': './calibration_trials.csv'},
    {'name': 'webgazer-2.0.1.js', 'path': './webgazer-2.0.1.js'},
    {'name': 'webgazer-2.0.1.tp.js', 'path': './webgazer-2.0.1.tp.js'},
    {'name': 'lib/psychojs-2021.2.3.js', 'path': './lib/psychojs-2021.2.3.js'},
    {'name': 'lib/psychojs-2021.2.3.css', 'path': './lib/psychojs-2021.2.3.css'},
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


var initializeEyetrackingClock;
var webcamWarning;
var inst1Clock;
var instruction1Txt;
var inst1_resp;
var calibrationIntroClock;
var calibrationTxt;
var calibrationMouse;
var calibrationClock;
var calibration_square;
var calibrationClick;
var trackingTrialClock;
var tracking_square;
var trackingTxt;
var tracking_resp;
var globalClock;
var routineTimer;
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
  
  // Ensure calibration trials data is loaded
  window.ensureCalibrationTrialsLoaded = async function() {
    try {
      // Check if calibration trials data is already loaded
      if (!psychoJS.serverManager.getResource('calibration_trials.csv')) {
        console.log('Loading calibration trials data...');
        await psychoJS.serverManager.prepareResource('calibration_trials.csv');
      }
      return true;
    } catch (error) {
      console.error('Failed to load calibration trials:', error);
      psychoJS.experiment.addData('calibrationTrialsLoadError', error.message);
      return false;
    }
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


var t;
var frameN;
var continueRoutine;
var initializeEyetrackingComponents;
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
    
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
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


var _inst1_resp_allKeys;
var inst1Components;
function inst1RoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //------Prepare to start Routine 'inst1'-------
    t = 0;
    inst1Clock.reset(); // clock
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // update component parameters for each repeat
    document.getElementById('webgazerFaceFeedbackBox').style.display = 'none';
    document.getElementById('webgazerVideoFeed').style.display = 'none';
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


var gotValidClick;
var calibrationIntroComponents;
function calibrationIntroRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
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


var prevButtonState;
var _mouseButtons;
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
    if (calibrationMouse.status === PsychoJS.Status.STARTED) {  // only update if started and not finished!
      _mouseButtons = calibrationMouse.getPressed();
      if (!_mouseButtons.every( (e,i,) => (e == prevButtonState[i]) )) { // button state changed?
        prevButtonState = _mouseButtons;
        if (_mouseButtons.reduce( (e, acc) => (e+acc) ) > 0) { // state changed to a new click
          // abort routine on response
          continueRoutine = false;
        }
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
  };
}


var _mouseXYs;
function calibrationIntroRoutineEnd() {
  return async function () {
    //------Ending Routine 'calibrationIntro'-------
    for (const thisComponent of calibrationIntroComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    // store data for psychoJS.experiment (ExperimentHandler)
    _mouseXYs = calibrationMouse.getPos();
    _mouseButtons = calibrationMouse.getPressed();
    psychoJS.experiment.addData('calibrationMouse.x', _mouseXYs[0]);
    psychoJS.experiment.addData('calibrationMouse.y', _mouseXYs[1]);
    psychoJS.experiment.addData('calibrationMouse.leftButton', _mouseButtons[0]);
    psychoJS.experiment.addData('calibrationMouse.midButton', _mouseButtons[1]);
    psychoJS.experiment.addData('calibrationMouse.rightButton', _mouseButtons[2]);
    // the Routine "calibrationIntro" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    return Scheduler.Event.NEXT;
  };
}


var trials;
var currentLoop;
function trialsLoopBegin(trialsLoopScheduler, snapshot) {
  return async function() {
    TrialHandler.fromSnapshot(snapshot); // update internal variables (.thisN etc) of the loop
    
    // set up handler to look after randomisation of conditions etc
    trials = new TrialHandler({
      psychoJS: psychoJS,
      nReps: 1, method: TrialHandler.Method.RANDOM,
      extraInfo: expInfo, originPath: undefined,
      trialList: 'calibration_trials.csv',
      seed: undefined, name: 'trials'
    });
    psychoJS.experiment.addLoop(trials); // add the loop to the experiment
    currentLoop = trials;  // we're now the current loop
    
    // Schedule all the trials in the trialList:
    for (const thisTrial of trials) {
      const snapshot = trials.getSnapshot();
      trialsLoopScheduler.add(importConditions(snapshot));
      trialsLoopScheduler.add(calibrationRoutineBegin(snapshot));
      trialsLoopScheduler.add(calibrationRoutineEachFrame());
      trialsLoopScheduler.add(calibrationRoutineEnd());
      trialsLoopScheduler.add(endLoopIteration(trialsLoopScheduler, snapshot));
    }
    
    return Scheduler.Event.NEXT;
  }
}


async function trialsLoopEnd() {
  psychoJS.experiment.removeLoop(trials);

  // Ensure coordinate plane is constructed after all calibration trials
  if (!window.screenCoordinatePlane.initialized) {
    console.log('Attempting to construct coordinate plane after all calibration trials');
    if (window.constructCoordinatePlane()) {
      console.log('Successfully constructed coordinate plane after all calibration trials');
    } else {
      console.warn('Failed to construct coordinate plane - not enough calibration points');
      // Log the issue
      psychoJS.experiment.addData('coordinatePlaneError', 'Failed to construct - insufficient points');
    }
  } else {
    console.log('Coordinate plane already constructed');
  }

  return Scheduler.Event.NEXT;
}


var callib_color;
var calibrationComponents;
function calibrationRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //------Prepare to start Routine 'calibration'-------
    t = 0;
    calibrationClock.reset(); // clock
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    routineTimer.add(5.000000);
    // update component parameters for each repeat
    calibrationDot.setPos([calibrationX, calibrationY]);
    
    // Enhanced calibration setup
    // Store calibration point for quality assessment
    window.currentCalibrationPoint = {
      x: calibrationX,
      y: calibrationY,
      screenX: null,  // Will be calculated below
      screenY: null,  // Will be calculated below
      samples: [],
      startTime: Date.now()
    };
    
    // Convert from PsychoJS coordinates to screen coordinates
    const canvas = psychoJS.window.size;
    // Map from [-1,1] to screen coordinates
    window.currentCalibrationPoint.screenX = ((calibrationX + 1) / 2) * canvas[0];
    window.currentCalibrationPoint.screenY = ((1 - calibrationY) / 2) * canvas[1]; // Flip Y
    
    // Record calibration point in experiment data
    psychoJS.experiment.addData('calibrationPointX', calibrationX);
    psychoJS.experiment.addData('calibrationPointY', calibrationY);
    psychoJS.experiment.addData('calibrationPointScreenX', window.currentCalibrationPoint.screenX);
    psychoJS.experiment.addData('calibrationPointScreenY', window.currentCalibrationPoint.screenY);
    
    // Reset calibration point samples
    window.calibrationSamples = [];
    
    // Set up enhanced gaze collection during calibration
    window.calibrationGazeListener = function(data) {
      if (data == null) return;
      
      // Store raw gaze data for this calibration point
      window.calibrationSamples.push({
        x: data.x,
        y: data.y,
        timestamp: Date.now(),
        targetX: window.currentCalibrationPoint.screenX,
        targetY: window.currentCalibrationPoint.screenY
      });
    };
    
    // Temporarily replace the gaze listener for calibration
    if (window.webgazer) {
      window.originalGazeListener = window.webgazer.getGazeListener();
      window.webgazer.setGazeListener(window.calibrationGazeListener);
    }
    
    // keep track of which components have finished
    calibrationComponents = [];
    calibrationComponents.push(calibrationDot);
    
    for (const thisComponent of calibrationComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


var frameRemains;
function calibrationRoutineEachFrame() {
  return async function () {
    //------Loop for each frame of Routine 'calibration'-------
    // get current time
    t = calibrationClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *calibrationDot* updates
    if (t >= 0.0 && calibrationDot.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      calibrationDot.tStart = t;  // (not accounting for frame time here)
      calibrationDot.frameNStart = frameN;  // exact frame index
      
      calibrationDot.setAutoDraw(true);
    }

    frameRemains = 0.0 + 5.0 - psychoJS.window.monitorFramePeriod * 0.75;  // most of one frame period left
    if (calibrationDot.status === PsychoJS.Status.STARTED && t >= frameRemains) {
      calibrationDot.setAutoDraw(false);
    }
    
    // Enhanced calibration animation
    if (calibrationDot.status === PsychoJS.Status.STARTED) {
      // Animate dot size to draw attention - pulsing effect
      const baseSize = 0.05;
      const pulseAmount = 0.01;
      const pulseFrequency = 2; // Hz
      
      // Calculate size based on sine wave
      const newSize = baseSize + pulseAmount * Math.sin(t * pulseFrequency * 2 * Math.PI);
      calibrationDot.setSize(newSize);
      
      // Change color gradually from red to green as time progresses
      const progress = Math.min(t / 5.0, 1.0); // 0 to 1 over 5 seconds
      const red = 1.0 - progress;
      const green = progress;
      calibrationDot.setFillColor(new util.Color([red, green, 0]));
      
      // Add click event at the end of calibration (last 1 second)
      if (t >= 4.0 && !window.clickRegisteredForCalibration) {
        window.clickRegisteredForCalibration = true;
        
        // Simulate click for WebGazer calibration
        if (window.webgazer && typeof window.webgazer.recordScreenPosition === 'function') {
          try {
            window.webgazer.recordScreenPosition(
              window.currentCalibrationPoint.screenX,
              window.currentCalibrationPoint.screenY,
              'click'
            );
            console.log(`Calibration point recorded at [${calibrationX}, ${calibrationY}]`);
          } catch (err) {
            console.error('Error recording calibration point:', err);
          }
        }
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
    for (const thisComponent of calibrationComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine && routineTimer.getTime() > 0) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  }
}


function calibrationRoutineEnd() {
  return async function () {
    //------Ending Routine 'calibration'-------
    for (const thisComponent of calibrationComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    
    // Enhanced calibration quality assessment
    if (window.calibrationSamples && window.calibrationSamples.length > 0) {
      // Calculate calibration quality metrics
      const targetX = window.currentCalibrationPoint.screenX;
      const targetY = window.currentCalibrationPoint.screenY;
      
      // Calculate average gaze position during calibration
      let sumX = 0, sumY = 0;
      let validSamples = 0;
      
      for (const sample of window.calibrationSamples) {
        if (sample.x !== null && sample.y !== null) {
          sumX += sample.x;
          sumY += sample.y;
          validSamples++;
        }
      }
      
      if (validSamples > 0) {
        const avgX = sumX / validSamples;
        const avgY = sumY / validSamples;
        
        // Calculate Euclidean distance between average gaze and target
        const distance = Math.sqrt(
          Math.pow(avgX - targetX, 2) + 
          Math.pow(avgY - targetY, 2)
        );
        
        // Calculate variance of gaze points
        let varX = 0, varY = 0;
        for (const sample of window.calibrationSamples) {
          if (sample.x !== null && sample.y !== null) {
            varX += Math.pow(sample.x - avgX, 2);
            varY += Math.pow(sample.y - avgY, 2);
          }
        }
        varX /= validSamples;
        varY /= validSamples;
        
        // Store calibration quality metrics
        const qualityMetrics = {
          pointIndex: trials.thisN,
          targetX: targetX,
          targetY: targetY,
          avgGazeX: avgX,
          avgGazeY: avgY,
          distance: distance,
          varianceX: varX,
          varianceY: varY,
          sampleCount: validSamples
        };
        
        // Log calibration quality
        console.log(`Calibration point ${trials.thisN} quality:`, qualityMetrics);
        psychoJS.experiment.addData('calibrationQuality', JSON.stringify(qualityMetrics));
        
        // Update overall calibration quality (lower is better)
        // Use a weighted combination of distance and variance
        const pointQuality = distance + Math.sqrt(varX + varY);
        window.calibrationQuality += pointQuality;
        
        // Store calibration point data for later use
        if (!window.allCalibrationPoints) {
          window.allCalibrationPoints = [];
        }
        window.allCalibrationPoints.push(qualityMetrics);
      }
    }
    
    // Restore original gaze listener
    if (window.webgazer && window.originalGazeListener) {
      window.webgazer.setGazeListener(window.originalGazeListener);
    }
    
    // Reset click registration flag
    window.clickRegisteredForCalibration = false;
    
    // Update last calibration time
    window.lastCalibrationTime = Date.now();
    
    return Scheduler.Event.NEXT;
  }
}


var _tracking_resp_allKeys;
var trackingTrialComponents;
function trackingTrialRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //------Prepare to start Routine 'trackingTrial'-------
    t = 0;
    trackingTrialClock.reset(); // clock
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    
    // Set up extended duration session
    window.extendedSessionActive = true;
    window.extendedSessionStartTime = Date.now();
    window.extendedSessionDuration = 1800000; // 30 minutes by default (can be configured)
    window.passiveRestingState = false;
    window.lastGazeUpdateTime = Date.now();
    window.gazeUpdateInterval = 50; // Update gaze tracking every 50ms
    window.restingStateCheckInterval = 10000; // Check for resting state every 10 seconds
    window.restingStateThreshold = 0.02; // Threshold for determining resting state (in normalized units)
    window.lastRestingStateCheck = Date.now();
    window.restingStateBuffer = [];
    window.restingStateBufferSize = 100; // Number of samples to use for resting state detection
    
    // update component parameters for each repeat
    tracking_resp.keys = undefined;
    tracking_resp.rt = undefined;
    _tracking_resp_allKeys = [];
    
    // Remove the click tracker used for calibration
    window.webgazer.removeMouseEventListeners();
    
    // Verify the coordinate plane was constructed
    if (!window.screenCoordinatePlane.initialized) {
      console.warn('Coordinate plane not initialized yet. Attempting to construct now.');
      if (window.constructCoordinatePlane()) {
        console.log('Successfully constructed coordinate plane during tracking trial');
      } else {
        console.error('Failed to construct coordinate plane - proceeding with default values');
        // Set default values based on window size
        var canvas = psychoJS.window.size;
        window.screenCoordinatePlane = {
          initialized: true,
          topLeft: { x: -canvas[0]/2, y: canvas[1]/2 },
          topRight: { x: canvas[0]/2, y: canvas[1]/2 },
          bottomLeft: { x: -canvas[0]/2, y: -canvas[1]/2 },
          bottomRight: { x: canvas[0]/2, y: -canvas[1]/2 },
          centerPoint: { x: 0, y: 0 },
          width: canvas[0],
          height: canvas[1]
        };
        psychoJS.experiment.addData('coordinatePlaneDefaulted', true);
      }
    }
    
    // Log the coordinate plane metrics to verify it was constructed
    psychoJS.experiment.addData('coordinatePlaneStatus', window.screenCoordinatePlane.initialized);
    psychoJS.experiment.addData('coordinatePlaneDimensions', 
                              JSON.stringify({
                                width: window.screenCoordinatePlane.width,
                                height: window.screenCoordinatePlane.height
                              }));
    
    // Set up extended session timer
    window.extendedSessionTimer = setInterval(() => {
      const elapsedTime = Date.now() - window.extendedSessionStartTime;
      
      // Check if session duration has been reached
      if (elapsedTime >= window.extendedSessionDuration) {
        // End the extended session
        clearInterval(window.extendedSessionTimer);
        window.extendedSessionActive = false;
        
        // Log session completion
        console.log('Extended session completed after', elapsedTime / 1000, 'seconds');
        psychoJS.experiment.addData('extendedSessionCompleted', true);
        psychoJS.experiment.addData('extendedSessionDuration', elapsedTime);
        
        // Force end routine
        continueRoutine = false;
      }
      
      // Periodically check if recalibration is needed
      if (elapsedTime > 300000 && (Date.now() - window.lastCalibrationTime) > 600000) {
        // If it's been more than 10 minutes since last calibration and we're 5+ minutes into session
        console.log('Recalibration may be needed - calibration quality check triggered');
        checkCalibrationQuality();
      }
    }, 10000); // Check every 10 seconds
    
    // Set up resting state detection
    window.restingStateDetectionTimer = setInterval(() => {
      detectRestingState();
    }, window.restingStateCheckInterval);
    
    //hide the video thumbnail 
    document.getElementById('webgazerFaceFeedbackBox').style.display = 'none';
    document.getElementById('webgazerVideoFeed').style.display = 'none';
    
    // keep track of which components have finished
    trackingTrialComponents = [];
    trackingTrialComponents.push(tracking_square);
    trackingTrialComponents.push(trackingTxt);
    trackingTrialComponents.push(tracking_resp);
    
    for (const thisComponent of trackingTrialComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}

// Function to check calibration quality and trigger recalibration if needed
function checkCalibrationQuality() {
  // Calculate current tracking accuracy
  if (window.allCalibrationPoints && window.allCalibrationPoints.length > 0) {
    // Get the most recent 100 gaze samples
    const recentGazeSamples = window.gazeDataBuffer.slice(-100);
    
    if (recentGazeSamples.length < 50) {
      console.log('Not enough recent gaze samples to assess calibration quality');
      return false;
    }
    
    // Calculate variance of recent gaze samples
    let sumX = 0, sumY = 0;
    for (const sample of recentGazeSamples) {
      sumX += sample.x;
      sumY += sample.y;
    }
    
    const avgX = sumX / recentGazeSamples.length;
    const avgY = sumY / recentGazeSamples.length;
    
    let varX = 0, varY = 0;
    for (const sample of recentGazeSamples) {
      varX += Math.pow(sample.x - avgX, 2);
      varY += Math.pow(sample.y - avgY, 2);
    }
    
    varX /= recentGazeSamples.length;
    varY /= recentGazeSamples.length;
    
    const totalVariance = Math.sqrt(varX + varY);
    
    // Log current calibration quality assessment
    console.log('Current calibration quality assessment:', {
      variance: totalVariance,
      sampleCount: recentGazeSamples.length,
      timeSinceCalibration: (Date.now() - window.lastCalibrationTime) / 1000
    });
    
    // If variance is too high, calibration may be degraded
    if (totalVariance > 100) { // Threshold for recalibration
      console.log('Calibration quality has degraded - recalibration recommended');
      psychoJS.experiment.addData('calibrationDegraded', true);
      psychoJS.experiment.addData('calibrationVariance', totalVariance);
      
      // Here you could trigger a recalibration sequence
      // For now, we'll just log it
      return true;
    }
  }
  
  return false;
}

// Function to detect resting state
function detectRestingState() {
  if (!window.extendedSessionActive) return;
  
  // Get the most recent gaze samples
  const recentGazeSamples = window.restingStateBuffer.slice(-window.restingStateBufferSize);
  
  if (recentGazeSamples.length < window.restingStateBufferSize / 2) {
    // Not enough samples to determine resting state
    window.passiveRestingState = false;
    return;
  }
  
  // Calculate variance of recent gaze positions
  let sumX = 0, sumY = 0;
  for (const sample of recentGazeSamples) {
    sumX += sample.x;
    sumY += sample.y;
  }
  
  const avgX = sumX / recentGazeSamples.length;
  const avgY = sumY / recentGazeSamples.length;
  
  let totalDeviation = 0;
  for (const sample of recentGazeSamples) {
    // Calculate Euclidean distance from average
    const deviation = Math.sqrt(
      Math.pow(sample.x - avgX, 2) + 
      Math.pow(sample.y - avgY, 2)
    );
    totalDeviation += deviation;
  }
  
  const averageDeviation = totalDeviation / recentGazeSamples.length;
  
  // Determine if we're in a resting state based on low gaze movement
  const previousState = window.passiveRestingState;
  window.passiveRestingState = averageDeviation < window.restingStateThreshold;
  
  // Log state changes
  if (previousState !== window.passiveRestingState) {
    console.log(
      window.passiveRestingState ? 
      'Entered passive resting state' : 
      'Exited passive resting state'
    );
    
    psychoJS.experiment.addData('restingStateChange', {
      timestamp: Date.now(),
      inRestingState: window.passiveRestingState,
      averageDeviation: averageDeviation,
      threshold: window.restingStateThreshold
    });
  }
}

function trackingTrialRoutineEachFrame() {
  return async function () {
    //------Loop for each frame of Routine 'trackingTrial'-------
    // get current time
    t = trackingTrialClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // Check if extended session is still active
    if (!window.extendedSessionActive) {
      continueRoutine = false;
      return Scheduler.Event.NEXT;
    }
    
    // Only update gaze tracking at specified intervals to reduce computational load
    const currentTime = Date.now();
    if (currentTime - window.lastGazeUpdateTime >= window.gazeUpdateInterval) {
      window.lastGazeUpdateTime = currentTime;
      
      // Set tracking square position based on latest gaze position
      // Calculate average gaze position
      if (window.xGazes && window.yGazes && window.xGazes.length > 0 && window.yGazes.length > 0) {
        // Convert raw gaze data to coordinate plane
        // Get average of recent gaze positions with outlier rejection
        var sumX = 0;
        var sumY = 0;
        var validPoints = 0;
        var validXGazes = [];
        var validYGazes = [];
        
        // First pass: collect valid points and calculate initial average
        for (var i = 0; i < window.xGazes.length; i++) {
          if (window.xGazes[i] !== 0 && window.yGazes[i] !== 0) {
            validXGazes.push(window.xGazes[i]);
            validYGazes.push(window.yGazes[i]);
            sumX += window.xGazes[i];
            sumY += window.yGazes[i];
            validPoints++;
          }
        }
        
        // Only update if we have valid gaze data
        if (validPoints > 0) {
          var avgX = sumX / validPoints;
          var avgY = sumY / validPoints;
          
          // Second pass: reject outliers (points more than 2 standard deviations from mean)
          var stdDevX = calculateStandardDeviation(validXGazes);
          var stdDevY = calculateStandardDeviation(validYGazes);
          
          sumX = 0;
          sumY = 0;
          validPoints = 0;
          
          for (var i = 0; i < validXGazes.length; i++) {
            if (Math.abs(validXGazes[i] - avgX) < 2 * stdDevX && 
                Math.abs(validYGazes[i] - avgY) < 2 * stdDevY) {
              sumX += validXGazes[i];
              sumY += validYGazes[i];
              validPoints++;
            }
          }
          
          // Recalculate average without outliers
          if (validPoints > 0) {
            avgX = sumX / validPoints;
            avgY = sumY / validPoints;
          }
          
          // Map raw coordinates to experiment coordinate system if coordinate plane is initialized
          if (window.screenCoordinatePlane.initialized) {
            // Normalize coordinates to 0-1 range based on screen dimensions
            var normalizedX = (avgX - window.screenCoordinatePlane.topLeft.x) / window.screenCoordinatePlane.width;
            var normalizedY = (avgY - window.screenCoordinatePlane.topLeft.y) / window.screenCoordinatePlane.height;
            
            // Map to PsychoJS coordinate system (-1 to 1)
            var mappedX = (normalizedX * 2) - 1;
            var mappedY = -((normalizedY * 2) - 1); // Y is flipped in browser coordinates
            
            // Apply Kalman filtering for smoother tracking
            if (window.lastMappedX !== undefined && window.lastMappedY !== undefined) {
              // Simple alpha filter (exponential smoothing)
              const alpha = 0.3; // Smoothing factor (0-1)
              mappedX = alpha * mappedX + (1 - alpha) * window.lastMappedX;
              mappedY = alpha * mappedY + (1 - alpha) * window.lastMappedY;
            }
            
            // Store for next frame
            window.lastMappedX = mappedX;
            window.lastMappedY = mappedY;
            
            // Update tracking square position with the mapped coordinates
            tracking_square.setPos([mappedX, mappedY]);
            
            // Add to resting state buffer for passive state detection
            window.restingStateBuffer.push({
              x: normalizedX,
              y: normalizedY,
              timestamp: Date.now()
            });
            
            // Keep buffer at fixed size
            if (window.restingStateBuffer.length > window.restingStateBufferSize) {
              window.restingStateBuffer.shift();
            }
            
            // Record mapping data periodically (every 30 frames) to avoid excessive data
            if (frameN % 30 === 0) {
              psychoJS.experiment.addData('gazeMapping', JSON.stringify({
                raw: [avgX, avgY],
                normalized: [normalizedX, normalizedY],
                mapped: [mappedX, mappedY],
                frameN: frameN,
                inRestingState: window.passiveRestingState
              }));
            }
          } else {
            // Fallback if coordinate plane not initialized
            tracking_square.setPos([avgX, avgY]);
          }
        }
      }
    }
    
    // Visual feedback for resting state
    if (window.passiveRestingState) {
      // Change appearance of tracking square during resting state
      tracking_square.setOpacity(0.5);
      tracking_square.setFillColor(new util.Color([0, 0.5, 0])); // Green for resting
    } else {
      // Normal appearance during active tracking
      tracking_square.setOpacity(1.0);
      tracking_square.setFillColor(new util.Color([1, 0, 0])); // Red for active
    }
    
    // *tracking_square* updates
    if (t >= 0.0 && tracking_square.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      tracking_square.tStart = t;  // (not accounting for frame time here)
      tracking_square.frameNStart = frameN;  // exact frame index
      
      tracking_square.setAutoDraw(true);
    }
    
    // *trackingTxt* updates
    if (t >= 0.0 && trackingTxt.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      trackingTxt.tStart = t;  // (not accounting for frame time here)
      trackingTxt.frameNStart = frameN;  // exact frame index
      
      trackingTxt.setAutoDraw(true);
    }
    
    // Update text based on session state
    if (trackingTxt.status === PsychoJS.Status.STARTED) {
      const elapsedTime = Math.floor((Date.now() - window.extendedSessionStartTime) / 1000);
      const remainingTime = Math.floor((window.extendedSessionDuration - (Date.now() - window.extendedSessionStartTime)) / 1000);
      
      if (window.passiveRestingState) {
        trackingTxt.setText(`Passive tracking active\nRemaining: ${formatTime(remainingTime)}`);
      } else {
        trackingTxt.setText(`Active tracking\nRemaining: ${formatTime(remainingTime)}`);
      }
    }
    
    // *tracking_resp* updates
    if (t >= 0.0 && tracking_resp.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      tracking_resp.tStart = t;  // (not accounting for frame time here)
      tracking_resp.frameNStart = frameN;  // exact frame index
      
      // keyboard checking is just starting
      psychoJS.window.callOnFlip(function() { tracking_resp.clock.reset(); });  // t=0 on next screen flip
      psychoJS.window.callOnFlip(function() { tracking_resp.start(); }); // start on screen flip
      psychoJS.window.callOnFlip(function() { tracking_resp.clearEvents(); });
    }
    
    if (tracking_resp.status === PsychoJS.Status.STARTED) {
      let theseKeys = tracking_resp.getKeys({keyList: ['space', 'escape'], waitRelease: false});
      _tracking_resp_allKeys = _tracking_resp_allKeys.concat(theseKeys);
      if (_tracking_resp_allKeys.length > 0) {
        tracking_resp.keys = _tracking_resp_allKeys[_tracking_resp_allKeys.length - 1].name;  // just the last key pressed
        tracking_resp.rt = _tracking_resp_allKeys[_tracking_resp_allKeys.length - 1].rt;
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
    for (const thisComponent of trackingTrialComponents)
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

// Helper function to calculate standard deviation
function calculateStandardDeviation(array) {
  const n = array.length;
  if (n === 0) return 0;
  
  const mean = array.reduce((sum, val) => sum + val, 0) / n;
  const variance = array.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  return Math.sqrt(variance);
}

// Helper function to format time as MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function trackingTrialRoutineEnd() {
  return async function () {
    //------Ending Routine 'trackingTrial'-------
    for (const thisComponent of trackingTrialComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    
    // Clean up extended session timers
    if (window.extendedSessionTimer) {
      clearInterval(window.extendedSessionTimer);
    }
    
    if (window.restingStateDetectionTimer) {
      clearInterval(window.restingStateDetectionTimer);
    }
    
    // Record session data
    psychoJS.experiment.addData('extendedSessionDuration', Date.now() - window.extendedSessionStartTime);
    psychoJS.experiment.addData('finalCalibrationQuality', window.calibrationQuality);
    psychoJS.experiment.addData('totalGazeSamples', window.gazeSampleCount);
    
    // Export final gaze data
    if (window.gazeDataBuffer && window.gazeDataBuffer.length > 0) {
      const finalBatchData = {
        timestamp: Date.now(),
        sessionId: expInfo.participant + '_' + expInfo.session,
        frameRate: expInfo.frameRate,
        gazePoints: window.gazeDataBuffer,
        bufferSize: window.gazeDataBuffer.length,
        isFinalBatch: true
      };
      
      // Add final batch to experiment data
      const batchKey = 'finalGazeBatch_' + finalBatchData.timestamp;
      psychoJS.experiment.addData(batchKey, JSON.stringify(finalBatchData));
      
      // Clear buffer
      window.gazeDataBuffer = [];
    }
    
    // was no response the correct answer?!
    if (tracking_resp.keys === undefined) {
      tracking_resp.keys = undefined;
    }
    psychoJS.experiment.addData('tracking_resp.keys', tracking_resp.keys);
    if (typeof tracking_resp.keys !== 'undefined') {  // we had a response
      psychoJS.experiment.addData('tracking_resp.rt', tracking_resp.rt);
    }
    
    tracking_resp.stop();
    return Scheduler.Event.NEXT;
  }
}


function endLoopIteration(scheduler, snapshot) {
  // ------Prepare for next entry------
  return async function () {
    if (typeof snapshot !== 'undefined') {
      // ------Check if user ended loop early------
      if (snapshot.finished) {
        // Check for and save orphaned data
        if (psychoJS.experiment.isEntryEmpty()) {
          psychoJS.experiment.nextEntry(snapshot);
        }
        scheduler.stop();
      } else {
        const thisTrial = snapshot.getCurrentTrial();
        if (typeof thisTrial === 'undefined' || !('isTrials' in thisTrial) || thisTrial.isTrials) {
          psychoJS.experiment.nextEntry(snapshot);
        }
      }
    return Scheduler.Event.NEXT;
    }
  };
}


function importConditions(currentLoop) {
  return async function () {
    const currentTrial = currentLoop.getCurrentTrial();
    psychoJS.importAttributes(currentTrial);
    
    // Map the CSV column names to the variable names used in the code
    if (typeof currentTrial.Calibrate_X !== 'undefined') {
      window.calibration_x = currentTrial.Calibrate_X;
    }
    
    if (typeof currentTrial.Calibrate_Y !== 'undefined') {
      window.calibration_y = currentTrial.Calibrate_Y;
    }
    
    return Scheduler.Event.NEXT;
  };
}


// Global array to store all gaze data
window.allGazeData = [];

// Function to start logging gaze coordinates
function startGazeLogging() {
  if (window.webgazer && typeof window.webgazer.setGazeListener === 'function') {
    console.log('Setting up enhanced gaze logging for extended sessions');
    
    // Initialize data structures for extended session
    window.allGazeData = [];
    window.gazeDataBuffer = [];
    window.lastExportTime = Date.now();
    window.gazeExportInterval = 30000; // Export every 30 seconds for extended sessions
    window.gazeSampleCount = 0;
    window.gazeDataChunks = []; // Store references to exported chunks
    window.maxBufferSize = 1000; // Maximum buffer size before forced export
    window.dataCompressionEnabled = true; // Enable compression for large datasets
    
    // Create a secondary window for gaze data visualization and monitoring
    const debugWidth = 400;
    const debugHeight = 600;
    const windowFeatures = `width=${debugWidth},height=${debugHeight},resizable,scrollbars=yes`;
    window.gazeDebugWindow = window.open('', 'WebGazer Debug', windowFeatures);
    
    if (window.gazeDebugWindow) {
      // Initialize the debug window with HTML structure
      window.gazeDebugWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Extended Session Gaze Monitor</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }
            h2 { margin-top: 0; }
            #stats { margin-bottom: 15px; padding: 10px; background: #f0f0f0; }
            #log { 
              height: 200px; 
              overflow: auto; 
              border: 1px solid #ccc; 
              padding: 10px;
              font-family: monospace;
              font-size: 12px;
            }
            #controls { margin-top: 15px; }
            button { padding: 5px 10px; margin-right: 5px; }
            #visualization {
              border: 1px solid #ccc;
              background: #f9f9f9;
              position: relative;
              height: 200px;
              margin-top: 15px;
            }
            .point {
              position: absolute;
              width: 4px;
              height: 4px;
              background: red;
              border-radius: 50%;
            }
            .resting-point {
              background: green;
            }
            #calibrationQuality {
              margin-top: 15px;
              padding: 10px;
              background: #e0f0e0;
            }
            #sessionTimer {
              font-size: 18px;
              font-weight: bold;
              margin-top: 10px;
            }
            .quality-good { color: green; }
            .quality-medium { color: orange; }
            .quality-poor { color: red; }
            #heatmap {
              border: 1px solid #ccc;
              height: 150px;
              margin-top: 15px;
              position: relative;
            }
          </style>
        </head>
        <body>
          <h2>Extended Session Gaze Monitor</h2>
          <div id="sessionTimer">Session time: 00:00</div>
          <div id="stats">
            <div>Total points: <span id="pointCount">0</span></div>
            <div>Points per second: <span id="pointsPerSecond">0</span></div>
            <div>Last coordinates: <span id="lastCoords">None</span></div>
            <div>Resting state: <span id="restingState">No</span></div>
          </div>
          <div id="calibrationQuality">
            <h3>Calibration Quality</h3>
            <div>Overall quality: <span id="overallQuality" class="quality-medium">Unknown</span></div>
            <div>Last calibration: <span id="lastCalibration">Never</span></div>
            <div>Gaze variance: <span id="gazeVariance">0</span></div>
          </div>
          <div id="visualization"></div>
          <div id="heatmap"><div style="padding: 5px;">Gaze Heatmap</div></div>
          <div id="controls">
            <button id="exportBtn">Export Data (CSV)</button>
            <button id="clearBtn">Clear Visualization</button>
            <button id="recalibrateBtn">Suggest Recalibration</button>
          </div>
          <h3>Recent Data Points:</h3>
          <div id="log"></div>
          
          <script>
            // Setup event handlers
            document.getElementById('exportBtn').addEventListener('click', function() {
              if (!window.opener || !window.opener.allGazeData) {
                alert('No gaze data available');
                return;
              }
              
              const csvContent = "data:text/csv;charset=utf-8," + 
                "timestamp,x,y,inRestingState\\n" + 
                window.opener.allGazeData.map(p => 
                  p.timestamp + "," + 
                  p.x + "," + 
                  p.y + "," + 
                  (p.inRestingState ? "true" : "false")
                ).join("\\n");
              
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "extended_session_gaze_data_" + new Date().toISOString() + ".csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            });
            
            document.getElementById('clearBtn').addEventListener('click', function() {
              document.getElementById('visualization').innerHTML = "";
            });
            
            document.getElementById('recalibrateBtn').addEventListener('click', function() {
              if (window.opener && window.opener.suggestRecalibration) {
                window.opener.suggestRecalibration();
                alert('Recalibration suggestion sent to main window');
              } else {
                alert('Recalibration function not available');
              }
            });
            
            // Update session timer
            setInterval(function() {
              if (window.opener && window.opener.extendedSessionStartTime) {
                const elapsedMs = Date.now() - window.opener.extendedSessionStartTime;
                const seconds = Math.floor((elapsedMs / 1000) % 60);
                const minutes = Math.floor((elapsedMs / (1000 * 60)) % 60);
                const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
                
                document.getElementById('sessionTimer').textContent = 
                  'Session time: ' + 
                  (hours > 0 ? hours + ':' : '') + 
                  minutes.toString().padStart(2, '0') + ':' + 
                  seconds.toString().padStart(2, '0');
              }
            }, 1000);
          </script>
        </body>
        </html>
      `);
      
      window.gazeDebugWindow.document.close();
    }
    
    // Create a more robust gaze listener for extended sessions
    window.webgazer.setGazeListener(function(data, elapsedTime) {
      if (data == null) {
        // Track consecutive null readings for error detection
        if (window.consecutiveNullReadings !== undefined) {
          window.consecutiveNullReadings++;
          
          // If too many consecutive null readings, attempt recovery
          if (window.consecutiveNullReadings > window.maxConsecutiveNullReadings) {
            console.warn(`${window.consecutiveNullReadings} consecutive null readings detected, attempting recovery...`);
            recoverGazeTracking();
            window.consecutiveNullReadings = 0;
          }
        }
        return;
      }
      
      // Reset consecutive null counter since we got valid data
      window.consecutiveNullReadings = 0;
      
      // Update last gaze timestamp for monitoring
      window.lastGazeTimestamp = Date.now();
      
      // Increment sample counter
      window.gazeSampleCount++;
      
      // Store the data point with timestamp and extended metadata
      const dataPoint = {
        timestamp: Date.now(),
        x: data.x,
        y: data.y,
        elapsedTime: elapsedTime,
        eyeFeatures: data.eyeFeatures || null,
        inRestingState: window.passiveRestingState || false,
        trialIndex: psychoJS.experiment.thisN || -1,
        trialPhase: psychoJS.experiment.currentScheduler?.taskName || 'unknown'
      };
      
      // Add to our global array (with size limiting to prevent memory issues)
      window.allGazeData.push(dataPoint);
      if (window.allGazeData.length > 10000) {
        // Keep only the most recent 10,000 points in memory
        window.allGazeData = window.allGazeData.slice(-10000);
      }
      
      // Add to buffer for periodic export
      window.gazeDataBuffer.push(dataPoint);
      
      // Update gaze arrays for tracking
      if (window.xGazes && window.yGazes) {
        window.xGazes.shift();
        window.xGazes.push(data.x);
        window.yGazes.shift();
        window.yGazes.push(data.y);
      }
      
      // Export data if buffer gets too large or time interval has passed
      const timeSinceLastExport = Date.now() - window.lastExportTime;
      if (window.gazeDataBuffer.length > window.maxBufferSize || timeSinceLastExport > window.gazeExportInterval) {
        exportGazeData();
      }
      
      // Log to console periodically (every 100 points to avoid flooding)
      if (window.gazeSampleCount % 100 === 0) {
        console.log(`Gaze data collected: [${dataPoint.x.toFixed(2)}, ${dataPoint.y.toFixed(2)}] - Total: ${window.gazeSampleCount}`);
      }
      
      // Update the debug window if it exists and is open
      if (window.gazeDebugWindow && !window.gazeDebugWindow.closed) {
        try {
          const logElem = window.gazeDebugWindow.document.getElementById('log');
          const statsElem = window.gazeDebugWindow.document.getElementById('pointCount');
          const lastCoordsElem = window.gazeDebugWindow.document.getElementById('lastCoords');
          const vizElem = window.gazeDebugWindow.document.getElementById('visualization');
          const restingStateElem = window.gazeDebugWindow.document.getElementById('restingState');
          const pointsPerSecondElem = window.gazeDebugWindow.document.getElementById('pointsPerSecond');
          const qualityElem = window.gazeDebugWindow.document.getElementById('overallQuality');
          const lastCalibrationElem = window.gazeDebugWindow.document.getElementById('lastCalibration');
          const gazeVarianceElem = window.gazeDebugWindow.document.getElementById('gazeVariance');
          
          if (logElem && statsElem && lastCoordsElem) {
            // Update stats
            statsElem.textContent = window.gazeSampleCount;
            lastCoordsElem.textContent = `x: ${dataPoint.x.toFixed(2)}, y: ${dataPoint.y.toFixed(2)}`;
            
            // Calculate and update points per second
            if (window.extendedSessionStartTime) {
              const sessionDuration = (Date.now() - window.extendedSessionStartTime) / 1000;
              if (sessionDuration > 0) {
                const pointsPerSecond = (window.gazeSampleCount / sessionDuration).toFixed(2);
                pointsPerSecondElem.textContent = pointsPerSecond;
              }
            }
            
            // Update resting state indicator
            if (restingStateElem) {
              restingStateElem.textContent = window.passiveRestingState ? 'Yes (Passive)' : 'No (Active)';
              restingStateElem.style.color = window.passiveRestingState ? 'green' : 'blue';
            }
            
            // Update calibration quality indicators
            if (qualityElem && window.calibrationQuality !== undefined) {
              // Lower is better for calibration quality
              let qualityText = 'Unknown';
              let qualityClass = 'quality-medium';
              
              if (window.calibrationQuality < 50) {
                qualityText = 'Good';
                qualityClass = 'quality-good';
              } else if (window.calibrationQuality < 150) {
                qualityText = 'Medium';
                qualityClass = 'quality-medium';
              } else {
                qualityText = 'Poor';
                qualityClass = 'quality-poor';
              }
              
              qualityElem.textContent = qualityText;
              qualityElem.className = qualityClass;
            }
            
            // Update last calibration time
            if (lastCalibrationElem && window.lastCalibrationTime) {
              const timeSinceCalibration = Math.floor((Date.now() - window.lastCalibrationTime) / 1000);
              const minutes = Math.floor(timeSinceCalibration / 60);
              const seconds = timeSinceCalibration % 60;
              lastCalibrationElem.textContent = `${minutes}m ${seconds}s ago`;
            }
            
            // Calculate and display gaze variance
            if (gazeVarianceElem && window.xGazes && window.yGazes) {
              const xVariance = calculateStandardDeviation(window.xGazes);
              const yVariance = calculateStandardDeviation(window.yGazes);
              gazeVarianceElem.textContent = `x: ${xVariance.toFixed(2)}, y: ${yVariance.toFixed(2)}`;
            }
            
            // Add to log (limiting to last 50 entries)
            const entry = window.gazeDebugWindow.document.createElement('div');
            entry.textContent = `[${new Date(dataPoint.timestamp).toLocaleTimeString()}] x: ${dataPoint.x.toFixed(2)}, y: ${dataPoint.y.toFixed(2)}${dataPoint.inRestingState ? ' (resting)' : ''}`;
            logElem.appendChild(entry);
            
            // Keep only last 50 entries to prevent browser slowdown
            while (logElem.childNodes.length > 50) {
              logElem.removeChild(logElem.firstChild);
            }
            
            // Scroll to bottom
            logElem.scrollTop = logElem.scrollHeight;
            
            // Add point to visualization (every 10th point to avoid clutter)
            if (window.gazeSampleCount % 10 === 0 && vizElem) {
              const point = window.gazeDebugWindow.document.createElement('div');
              point.className = dataPoint.inRestingState ? 'point resting-point' : 'point';
              
              // Normalize to visualization area
              const vizWidth = vizElem.offsetWidth;
              const vizHeight = vizElem.offsetHeight;
              
              // Get screen dimensions
              const screenWidth = window.screen.width;
              const screenHeight = window.screen.height;
              
              // Normalize coordinates to visualization area
              const normalizedX = (dataPoint.x / screenWidth) * vizWidth;
              const normalizedY = (dataPoint.y / screenHeight) * vizHeight;
              
              point.style.left = `${normalizedX}px`;
              point.style.top = `${normalizedY}px`;
              vizElem.appendChild(point);
              
              // Limit visualization points
              while (vizElem.childNodes.length > 100) {
                vizElem.removeChild(vizElem.firstChild);
              }
            }
          }
        } catch (e) {
          console.error('Error updating gaze debug window:', e);
        }
      }
    });
    
    // Function to export gaze data to experiment data
    window.exportGazeData = function() {
      if (!window.gazeDataBuffer || window.gazeDataBuffer.length === 0) {
        return;
      }
      
      try {
        // Prepare batch data
        const batchData = {
          timestamp: Date.now(),
          sessionId: expInfo.participant + '_' + expInfo.session,
          frameRate: expInfo.frameRate,
          batchNumber: window.gazeDataChunks ? window.gazeDataChunks.length + 1 : 1,
          gazePoints: window.dataCompressionEnabled ? compressGazeData(window.gazeDataBuffer) : window.gazeDataBuffer,
          compressed: window.dataCompressionEnabled,
          bufferSize: window.gazeDataBuffer.length
        };
        
        // Add batch to experiment data with unique identifier
        const batchKey = 'gazeBatch_' + batchData.timestamp;
        psychoJS.experiment.addData(batchKey, JSON.stringify(batchData));
        
        // Store reference to exported chunk
        if (!window.gazeDataChunks) {
          window.gazeDataChunks = [];
        }
        window.gazeDataChunks.push({
          timestamp: batchData.timestamp,
          batchNumber: batchData.batchNumber,
          size: window.gazeDataBuffer.length
        });
        
        // Log export details
        console.log(`Exported gaze data batch #${batchData.batchNumber} at ${new Date(batchData.timestamp).toISOString()}: ${batchData.bufferSize} points`);
        
        // Clear buffer after successful export
        window.gazeDataBuffer = [];
        window.lastExportTime = Date.now();
        
        // Record export success in experiment data
        psychoJS.experiment.addData('gazeExportSuccess', true);
        psychoJS.experiment.addData('gazeExportTimestamp', batchData.timestamp);
        psychoJS.experiment.addData('gazeExportSize', batchData.bufferSize);
        
        return true;
      } catch (error) {
        // Handle export errors gracefully
        console.error('Error exporting gaze data:', error);
        psychoJS.experiment.addData('gazeExportError', error.message);
        
        // Attempt recovery by clearing buffer
        window.gazeDataBuffer = [];
        window.lastExportTime = Date.now();
        
        return false;
      }
    };
    
    // Set up periodic export timer
    window.gazeExportTimer = setInterval(() => {
      window.exportGazeData();
    }, window.gazeExportInterval);
    
    // Function to compress gaze data for more efficient storage
    function compressGazeData(gazeData) {
      if (!gazeData || gazeData.length === 0) return [];
      
      // Simple compression: store first timestamp and then deltas
      const compressed = [];
      let lastTimestamp = gazeData[0].timestamp;
      
      compressed.push({
        t: lastTimestamp,
        x: Math.round(gazeData[0].x),
        y: Math.round(gazeData[0].y),
        r: gazeData[0].inRestingState ? 1 : 0
      });
      
      for (let i = 1; i < gazeData.length; i++) {
        const point = gazeData[i];
        const timeDelta = point.timestamp - lastTimestamp;
        lastTimestamp = point.timestamp;
        
        compressed.push({
          d: timeDelta,
          x: Math.round(point.x),
          y: Math.round(point.y),
          r: point.inRestingState ? 1 : 0
        });
      }
      
      return compressed;
    }
    
    // Function to suggest recalibration
    window.suggestRecalibration = function() {
      console.log('Recalibration suggested by user');
      psychoJS.experiment.addData('userSuggestedRecalibration', true);
      psychoJS.experiment.addData('recalibrationTimestamp', Date.now());
      
      // Here you could implement logic to trigger recalibration
      // For now, we'll just log it
      alert('Recalibration suggested. This would trigger a recalibration sequence in a full implementation.');
    };
    
    console.log('Enhanced gaze logging initialized successfully for extended sessions');
  } else {
    console.error('WebGazer not available or setGazeListener method not found');
  }
}

async function quitPsychoJS(message, isCompleted) {
  // Check for and save orphaned data
  if (psychoJS.experiment.isEntryEmpty()) {
    psychoJS.experiment.nextEntry();
  }
  
  // Stop eye tracking and save final data
  if (window.webgazer) {
    try {
      // Add final eye tracking metrics to experiment data
      // Check if getStoredPoints is available on webgazer directly
      if (typeof window.webgazer.getStoredPoints === 'function') {
        const storedPoints = window.webgazer.getStoredPoints();
        psychoJS.experiment.addData('finalCalibrationScore', storedPoints.length);
        
        // Export all collected gaze data
        const gazeData = {
          timestamps: storedPoints.map(p => p.timestamp),
          xPositions: storedPoints.map(p => p.x),
          yPositions: storedPoints.map(p => p.y),
          eyeFeatures: storedPoints.map(p => p.eyeFeatures)
        };
        
        console.log('Saving gaze data...', gazeData);
        
        // Add data to PsychoJS experiment
        psychoJS.experiment.addData('gazeData', JSON.stringify(gazeData));
      } else {
        // If getStoredPoints is not available, use our fallback data
        console.warn('WebGazer getStoredPoints method not available - using fallback gaze data');
        
        if (window.allGazeData && window.allGazeData.length > 0) {
          // Export fallback collected gaze data
          const fallbackGazeData = {
            timestamps: window.allGazeData.map(p => p.timestamp),
            xPositions: window.allGazeData.map(p => p.x),
            yPositions: window.allGazeData.map(p => p.y),
            count: window.allGazeData.length
          };
          
          console.log(`Saving fallback gaze data (${window.allGazeData.length} points)...`);
          
          // Add fallback data to PsychoJS experiment
          psychoJS.experiment.addData('fallbackGazeData', JSON.stringify(fallbackGazeData));
          
          // Also try to save to a downloadable file if possible
          try {
            const csvContent = "data:text/csv;charset=utf-8," + 
              "timestamp,x,y\n" + 
              window.allGazeData.map(p => `${p.timestamp},${p.x},${p.y}`).join("\n");
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "gaze_data_fallback_" + new Date().toISOString() + ".csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Fallback gaze data CSV download initiated');
          } catch (downloadErr) {
            console.error('Failed to initiate fallback gaze data download:', downloadErr);
          }
        } else {
          console.error('No fallback gaze data available in window.allGazeData');
        }
      }
      
      // Pause webgazer
      if (typeof window.webgazer.pause === 'function') {
        window.webgazer.pause();
      }
      
    } catch (err) {
      console.error('Error saving WebGazer data:', err);
      
      // Try to save fallback data if primary method failed
      if (window.allGazeData && window.allGazeData.length > 0) {
        try {
          console.log(`Attempting to save fallback gaze data after error (${window.allGazeData.length} points)...`);
          
          // Create a simplified data structure
          const fallbackGazeData = {
            timestamps: window.allGazeData.map(p => p.timestamp),
            xPositions: window.allGazeData.map(p => p.x),
            yPositions: window.allGazeData.map(p => p.y),
            count: window.allGazeData.length
          };
          
          // Add fallback data to PsychoJS experiment
          psychoJS.experiment.addData('fallbackGazeData', JSON.stringify(fallbackGazeData));
          
          // Also try to save to a downloadable file
          const csvContent = "data:text/csv;charset=utf-8," + 
            "timestamp,x,y\n" + 
            window.allGazeData.map(p => `${p.timestamp},${p.x},${p.y}`).join("\n");
          
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "gaze_data_fallback_" + new Date().toISOString() + ".csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          console.log('Fallback gaze data CSV download initiated after error');
        } catch (fallbackErr) {
          console.error('Failed to save fallback gaze data after error:', fallbackErr);
        }
      }
    }
  }
  
  // Force data to be saved to server before closing
  try {
    await psychoJS.experiment.save();
    console.log('Experiment data successfully saved');
  } catch (error) {
    console.error('Failed to save experiment data:', error);
  }
  
  // End the experiment
  psychoJS.quit({message: message, isCompleted: isCompleted});
  
  // Additional cleanup for WebGazer if needed
  if (window.webgazer) {
    try {
      if (typeof window.webgazer.end === 'function') {
        window.webgazer.end();
        console.log('WebGazer session ended properly');
      }
    } catch (err) {
      console.error('Error ending WebGazer:', err);
    }
  }
  
  return Scheduler.Event.QUIT;
}

// Initialize eye tracking
async function initializeWebGazer() {
  // Add WebGazer.js  
  if (window.webgazer) {
    console.log('WebGazer already loaded, initializing...');
    try {
      console.log('Starting WebGazer...');
      
      // Enhanced configuration for better precision and extended sessions
      window.webgazer.params.showVideo = true;
      window.webgazer.params.showFaceOverlay = true;
      window.webgazer.params.showFaceFeedbackBox = true;
      window.webgazer.params.showGazeDot = false; // Will control this manually
      window.webgazer.params.camConstraints = { 
        video: { 
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          frameRate: { ideal: 30 }
        }
      };
      
      // Set up WebGazer with improved regression model and tracker
      await window.webgazer
        .setRegression('ridge') // Ridge regression for better accuracy
        .setTracker('TFFacemesh') // TensorFlow face mesh for better tracking
        .setGazeListener(function(data, timestamp) {
          // This is just a placeholder - our detailed listener will be set up later
          if (data == null) return;
          
          // Store eye gaze position with timestamp for better tracking
          window.currentGazeX = data.x;
          window.currentGazeY = data.y;
          window.lastGazeTimestamp = Date.now();
          
          // Track consecutive null readings for error detection
          window.consecutiveNullReadings = 0;
        })
        .begin();
      
      // Initialize extended session variables
      window.extendedSessionActive = false;
      window.sessionStartTime = Date.now();
      window.calibrationQuality = 0;
      window.lastCalibrationTime = 0;
      window.gazeSampleCount = 0;
      window.gazeDataBuffer = [];
      window.lastExportTime = Date.now();
      window.gazeExportInterval = 10000; // 10 seconds
      window.allGazeData = [];
      window.xGazes = Array(10).fill(0);
      window.yGazes = Array(10).fill(0);
      window.consecutiveNullReadings = 0;
      window.maxConsecutiveNullReadings = 30; // Threshold for error detection
      
      // Set up error detection and recovery
      window.gazeErrorCheckInterval = setInterval(function() {
        // Check if we're getting data
        const timeSinceLastGaze = Date.now() - window.lastGazeTimestamp;
        if (timeSinceLastGaze > 5000) { // 5 seconds without data
          console.warn('No gaze data received for 5 seconds, attempting recovery...');
          recoverGazeTracking();
        }
      }, 5000);
      
      // Start the robust fallback data logging system
      startGazeLogging();
      
      console.log('WebGazer initialized successfully');
      return true;
    } catch (err) {
      console.error('Failed to initialize WebGazer:', err);
      alert('Eye tracking failed to initialize: ' + err.message);
      return false;
    }
  } else {
    console.error('WebGazer not found. Make sure webgazer.js is loaded correctly.');
    return false;
  }
}

// Add recovery function for gaze tracking issues
function recoverGazeTracking() {
  if (!window.webgazer) return false;
  
  try {
    console.log('Attempting to recover gaze tracking...');
    
    // Pause tracking temporarily
    window.webgazer.pause();
    
    // Reset internal state
    window.consecutiveNullReadings = 0;
    
    // Resume with fresh state
    setTimeout(() => {
      window.webgazer.resume();
      console.log('Gaze tracking resumed after recovery attempt');
    }, 1000);
    
    return true;
  } catch (err) {
    console.error('Failed to recover gaze tracking:', err);
    return false;
  }
}