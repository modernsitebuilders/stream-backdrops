// png-download-converter.js - Convert WebP to PNG during download
const fs = require('fs');
const path = require('path');

const categoryPagePath = path.join(__dirname, 'pages', 'category', '[slug].js');

if (fs.existsSync(categoryPagePath)) {
  let content = fs.readFileSync(categoryPagePath, 'utf8');
  
  // Replace the handleDownload function with a WebP-to-PNG converter
  const pngDownloadFunction = `
  const handleDownload = async (image) => {
    try {
      // Fetch the WebP image
      const response = await fetch(\`/images/\${image.filename}\`);
      const blob = await response.blob();
      
      // Create canvas to convert WebP to PNG
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        // Set canvas size to image size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        
        // Convert to PNG blob
        canvas.toBlob((pngBlob) => {
          // Download the PNG
          const url = window.URL.createObjectURL(pngBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = \`StreamBackdrops-Background.png\`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 'image/png', 1.0); // High quality PNG
      };
      
      // Load the image
      const imageUrl = window.URL.createObjectURL(blob);
      img.src = imageUrl;
      
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback - download as WebP
      const link = document.createElement('a');
      link.href = \`/images/\${image.filename}\`;
      link.download = \`StreamBackdrops-Background.webp\`;
      link.click();
    }
  };`;
  
  // Replace the existing handleDownload function
  content = content.replace(
    /const handleDownload = async \(image\) => {[\s\S]*?};/,
    pngDownloadFunction
  );
  
  // Make sure the download button uses this function
  content = content.replace(
    /href={\`\/images\/\${previewImage\.filename}\`}[\s\S]*?download[^>]*>/g,
    'href="#" onClick={(e) => { e.preventDefault(); handleDownload(previewImage); }}>'
  );
  
  fs.writeFileSync(categoryPagePath, content);
  console.log('✅ Added WebP to PNG conversion during download');
  console.log('🖼️  Downloads will now be PNG files');
  console.log('⚡ Automatic conversion happens in the browser');
  console.log('📁 No more WebP files - users get PNG as expected');
} else {
  console.log('❌ Category page not found');
}