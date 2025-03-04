/**
 * Experiment Launcher Script
 * This script starts a local server and launches the experiment in the default browser.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { exec } = require('child_process');

// Configuration
const PORT = 8080;
const MAIN_URL = `http://localhost:${PORT}/import-fix.html`;
const TEST_URL = `http://localhost:${PORT}/resource-test.html`;

// Check if required files exist before starting
const requiredFiles = [
    './import-fix.html',
    './extended_session_experiment.js',
    './extended_session_experiment-legacy-browsers.js',
    './lib/psychojs-2021.2.3.js',
    './webgazer-2.0.1.js'
];

console.log('🔍 Checking for required files...');
const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
    console.error('❌ ERROR: The following required files are missing:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    console.error('Please ensure all required files are present before starting the server.');
    process.exit(1);
}

console.log('✅ All required files found.');

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

// Create HTTP server
console.log('🚀 Starting local server...');
const server = http.createServer((req, res) => {
    // Parse the URL
    const parsedUrl = url.parse(req.url);
    
    // Extract the path from the URL
    let pathname = `.${parsedUrl.pathname}`;
    
    // Default to import-fix.html if the path is '/'
    if (pathname === './') {
        pathname = './import-fix.html';
    }
    
    // Get the file extension
    const ext = path.parse(pathname).ext;
    
    // Map file extension to MIME type
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Read the file
    fs.readFile(pathname, (err, data) => {
        if (err) {
            // If the file is not found
            if (err.code === 'ENOENT') {
                console.error(`❌ File not found: ${pathname}`);
                res.writeHead(404);
                res.end(`File not found: ${pathname}`);
                return;
            }
            
            // For other errors
            console.error(`❌ Server error: ${err}`);
            res.writeHead(500);
            res.end(`Server error: ${err.code}`);
            return;
        }
        
        // If the file is found, send it with the correct content type
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log('\n📡 Server running successfully!');
    console.log(`🌐 Main experiment: ${MAIN_URL}`);
    console.log(`🧪 Resource tester: ${TEST_URL}`);
    console.log('\n🔄 Opening experiment in your default browser...');
    
    // Open URL in the default browser based on platform
    let command;
    switch (process.platform) {
        case 'darwin': // macOS
            command = `open "${MAIN_URL}"`;
            break;
        case 'win32': // Windows
            command = `start "" "${MAIN_URL}"`;
            break;
        default: // Linux, etc.
            command = `xdg-open "${MAIN_URL}"`;
    }
    
    exec(command, (error) => {
        if (error) {
            console.error(`❌ Failed to open browser: ${error}`);
            console.log(`   Please manually open: ${MAIN_URL}`);
        }
    });
    
    console.log('\n📋 Available URLs:');
    console.log(`   - Main Experiment (FIXED VERSION): ${MAIN_URL}`);
    console.log(`   - Original Experiment: http://localhost:${PORT}/index.html`);
    console.log(`   - Resource Tester: ${TEST_URL}`);
    console.log('\n⚠️  Make sure to allow camera access when prompted!');
    console.log('⌨️  Press Ctrl+C to stop the server\n');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped successfully.');
        process.exit(0);
    });
}); 