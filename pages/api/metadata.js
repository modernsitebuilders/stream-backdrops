// pages/api/metadata.js - Debug version

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    console.log('API called - starting debug...');
    console.log('Current working directory:', process.cwd());
    
    // Try both locations - public folder and root data folder
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'data', 'image-metadata.json'),
      path.join(process.cwd(), 'data', 'image-metadata.json')
    ];
    
    console.log('Checking paths:', possiblePaths);
    
    let filePath = null;
    for (const testPath of possiblePaths) {
      console.log(`Checking: ${testPath}`);
      console.log(`Exists: ${fs.existsSync(testPath)}`);
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        console.log(`Found file at: ${filePath}`);
        break;
      }
    }
    
    if (!filePath) {
      console.log('No metadata file found!');
      
      // Let's also check what files ARE in the data directory
      const dataDir = path.join(process.cwd(), 'public', 'data');
      if (fs.existsSync(dataDir)) {
        const files = fs.readdirSync(dataDir);
        console.log('Files in public/data:', files);
      } else {
        console.log('public/data directory does not exist');
      }
      
      return res.status(404).json({ 
        error: 'Metadata file not found',
        searchedPaths: possiblePaths,
        cwd: process.cwd()
      });
    }

    const jsonData = fs.readFileSync(filePath, 'utf8');
    console.log('File content length:', jsonData.length);
    console.log('First 100 chars:', jsonData.substring(0, 100));
    
    const data = JSON.parse(jsonData);
    console.log(`Loaded ${Object.keys(data).length} images from metadata`);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error loading metadata:', error);
    res.status(500).json({ 
      error: 'Failed to load metadata', 
      details: error.message,
      stack: error.stack
    });
  }
}