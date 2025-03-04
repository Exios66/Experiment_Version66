#!/bin/bash
# Shell script to start the experiment on macOS/Linux

echo "🔍 Starting PsychoJS Eye Tracking Experiment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

# Run the experiment launcher
echo "🚀 Launching server..."
node start-experiment.js

# This script will not reach here unless there's an error
# as the node process will take over
echo "❌ Server stopped unexpectedly!"
exit 1 