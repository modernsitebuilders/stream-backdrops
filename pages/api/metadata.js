// pages/api/metadata.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Try to load from the public/data folder
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'data', 'image-metadata-cleaned.json'),
      path.join(process.cwd(), 'public', 'data', 'image-metadata.json')
    ];
    
    let data = {};
    let filePath = null;
    
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        break;
      }
    }
    
    if (filePath) {
      console.log('Loading metadata from:', filePath);
      const jsonData = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(jsonData);
      console.log(`Loaded ${Object.keys(data).length} images from metadata file`);
    } else {
      console.log('No metadata file found, returning empty object');
      // Return empty object instead of error
      data = {};
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error loading metadata:', error);
    // Return empty object instead of error to prevent build failure
    res.status(200).json({});
  }
}