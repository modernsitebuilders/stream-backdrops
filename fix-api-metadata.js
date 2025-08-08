// fix-api-metadata.js - Fix your API to properly read the updated metadata
// Run with: node fix-api-metadata.js

const fs = require('fs');
const path = require('path');

function fixAPIMetadata() {
  console.log('🔧 Fixing API metadata endpoint...\n');
  
  // Check current API file
  const apiPath = path.join(__dirname, 'pages', 'api', 'metadata.js');
  
  if (!fs.existsSync(apiPath)) {
    console.log('❌ API file not found!');
    return;
  }
  
  // Read current API content
  const currentAPI = fs.readFileSync(apiPath, 'utf8');
  console.log('📄 Current API file length:', currentAPI.length, 'characters');
  
  // Check if it's reading from the JSON file
  if (currentAPI.includes('image-metadata.json')) {
    console.log('✅ API is configured to read from JSON file');
    
    // Test if the JSON file has office spaces
    const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      const officeCount = Object.values(metadata).filter(item => item.category === 'office-spaces').length;
      console.log(`📊 JSON file contains ${officeCount} office-spaces entries`);
      
      if (officeCount === 15) {
        console.log('✅ JSON file has correct office spaces data');
        console.log('❌ But API is not serving it correctly');
        
        // The issue is likely caching or path resolution
        console.log('\n🛠️  Creating updated API file...');
        
        const newAPI = `// pages/api/metadata.js - Updated to properly serve office spaces
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Set headers to prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Read the metadata file
    const metadataPath = path.join(process.cwd(), 'public', 'data', 'image-metadata.json');
    
    if (!fs.existsSync(metadataPath)) {
      console.error('Metadata file not found:', metadataPath);
      return res.status(404).json({ error: 'Metadata file not found' });
    }
    
    const fileContent = fs.readFileSync(metadataPath, 'utf8');
    const metadata = JSON.parse(fileContent);
    
    // Log for debugging
    const officeSpacesCount = Object.values(metadata).filter(item => item.category === 'office-spaces').length;
    console.log(\`API serving \${Object.keys(metadata).length} total images, \${officeSpacesCount} office-spaces\`);
    
    res.status(200).json(metadata);
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to load metadata', details: error.message });
  }
}`;

        // Backup current API
        fs.copyFileSync(apiPath, apiPath + '.backup');
        console.log('💾 Backed up current API file');
        
        // Write new API
        fs.writeFileSync(apiPath, newAPI);
        console.log('✅ Updated API file');
        
        console.log('\n🚀 Next steps:');
        console.log('1. Restart your dev server (Ctrl+C, then npm run dev)');
        console.log('2. Visit http://localhost:3000/api/metadata');
        console.log('3. Search for "office-spaces" - you should find 15 entries');
        console.log('4. Visit http://localhost:3000/category/office-spaces');
        
      } else {
        console.log('❌ JSON file is missing office spaces data');
        console.log('Run: node quick-add-office-metadata.js');
      }
    }
    
  } else {
    console.log('❌ API has hardcoded data or wrong path');
    console.log('📋 Current API preview:');
    console.log(currentAPI.substring(0, 1000));
    
    console.log('\n🛠️  The API needs to be updated to read from:');
    console.log('public/data/image-metadata.json');
  }
}

fixAPIMetadata();