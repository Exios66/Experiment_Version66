/**
 * DEPRECATED - THIS FILE HAS BEEN MERGED INTO THE ROOT FILE
 * 
 * The functionality in this file has been incorporated into the main 
 * extended_session_experiment.js file in the root directory.
 * 
 * Please use the version at: ./extended_session_experiment.js
 * 
 * This version in the subdirectory will no longer be maintained or used.
 * It is kept only for reference purposes and backward compatibility.
 */

/**
 * This file contains extracted functions from the main experiment.
 * It's meant to be included alongside the main experiment.js file
 * for compatibility with certain experiment configurations.
 * 
 * Note: Most functionality should be placed in the main experiment.js file.
 */

// This function is provided for compatibility with older experiment versions
function initializeEyetrackingRoutineBegin(snapshot) {
  return async function () {
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
    // update component parameters for each repeat
    // Show webcam thumbnail and face feedback box, but not face overlay and gaze dot
    window.webgazer.params.showVideoPreview = true;
    window.webgazer.params.showFaceFeedbackBox = true;
    window.webgazer.params.showFaceOverlay = false;
    window.webgazer.params.showGazeDot = false;
  };
} 