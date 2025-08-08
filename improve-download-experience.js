// auto-download-solution.js - Create seamless auto-downloads
const fs = require('fs');
const path = require('path');

const categoryPagePath = path.join(__dirname, 'pages', 'category', '[slug].js');

if (fs.existsSync(categoryPagePath)) {
  let content = fs.readFileSync(categoryPagePath, 'utf8');
  
  // Replace the download functionality with automatic download
  const autoDownloadFunction = `
  const handleDownload = async (image) => {
    try {
      // Fetch the image
      const response = await fetch(\`/images/\${image.filename}\`);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = \`StreamBackdrops-\${image.filename}\`;
      
      // Auto-click to download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to regular download
      const link = document.createElement('a');
      link.href = \`/images/\${image.filename}\`;
      link.download = \`StreamBackdrops-\${image.filename}\`;
      link.click();
    }
  };`;
  
  // Insert the download function before the return statement
  content = content.replace(
    /const category = categoryInfo\[slug\];/,
    `${autoDownloadFunction}\n\n  const category = categoryInfo[slug];`
  );
  
  // Replace the download button in the preview modal
  content = content.replace(
    /href={\`\/images\/\${previewImage\.filename}\`}\s*download={previewImage\.filename}/g,
    'href="#" onClick={(e) => { e.preventDefault(); handleDownload(previewImage); }}'
  );
  
  // Replace download links in the grid (if any)
  content = content.replace(
    /href={\`\/images\/\${image\.filename}\`}\s*download={image\.filename}/g,
    'href="#" onClick={(e) => { e.preventDefault(); handleDownload(image); }}'
  );
  
  fs.writeFileSync(categoryPagePath, content);
  console.log('✅ Added automatic download functionality');
  console.log('   🚀 Downloads now trigger automatically');
  console.log('   📁 No more file explorer popups');
  console.log('   🎯 Downloads go directly to default Downloads folder');
} else {
  console.log('❌ Category page not found');
}