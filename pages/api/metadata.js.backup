// REPLACE your pages/api/metadata.js file with this code

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Set CORS headers to prevent issues
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Try to load from the public/data folder
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'data', 'image-metadata-cleaned.json'),
      path.join(process.cwd(), 'public', 'data', 'image-metadata.json')
    ];
    
    let data = {};
    let filePath = null;
    
    // Find the first existing file
    for (const testPath of possiblePaths) {
      try {
        if (fs.existsSync(testPath)) {
          filePath = testPath;
          break;
        }
      } catch (err) {
        // Continue to next path
        console.warn(`Cannot access path: ${testPath}`);
      }
    }
    
    if (filePath) {
      try {
        console.log('Loading metadata from:', filePath);
        const jsonData = fs.readFileSync(filePath, 'utf8');
        
        if (!jsonData || jsonData.trim() === '') {
          throw new Error('Empty metadata file');
        }
        
        data = JSON.parse(jsonData);
        
        // Validate the data structure
        if (typeof data !== 'object' || data === null) {
          throw new Error('Invalid metadata format');
        }
        
        console.log(`Successfully loaded ${Object.keys(data).length} images from metadata file`);
      } catch (parseError) {
        console.error('Error parsing metadata file:', parseError);
        data = {};
      }
    } else {
      console.log('No metadata file found, returning empty object');
      data = {};
    }
    
    // Set appropriate cache headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600'); // 5 min cache
    
    // Always return a valid response
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error in metadata API:', error);
    
    // Always return a valid JSON response, never throw
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({});
  }
}