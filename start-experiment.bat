@echo off
REM Batch file to start the experiment on Windows

echo 🔍 Starting PsychoJS Eye Tracking Experiment...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js is not installed. Please install it from https://nodejs.org/
    exit /b 1
)

REM Run the experiment launcher
echo 🚀 Launching server...
node start-experiment.js

REM This script will not reach here unless there's an error
REM as the node process will take over
echo ❌ Server stopped unexpectedly!
exit /b 1 