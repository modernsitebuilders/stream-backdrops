// check-api-metadata.js - Check what the API is actually loading
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking what the API is actually loading...\n');

// Check the API file
const apiPath = path.join(__dirname, 'pages', 'api', 'metadata.js');
if (fs.existsSync(apiPath)) {
  const apiContent = fs.readFileSync(apiPath, 'utf8');
  console.log('📄 API metadata.js content (first 500 chars):');
  console.log(apiContent.substring(0, 500));
  console.log('...\n');
  
  // Look for the file path it's reading
  const filePathMatch = apiContent.match(/['"`]([^'"`]*metadata[^'"`]*\.json)['"`]/);
  if (filePathMatch) {
    console.log(`📁 API is trying to read: ${filePathMatch[1]}`);
  }
} else {
  console.log('❌ API file not found');
}

// Check all metadata files
console.log('📋 All metadata files in public/data/:');
const dataDir = path.join(__dirname, 'public', 'data');
if (fs.existsSync(dataDir)) {
  const files = fs.readdirSync(dataDir).filter(f => f.includes('metadata'));
  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    const stats = fs.statSync(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    console.log(`   ${file} (${(stats.size / 1024).toFixed(1)}KB, ${Object.keys(data).length} images)`);
    
    // Check first image
    const firstKey = Object.keys(data)[0];
    if (firstKey) {
      console.log(`     First image: ${data[firstKey].filename}`);
    }
  });
}