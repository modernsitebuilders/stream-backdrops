// pages/api/metadata.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Try to load from the public/data folder
   const filePath = path.join(process.cwd(), 'public', 'data', 'image-metadata-cleaned.json');
    
    console.log('Loading metadata from:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('Metadata file not found at:', filePath);
      return res.status(404).json({ 
        error: 'Metadata file not found',
        path: filePath
      });
    }

    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    
    // Log the actual count
    const imageCount = Object.keys(data).length;
    console.log(`Loaded ${imageCount} images from metadata file`);
    
    // Debug: Show category breakdown
    const categories = {};
    Object.values(data).forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    console.log('Category breakdown:', categories);
    
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