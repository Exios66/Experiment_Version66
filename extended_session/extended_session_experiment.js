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
    window.webgazer.params.showGazeDot = false;
  };
} 