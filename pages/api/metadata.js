import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Your metadata file is at the root level in data/image-metadata.json
    const filePath = path.join(process.cwd(), 'data', 'image-metadata.json');
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        error: 'Metadata file not found',
        expectedPath: filePath
      });
    }

    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    
    console.log(`Loaded ${Object.keys(data).length} images from metadata`);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.status(200).json(data);
  } catch (error) {
    console.error('Error loading metadata:', error);
    res.status(500).json({ 
      error: 'Failed to load metadata', 
      details: error.message 
    });
  }
}