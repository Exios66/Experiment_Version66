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
}

process.exit(failed ? 1 : 0);
