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
    '.mjs': 'application/javascript', // JavaScript modules with explicit extension
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

// List of files that should be treated as ES modules
const moduleFiles = [
    'extended_session_experiment.js',
    'module-wrapper.js',
    'extended_session_experiment-module-wrapper.js'
];

// Common source map files that might be requested but are usually not available
const commonMissingMaps = [
    'webgazer.js.map',
    'psychojs-2021.2.3.js.map',
    'preloadjs.min.js.map',
    'jquery.min.js.map',
    'jquery-ui.min.js.map'
];

// Function to check if a file is likely a module (has ES6 imports/exports)
function checkIfModuleFile(pathname) {
    // Always treat listed module files as modules
    if (moduleFiles.some(modFile => pathname.includes(modFile))) {
        return true;
    }
    
    // For other JS files, check content for import/export statements
    if (pathname.endsWith('.js') && fs.existsSync(pathname)) {
        try {
            const content = fs.readFileSync(pathname, 'utf8');
            const firstFewLines = content.split('\n').slice(0, 20).join('\n');
            
            // Check for import or export statements
            if (firstFewLines.includes('import ') || 
                firstFewLines.includes('export ') || 
                firstFewLines.match(/import\s*{/)) {
                console.log(`Detected module file: ${pathname}`);
                // Add to known module files for future requests
                if (!moduleFiles.some(modFile => pathname.includes(modFile))) {
                    moduleFiles.push(path.basename(pathname));
                }
                return true;
            }
        } catch (err) {
            console.error(`Error checking module file: ${pathname}`, err);
        }
    }
    return false;
}

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
        // Check if this is a common missing map file that we know doesn't exist
        const filename = path.basename(pathname);
        const isCommonMissingMap = commonMissingMaps.some(mapFile => 
            filename.includes(mapFile) || pathname.includes(mapFile)
        );
        
        // If it's a common missing map or doesn't exist, serve an empty map
        if (isCommonMissingMap || !fs.existsSync(pathname)) {
            // For common missing maps, don't log an error to reduce noise
            if (isCommonMissingMap) {
                console.log(`Expected missing map file: ${pathname} - Serving empty map`);
            } else {
                console.log(`Source map not found: ${pathname} - Serving empty map`);
            }
            
            // Add CORS headers for all responses
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            
            // Return empty object
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end('{}');
            return;
        }
    }
    
    // Get the file extension
    const ext = path.parse(pathname).ext;
    
    // Determine if this is a module file - check both listed files and content
    const isModule = ext === '.js' && checkIfModuleFile(pathname);
    
    // Set the correct MIME type
    let contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Override MIME type for JavaScript modules
    if (isModule) {
        contentType = 'application/javascript';
        
        // Add special headers for modules
        res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    }
    
    // Log the file type detection for JavaScript files
    if (ext === '.js') {
        console.log(`Serving JS file: ${pathname} as ${isModule ? 'module' : 'regular script'}`);
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
                // Check if this is a map file we missed in the earlier check
                if (pathname.endsWith('.map')) {
                    console.log(`Map file not found in second check: ${pathname} - Returning empty map`);
                    
                    // Add CORS headers
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
                    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end('{}');
                    return;
                }
                
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
        
        // Add CORS headers for all responses
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        
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