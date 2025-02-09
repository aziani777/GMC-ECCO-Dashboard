const fs = require('fs');
const path = require('path');

// Read the environment variables
const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';

// Read the original script.js
let script = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

// Replace the API_BASE_URL with the environment variable
script = script.replace(
    /const API_BASE_URL = .*$/m,
    `const API_BASE_URL = '${backendUrl}';`
);

// Write the processed script to a dist folder
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'));
}

fs.writeFileSync(path.join(__dirname, 'dist', 'script.js'), script);

// Copy index.html and styles.css to dist
fs.copyFileSync(
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'dist', 'index.html')
);

if (fs.existsSync(path.join(__dirname, 'styles.css'))) {
    fs.copyFileSync(
        path.join(__dirname, 'styles.css'),
        path.join(__dirname, 'dist', 'styles.css')
    );
}

console.log('Build completed!'); 