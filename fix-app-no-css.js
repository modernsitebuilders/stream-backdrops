// fix-app-no-css.js - Remove CSS import that might be causing issues
const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'pages', '_app.js');

// Create _app.js without CSS import
const noCssApp = `export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}`;

fs.writeFileSync(appPath, noCssApp);
console.log('Created _app.js without CSS import');
console.log('Try: npm run dev');