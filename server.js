// Import required modules
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 8080;

// Define the request handler function
function requestHandler(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Serve the index.html for root requests
  if (pathname === '/') {
    serveFile(res, 'index.html', 'text/html');
    return;
  }
  
  // Handle known test pages directly
  if (knownTestPages.includes(pathname)) {
    const extension = path.extname(pathname);
    const contentType = getContentType(extension);
    serveFile(res, pathname.substring(1), contentType);
    return;
  }
  
  // Serve any file requested from the filesystem
  serveFile(res, pathname.substring(1), getContentType(path.extname(pathname)));
}

// Helper function to serve files
function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// Helper function to get content type based on file extension
function getContentType(extension) {
  switch (extension) {
    case '.html': return 'text/html';
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.json': return 'application/json';
    case '.png': return 'image/png';
    case '.jpg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    default: return 'text/plain';
  }
}

// Known test pages that should be directly accessible
const knownTestPages = [
    '/webgazer-test.html',
    '/resource-test.html',
    '/direct-experiment.html',  // Added direct experiment
    '/extended_session_experiment.js'  // Added main experiment JS file
]; 

// Create the server and start listening
const server = http.createServer(requestHandler);
server.listen(PORT, () => {
  console.log('\n📡 Eye Tracking Server running successfully!');
  console.log(`🔗 Server URL: http://localhost:${PORT}/`);
  
  console.log('\n📋 Available Pages:');
  console.log(`   - Main Experiment: http://localhost:${PORT}/direct-experiment.html`);
  
  // List all known test pages
  knownTestPages.forEach(page => {
    if (page.endsWith('.html')) {
      console.log(`   - ${page.substring(1).split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: http://localhost:${PORT}${page}`);
    }
  });
  
  // List JavaScript resources
  console.log('\n📂 Accessible JavaScript Files:');
  knownTestPages.forEach(page => {
    if (page.endsWith('.js')) {
      console.log(`   - ${page.substring(1)}: http://localhost:${PORT}${page}`);
    }
  });
  
  console.log('\n⚠️  Make sure to allow camera access when prompted!');
  console.log('⌨️  Press Ctrl+C to stop the server\n');
}); 