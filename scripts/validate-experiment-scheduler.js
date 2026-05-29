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

  if (!code.includes('function recordGazeDataPoint(')) {
    console.error(`${rel}: recordGazeDataPoint helper is required for bounded gaze storage`);
    failed = true;
  }

  const quitMatch = code.match(/async function quitPsychoJS[\s\S]*?return Scheduler\.Event\.QUIT;/);
  if (quitMatch && !quitMatch[0].includes('window.exportGazeData()')) {
    console.error(`${rel}: quitPsychoJS must flush gazeDataBuffer via exportGazeData`);
    failed = true;
  }

  if (!code.includes('eyeTrackingInitFailed')) {
    console.error(`${rel}: must record and guard WebGazer init failure (eyeTrackingInitFailed)`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
