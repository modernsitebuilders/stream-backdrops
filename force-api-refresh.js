// force-api-refresh.js - Force the API to refresh by adding cache busting
const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, 'pages', 'api', 'metadata.js');

if (fs.existsSync(apiPath)) {
  let content = fs.readFileSync(apiPath, 'utf8');
  
  // Add cache busting headers
  const newApiContent = `// REPLACE your pages/api/metadata.js file with this code
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Set CORS headers and disable caching
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const metadataPath = path.join(process.cwd(), 'public', 'data', 'image-metadata-cleaned.json');
    console.log('Loading metadata from:', metadataPath);
    
    if (!fs.existsSync(metadataPath)) {
      console.error('Metadata file not found:', metadataPath);
      return res.status(404).json({ error: 'Metadata file not found' });
    }

    const fileContent = fs.readFileSync(metadataPath, 'utf8');
    const metadata = JSON.parse(fileContent);
    
    console.log(\`Successfully loaded \${Object.keys(metadata).length} images from metadata file\`);
    
    // Add timestamp to force refresh
    const response = {
      ...metadata,
      _timestamp: Date.now(),
      _total: Object.keys(metadata).length
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error loading metadata:', error);
    res.status(500).json({ error: 'Failed to load metadata' });
  }
}`;

  // Backup and replace
  fs.writeFileSync(apiPath + '.backup', content);
  fs.writeFileSync(apiPath, newApiContent);
  
  console.log('✅ Updated API with cache-busting headers');
} else {
  console.log('❌ API file not found');
}