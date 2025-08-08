import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { filename } = req.query;
  
  if (!filename) {
    return res.status(400).json({ error: 'Filename required' });
  }
  
  try {
    const filePath = path.join(process.cwd(), 'public', 'images', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const fileBuffer = fs.readFileSync(filePath);
    const fileExtension = path.extname(filename).toLowerCase();
    
    // Set appropriate content type
    let contentType = 'application/octet-stream';
    if (fileExtension === '.webp') contentType = 'image/webp';
    if (fileExtension === '.png') contentType = 'image/png';
    if (fileExtension === '.jpg' || fileExtension === '.jpeg') contentType = 'image/jpeg';
    
    // Force download with proper headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="StreamBackdrops-Background${fileExtension}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    
    res.send(fileBuffer);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
}