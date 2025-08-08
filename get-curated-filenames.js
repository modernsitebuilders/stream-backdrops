// get-curated-filenames.js
// Run with: node get-curated-filenames.js
// This will scan your curated collection folder and output the filenames ready for the processing script

const fs = require('fs');
const path = require('path');

function getCuratedFilenames() {
  // UPDATE THIS PATH - where you put your curated collection images
  const curatedDir = path.join(__dirname, '..', 'curated-collection'); // Your curated images folder
  
  console.log('🔍 Scanning curated collection folder for PNG files...');
  console.log(`📁 Looking in: ${curatedDir}\n`);
  
  try {
    // Check if directory exists
    if (!fs.existsSync(curatedDir)) {
      console.log('❌ Curated collection directory not found!');
      console.log(`💡 Please create the folder: ${curatedDir}`);
      console.log('   And put your selected PNG files in there.');
      return;
    }
    
    // Get all PNG files
    const allFiles = fs.readdirSync(curatedDir);
    const pngFiles = allFiles.filter(file => file.toLowerCase().endsWith('.png'));
    
    if (pngFiles.length === 0) {
      console.log('⚠️  No PNG files found in curated collection folder!');
      console.log('💡 Make sure to put your selected PNG files in:');
      console.log(`   ${curatedDir}`);
      return;
    }
    
    console.log(`📊 Found ${pngFiles.length} PNG files in your curated collection:`);
    console.log('==============================================================\n');
    
    // Sort files alphabetically for easier review
    const sortedFiles = pngFiles.sort();
    
    // Show each file with a number for easy reference
    console.log('📋 Your curated collection files:');
    console.log('================================');
    sortedFiles.forEach((file, index) => {
      console.log(`${(index + 1).toString().padStart(2, ' ')}. ${file}`);
    });
    
    console.log('\n🔄 Ready to copy into processing script:');
    console.log('========================================');
    
    // Format as JavaScript array for easy copy-paste into process-curated-collection.js
    const jsArray = sortedFiles.map(file => `  '${file}'`).join(',\n');
    
    console.log('const curatedImages = [');
    console.log(jsArray);
    console.log('];');
    
    console.log('\n💡 Next steps:');
    console.log('1. Copy the array above');
    console.log('2. Paste it into process-curated-collection.js (replacing the placeholder array)');
    console.log('3. Run: node clear-old-images.js');
    console.log('4. Run: node process-curated-collection.js');
    
    // Show some analysis to help with categorization
    console.log('\n🔍 Quick categorization preview:');
    console.log('================================');
    
    const categories = {
      'Professional Shelves': [],
      'Home & Lifestyle': [],
      'Academic & Literary': [],
      'Creative & Artistic': [],
      'Specialized Professional': [],
      'Natural & Rustic': []
    };
    
    sortedFiles.forEach(file => {
      const name = file.toLowerCase();
      
      if (name.includes('shelf') || name.includes('shelves') || name.includes('floating') ||
          (name.includes('wood') && (name.includes('light') || name.includes('dark'))) ||
          name.includes('concrete') || name.includes('stone') || name.includes('metal') ||
          name.includes('glass') || name.includes('industrial')) {
        categories['Professional Shelves'].push(file);
      }
      else if (name.includes('bar') || name.includes('curio') || name.includes('minimalist') ||
               name.includes('scandinavian') || name.includes('hygge') || name.includes('cozy')) {
        categories['Home & Lifestyle'].push(file);
      }
      else if (name.includes('library') || name.includes('study') || name.includes('academic') ||
               name.includes('vintage') || name.includes('map') || name.includes('book')) {
        categories['Academic & Literary'].push(file);
      }
      else if (name.includes('gallery') || name.includes('botanical') || name.includes('garden') ||
               name.includes('artistic') || name.includes('creative')) {
        categories['Creative & Artistic'].push(file);
      }
      else if (name.includes('science') || name.includes('lab') || name.includes('culinary') ||
               name.includes('cooking') || name.includes('medical') || name.includes('technical')) {
        categories['Specialized Professional'].push(file);
      }
      else if (name.includes('rustic') || name.includes('reclaimed') || name.includes('natural') ||
               name.includes('organic') || name.includes('farmhouse')) {
        categories['Natural & Rustic'].push(file);
      }
      else {
        categories['Professional Shelves'].push(file); // Default fallback
      }
    });
    
    Object.entries(categories).forEach(([category, files]) => {
      if (files.length > 0) {
        console.log(`\n📁 ${category} (${files.length} images):`);
        files.forEach(file => console.log(`   • ${file}`));
      }
    });
    
    console.log('\n✨ Perfect! Your curated collection looks ready to process.');
    
  } catch (error) {
    console.error('❌ Error reading curated collection directory:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the curated-collection folder exists');
    console.log('2. Put your selected PNG files in that folder');
    console.log('3. Update the curatedDir path in this script if needed');
  }
}

getCuratedFilenames();