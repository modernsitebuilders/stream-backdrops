// pages/api/track-download.js
// Simple API endpoint to track downloads

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { filename, category, timestamp } = req.body;
  
  // Log to console (Vercel logs are searchable)
  console.log('DOWNLOAD_TRACKED:', {
    filename,
    category,
    timestamp: timestamp || new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent']
  });

  // You could also write to a database here later
  // For now, console logs are searchable in Vercel dashboard

  res.status(200).json({ success: true });
}

// Updated handleDownload function for your category page
const handleDownload = async (image) => {
  try {
    // Track download immediately (no GA4 dependency)
    fetch('/api/track-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: image.filename,
        category: slug,
        timestamp: new Date().toISOString()
      })
    }).catch(err => console.log('Tracking failed:', err));

    console.log('Download tracked locally:', image.filename);

    // Your existing download code...
    const response = await fetch(`/images/${folderMap[slug]}/${image.filename}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const blob = await response.blob();
    
    const img = new window.Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((pngBlob) => {
        const url = window.URL.createObjectURL(pngBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `StreamBackdrops-${image.title.replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 'image/png', 1.0);
    };
    
    const imageUrl = window.URL.createObjectURL(blob);
    img.src = imageUrl;
    
  } catch (error) {
    console.error('Download failed:', error);
  }
};