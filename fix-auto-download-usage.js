// fix-auto-download-usage.js - Connect the auto-download function to the button
const fs = require('fs');
const path = require('path');

const categoryPagePath = path.join(__dirname, 'pages', 'category', '[slug].js');

if (fs.existsSync(categoryPagePath)) {
  let content = fs.readFileSync(categoryPagePath, 'utf8');
  
  // Find and replace the static download link with the auto-download function call
  content = content.replace(
    /href={\`\/images\/\${previewImage\.filename}\`}\s*download="StreamBackdrops-Background\.webp"/g,
    'href="#" onClick={(e) => { e.preventDefault(); handleDownload(previewImage); }}'
  );
  
  // Also fix any other static download links
  content = content.replace(
    /download="StreamBackdrops-Background\.webp"/g,
    'onClick={(e) => { e.preventDefault(); handleDownload(image || previewImage); }}'
  );
  
  fs.writeFileSync(categoryPagePath, content);
  console.log('✅ Connected auto-download function to download buttons');
  console.log('🎯 Download button will now use the handleDownload function');
  console.log('📁 Files will download automatically to Downloads folder');
} else {
  console.log('❌ Category page not found');
}