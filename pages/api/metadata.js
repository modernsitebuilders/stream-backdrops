// Update your pages/api/metadata.js file:

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Try both locations - public folder and root data folder
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'data', 'image-metadata.json'),
      path.join(process.cwd(), 'data', 'image-metadata.json')
    ];
    
    let filePath = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        break;
      }
    }
    
    if (!filePath) {
      return res.status(404).json({ 
        error: 'Metadata file not found',
        searchedPaths: possiblePaths 
      });
    }

    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    
    console.log(`Loaded ${Object.keys(data).length} images from metadata`);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error loading metadata:', error);
    res.status(500).json({ 
      error: 'Failed to load metadata', 
      details: error.message 
    });
  }
}