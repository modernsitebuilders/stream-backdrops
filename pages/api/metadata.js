// pages/api/metadata.js - Updated with cache busting
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Prevent all caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Last-Modified', new Date().toUTCString());
    
    console.log('🔍 API called at:', new Date().toISOString());
    
    const metadataPath = path.join(process.cwd(), 'public', 'data', 'image-metadata.json');
    console.log('📁 Reading from:', metadataPath);
    
    if (!fs.existsSync(metadataPath)) {
      console.log('❌ Metadata file not found');
      return res.status(404).json({ error: 'Metadata file not found' });
    }
    
    // Read fresh data every time
    const rawData = fs.readFileSync(metadataPath, 'utf8');
    const metadata = JSON.parse(rawData);
    
    // Count categories
    const categoryCounts = {};
    Object.values(metadata).forEach(item => {
      if (item.category) {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      }
    });
    
    console.log('📊 Serving categories:', categoryCounts);
    
    const totalImages = Object.keys(metadata).length;
    console.log(`✅ Serving ${totalImages} total images`);
    
    // Return fresh data
    res.status(200).json(metadata);
    
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ 
      error: 'Failed to load metadata',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}