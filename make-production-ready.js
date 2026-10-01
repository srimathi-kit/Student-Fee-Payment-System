const fs = require('fs');
const path = require('path');

// Update backend server.js for CORS
const serverJsPath = path.join(__dirname, 'server', 'server.js');
let serverJs = fs.readFileSync(serverJsPath, 'utf8');
serverJs = serverJs.replace(
  'app.use(cors());',
  'app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));'
);
fs.writeFileSync(serverJsPath, serverJs);

// Helper to recursively update frontend files
const clientSrcPath = path.join(__dirname, 'client', 'src');
const replaceApiUrl = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceApiUrl(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('http://localhost:5000')) {
        content = content.replace(/http:\/\/localhost:5000/g, "${import.meta.env.VITE_API_URL || 'http://localhost:5000'}");
        
        // Fix string interpolation syntax if it wasn't already in backticks
        content = content.replace(/'\$\{import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000'\}'/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`");
        content = content.replace(/'\$\{import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000'\}(.*?)'/g, "`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");

        fs.writeFileSync(fullPath, content);
      }
    }
  }
};
replaceApiUrl(clientSrcPath);

// Write .env to client
fs.writeFileSync(path.join(__dirname, 'client', '.env'), 'VITE_API_URL=http://localhost:5000\n');
console.log('Production ready adjustments complete.');
