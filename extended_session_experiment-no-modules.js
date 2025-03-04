/*************************** 
 * Demo_Eye_Tracking2 Test *
 ***************************/

// Store info about the experiment session
let expName = 'extended_session_experiment';
let expInfo = {'participant': '', 'session': '001'};

// Access debug helpers safely
function debug(message) {
  console.log(message);
  if (typeof window.addDebugMessage === 'function') {
    try {
      window.addDebugMessage('EXP: ' + message);
    } catch (e) {
      // Silent fail
    }
  }
}

// Safe error reporting
function reportError(message, error) {
  const errorMsg = message + (error ? ': ' + (error.message || String(error)) : '');
  console.error(errorMsg);
  
  if (typeof window.showError === 'function') {
    try {
      window.showError(errorMsg);
    } catch (e) {
      // Fallback to basic alert if showError fails
      alert('Error: ' + errorMsg);
    }
  }
}

// Initialize experiment
debug('Experiment script starting');

try {
  // Basic math helpers
  const { abs, sin, cos, PI: pi, sqrt } = Math;
  const round = function(num) {
    return Math.round(num * 1000) / 1000;
  };
  
  // Check for jQuery
  if (typeof window.jQuery === 'undefined') {
    reportError('jQuery is not loaded');
    throw new Error('jQuery dependency missing');
  }
  
  // Check for PsychoJS
  if (typeof window.psychoJS === 'undefined') {
    reportError('PsychoJS is not loaded');
    throw new Error('PsychoJS dependency missing');
  }
  
  const { PsychoJS } = window.psychoJS.core;
  const { TrialHandler } = window.psychoJS.data;
  const { Scheduler } = window.psychoJS.util;
  const { core, data, sound, util, visual } = window.psychoJS;

  // Start the experiment
  const psychoJS = new PsychoJS({
    debug: true,
    pavlovia: { 
      URL: 'https://pavlovia.org',
      gitlabURL: 'https://gitlab.pavlovia.org'
    },
    collectIP: false,
    topLevelStatus: true
  });

  // Open window
  psychoJS.openWindow({
    fullscr: true,
    color: new util.Color([(- 1), (- 1), (- 1)]),
    units: 'height',
    waitBlanking: true
  });

  // Schedule the experiment
  psychoJS.schedule(psychoJS.gui.DlgFromDict({
    dictionary: expInfo,
    title: expName
  }));

  const flowScheduler = new Scheduler(psychoJS);
  const dialogCancelScheduler = new Scheduler(psychoJS);
  psychoJS.scheduleCondition(function() { return (psychoJS.gui.dialogComponent.button === 'OK'); }, flowScheduler, dialogCancelScheduler);

  // Main experiment flow - import the rest of the functionality from the main experiment
  debug('Main experiment flow starting');
  
  // Setup the experimental flow
  flowScheduler.add(function() {
    debug('Initializing experiment...');
    return setupExperiment(psychoJS, expInfo);
  });
  
  // Add main experiment routines
  flowScheduler.add(instructionsRoutineBegin);
  flowScheduler.add(instructionsRoutineEachFrame);
  flowScheduler.add(instructionsRoutineEnd);
  
  // Add calibration routine
  flowScheduler.add(calibrationRoutineBegin);
  flowScheduler.add(calibrationRoutineEachFrame);
  flowScheduler.add(calibrationRoutineEnd);
  
  // Add tracking trial routine
  const trackingLoopScheduler = new Scheduler(psychoJS);
  flowScheduler.add(trackingLoopBegin, trackingLoopScheduler);
  flowScheduler.add(trackingLoopScheduler);
  flowScheduler.add(trackingLoopEnd);
  
  // Add tracking trial components
  trackingLoopScheduler.add(trackingTrialRoutineBegin);
  trackingLoopScheduler.add(trackingTrialRoutineEachFrame);
  trackingLoopScheduler.add(trackingTrialRoutineEnd);
  
  // Add end routine
  flowScheduler.add(endRoutineBegin);
  flowScheduler.add(endRoutineEachFrame);
  flowScheduler.add(endRoutineEnd);
  
  // Add completion routine
  flowScheduler.add(function() {
    debug('Experiment complete');
    psychoJS.experiment.nextEntry();
    return Scheduler.Event.NEXT;
  });
  
  // Add quit routine
  flowScheduler.add(quitPsychoJS, '', true);
  
  dialogCancelScheduler.add(function() {
    psychoJS.quit('The experiment was cancelled.');
  });
  
  // Start the experiment
  psychoJS.start();
  
} catch (error) {
  reportError('Failed to start experiment', error);
} 

// Helper function to calculate variance
function calculateVariance(array) {
  const mean = array.reduce((a, b) => a + b, 0) / array.length;
  return array.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / array.length;
}

// Setup experiment components
function setupExperiment(psychoJS, expInfo) {
  // Initialize components for Routine "instructions"
  const instructionsClock = new util.Clock();
  const instructionsText = new visual.TextStim({
    win: psychoJS.window,
    name: 'instructionsText',
    text: 'Welcome to the extended eye tracking session.\n\nYou will be asked to follow points on the screen with your eyes.\n\nPress SPACE to begin.',
    font: 'Arial',
    units: 'height', 
    pos: [0, 0], height: 0.05,
    wrapWidth: undefined, ori: 0,
    color: new util.Color('white'),
    opacity: 1,
    depth: 0.0 
  });
  
  const instructionsResp = new core.Keyboard({psychoJS: psychoJS, clock: instructionsClock, waitForStart: true});
  
  // Initialize components for Routine "calibration"
  const calibrationClock = new util.Clock();
  const calibrationText = new visual.TextStim({
    win: psychoJS.window,
    name: 'calibrationText',
    text: 'Calibrating eye tracker...\n\nPlease follow the dot with your eyes.',
    font: 'Arial',
    units: 'height', 
    pos: [0, 0], height: 0.05,
    wrapWidth: undefined, ori: 0,
    color: new util.Color('white'),
    opacity: 1,
    depth: 0.0 
  });
  
  const calibrationDot = new visual.Polygon({
    win: psychoJS.window,
    name: 'calibrationDot',
    edges: 32, size: [0.03, 0.03],
    ori: 0, pos: [0, 0],
    lineWidth: 1, lineColor: new util.Color([1, 1, 1]),
    fillColor: new util.Color([1, 0, 0]),
    opacity: 1, depth: -1.0, interpolate: true,
  });
  
  // Initialize components for Routine "trackingTrial"
  const trackingTrialClock = new util.Clock();
  const trackingTarget = new visual.Polygon({
    win: psychoJS.window,
    name: 'trackingTarget',
    edges: 32, size: [0.03, 0.03],
    ori: 0, pos: [0, 0],
    lineWidth: 1, lineColor: new util.Color([1, 1, 1]),
    fillColor: new util.Color([0, 1, 0]),
    opacity: 1, depth: 0.0, interpolate: true,
  });
  
  const tracking_resp = new core.Keyboard({psychoJS: psychoJS, clock: trackingTrialClock, waitForStart: true});
  
  // Initialize components for Routine "end"
  const endClock = new util.Clock();
  const endText = new visual.TextStim({
    win: psychoJS.window,
    name: 'endText',
    text: 'Thank you for participating!\n\nYour data has been saved.\n\nPress SPACE to exit.',
    font: 'Arial',
    units: 'height', 
    pos: [0, 0], height: 0.05,
    wrapWidth: undefined, ori: 0,
    color: new util.Color('white'),
    opacity: 1,
    depth: 0.0 
  });
  
  const endResp = new core.Keyboard({psychoJS: psychoJS, clock: endClock, waitForStart: true});
  
  // Initialize global variables for eye tracking
  window.gazeDataBuffer = [];
  window.calibrationPoints = [];
  window.trackingAccuracy = { x: 0, y: 0 };
  
  // Return to continue flow
  return Scheduler.Event.NEXT;
}

// Instructions Routine
function instructionsRoutineBegin() {
  return async function() {
    //------Prepare to start Routine 'instructions'-------
    instructionsText.setAutoDraw(true);
    instructionsResp.keys = undefined;
    instructionsResp.rt = undefined;
    instructionsResp.start();
    return Scheduler.Event.NEXT;
  };
}

function instructionsRoutineEachFrame() {
  return async function() {
    //------Loop for each frame of Routine 'instructions'-------
    let continueRoutine = true;
    
    // Get latest keyboard presses
    if (instructionsResp.status === PsychoJS.Status.STARTED) {
      let theseKeys = instructionsResp.getKeys({keyList: ['space'], waitRelease: false});
      if (theseKeys.length > 0) {
        instructionsResp.keys = theseKeys[0].name;
        instructionsResp.rt = theseKeys[0].rt;
        continueRoutine = false;
      }
    }
    
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function instructionsRoutineEnd() {
  return async function() {
    //------Ending Routine 'instructions'-------
    instructionsText.setAutoDraw(false);
    instructionsResp.stop();
    return Scheduler.Event.NEXT;
  };
}

// Calibration Routine
function calibrationRoutineBegin() {
  return async function() {
    //------Prepare to start Routine 'calibration'-------
    calibrationText.setAutoDraw(true);
    calibrationDot.setAutoDraw(true);
    
    // Initialize calibration points
    window.calibrationPoints = [
      {x: 0, y: 0},
      {x: -0.4, y: 0.4},
      {x: 0.4, y: 0.4},
      {x: -0.4, y: -0.4},
      {x: 0.4, y: -0.4}
    ];
    
    // Set initial position
    calibrationDot.setPos([window.calibrationPoints[0].x, window.calibrationPoints[0].y]);
    
    // Start calibration timer
    window.calibrationIndex = 0;
    window.calibrationTimer = new util.Clock();
    
    return Scheduler.Event.NEXT;
  };
}

function calibrationRoutineEachFrame() {
  return async function() {
    //------Loop for each frame of Routine 'calibration'-------
    let continueRoutine = true;
    
    // Update dot position every 2 seconds
    if (window.calibrationTimer.getTime() > 2) {
      window.calibrationIndex++;
      window.calibrationTimer.reset();
      
      if (window.calibrationIndex < window.calibrationPoints.length) {
        const point = window.calibrationPoints[window.calibrationIndex];
        calibrationDot.setPos([point.x, point.y]);
      } else {
        // End calibration when all points are done
        continueRoutine = false;
        
        // Set simulated accuracy for demo
        window.trackingAccuracy = { x: 0.02, y: 0.03 };
      }
    }
    
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function calibrationRoutineEnd() {
  return async function() {
    //------Ending Routine 'calibration'-------
    calibrationText.setAutoDraw(false);
    calibrationDot.setAutoDraw(false);
    
    // Store calibration results
    psychoJS.experiment.addData('calibrationAccuracy_x', window.trackingAccuracy.x);
    psychoJS.experiment.addData('calibrationAccuracy_y', window.trackingAccuracy.y);
    
    return Scheduler.Event.NEXT;
  };
}

// Tracking Loop
function trackingLoopBegin(trackingLoopScheduler) {
  return async function() {
    //------Prepare to start Routine 'trackingLoop'-------
    const trackingLoopCount = 3; // Number of tracking trials
    
    // Set up tracking loop
    const trackingLoop = new TrialHandler({
      psychoJS: psychoJS,
      nReps: trackingLoopCount,
      method: TrialHandler.Method.RANDOM,
      extraInfo: expInfo,
      originPath: undefined,
      trialList: undefined,
      seed: undefined,
      name: 'trackingLoop'
    });
    psychoJS.experiment.addLoop(trackingLoop);
    
    // Schedule all the trials in the loop
    for (const thisTrial of trackingLoop) {
      trackingLoopScheduler.add(function() {
        return trackingLoop.currentTrial;
      });
      
      trackingLoopScheduler.add(trackingTrialRoutineBegin);
      trackingLoopScheduler.add(trackingTrialRoutineEachFrame);
      trackingLoopScheduler.add(trackingTrialRoutineEnd);
      
      trackingLoopScheduler.add(endLoopIteration(trackingLoopScheduler, trackingLoop));
    }
    
    return Scheduler.Event.NEXT;
  };
}

function trackingLoopEnd() {
  return async function() {
    //------Ending Routine 'trackingLoop'-------
    psychoJS.experiment.removeLoop(trackingLoop);
    return Scheduler.Event.NEXT;
  };
}

// Tracking Trial Routine
function trackingTrialRoutineBegin() {
  return async function() {
    //------Prepare to start Routine 'trackingTrial'-------
    trackingTrialClock.reset();
    trackingTarget.setAutoDraw(true);
    tracking_resp.keys = undefined;
    tracking_resp.rt = undefined;
    tracking_resp.start();
    
    // Initialize tracking path
    window.trackingPath = [];
    for (let i = 0; i < 100; i++) {
      window.trackingPath.push({
        x: 0.4 * Math.sin(i / 10),
        y: 0.3 * Math.cos(i / 8)
      });
    }
    
    window.trackingIndex = 0;
    window.trackingTimer = new util.Clock();
    
    return Scheduler.Event.NEXT;
  };
}

function trackingTrialRoutineEachFrame() {
  return async function() {
    //------Loop for each frame of Routine 'trackingTrial'-------
    let continueRoutine = true;
    
    // Move target along path
    if (window.trackingTimer.getTime() > 0.05) {
      window.trackingIndex = (window.trackingIndex + 1) % window.trackingPath.length;
      window.trackingTimer.reset();
      
      const point = window.trackingPath[window.trackingIndex];
      trackingTarget.setPos([point.x, point.y]);
      
      // Simulate gaze data collection
      if (window.gazeDataBuffer) {
        window.gazeDataBuffer.push({
          timestamp: Date.now(),
          x: point.x + (Math.random() - 0.5) * 0.05,
          y: point.y + (Math.random() - 0.5) * 0.05
        });
      }
    }
    
    // End routine after 10 seconds or on space press
    if (trackingTrialClock.getTime() > 10) {
      continueRoutine = false;
    }
    
    // Get latest keyboard presses
    if (tracking_resp.status === PsychoJS.Status.STARTED) {
      let theseKeys = tracking_resp.getKeys({keyList: ['space'], waitRelease: false});
      if (theseKeys.length > 0) {
        tracking_resp.keys = theseKeys[0].name;
        tracking_resp.rt = theseKeys[0].rt;
        continueRoutine = false;
      }
    }
    
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function trackingTrialRoutineEnd() {
  return async function() {
    //------Ending Routine 'trackingTrial'-------
    trackingTarget.setAutoDraw(false);
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
    
    return Scheduler.Event.NEXT;
  };
}

// End Routine
function endRoutineBegin() {
  return async function() {
    //------Prepare to start Routine 'end'-------
    endText.setAutoDraw(true);
    endResp.keys = undefined;
    endResp.rt = undefined;
    endResp.start();
    return Scheduler.Event.NEXT;
  };
}

function endRoutineEachFrame() {
  return async function() {
    //------Loop for each frame of Routine 'end'-------
    let continueRoutine = true;
    
    // Get latest keyboard presses
    if (endResp.status === PsychoJS.Status.STARTED) {
      let theseKeys = endResp.getKeys({keyList: ['space'], waitRelease: false});
      if (theseKeys.length > 0) {
        endResp.keys = theseKeys[0].name;
        endResp.rt = theseKeys[0].rt;
        continueRoutine = false;
      }
    }
    
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function endRoutineEnd() {
  return async function() {
    //------Ending Routine 'end'-------
    endText.setAutoDraw(false);
    endResp.stop();
    return Scheduler.Event.NEXT;
  };
}

function endLoopIteration(scheduler, snapshot) {
  // ------Prepare for next entry------
  return async function() {
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
    }
    return Scheduler.Event.NEXT;
  };
}

function quitPsychoJS(message, isCompleted) {
  // Function to quit the experiment
  psychoJS.window.close();
  psychoJS.quit({message: message, isCompleted: isCompleted});
  
  return Scheduler.Event.QUIT;
}