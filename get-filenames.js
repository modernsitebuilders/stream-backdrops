// get-filenames.js
// Run with: node get-filenames.js

const fs = require('fs');
const path = require('path');

function getExecutiveOfficeFilenames() {
  const imagesDir = path.join(__dirname, 'public', 'images');
  
  try {
    // Get all PNG files
    const allFiles = fs.readdirSync(imagesDir);
    const pngFiles = allFiles.filter(file => file.toLowerCase().endsWith('.png'));
    
    console.log('🔍 Found PNG files in public/images/:');
    console.log('=====================================');
    
    // Filter for likely executive office files (adjust these keywords as needed)
    const executiveKeywords = [
      'executive', 'office', 'marble', 'corner', 'mahogany', 
      'luxury', 'desk', 'wood', 'stone', 'green', 'medical',
      'working', 'professional', 'ceo', 'boardroom'
    ];
    
    const executiveFiles = pngFiles.filter(file => {
      const fileName = file.toLowerCase();
      return executiveKeywords.some(keyword => fileName.includes(keyword));
    });
    
    if (executiveFiles.length > 0) {
      console.log('\n🏢 EXECUTIVE OFFICE FILES FOUND:');
      console.log('================================');
      
      // Format as JavaScript array
      const jsArray = executiveFiles.map(file => `  '${file}'`).join(',\n');
      
      console.log('const executiveOfficeFiles = [');
      console.log(jsArray);
      console.log('];');
      
      console.log(`\n📊 Found ${executiveFiles.length} executive office files`);
      
      // Also show premium candidates (you'll need to manually classify these)
      console.log('\n💎 PREMIUM CANDIDATES (manually classify):');
      console.log('==========================================');
      console.log('const premiumFiles = [');
      console.log('  // Copy the best ones from above array');
      console.log('  // Based on our session, look for:');
      console.log('  // - marble-accent files');
      console.log('  // - corner-office files'); 
      console.log('  // - forest-green files');
      console.log('  // - travertine-stone files');
      console.log('  // - medical-sage files');
      console.log('];');
      
    } else {
      console.log('\n⚠️  NO EXECUTIVE OFFICE FILES FOUND');
      console.log('Showing ALL PNG files instead:');
      console.log('==============================');
      
      const jsArray = pngFiles.map(file => `  '${file}'`).join(',\n');
      console.log('const allPngFiles = [');
      console.log(jsArray);
      console.log('];');
    }
    
    console.log(`\n📁 Total PNG files: ${pngFiles.length}`);
    
  } catch (error) {
    console.error('❌ Error reading images directory:', error.message);
    console.log('\n🔧 Make sure you have a public/images/ folder with PNG files');
  }
}

getExecutiveOfficeFilenames();