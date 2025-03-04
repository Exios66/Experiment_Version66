const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;

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
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.wav': 'audio/wav',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.csv': 'text/csv',
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    // Parse the URL
    const parsedUrl = url.parse(req.url);
    
    // Extract the path from the URL
    let pathname = `.${parsedUrl.pathname}`;
    
    // Default to index.html if the path is '/'
    if (pathname === './') {
        pathname = './index.html';
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
        res.setHeader('Content-Type', contentType);
        
        // Add special header for modules if needed
        if (pathname.includes('module-wrapper')) {
            // Important: Set CORS headers for module scripts
            res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
            res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        }
    }
    
    // Read the file
    fs.readFile(pathname, (err, data) => {
        if (err) {
            // If the file is not found
            if (err.code === 'ENOENT') {
                console.error(`File not found: ${pathname}`);
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
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`You can test resources at http://localhost:${PORT}/resource-test.html`);
    console.log(`Press Ctrl+C to stop the server`);
}); 