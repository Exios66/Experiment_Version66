#!/usr/bin/env node
/**
 * Ensures PsychoJS flowScheduler callbacks reference defined functions.
 * Run: node scripts/validate-experiment-scheduler.js
 */
const fs = require('fs');
const path = require('path');

const targets = [
  'extended_session_experiment.js',
  'src/js/extended_session_experiment.js',
];

let failed = false;

for (const rel of targets) {
  const filePath = path.join(__dirname, '..', rel);
  const code = fs.readFileSync(filePath, 'utf8');
  const scheduled = [...code.matchAll(/flowScheduler\.add\((\w+)/g)].map((m) => m[1]);
  const defined = new Set([...code.matchAll(/function (\w+)\(/g)].map((m) => m[1]));
  const skip = new Set(['quitPsychoJS', 'trialsLoopScheduler']);
  const missing = [...new Set(scheduled.filter((s) => !defined.has(s) && !skip.has(s)))];

  if (missing.length) {
    console.error(`${rel}: missing handlers: ${missing.join(', ')}`);
    failed = true;
  } else {
    console.log(`${rel}: OK (${scheduled.length} scheduled steps)`);
  }

  if (code.includes("key.includes('webgazer')")) {
    console.error(`${rel}: broad localStorage recovery would delete WebGazer keys`);
    failed = true;
  }

  if (code.includes('window.exportGazeData()') && !code.includes('window.exportGazeData = exportGazeData')) {
    console.error(`${rel}: window.exportGazeData is invoked but never assigned`);
    failed = true;
  }

  const startGazeLoggingMatch = code.match(/function startGazeLogging\(\)\s*\{[\s\S]*?\n\}/);
  if (startGazeLoggingMatch && startGazeLoggingMatch[0].includes('setGazeListener')) {
    console.error(`${rel}: startGazeLogging must not replace the WebGazer gaze listener`);
    failed = true;
  }

  const eyetrackingBegin = code.match(/function initializeEyetrackingRoutineBegin[\s\S]*?function initializeEyetrackingRoutineEachFrame/);
  if (eyetrackingBegin &&
      eyetrackingBegin[0].includes('.setGazeListener') &&
      !eyetrackingBegin[0].includes('if (!window.webgazer)')) {
    console.error(`${rel}: initializeEyetrackingRoutineBegin must guard setGazeListener when webgazer is unavailable`);
    failed = true;
  }

  if (code.includes('window.webgazer.removeMouseEventListeners();') &&
      !code.includes('typeof window.webgazer.removeMouseEventListeners')) {
    console.error(`${rel}: removeMouseEventListeners must be guarded when webgazer may be unavailable`);
    failed = true;
  }

  if (code.includes("getElementById('webgazerFaceFeedbackBox').style.display != 'none'")) {
    console.error(`${rel}: webgazerFaceFeedbackBox DOM access must be null-checked`);
    failed = true;
  }

  if (!code.includes('experimentFallbackActive')) {
    console.error(`${rel}: missing experimentFallbackActive guard against duplicate experiment start`);
    failed = true;
  }
}

const wrapperPath = path.join(__dirname, '..', 'extended_session_experiment-module-wrapper.js');
const wrapperCode = fs.readFileSync(wrapperPath, 'utf8');
if (!wrapperCode.includes('experimentFallbackActive')) {
  console.error('extended_session_experiment-module-wrapper.js: missing experimentFallbackActive fallback guard');
  failed = true;
}
if (!wrapperCode.includes('clearTimeout(window.experimentLoadTimeout)')) {
  console.error('extended_session_experiment-module-wrapper.js: must clear module load timeout after successful import');
  failed = true;
}

for (const rel of ['start-server.js', 'src/server.js']) {
  const serverCode = fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
  if (!serverCode.includes('Forbidden')) {
    console.error(`${rel}: missing path traversal protection`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
