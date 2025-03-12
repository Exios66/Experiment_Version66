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

// Add after the imports but before the experiment info:

// Check for WebGL support and capabilities
function checkWebGLSupport() {
  try {
    // Try to create a WebGL context
    const canvas = document.createElement('canvas');
    let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.error('WebGL not supported by this browser.');
      return { supported: false, message: 'WebGL not supported by this browser.' };
    }
    
    // Check for compressed texture support
    const compressedTexturesSupported = gl.getExtension('WEBGL_compressed_texture_s3tc') 
      || gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc')
      || gl.getExtension('MOZ_WEBGL_compressed_texture_s3tc');
    
    if (!compressedTexturesSupported) {
      console.warn('WebGL compressed textures not supported. Using fallback rendering.');
      return { 
        supported: true, 
        compressedTextures: false,
        message: 'WebGL supported, but compressed textures are not available. Using fallback rendering.'
      };
    }
    
    return { 
      supported: true,
      compressedTextures: true,
      message: 'Full WebGL support including compressed textures.'
    };
  } catch (e) {
    console.error('Error checking WebGL support:', e);
    return { supported: false, message: 'Error checking WebGL support: ' + e.message };
  }
}

// Store WebGL support info globally
window.webGLInfo = checkWebGLSupport();

// Create a helper function for creating visual components with appropriate fallback options
function createVisualComponent(componentType, options) {
  // Apply WebGL-specific fallbacks if needed
  if (window.webGLInfo && !window.webGLInfo.compressedTextures) {
    // For text components, use simpler rendering
    if (componentType === visual.TextStim) {
      options.wrapWidth = options.wrapWidth || 0.8; // Ensure text wrapping is reasonable
      options.contrast = 1; // Maximize contrast for better visibility
    }
    
    // For shape components like Rect, use simpler rendering
    if (componentType === visual.Rect) {
      options.interpolate = false; // Disable interpolation which might use compressed textures
    }
    
    // For all components, ensure opacity is defined
    if (options.opacity === undefined) {
      options.opacity = 1;
    }
    
    console.log(`Creating ${componentType.name} with WebGL fallback options`);
  }
  
  // Create and return the component
  return new componentType(options);
}

// Display WebGL support status to user
if (!window.webGLInfo.supported) {
  // Create a warning notification if WebGL is not supported at all
  const notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.top = '10px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.backgroundColor = '#ff9800';
  notification.style.color = 'white';
  notification.style.padding = '15px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '9999';
  notification.style.maxWidth = '80%';
  notification.style.textAlign = 'center';
  notification.innerHTML = `
    <strong>WebGL Support Issue</strong>
    <p>${window.webGLInfo.message}</p>
    <p>The experiment may not display graphics correctly. Try using an updated browser or enabling hardware acceleration.</p>
  `;
  
  // Add the notification when the document is ready
  if (document.body) {
    document.body.appendChild(notification);
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(notification);
    });
  }
} else if (!window.webGLInfo.compressedTextures) {
  console.log('Using fallback rendering mode due to limited WebGL support');
}

// store info about the experiment session:
let expName = 'extended_session_experiment';  // from the Builder filename that created this script
let expInfo = {
  'participant': '', 
  'session': '001',
  'screen_resolution': '1920x1080',
  'webcam': 'Default'
};

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

// Configure options based on WebGL capabilities
const windowOptions = {
  fullscr: true,
  color: new util.Color([(- 1), (- 1), (- 1)]), // black background
  units: 'height',
  waitBlanking: true
};

// Add WebGL-specific options based on detected capabilities
if (window.webGLInfo && !window.webGLInfo.compressedTextures) {
  // If compressed textures aren't supported, use fallback rendering
  windowOptions.useRetina = false; // Disable retina support which may rely on compressed textures
  windowOptions.antialias = true; // Enable antialiasing as a quality fallback
  
  // Log the adjusted configuration
  console.log('Adjusting rendering options for limited WebGL support:', windowOptions);
}

// open window with appropriate options:
try {
  psychoJS.openWindow(windowOptions);
  console.log('Window opened successfully with options:', windowOptions);
} catch (err) {
  console.error('Failed to open experiment window:', err);
  // Create a error notification
  const errorNotification = document.createElement('div');
  errorNotification.style.position = 'fixed';
  errorNotification.style.top = '50%';
  errorNotification.style.left = '50%';
  errorNotification.style.transform = 'translate(-50%, -50%)';
  errorNotification.style.backgroundColor = '#f44336';
  errorNotification.style.color = 'white';
  errorNotification.style.padding = '20px';
  errorNotification.style.borderRadius = '5px';
  errorNotification.style.zIndex = '10000';
  errorNotification.style.textAlign = 'center';
  errorNotification.innerHTML = `
    <h3 style="margin-top: 0;">Failed to Start Experiment</h3>
    <p>Error: ${err.message}</p>
    <p>This may be due to graphics capability issues with your browser.</p>
    <button onclick="location.reload()" style="background: white; color: #f44336; border: none; padding: 8px 15px; cursor: pointer; border-radius: 3px; margin-top: 10px;">Retry</button>
  `;
  document.body.appendChild(errorNotification);
}
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

  // Get actual screen resolution
  const actualWidth = window.screen.width;
  const actualHeight = window.screen.height;
  const actualResolution = `${actualWidth}x${actualHeight}`;
  
  // Update default resolution if we can detect it
  if (actualWidth > 0 && actualHeight > 0) {
    expInfo['screen_resolution'] = actualResolution;
  }
  
  // Populate webcam options before showing dialog
  try {
    // Get list of available video devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    // Create webcam options object for the dialog
    if (videoDevices.length > 0) {
      // Create a dictionary of webcam options
      const webcamOptions = {};
      webcamOptions['Default'] = 'Default';
      
      videoDevices.forEach((device, index) => {
        const label = device.label || `Camera ${index + 1}`;
        webcamOptions[device.deviceId] = label;
      });
      
      // Add webcam options to experiment info
      expInfo['webcam'] = {
        options: webcamOptions,
        selected: 'Default'
      };
      
      console.log('Available webcams:', webcamOptions);
    }
  } catch (err) {
    console.error('Error enumerating video devices:', err);
  }

  // store frame rate of monitor if we can measure it successfully
  expInfo['frameRate'] = psychoJS.window.getActualFrameRate();
  if (typeof expInfo['frameRate'] !== 'undefined')
    frameDur = 1.0 / Math.round(expInfo['frameRate']);
  else
    frameDur = 1.0 / 60.0; // couldn't get a reliable measure so guess

  // Parse screen resolution after dialog
  if (typeof expInfo['screen_resolution'] === 'string') {
    const parts = expInfo['screen_resolution'].split('x');
    if (parts.length === 2) {
      window.screenWidth = parseInt(parts[0], 10) || actualWidth;
      window.screenHeight = parseInt(parts[1], 10) || actualHeight;
    } else {
      window.screenWidth = actualWidth;
      window.screenHeight = actualHeight;
    }
  } else {
    window.screenWidth = actualWidth;
    window.screenHeight = actualHeight;
  }
  
  // Store resolution in experiment data
  psychoJS.experiment.addData('screenWidth', window.screenWidth);
  psychoJS.experiment.addData('screenHeight', window.screenHeight);
  psychoJS.experiment.addData('actualScreenWidth', actualWidth);
  psychoJS.experiment.addData('actualScreenHeight', actualHeight);
  
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
var calibrationDot;
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
    
    // Calculate width and height of calibration area
    const width = maxX - minX;
    const height = maxY - minY;
    
    // Ensure we have a reasonable calibration area
    if (width < 0.1 || height < 0.1) {
      console.warn('Calibration area is too small, using default screen dimensions');
      
      // Use full screen dimensions as fallback
      minX = -1;
      maxX = 1;
      minY = -1;
      maxY = 1;
    }
    
    // Calculate scaling factors to map to full screen
    const screenAspectRatio = window.screenWidth / window.screenHeight;
    const calibrationAspectRatio = width / height;
    
    // Adjust calibration area to match screen aspect ratio if needed
    let adjustedMinX = minX;
    let adjustedMaxX = maxX;
    let adjustedMinY = minY;
    let adjustedMaxY = maxY;
    
    if (Math.abs(screenAspectRatio - calibrationAspectRatio) > 0.1) {
      console.log('Adjusting calibration area to match screen aspect ratio');
      
      if (screenAspectRatio > calibrationAspectRatio) {
        // Screen is wider than calibration area, expand horizontally
        const targetWidth = height * screenAspectRatio;
        const widthDiff = targetWidth - width;
        adjustedMinX = minX - (widthDiff / 2);
        adjustedMaxX = maxX + (widthDiff / 2);
      } else {
        // Screen is taller than calibration area, expand vertically
        const targetHeight = width / screenAspectRatio;
        const heightDiff = targetHeight - height;
        adjustedMinY = minY - (heightDiff / 2);
        adjustedMaxY = maxY + (heightDiff / 2);
      }
    }
    
    // Construct the coordinate plane with adjusted dimensions
    window.screenCoordinatePlane = {
      initialized: true,
      topLeft: { x: adjustedMinX, y: adjustedMaxY },
      topRight: { x: adjustedMaxX, y: adjustedMaxY },
      bottomLeft: { x: adjustedMinX, y: adjustedMinY },
      bottomRight: { x: adjustedMaxX, y: adjustedMinY },
      centerPoint: { x: sumX / window.calibrationPoints.length, y: sumY / window.calibrationPoints.length },
      width: adjustedMaxX - adjustedMinX,
      height: adjustedMaxY - adjustedMinY,
      originalWidth: width,
      originalHeight: height,
      screenWidth: window.screenWidth,
      screenHeight: window.screenHeight
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
  
  // Use our createVisualComponent helper for WebGL compatibility
  webcamWarning = createVisualComponent(visual.TextStim, {
    win: psychoJS.window,
    name: 'webcamWarning',
    text: 'This experiment uses eye tracking. \n\nYou should see your web-browser request access to your webcam. Please permit access, and wait a little while. Your webcam video should appear in the top-left of the screen.',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], height: 0.05, wrapWidth: undefined, ori: 0.0,
    color: new util.Color('white'), opacity: undefined,
    depth: -1.0 
  });
  
  // Initialize components for Routine "inst1"
  inst1Clock = new util.Clock();
  
  instruction1Txt = createVisualComponent(visual.TextStim, {
    win: psychoJS.window,
    name: 'instruction1Txt',
    text: 'WebGazer initialized.\nPress space to continue',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], height: 0.05,  wrapWidth: undefined, ori: 0.0,
    color: new util.Color('white'),  opacity: undefined,
    depth: -1.0 
  });
  
  inst1_resp = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  // Initialize components for Routine "calibrationIntro"
  calibrationIntroClock = new util.Clock();
  
  calibrationTxt = createVisualComponent(visual.TextStim, {
    win: psychoJS.window,
    name: 'calibrationTxt',
    text: "OK great! we are almost ready to get started. \n\nFirst we need to calibrate the eye tracker. Please try to keep your head still. If you move your head too far away, your webcam will appear in the top left corner. If this happens, please move back into view. \n\nWhite squares will appear at different locations on the screen. Please click each square with your mouse.\n\nClick anywhere with the mouse to continue...",
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
  calibration_square = createVisualComponent(visual.Rect, {
    win: psychoJS.window, name: 'calibration_square', 
    width: [0.02, 0.02][0], height: [0.02, 0.02][1],
    ori: 0.0, pos: [0, 0],
    lineWidth: 1.0, lineColor: new util.Color('white'),
    fillColor: new util.Color('white'),
    opacity: undefined, depth: -1, interpolate: true,
  });
  
  // Define calibrationDot - this was missing and causing the error
  calibrationDot = new visual.Polygon({
    win: psychoJS.window,
    name: 'calibrationDot',
    edges: 32, size: [0.03, 0.03],
    ori: 0, pos: [0, 0],
    lineWidth: 1, lineColor: new util.Color([1, 1, 1]),
    fillColor: new util.Color([1, 0, 0]),
    opacity: 1, depth: 0.0,
    interpolate: true
  });
  
  // Replace with our helper function:
  
  // For WebGL compatibility, extend our helper function to handle Polygon objects
  if (window.webGLInfo && !window.webGLInfo.compressedTextures) {
    console.log('Adding Polygon handling to createVisualComponent for WebGL compatibility');
    const originalCreateVisualComponent = createVisualComponent;
    createVisualComponent = function(componentType, options) {
      // Add special handling for Polygon
      if (componentType === visual.Polygon) {
        options.interpolate = false; // Disable interpolation which might use compressed textures
        // Use simpler shape with fewer edges if WebGL has limited capabilities
        if (options.edges > 20) {
          console.log(`Reducing polygon complexity from ${options.edges} edges to 20 edges`);
          options.edges = 20;
        }
      }
      return originalCreateVisualComponent(componentType, options);
    };
  }
  
  // Use the enhanced helper function for the calibration dot
  calibrationDot = createVisualComponent(visual.Polygon, {
    win: psychoJS.window,
    name: 'calibrationDot',
    edges: 32, size: [0.03, 0.03],
    ori: 0, pos: [0, 0],
    lineWidth: 1, lineColor: new util.Color([1, 1, 1]),
    fillColor: new util.Color([1, 0, 0]),
    opacity: 1, depth: 0.0,
    interpolate: true
  });
  
  calibrationClick = new core.Mouse({
    win: psychoJS.window,
  });
  calibrationClick.mouseClock = new util.Clock();
  // Initialize components for Routine "trackingTrial"
  trackingTrialClock = new util.Clock();
  tracking_square = createVisualComponent(visual.Rect, {
    win: psychoJS.window, name: 'tracking_square', 
    width: [0.02, 0.02][0], height: [0.02, 0.02][1],
    ori: 0.0, pos: [0, 0],
    lineWidth: 1.0, lineColor: new util.Color('white'),
    fillColor: new util.Color('white'),
    opacity: undefined, depth: 0, interpolate: true,
  });
  
  trackingTxt = createVisualComponent(visual.TextStim, {
    win: psychoJS.window,
    name: 'trackingTxt',
    text: 'Great! We are now tracking your eye movements! Look around the screen to see how it works! \n\nPlease remember it is important for you to keep your head still during the experiment. \n\nPress space to start',
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
    
    // Ensure webcam elements are visible
    if (document.getElementById('webgazerFaceFeedbackBox')) {
      document.getElementById('webgazerFaceFeedbackBox').style.display = 'block';
    }
    if (document.getElementById('webgazerVideoFeed')) {
      document.getElementById('webgazerVideoFeed').style.display = 'block';
    }
    
    // Start gaze data logging now that eye tracking is initialized
    if (window.webgazer && typeof startGazeLogging === 'function') {
      console.log('Starting gaze logging after eye tracking initialization');
      // Start gaze logging with a slight delay to ensure WebGazer is fully initialized
      setTimeout(() => {
        startGazeLogging();
        console.log('Gaze logging started with debug window');
      }, 500);
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
    // Keep webcam visible - removed code that hides webcam elements
    // Make sure webcam elements are visible
    if (document.getElementById('webgazerFaceFeedbackBox')) {
      document.getElementById('webgazerFaceFeedbackBox').style.display = 'block';
    }
    if (document.getElementById('webgazerVideoFeed')) {
      document.getElementById('webgazerVideoFeed').style.display = 'block';
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
    routineTimer.add(3.500000);
    // update component parameters for each repeat
    
    // Define default values for calibration_x and calibration_y if they're not defined
    if (typeof calibration_x === 'undefined') {
      console.log("Warning: calibration_x was undefined. Using default value of 0.");
      calibration_x = 0;
    }
    if (typeof calibration_y === 'undefined') {
      console.log("Warning: calibration_y was undefined. Using default value of 0.");
      calibration_y = 0;
    }
    
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
    try {
      if (window.webgazer) {
        window.webgazer.checkEyesInValidationBox();
      } else {
        console.error('WebGazer is not available');
      }
    } catch (err) {
      console.error('Error in webgazer.checkEyesInValidationBox:', err);
    }

    // Add specific check for WebGL compressed textures issue
    if (window.webGLInfo && !window.webGLInfo.compressedTextures) {
      try {
        // If an element is failing due to WebGL compressed textures, handle it gracefully
        if (calibrationDot && calibrationDot.status === PsychoJS.Status.STARTED) {
          // Check if calibrationDot is having issues
          if (!calibrationDot._pixi || !calibrationDot._pixi.visible) {
            console.warn('WebGL issue detected with calibrationDot. Using fallback rendering...');
            // Try to recreate with simpler rendering
            calibrationDot.setAutoDraw(false);
            calibrationDot = createVisualComponent(visual.Polygon, {
              win: psychoJS.window,
              name: 'calibrationDot',
              edges: 16, // Even fewer edges
              size: [0.03, 0.03],
              ori: 0, pos: [calibration_x, calibration_y],
              lineWidth: 1, lineColor: new util.Color([1, 1, 1]),
              fillColor: new util.Color([1, 0, 0]),
              opacity: 1, depth: 0.0,
              interpolate: false
            });
            calibrationDot.setAutoDraw(true);
          }
        }
      } catch (webglErr) {
        console.error('Error handling WebGL fallback:', webglErr);
      }
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
    
    // *calibrationDot* updates
    if (t >= 0.5 && calibrationDot.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      calibrationDot.tStart = t;  // (not accounting for frame time here)
      calibrationDot.frameNStart = frameN;  // exact frame index
      
      calibrationDot.setAutoDraw(true);
      calibrationDot.setPos([calibration_x, calibration_y]);
    }

    if (calibrationDot.status === PsychoJS.Status.STARTED && t >= frameRemains) {
      calibrationDot.setAutoDraw(false);
    }
    // *calibrationClick* updates
    if (t >= 0.5 && calibrationClick.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      calibrationClick.tStart = t;  // (not accounting for frame time here)
      calibrationClick.frameNStart = frameN;  // exact frame index
      
      // keyboard checking is just starting
      psychoJS.window.callOnFlip(function() { calibrationClick.clock.reset(); });  // t=0 on next screen flip
      psychoJS.window.callOnFlip(function() { calibrationClick.start(); }); // start on screen flip
      psychoJS.window.callOnFlip(function() { calibrationClick.clearEvents(); });
    }
    if (calibrationClick.status === PsychoJS.Status.STARTED && t >= frameRemains) {
      calibrationClick.status = PsychoJS.Status.FINISHED;
    }
    if (calibrationClick.status === PsychoJS.Status.STARTED) {
      if (calibrationClick.getPressed()[0] === 1) {
        callib_color = 'white';
        const distance = Math.sqrt(
          Math.pow((calibrationClick.getPos()[0] - calibration_x), 2) + 
          Math.pow((calibrationClick.getPos()[1] - calibration_y), 2)
        );
        if (distance < 1) {
          //gotValidClick = true;
          
          // Store this calibration point
          window.calibrationPoints.push({
            expected: [calibration_x, calibration_y],
            clicked: [calibrationClick.getPos()[0], calibrationClick.getPos()[1]]
          });
          
          // Save values to experiment data
          psychoJS.experiment.addData('calibration_x_expected', calibration_x);
          psychoJS.experiment.addData('calibration_y_expected', calibration_y);
          psychoJS.experiment.addData('calibration_x_clicked', calibrationClick.getPos()[0]);
          psychoJS.experiment.addData('calibration_y_clicked', calibrationClick.getPos()[1]);
        }
        
        calibrationClick.status = PsychoJS.Status.FINISHED;
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
      
      // Attempt to construct coordinate plane if we have enough points
      if (window.calibrationPoints.length >= 5 && !window.screenCoordinatePlane.initialized) {
        if (window.constructCoordinatePlane()) {
          console.log('Successfully constructed coordinate plane after calibration point');
        }
      }
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
    
    // Set tracking square position based on latest gaze position
    // Calculate average gaze position
    if (window.xGazes && window.yGazes && window.xGazes.length > 0 && window.yGazes.length > 0) {
      // Get average of recent gaze positions
      var sumX = 0;
      var sumY = 0;
      var validPoints = 0;
      
      for (var i = 0; i < window.xGazes.length; i++) {
        if (window.xGazes[i] !== 0 || window.yGazes[i] !== 0) {
          sumX += window.xGazes[i];
          sumY += window.yGazes[i];
          validPoints++;
        }
      }
      
      // Only update if we have valid gaze data
      if (validPoints > 0) {
        var avgX = sumX / validPoints;
        var avgY = sumY / validPoints;
        
        // Map raw coordinates to experiment coordinate system if coordinate plane is initialized
        if (window.screenCoordinatePlane.initialized) {
          // Get screen dimensions from user input or detection
          const screenWidth = window.screenWidth || window.screen.width;
          const screenHeight = window.screenHeight || window.screen.height;
          
          // Map raw screen coordinates (pixels) to normalized coordinates (0-1)
          const normalizedX = avgX / screenWidth;
          const normalizedY = avgY / screenHeight;
          
          // Map normalized coordinates to PsychoJS coordinate system (-1 to 1)
          // using the calibrated coordinate plane
          const planeWidth = window.screenCoordinatePlane.width;
          const planeHeight = window.screenCoordinatePlane.height;
          const planeLeft = window.screenCoordinatePlane.topLeft.x;
          const planeTop = window.screenCoordinatePlane.topLeft.y;
          
          // Calculate mapped coordinates
          const mappedX = planeLeft + (normalizedX * planeWidth);
          const mappedY = planeTop - (normalizedY * planeHeight);
          
          // Apply the mapped coordinates to the tracking square
          tracking_square.setPos([mappedX, mappedY]);
          
          // Record mapping data periodically (every 30 frames) to avoid excessive data
          if (frameN % 30 === 0) {
            psychoJS.experiment.addData('gazeMapping', JSON.stringify({
              raw: [avgX, avgY],
              normalized: [normalizedX, normalizedY],
              mapped: [mappedX, mappedY],
              frameN: frameN,
              screenDimensions: [screenWidth, screenHeight]
            }));
          }
        } else {
          // Fallback if coordinate plane not initialized
          // Convert raw pixel coordinates to PsychoJS coordinates (-1 to 1)
          const screenWidth = window.screen.width;
          const screenHeight = window.screen.height;
          
          // Normalize to -1 to 1 range
          const mappedX = ((avgX / screenWidth) * 2) - 1;
          const mappedY = -((avgY / screenHeight) * 2) + 1; // Y is flipped in browser coordinates
          
          tracking_square.setPos([mappedX, mappedY]);
          
          if (frameN % 30 === 0) {
            console.log('Using fallback coordinate mapping:', [mappedX, mappedY]);
          }
        }
      }
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
    const currentTrial = currentLoop.getCurrentTrial();
    psychoJS.importAttributes(currentTrial);
    
    // Map the CSV column names to the variable names used in the code
    if (typeof currentTrial.Calibrate_X !== 'undefined') {
      window.calibration_x = currentTrial.Calibrate_X;
    }
    
    if (typeof currentTrial.Calibrate_Y !== 'undefined') {
      window.calibrationTxt = currentTrial.Calibrate_Y;
    }
    
    return Scheduler.Event.NEXT;
  };
}

// Replace with:

function importConditions(currentLoop) {
  return async function () {
    const currentTrial = currentLoop.getCurrentTrial();
    psychoJS.importAttributes(currentTrial);
    
    // Map the CSV column names to the variable names used in the code
    if (typeof currentTrial.Calibrate_X !== 'undefined') {
      window.calibration_x = currentTrial.Calibrate_X;
    }
    
    if (typeof currentTrial.Calibrate_Y !== 'undefined') {
      // Bug fix: properly set the Y coordinate rather than overwriting calibrationTxt
      window.calibration_y = currentTrial.Calibrate_Y;
    }
    
    // For troubleshooting: log the values to make sure they're correctly set
    console.log('Calibration coordinates set:', {
      x: window.calibration_x,
      y: window.calibration_y
    });
    
    return Scheduler.Event.NEXT;
  };
}

// Global array to store all gaze data
window.allGazeData = [];

// Function to start logging gaze coordinates
function startGazeLogging() {
  if (window.webgazer && typeof window.webgazer.setGazeListener === 'function') {
    console.log('Setting up gaze logging');
    
    // Create a secondary window for gaze data visualization
    const debugWidth = 600;
    const debugHeight = 700;
    const windowFeatures = `width=${debugWidth},height=${debugHeight},resizable=yes,scrollbars=yes,status=yes,location=no`;
    
    // Close existing window if it exists
    if (window.gazeDebugWindow && !window.gazeDebugWindow.closed) {
      window.gazeDebugWindow.close();
    }
    

    // Open new debug window
    window.gazeDebugWindow = window.open('', 'WebGazer Debug', windowFeatures);
    
    if (window.gazeDebugWindow) {
      // Initialize the debug window with HTML structure
      window.gazeDebugWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>WebGazer Gaze Data Visualization</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 10px; 
              background-color: #f0f0f0;
            }
            h2 { 
              margin-top: 0; 
              color: #333;
              text-align: center;
            }
            #stats { 
              margin-bottom: 15px; 
              padding: 10px; 
              background: #fff; 
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            #log { 
              height: 150px; 
              overflow: auto; 
              border: 1px solid #ccc; 
              padding: 10px;
              font-family: monospace;
              font-size: 12px;
              background: #fff;
              border-radius: 5px;
              margin-bottom: 15px;
            }
            #controls { 
              margin: 15px 0; 
              text-align: center;
            }
            button { 
              padding: 8px 15px; 
              margin-right: 10px; 
              background: #4CAF50;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
            }
            button:hover {
              background: #45a049;
            }
            #visualization {
              border: 1px solid #ccc;
              background: #fff;
              position: relative;
              height: 200px;
              margin: 15px 0;
              border-radius: 5px;
              overflow: hidden;
            }
            #heatmap {
              border: 1px solid #ccc;
              background: #fff;
              position: relative;
              height: 200px;
              margin: 15px 0;
              border-radius: 5px;
              overflow: hidden;
            }
            .point {
              position: absolute;
              width: 6px;
              height: 6px;
              background: rgba(255,0,0,0.7);
              border-radius: 50%;
              margin-left: -3px;
              margin-top: -3px;
              z-index: 2;
            }
            .heatpoint {
              position: absolute;
              width: 20px;
              height: 20px;
              background: radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,0,0,0) 70%);
              border-radius: 50%;
              margin-left: -10px;
              margin-top: -10px;
              z-index: 1;
            }
            .section {
              background: #fff;
              padding: 10px;
              margin-bottom: 15px;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            h3 {
              margin-top: 0;
              color: #555;
            }
            .grid-line {
              position: absolute;
              background: rgba(0,0,0,0.1);
              z-index: 1;
            }
            .grid-line-h {
              width: 100%;
              height: 1px;
            }
            .grid-line-v {
              height: 100%;
              width: 1px;
            }
            .coordinate-label {
              position: absolute;
              font-size: 10px;
              color: #666;
              z-index: 1;
            }
          </style>
        </head>
        <body>
          <h2>WebGazer Gaze Data Visualization</h2>
          
          <div class="section">
            <h3>Configuration</h3>
            <div id="config">
              Screen Resolution: <span id="screenResolution">${window.screenWidth || window.screen.width}x${window.screenHeight || window.screen.height}</span><br>
              Webcam: <span id="webcamInfo">${expInfo.webcam || 'Default'}</span><br>
              Calibration Status: <span id="calibrationStatus">In Progress</span>
            </div>
          </div>
          
          <div class="section">
            <h3>Statistics</h3>
            <div id="stats">
              Total points: <span id="pointCount">0</span><br>
              Last coordinates: <span id="lastCoords">None</span><br>
              Points per second: <span id="pointsPerSecond">0</span><br>
              Mapping quality: <span id="mappingQuality">Unknown</span>
            </div>
          </div>
          
          <div class="section">
            <h3>Real-time Gaze Visualization</h3>
            <div id="visualization">
              <!-- Grid lines will be added by JavaScript -->
            </div>
          </div>
          
          <div class="section">
            <h3>Gaze Heatmap</h3>
            <div id="heatmap"></div>
          </div>
          
          <div id="controls">
            <button id="exportBtn">Export Data (CSV)</button>
            <button id="clearBtn">Clear Visualizations</button>
            <button id="toggleHeatmapBtn">Toggle Heatmap</button>
            <button id="toggleGridBtn">Toggle Grid</button>
          </div>
          
          <div class="section">
            <h3>Recent Data Points</h3>
            <div id="log"></div>
          </div>
          
          <script>
            // Variables for tracking
            let startTime = Date.now();
            let pointsCollected = 0;
            let showHeatmap = true;
            let showGrid = true;
            
            // Create grid lines for visualization
            function createGrid() {
              const vizElem = document.getElementById('visualization');
              if (!vizElem) return;
              
              // Clear existing grid
              const existingGridLines = vizElem.querySelectorAll('.grid-line, .coordinate-label');
              existingGridLines.forEach(line => line.remove());
              
              if (!showGrid) return;
              
              const width = vizElem.offsetWidth;
              const height = vizElem.offsetHeight;
              
              // Create horizontal grid lines (5 lines)
              for (let i = 0; i <= 4; i++) {
                const y = (i / 4) * height;
                const line = document.createElement('div');
                line.className = 'grid-line grid-line-h';
                line.style.top = y + 'px';
                vizElem.appendChild(line);
                
                // Add coordinate label
                const label = document.createElement('div');
                label.className = 'coordinate-label';
                label.textContent = (1 - i / 2).toFixed(1);
                label.style.top = (y - 8) + 'px';
                label.style.left = '2px';
                vizElem.appendChild(label);
              }
              
              // Create vertical grid lines (5 lines)
              for (let i = 0; i <= 4; i++) {
                const x = (i / 4) * width;
                const line = document.createElement('div');
                line.className = 'grid-line grid-line-v';
                line.style.left = x + 'px';
                vizElem.appendChild(line);
                
                // Add coordinate label
                const label = document.createElement('div');
                label.className = 'coordinate-label';
                label.textContent = (i / 2 - 1).toFixed(1);
                label.style.left = (x - 8) + 'px';
                label.style.top = (height - 15) + 'px';
                vizElem.appendChild(label);
              }
            }
            
            // Create grid on load
            window.addEventListener('load', createGrid);
            window.addEventListener('resize', createGrid);
            
            // Update points per second every second
            setInterval(function() {
              const elapsedSeconds = (Date.now() - startTime) / 1000;
              const pps = (pointsCollected / elapsedSeconds).toFixed(1);
              document.getElementById('pointsPerSecond').textContent = pps;
              
              // Update calibration status
              if (window.opener && window.opener.screenCoordinatePlane) {
                const plane = window.opener.screenCoordinatePlane;
                if (plane.initialized) {
                  document.getElementById('calibrationStatus').textContent = 'Calibrated';
                  document.getElementById('calibrationStatus').style.color = '#4CAF50';
                  
                  // Update mapping quality based on calibration points
                  if (window.opener.trackingAccuracy) {
                    const quality = window.opener.trackingAccuracy;
                    const avgError = ((quality.x + quality.y) / 2).toFixed(3);
                    document.getElementById('mappingQuality').textContent = 
                      \`Average Error: \${avgError} (x: \${quality.x.toFixed(3)}, y: \${quality.y.toFixed(3)})\`;
                  }
                }
              }
            }, 1000);
            
            // Setup event handlers
            document.getElementById('exportBtn').addEventListener('click', function() {
              const csvContent = "data:text/csv;charset=utf-8," + 
                "timestamp,x,y\\n" + 
                window.opener.allGazeData.map(p => p.timestamp + "," + p.x + "," + p.y).join("\\n");
              
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "gaze_data_" + new Date().toISOString() + ".csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            });
            
            document.getElementById('clearBtn').addEventListener('click', function() {
              document.getElementById('log').innerHTML = "";
              document.getElementById('visualization').innerHTML = "";
              document.getElementById('heatmap').innerHTML = "";
              document.getElementById('pointCount').textContent = "0";
              document.getElementById('lastCoords').textContent = "None";
              pointsCollected = 0;
              startTime = Date.now();
              createGrid();
            });
            
            document.getElementById('toggleHeatmapBtn').addEventListener('click', function() {
              showHeatmap = !showHeatmap;
              document.getElementById('heatmap').style.display = showHeatmap ? 'block' : 'none';
              this.textContent = showHeatmap ? 'Hide Heatmap' : 'Show Heatmap';
            });
            
            document.getElementById('toggleGridBtn').addEventListener('click', function() {
              showGrid = !showGrid;
              this.textContent = showGrid ? 'Hide Grid' : 'Show Grid';
              createGrid();
            });
          </script>
        </body>
        </html>
      `);
      
      window.gazeDebugWindow.document.close();
      
      // Focus the debug window to bring it to the front
      window.gazeDebugWindow.focus();
      
      console.log('Gaze debug window created successfully');
    } else {
      console.warn('Failed to create gaze debug window - popup might be blocked');
      
      // Create a notification element to alert the user
      const notification = document.createElement('div');
      notification.style.position = 'fixed';
      notification.style.top = '10px';
      notification.style.left = '50%';
      notification.style.transform = 'translateX(-50%)';
      notification.style.backgroundColor = '#f44336';
      notification.style.color = 'white';
      notification.style.padding = '15px';
      notification.style.borderRadius = '5px';
      notification.style.zIndex = '9999';
      notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      notification.style.maxWidth = '80%';
      notification.style.textAlign = 'center';
      notification.innerHTML = `
        <strong>Popup Blocked!</strong> 
        <p>The gaze visualization window was blocked by your browser.</p>
        <p>Please allow popups for this site and <button id="retryBtn" style="background: white; color: #f44336; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; font-weight: bold;">Retry</button></p>
      `;
      
      document.body.appendChild(notification);
      
      // Add event listener to retry button
      document.getElementById('retryBtn').addEventListener('click', function() {
        document.body.removeChild(notification);
        startGazeLogging();
      });
      
      // Auto-remove after 10 seconds
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 10000);
    }
    
    // Set up the gaze listener to collect data
    window.webgazer.setGazeListener(function(data, elapsedTime) {
      if (data == null) {
        return;
      }
      
      // Store the data point with timestamp
      const dataPoint = {
        timestamp: new Date().getTime(),
        x: data.x,
        y: data.y,
        elapsedTime: elapsedTime
      };
      
      // Add to our global array
      window.allGazeData.push(dataPoint);
      
      // Log to console periodically (every 50 points to avoid flooding)
      if (window.allGazeData.length % 50 === 0) {
        console.log(`Gaze data point collected: [${dataPoint.x.toFixed(2)}, ${dataPoint.y.toFixed(2)}] - Total: ${window.allGazeData.length}`);
      }
      
      // Update the debug window if it exists and is open
      if (window.gazeDebugWindow && !window.gazeDebugWindow.closed) {
        try {
          const logElem = window.gazeDebugWindow.document.getElementById('log');
          const statsElem = window.gazeDebugWindow.document.getElementById('pointCount');
          const lastCoordsElem = window.gazeDebugWindow.document.getElementById('lastCoords');
          const vizElem = window.gazeDebugWindow.document.getElementById('visualization');
          const heatmapElem = window.gazeDebugWindow.document.getElementById('heatmap');
          
          if (logElem && statsElem && lastCoordsElem) {
            // Update stats
            statsElem.textContent = window.allGazeData.length;
            lastCoordsElem.textContent = `x: ${dataPoint.x.toFixed(2)}, y: ${dataPoint.y.toFixed(2)}`;
            
            // Increment points collected for rate calculation
            window.gazeDebugWindow.pointsCollected++;
            
            // Add to log (limiting to last 50 entries)
            const entry = window.gazeDebugWindow.document.createElement('div');
            entry.textContent = `[${new Date(dataPoint.timestamp).toLocaleTimeString()}] x: ${dataPoint.x.toFixed(2)}, y: ${dataPoint.y.toFixed(2)}`;
            logElem.appendChild(entry);
            
            // Keep only last 50 entries to prevent browser slowdown
            while (logElem.childNodes.length > 50) {
              logElem.removeChild(logElem.firstChild);
            }
            
            // Scroll to bottom
            logElem.scrollTop = logElem.scrollHeight;
            
            // Add point to visualization (every 3rd point to avoid clutter)
            if (window.allGazeData.length % 3 === 0 && vizElem) {
              const point = window.gazeDebugWindow.document.createElement('div');
              point.className = 'point';
              
              // Get screen dimensions from user input or detection
              const screenWidth = window.screenWidth || window.screen.width;
              const screenHeight = window.screenHeight || window.screen.height;
              
              // Normalize to visualization area
              const vizWidth = vizElem.offsetWidth;
              const vizHeight = vizElem.offsetHeight;
              const normalizedX = (dataPoint.x / screenWidth) * vizWidth;
              const normalizedY = (dataPoint.y / screenHeight) * vizHeight;
              
              point.style.left = `${normalizedX}px`;
              point.style.top = `${normalizedY}px`;
              vizElem.appendChild(point);
              
              // Limit visualization points
              while (vizElem.childNodes.length > 100) {
                vizElem.removeChild(vizElem.firstChild);
              }
              
              // Add to heatmap (every 5th point)
              if (window.allGazeData.length % 5 === 0 && heatmapElem) {
                const heatpoint = window.gazeDebugWindow.document.createElement('div');
                heatpoint.className = 'heatpoint';
                heatpoint.style.left = `${normalizedX}px`;
                heatpoint.style.top = `${normalizedY}px`;
                heatmapElem.appendChild(heatpoint);
                
                // Limit heatmap points
                while (heatmapElem.childNodes.length > 200) {
                  heatmapElem.removeChild(heatmapElem.firstChild);
                }
              }
            }
          }
        } catch (e) {
          console.error('Error updating gaze debug window:', e);
        }
      } else if (window.allGazeData.length % 100 === 0) {
        // If debug window was closed, try to reopen it
        console.log('Debug window closed or not available. Attempting to reopen...');
        
        // Create a new debug window
        const debugWidth = 600;
        const debugHeight = 700;
        const windowFeatures = `width=${debugWidth},height=${debugHeight},resizable=yes,scrollbars=yes,status=yes,location=no`;
        
        // Open new debug window
        window.gazeDebugWindow = window.open('', 'WebGazer Debug', windowFeatures);
        
        if (window.gazeDebugWindow) {
          // Initialize the debug window with HTML structure (reuse the same HTML)
          window.gazeDebugWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>WebGazer Gaze Data Visualization</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 0; 
                  padding: 10px; 
                  background-color: #f0f0f0;
                }
                /* Rest of the styles... */
                h2 { margin-top: 0; color: #333; text-align: center; }
                #stats { margin-bottom: 15px; padding: 10px; background: #fff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                #log { height: 150px; overflow: auto; border: 1px solid #ccc; padding: 10px; font-family: monospace; font-size: 12px; background: #fff; border-radius: 5px; margin-bottom: 15px; }
                #visualization, #heatmap { border: 1px solid #ccc; background: #fff; position: relative; height: 200px; margin: 15px 0; border-radius: 5px; overflow: hidden; }
                .point { position: absolute; width: 6px; height: 6px; background: rgba(255,0,0,0.7); border-radius: 50%; margin-left: -3px; margin-top: -3px; z-index: 2; }
                .heatpoint { position: absolute; width: 20px; height: 20px; background: radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,0,0,0) 70%); border-radius: 50%; margin-left: -10px; margin-top: -10px; z-index: 1; }
              </style>
            </head>
            <body>
              <h2>WebGazer Gaze Data Visualization (Reopened)</h2>
              <div id="stats">
                Total points: <span id="pointCount">0</span><br>
                Last coordinates: <span id="lastCoords">None</span><br>
              </div>
              <div id="visualization"></div>
              <div id="heatmap"></div>
              <div id="log"></div>
            </body>
            </html>
          `);
          
          window.gazeDebugWindow.document.close();
          window.gazeDebugWindow.focus();
          console.log('Gaze debug window reopened successfully');
        }
      }
    });
    
    console.log('Gaze logging initialized successfully');
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
      
      // Configure WebGazer to keep webcam visible
      window.webgazer.params.showVideoPreview = true;
      window.webgazer.params.showFaceFeedbackBox = true;
      window.webgazer.params.showFaceOverlay = false;
      window.webgazer.params.showGazeDot = false;
      
      // Set up webcam selection if a specific one was chosen
      if (expInfo.webcam && expInfo.webcam !== 'Default' && expInfo.webcam !== '') {
        try {
          console.log('Setting up selected webcam:', expInfo.webcam);
          
          // Set the webcam device ID if it's not the default
          if (typeof window.webgazer.setVideoElementConstraints === 'function') {
            const constraints = {
              video: {
                deviceId: { exact: expInfo.webcam }
              }
            };
            window.webgazer.setVideoElementConstraints(constraints);
            console.log('Webcam constraints set successfully');
          } else {
            console.warn('WebGazer does not support setVideoElementConstraints');
          }
        } catch (webcamErr) {
          console.error('Error setting webcam:', webcamErr);
        }
      }
      
      // Set up WebGazer with more robust error handling
      try {
        await window.webgazer.setRegression('ridge')
          .setTracker('TFFacemesh')
          .setGazeListener(function(data, timestamp) {
            // This is just a placeholder - our detailed listener will be set up later
            if (data == null) return;
            
            // Store eye gaze position
            window.currentGazeX = data.x;
            window.currentGazeY = data.y;
          })
          .begin();
        
        console.log('WebGazer core initialized successfully');
      } catch (initErr) {
        console.error('Error during WebGazer core initialization:', initErr);
        // Try with fallback settings
        try {
          console.log('Trying fallback initialization...');
          await window.webgazer.setRegression('weightedRidge')
            .setTracker('clmtrackr')
            .begin();
          console.log('WebGazer initialized with fallback settings');
        } catch (fallbackErr) {
          throw new Error(`Failed to initialize WebGazer with fallback settings: ${fallbackErr.message}`);
        }
      }
      
      // Ensure webcam elements are visible
      if (document.getElementById('webgazerFaceFeedbackBox')) {
        document.getElementById('webgazerFaceFeedbackBox').style.display = 'block';
      }
      if (document.getElementById('webgazerVideoFeed')) {
        document.getElementById('webgazerVideoFeed').style.display = 'block';
      }
      
      // Start the robust fallback data logging system with retry
      let loggingSuccess = false;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (!loggingSuccess && retryCount < maxRetries) {
        try {
          console.log(`Starting gaze logging (attempt ${retryCount + 1})...`);
          startGazeLogging();
          loggingSuccess = true;
          console.log('Gaze logging started successfully');
        } catch (loggingErr) {
          console.error(`Error starting gaze logging (attempt ${retryCount + 1}):`, loggingErr);
          retryCount++;
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (!loggingSuccess) {
        console.warn('Failed to start gaze logging after multiple attempts');
      }
      
      console.log('WebGazer initialization complete');
      return true;
    } catch (err) {
      console.error('Failed to initialize WebGazer:', err);
      
      // Create a more informative error message for the user
      const errorNotification = document.createElement('div');
      errorNotification.style.position = 'fixed';
      errorNotification.style.top = '50%';
      errorNotification.style.left = '50%';
      errorNotification.style.transform = 'translate(-50%, -50%)';
      errorNotification.style.backgroundColor = '#f44336';
      errorNotification.style.color = 'white';
      errorNotification.style.padding = '20px';
      errorNotification.style.borderRadius = '5px';
      errorNotification.style.zIndex = '10000';
      errorNotification.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      errorNotification.style.maxWidth = '80%';
      errorNotification.style.textAlign = 'center';
      errorNotification.innerHTML = `
        <h3 style="margin-top: 0;">Eye Tracking Initialization Failed</h3>
        <p>${err.message}</p>
        <p>Possible causes:</p>
        <ul style="text-align: left;">
          <li>Camera access was denied</li>
          <li>No camera detected</li>
          <li>Browser compatibility issue</li>
        </ul>
        <button id="retryWebGazerBtn" style="background: white; color: #f44336; border: none; padding: 8px 15px; cursor: pointer; border-radius: 3px; font-weight: bold; margin-top: 10px;">Retry</button>
      `;
      
      document.body.appendChild(errorNotification);
      
      // Add event listener to retry button
      document.getElementById('retryWebGazerBtn').addEventListener('click', function() {
        document.body.removeChild(errorNotification);
        initializeWebGazer();
      });
      
      return false;
    }
  } else {
    console.error('WebGazer not found. Make sure webgazer.js is loaded correctly.');
    
    // Create a notification for missing WebGazer
    const missingNotification = document.createElement('div');
    missingNotification.style.position = 'fixed';
    missingNotification.style.top = '50%';
    missingNotification.style.left = '50%';
    missingNotification.style.transform = 'translate(-50%, -50%)';
    missingNotification.style.backgroundColor = '#ff9800';
    missingNotification.style.color = 'white';
    missingNotification.style.padding = '20px';
    missingNotification.style.borderRadius = '5px';
    missingNotification.style.zIndex = '10000';
    missingNotification.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    missingNotification.style.maxWidth = '80%';
    missingNotification.style.textAlign = 'center';
    missingNotification.innerHTML = `
      <h3 style="margin-top: 0;">WebGazer Not Found</h3>
      <p>The eye tracking library (WebGazer) could not be loaded.</p>
      <p>Please check your internet connection and refresh the page.</p>
      <button onclick="location.reload()" style="background: white; color: #ff9800; border: none; padding: 8px 15px; cursor: pointer; border-radius: 3px; font-weight: bold; margin-top: 10px;">Refresh Page</button>
    `;
    
    document.body.appendChild(missingNotification);
    
    return false;
  }
}

