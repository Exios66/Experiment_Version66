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
let expName = 'demo_eye_tracking2';  // from the Builder filename that created this script
let expInfo = {'participant': '', 'session': '001'};

// Start code blocks for 'Before Experiment'
// init psychoJS:
const psychoJS = new PsychoJS({
  debug: true
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
    {'name': 'calibration_trials.xlsx', 'path': 'calibration_trials.xlsx'},
    {'name': 'webgazer-2.0.1.tp.js', 'path': 'webgazer-2.0.1.tp.js'}
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
function initializeEyetrackingRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //------Prepare to start Routine 'initializeEyetracking'-------
    t = 0;
    initializeEyetrackingClock.reset(); // clock
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // update component parameters for each repeat
    // Show webcam thumbnail and face feedback box, but not face overlay and gaze dot
    window.webgazer.params.showVideoPreview = true;
    window.webgazer.params.showFaceFeedbackBox = true;
    window.webgazer.params.showFaceOverlay = false;
    window.webgazer.params.showGazeDot = false
    
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
      trialList: 'calibration_trials.xlsx',
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
    routineTimer.add(3.500000);
    // update component parameters for each repeat
    // Position calibration_square using width and height of window
    var canvas = psychoJS.window.size;
    var scaling = [
      canvas[0] <= canvas[1]? 1: canvas[0] / canvas[1],
      canvas[1] <= canvas[0]? 1: canvas[1] / canvas[0]
    ];
    var newPos = [
        calibration_x * scaling[0],
        calibration_y * scaling[1]
    ];
    console.log(newPos);
    //calibration_square.setPos(newPos);
    callib_color = 'white';
    calibration_square.setPos([calibration_x, calibration_y]);
    // setup some python lists for storing info about the calibrationClick
    calibrationClick.clicked_name = [];
    gotValidClick = false; // until a click is received
    // keep track of which components have finished
    calibrationComponents = [];
    calibrationComponents.push(calibration_square);
    calibrationComponents.push(calibrationClick);
    
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
    // returns type error - checking fix 
    
    // Hide webcam thumbnail if eyes are in validation box
    if (webgazer.checkEyesInValidationBox() === true) {
      // If last time that eyes were outside of validation box was longer than 
      // window.eyesReturnedDelay ago, hide thumbnail
      if (
        document.getElementById('webgazerFaceFeedbackBox').style.display != 'none' &&
        (new Date).getTime() > window.eyesExitedTimestamp + window.eyesReturnedDelay
      ) {   
        document.getElementById('webgazerFaceFeedbackBox').style.display = 'none';
        document.getElementById('webgazerVideoFeed').style.display = 'none';
      }
    } else {
        // Eyes outside of validation box; show thumbnail
        window.eyesExitedTimestamp = (new Date).getTime();
        document.getElementById('webgazerFaceFeedbackBox').style.display = 'block';
        document.getElementById('webgazerVideoFeed').style.display = 'block';
    }
    
    
    if (
      document.getElementById('webgazerFaceFeedbackBox').style.display != 'none' &&
      (new Date).getTime() > window.eyesExitedTimestamp + window.eyesReturnedDelay
    ) {   
      document.getElementById('webgazerFaceFeedbackBox').style.display = 'none';
      document.getElementById('webgazerVideoFeed').style.display = 'none';
    }
    
    
    // *calibration_square* updates
    if (t >= 0.5 && calibration_square.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      calibration_square.tStart = t;  // (not accounting for frame time here)
      calibration_square.frameNStart = frameN;  // exact frame index
      
      calibration_square.setAutoDraw(true);
    }

    frameRemains = 0.5 + 3 - psychoJS.window.monitorFramePeriod * 0.75;  // most of one frame period left
    if (calibration_square.status === PsychoJS.Status.STARTED && t >= frameRemains) {
      calibration_square.setAutoDraw(false);
    }
    
    if (calibration_square.status === PsychoJS.Status.STARTED){ // only update if being drawn
      calibration_square.setFillColor(new util.Color(callib_color), false);
    }
    // *calibrationClick* updates
    if (t >= 0.5 && calibrationClick.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      calibrationClick.tStart = t;  // (not accounting for frame time here)
      calibrationClick.frameNStart = frameN;  // exact frame index
      
      calibrationClick.status = PsychoJS.Status.STARTED;
      calibrationClick.mouseClock.reset();
      prevButtonState = calibrationClick.getPressed();  // if button is down already this ISN'T a new click
      }
    frameRemains = 0.5 + 3 - psychoJS.window.monitorFramePeriod * 0.75;  // most of one frame period left
    if (calibrationClick.status === PsychoJS.Status.STARTED && t >= frameRemains) {
      calibrationClick.status = PsychoJS.Status.FINISHED;
  }
    if (calibrationClick.status === PsychoJS.Status.STARTED) {  // only update if started and not finished!
      _mouseButtons = calibrationClick.getPressed();
      if (!_mouseButtons.every( (e,i,) => (e == prevButtonState[i]) )) { // button state changed?
        prevButtonState = _mouseButtons;
        if (_mouseButtons.reduce( (e, acc) => (e+acc) ) > 0) { // state changed to a new click
          // check if the mouse was inside our 'clickable' objects
          gotValidClick = false;
          for (const obj of [calibration_square]) {
            if (obj.contains(calibrationClick)) {
              gotValidClick = true;
              calibrationClick.clicked_name.push(obj.name)
            }
          }
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
  };
}


function calibrationRoutineEnd() {
  return async function () {
    //------Ending Routine 'calibration'-------
    for (const thisComponent of calibrationComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    // store data for psychoJS.experiment (ExperimentHandler)
    _mouseXYs = calibrationClick.getPos();
    _mouseButtons = calibrationClick.getPressed();
    psychoJS.experiment.addData('calibrationClick.x', _mouseXYs[0]);
    psychoJS.experiment.addData('calibrationClick.y', _mouseXYs[1]);
    psychoJS.experiment.addData('calibrationClick.leftButton', _mouseButtons[0]);
    psychoJS.experiment.addData('calibrationClick.midButton', _mouseButtons[1]);
    psychoJS.experiment.addData('calibrationClick.rightButton', _mouseButtons[2]);
    if (calibrationClick.clicked_name.length > 0) {
      psychoJS.experiment.addData('calibrationClick.clicked_name', calibrationClick.clicked_name[0]);
    }
    
    // Store calibration point for analysis
    window.calibrationPoints.push({
      expected: [calibration_x, calibration_y],
      clicked: [_mouseXYs[0], _mouseXYs[1]],
      timestamp: Date.now()
    });
    
    // Calculate and store current calibration metrics
    if (window.calibrationPoints.length > 0) {
      // Calculate average error in x and y directions
      let totalErrorX = 0;
      let totalErrorY = 0;
      
      window.calibrationPoints.forEach(point => {
        totalErrorX += Math.abs(point.expected[0] - point.clicked[0]);
        totalErrorY += Math.abs(point.expected[1] - point.clicked[1]);
      });
      
      window.trackingAccuracy.x = totalErrorX / window.calibrationPoints.length;
      window.trackingAccuracy.y = totalErrorY / window.calibrationPoints.length;
      
      // Store current calibration quality
      psychoJS.experiment.addData('calibrationQuality_x', window.trackingAccuracy.x);
      psychoJS.experiment.addData('calibrationQuality_y', window.trackingAccuracy.y);
      psychoJS.experiment.addData('calibrationPointCount', window.calibrationPoints.length);
      
      console.log('Updated calibration quality metrics:', window.trackingAccuracy);
    }
    
    return Scheduler.Event.NEXT;
  };
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
    // update component parameters for each repeat
    tracking_resp.keys = undefined;
    tracking_resp.rt = undefined;
    _tracking_resp_allKeys = [];
    // Remove the click tracker used for calibration
    window.webgazer.removeMouseEventListeners();
    
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


function trackingTrialRoutineEachFrame() {
  return async function () {
    //------Loop for each frame of Routine 'trackingTrial'-------
    // get current time
    t = trackingTrialClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
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
      let theseKeys = tracking_resp.getKeys({keyList: ['space'], waitRelease: false});
      _tracking_resp_allKeys = _tracking_resp_allKeys.concat(theseKeys);
      if (_tracking_resp_allKeys.length > 0) {
        tracking_resp.keys = _tracking_resp_allKeys[_tracking_resp_allKeys.length - 1].name;  // just the last key pressed
        tracking_resp.rt = _tracking_resp_allKeys[_tracking_resp_allKeys.length - 1].rt;
        // a response ends the routine
        continueRoutine = false;
      }
    }
    
    // Manage webcam display based on eye position
    if (window.webgazer && window.webgazer.checkEyesInValidationBox) {
      // Handle eye position validation
      const eyesInBox = window.webgazer.checkEyesInValidationBox();
      
      if (eyesInBox === true) {
        // If eyes are in validation box
        if (
          document.getElementById('webgazerFaceFeedbackBox') && 
          document.getElementById('webgazerFaceFeedbackBox').style.display !== 'none' &&
          (Date.now() > window.eyesExitedTimestamp + window.eyesReturnedDelay)
        ) {   
          // Hide webcam elements after delay
          if (document.getElementById('webgazerFaceFeedbackBox')) {
            document.getElementById('webgazerFaceFeedbackBox').style.display = 'none';
          }
          if (document.getElementById('webgazerVideoFeed')) {
            document.getElementById('webgazerVideoFeed').style.display = 'none';
          }
          
          // Record when we hid the webcam
          psychoJS.experiment.addData('webcamHidden', Date.now());
        }
      } else {
        // Eyes outside of validation box; show webcam elements and record timestamp
        window.eyesExitedTimestamp = Date.now();
        
        if (document.getElementById('webgazerFaceFeedbackBox')) {
          document.getElementById('webgazerFaceFeedbackBox').style.display = 'block';
        }
        if (document.getElementById('webgazerVideoFeed')) {
          document.getElementById('webgazerVideoFeed').style.display = 'block';
        }
        
        // Record that eyes exited validation box
        psychoJS.experiment.addData('eyesExitedBox', Date.now());
      }
    }
    
    // Update tracking square with smoothed gaze position
    if (window.xGazes && window.yGazes) {
      // Calculate weighted average with more weight on recent gaze points
      const weights = window.xGazes.map((_, i) => i + 1);  // 1, 2, 3, ...
      const weightSum = weights.reduce((a, b) => a + b, 0);
      
      let weightedX = 0;
      let weightedY = 0;
      
      for (let i = 0; i < window.xGazes.length; i++) {
        weightedX += window.xGazes[i] * weights[i];
        weightedY += window.yGazes[i] * weights[i];
      }
      
      // Normalize by weight sum
      let x = weightedX / weightSum;
      let y = weightedY / weightSum;
      
      // Set tracking square to weighted x and y, transformed to height units
      tracking_square.setPos(
        util.to_height(
          [
            x - psychoJS.window.size[0] / 2,
            -1 * (y - psychoJS.window.size[1] / 2)
          ], 
          'pix', 
          psychoJS.window
        )
      );
      
      // Change square color based on confidence in gaze tracking
      const xVariance = calculateVariance(window.xGazes);
      const yVariance = calculateVariance(window.yGazes);
      const totalVariance = xVariance + yVariance;
      
      // Change color based on variance (more variance = less confident = more red)
      const varianceThreshold = 10000; // Adjust based on your needs
      const confidenceRatio = Math.min(1, totalVariance / varianceThreshold);
      const red = confidenceRatio;
      const green = 1 - confidenceRatio;
      const blue = 0;
      
      tracking_square.setFillColor(new util.Color([red, green, blue]));
      
      // Record current gaze position and confidence for this frame
      psychoJS.experiment.addData('currentGazeX', x);
      psychoJS.experiment.addData('currentGazeY', y);
      psychoJS.experiment.addData('gazeConfidence', 1 - confidenceRatio);
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
  };
}

// Helper function to calculate variance
function calculateVariance(array) {
  const mean = array.reduce((a, b) => a + b, 0) / array.length;
  return array.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / array.length;
}

function trackingTrialRoutineEnd() {
  return async function () {
    //------Ending Routine 'trackingTrial'-------
    for (const thisComponent of trackingTrialComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    psychoJS.experiment.addData('tracking_resp.keys', tracking_resp.keys);
    if (typeof tracking_resp.keys !== 'undefined') {  // we had a response
        psychoJS.experiment.addData('tracking_resp.rt', tracking_resp.rt);
        routineTimer.reset();
    }
    
    tracking_resp.stop();
    
    // Save tracking session summary data
    if (window.gazeDataBuffer && window.gazeDataBuffer.length > 0) {
      // Force an immediate export of any remaining gaze data
      const batchData = {
        timestamp: Date.now(),
        gazePoints: window.gazeDataBuffer,
        isFinal: true
      };
      psychoJS.experiment.addData('finalGazeBatch', JSON.stringify(batchData));
      
      // Clear buffer after export
      window.gazeDataBuffer = [];
      console.log('Exported final gaze data batch');
    }
    
    // Calculate and store tracking session metrics
    if (window.trackingAccuracy) {
      // Final calibration accuracy
      psychoJS.experiment.addData('finalCalibrationAccuracy_x', window.trackingAccuracy.x);
      psychoJS.experiment.addData('finalCalibrationAccuracy_y', window.trackingAccuracy.y);
    }
    
    // Add summary of tracking trial
    const summary = {
      duration: trackingTrialClock.getTime(),
      pointCount: window.calibrationPoints ? window.calibrationPoints.length : 0,
      userResponse: tracking_resp.keys,
      responseTime: tracking_resp.rt
    };
    
    psychoJS.experiment.addData('trackingTrialSummary', JSON.stringify(summary));
    
    try {
      // Save data to server after trial is complete
      await psychoJS.experiment.save();
      console.log('Trial data successfully saved to server');
    } catch (error) {
      console.error('Failed to save trial data:', error);
    }
    
    // the Routine "trackingTrial" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    return Scheduler.Event.NEXT;
  };
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
    psychoJS.importAttributes(currentLoop.getCurrentTrial());
    return Scheduler.Event.NEXT;
    };
}


async function quitPsychoJS(message, isCompleted) {
  // Check for and save orphaned data
  if (psychoJS.experiment.isEntryEmpty()) {
    psychoJS.experiment.nextEntry();
  }
  
  // Stop eye tracking and save final data
  if (window.webgazer) {
    // Add final eye tracking metrics to experiment data
    psychoJS.experiment.addData('finalCalibrationScore', window.webgazer.getTracker().getStoredPoints().length);
    
    // Export all collected gaze data
    const gazeData = {
      timestamps: window.webgazer.getStoredPoints().map(p => p.timestamp),
      xPositions: window.webgazer.getStoredPoints().map(p => p.x),
      yPositions: window.webgazer.getStoredPoints().map(p => p.y),
      eyeFeatures: window.webgazer.getStoredPoints().map(p => p.eyeFeatures)
    };
    
    // Add all collected gaze data to experiment data
    psychoJS.experiment.addData('completeGazeData', JSON.stringify(gazeData));
    
    // Calculate and store summary statistics
    const xMean = gazeData.xPositions.reduce((a, b) => a + b, 0) / gazeData.xPositions.length;
    const yMean = gazeData.yPositions.reduce((a, b) => a + b, 0) / gazeData.yPositions.length;
    psychoJS.experiment.addData('meanGazeX', xMean);
    psychoJS.experiment.addData('meanGazeY', yMean);
    
    // Properly end webgazer session
    window.webgazer.end();
    console.log('Eye tracking session ended and data saved');
  }
  
  // Force data to be saved to server before closing
  try {
    await psychoJS.experiment.save();
    console.log('Experiment data successfully saved');
  } catch (error) {
    console.error('Failed to save experiment data:', error);
  }
  
  // Clean up and close window
  psychoJS.window.close();
  psychoJS.quit({message: message, isCompleted: isCompleted});
  
  return Scheduler.Event.QUIT;
}