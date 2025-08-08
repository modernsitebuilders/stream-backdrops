// get-office-space-filenames.js
// This script scans your zoom-images folder and gets filenames for your 15 office space images
// Save this file in your stream-backdrops/nextjs-site/ folder
// Run with: node get-office-space-filenames.js

const fs = require('fs');
const path = require('path');

function getOfficeSpaceFilenames() {
  // Path to your zoom-images folder
  const zoomImagesDir = path.join(__dirname, '..', 'zoom-images');
  
  console.log('🔍 Scanning zoom-images folder for office space files...');
  console.log(`📁 Looking in: ${zoomImagesDir}\n`);
  
  try {
    // Check if directory exists
    if (!fs.existsSync(zoomImagesDir)) {
      console.log('❌ zoom-images directory not found!');
      console.log(`💡 Expected location: ${zoomImagesDir}`);
      console.log('   Make sure the zoom-images folder exists in your stream-backdrops directory.');
      return;
    }
    
    // Get all files in the directory
    const allFiles = fs.readdirSync(zoomImagesDir);
    
    // Filter for image files (common formats)
    const imageFiles = allFiles.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext);
    });
    
    if (imageFiles.length === 0) {
      console.log('⚠️  No image files found in zoom-images folder!');
      console.log('💡 Make sure your office space images are in:');
      console.log(`   ${zoomImagesDir}`);
      return;
    }
    
    console.log(`📊 Found ${imageFiles.length} image files in zoom-images folder:`);
    console.log('===========================================================\n');
    
    // Sort files alphabetically for easier review
    const sortedFiles = imageFiles.sort();
    
    // Show each file with a number for easy reference
    console.log('📋 Your office space image files:');
    console.log('=================================');
    sortedFiles.forEach((file, index) => {
      console.log(`${(index + 1).toString().padStart(2, ' ')}. ${file}`);
    });
    
    console.log('\n🔄 Ready to copy into your processing script:');
    console.log('=============================================');
    
    // Format as JavaScript array for easy copy-paste
    const jsArray = sortedFiles.map(file => `  '${file}'`).join(',\n');
    
    console.log('// Office Spaces category - 15 carefully selected images');
    console.log('const officeSpaceImages = [');
    console.log(jsArray);
    console.log('];');
    
    console.log('\n📝 Image details:');
    console.log('=================');
    sortedFiles.forEach((file, index) => {
      const filePath = path.join(zoomImagesDir, file);
      const stats = fs.statSync(filePath);
      const fileSizeKB = Math.round(stats.size / 1024);
      console.log(`${(index + 1).toString().padStart(2, ' ')}. ${file} (${fileSizeKB} KB)`);
    });
    
    console.log('\n💡 Next steps:');
    console.log('==============');
    console.log('1. Copy the array above into your image processing script');
    console.log('2. Create the "office-spaces" category in your site configuration');
    console.log('3. Process these images for optimization and upload');
    console.log('4. Update your category navigation to include "Office Spaces"');
    
    // Also save to a text file for easy reference
    const outputFile = path.join(__dirname, 'office-space-filenames.txt');
    const outputContent = [
      'Office Space Image Files from zoom-images folder',
      '================================================',
      '',
      `Total files found: ${imageFiles.length}`,
      `Scanned directory: ${zoomImagesDir}`,
      `Generated on: ${new Date().toLocaleString()}`,
      '',
      'Files:',
      ...sortedFiles.map((file, index) => `${index + 1}. ${file}`),
      '',
      'JavaScript Array:',
      'const officeSpaceImages = [',
      ...sortedFiles.map(file => `  '${file}'`),
      '];'
    ].join('\n');
    
    fs.writeFileSync(outputFile, outputContent);
    console.log(`\n💾 File list also saved to: ${outputFile}`);
    
  } catch (error) {
    console.error('❌ Error scanning directory:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('- Make sure the zoom-images folder exists');
    console.log('- Check that you have read permissions for the folder');
    console.log('- Verify the folder contains your office space images');
  }
}

// Function to analyze image types (bonus feature)
function analyzeImageTypes(files) {
  console.log('\n🔍 Image type analysis:');
  console.log('=======================');
  
  const typeCount = {};
  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    typeCount[ext] = (typeCount[ext] || 0) + 1;
  });
  
  Object.entries(typeCount).forEach(([type, count]) => {
    console.log(`${type}: ${count} files`);
  });
}

// Run the function
if (require.main === module) {
  getOfficeSpaceFilenames();
}

module.exports = { getOfficeSpaceFilenames };