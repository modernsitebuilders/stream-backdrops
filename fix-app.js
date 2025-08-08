// fix-app.js - Fix the _app.js file that might be causing the loop
const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'pages', '_app.js');

// Backup current _app.js
if (fs.existsSync(appPath)) {
  fs.copyFileSync(appPath, appPath + '.broken');
  console.log('Backed up _app.js');
}

// Create minimal _app.js
const minimalApp = `import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}`;

fs.writeFileSync(appPath, minimalApp);
console.log('Created minimal _app.js');
console.log('Now try: npm run dev');