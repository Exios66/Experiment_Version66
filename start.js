/**
 * Start script for the experiment
 * This script starts the server with the correct paths
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting experiment server...');

// Execute the server script
const server = spawn('node', [path.join(__dirname, 'src', 'server.js')], {
  stdio: 'inherit' // Show output in this console
});

// Handle server errors
server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Handle server close
server.on('close', (code) => {
  if (code !== 0) {
    console.error(`Server process exited with code ${code}`);
    process.exit(code);
  }
  console.log('Server shut down.');
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.kill('SIGINT');
});

console.log('Server process started. Press Ctrl+C to stop.');
