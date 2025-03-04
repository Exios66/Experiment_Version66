const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Allow port to be configured through environment or command line
const PORT = process.env.PORT || 8080;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.htm': 'text/html',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript', // JavaScript modules
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
    '.pdf': 'application/pdf',
    '.xml': 'application/xml',
    '.zip': 'application/zip',
    '.mp3': 'audio/mpeg',
    '.map': 'application/json', // Source maps
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

// List of files that should always return the index.html for SPA-like behavior
const spaPaths = [
    '/experiment',
    '/calibration',
    '/results'
];

// Create server
const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Parse the URL
    const parsedUrl = url.parse(req.url);
    
    // Extract the path from the URL
    let pathname = `.${parsedUrl.pathname}`;
    
    // Default to index.html if the path is '/' or in SPA paths
    if (pathname === './' || spaPaths.includes(parsedUrl.pathname)) {
        console.log('Serving index.html as default page');
        pathname = './index.html';
    }
    
    // Handle missing source map files gracefully
    if (pathname.endsWith('.map')) {
        // Check if the map file exists
        if (!fs.existsSync(pathname)) {
            console.log(`Source map requested but not found: ${pathname} - Returning empty map`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end('{}');
            return;
        }
    }
    
    // Get the file extension
    const ext = path.parse(pathname).ext;
    
    // Set the correct MIME type
    let contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Handle JavaScript modules specially
    if (ext === '.js' && (
        pathname.includes('module-wrapper') || 
        req.headers.accept && req.headers.accept.includes('application/javascript')
    )) {
        contentType = 'application/javascript';
        
        // Add special header for modules if needed
        if (pathname.includes('module-wrapper')) {
            // Important: Set CORS headers for module scripts
            res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
            res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        }
    }
    
    // Special case for the webgazer library and its source map
    if (pathname.includes('webgazer') && !fs.existsSync(pathname)) {
        if (pathname.endsWith('.map')) {
            console.log(`WebGazer map file not found: ${pathname} - Returning empty map`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end('{}');
            return;
        }
        // Try alternate versions of webgazer
        const alternateVersions = [
            './webgazer-2.0.1.js',
            './webgazer-2.0.1.tp.js',
            './lib/webgazer.js'
        ];
        
        for (const altPath of alternateVersions) {
            if (fs.existsSync(altPath)) {
                console.log(`Redirecting WebGazer request to alternate: ${altPath}`);
                pathname = altPath;
                break;
            }
        }
    }
    
    // Read the file
    fs.readFile(pathname, (err, data) => {
        if (err) {
            // If the file is not found
            if (err.code === 'ENOENT') {
                console.error(`File not found: ${pathname}`);
                
                // Special handling for missing files
                if (pathname.includes('experiment') && pathname.endsWith('.js')) {
                    // Try to serve the no-modules version instead
                    const noModulesPath = './extended_session_experiment-no-modules.js';
                    if (fs.existsSync(noModulesPath)) {
                        console.log(`Redirecting to non-module version: ${noModulesPath}`);
                        fs.readFile(noModulesPath, (err, data) => {
                            if (!err) {
                                res.writeHead(200, { 'Content-Type': contentType });
                                res.end(data);
                            } else {
                                // Still failed, serve 404
                                res.writeHead(404);
                                res.end(`File not found: ${pathname}`);
                            }
                        });
                        return;
                    }
                }
                
                // For all other files, just return 404
                res.writeHead(404);
                res.end(`File not found: ${pathname}`);
                return;
            }
            
            // For other errors
            console.error(`Server error: ${err}`);
            res.writeHead(500);
            res.end(`Server error: ${err.code}`);
            return;
        }
        
        // If the file is found, send it with the correct content type
        res.writeHead(200, { 'Content-Type': contentType });
        
        // For JavaScript files, we can add module type if needed
        if (ext === '.js' && pathname.includes('extended_session_experiment.js')) {
            console.log('Serving extended session experiment script');
        }
        
        res.end(data);
    });
});

// Function to attempt to start the server on the given port
function startServer(port) {
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${port} is already in use. Trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error(`Server error:`, err);
            process.exit(1);
        }
    });
    
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
        console.log(`You can access the experiment at http://localhost:${port}/`);
        console.log(`You can test resources at http://localhost:${port}/resource-test.html`);
        console.log(`Press Ctrl+C to stop the server`);
    });
}

// Start the server
startServer(PORT); 