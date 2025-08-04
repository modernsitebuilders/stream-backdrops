// find-my-data.js
// Run with: node find-my-data.js

const fs = require('fs');
const path = require('path');

function findEverything() {
  console.log('🔍 COMPREHENSIVE SEARCH FOR YOUR DATA');
  console.log('====================================\n');
  
  const rootDir = process.cwd();
  console.log(`Root directory: ${rootDir}\n`);
  
  // 1. Check for metadata file
  console.log('📄 SEARCHING FOR METADATA FILES:');
  const metadataPaths = [
    path.join(rootDir, 'public', 'data', 'image-metadata.json'),
    path.join(rootDir, 'data', 'image-metadata.json'),
    path.join(rootDir, 'image-metadata.json')
  ];
  
  let foundMetadata = false;
  metadataPaths.forEach(metaPath => {
    if (fs.existsSync(metaPath)) {
      console.log(`✅ FOUND: ${metaPath}`);
      try {
        const data = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        console.log(`   Contains ${Object.keys(data).length} images`);
        
        // Show executive office images
        const execImages = Object.entries(data).filter(([_, img]) => 
          img.category === 'executive-offices'
        );
        console.log(`   Executive offices: ${execImages.length} images`);
        if (execImages.length > 0) {
          console.log('   📁 Executive office filenames:');
          execImages.slice(0, 5).forEach(([key, img]) => {
            console.log(`      - ${img.filename}`);
          });
        }
        foundMetadata = true;
      } catch (error) {
        console.log(`   ❌ Error reading: ${error.message}`);
      }
    } else {  
      console.log(`❌ NOT FOUND: ${metaPath}`);
    }
  });
  
  if (!foundMetadata) {
    console.log('\n⚠️  NO METADATA FOUND! This means:');
    console.log('   1. You haven\'t run the executive-office-processor.js script yet');
    console.log('   2. Or the script failed to create the metadata file');
  }
  
  // 2. Check for image files
  console.log('\n🖼️  SEARCHING FOR IMAGE FILES:');
  const imageDir = path.join(rootDir, 'public', 'images');
  
  if (fs.existsSync(imageDir)) {
    const allFiles = fs.readdirSync(imageDir);
    const imageFiles = allFiles.filter(file => 
      file.toLowerCase().endsWith('.webp') || 
      file.toLowerCase().endsWith('.png') ||
      file.toLowerCase().endsWith('.jpg')
    );
    
    console.log(`✅ Found ${imageFiles.length} image files in public/images/`);
    
    // Look for executive office images
    const execFiles = imageFiles.filter(file => 
      file.toLowerCase().includes('executive') ||
      file.toLowerCase().includes('marble') ||
      file.toLowerCase().includes('financial') ||
      file.toLowerCase().includes('forest')
    );
    
    if (execFiles.length > 0) {
      console.log(`\n📁 EXECUTIVE OFFICE IMAGES (${execFiles.length} found):`);
      execFiles.forEach(file => console.log(`   - ${file}`));
    }
    
    // Look for home office images
    const homeFiles = imageFiles.filter(file => 
      file.toLowerCase().includes('home') ||
      file.toLowerCase().includes('scandinavian') ||
      file.toLowerCase().includes('clean')
    );
    
    if (homeFiles.length > 0) {
      console.log(`\n🏠 HOME OFFICE IMAGES (${homeFiles.length} found):`);
      homeFiles.slice(0, 3).forEach(file => console.log(`   - ${file}`));
    }
    
  } else {
    console.log('❌ public/images/ directory not found!');
  }
  
  // 3. Check for original PNG files
  console.log('\n🔍 SEARCHING FOR ORIGINAL PNG FILES:');
  const searchDirs = [
    path.join(rootDir, 'premium-source'),
    path.join(rootDir, 'executive-offices'),
    rootDir
  ];
  
  searchDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const pngFiles = files.filter(f => f.toLowerCase().endsWith('.png'));
      if (pngFiles.length > 0) {
        console.log(`📁 Found ${pngFiles.length} PNG files in: ${dir}`);
        pngFiles.slice(0, 3).forEach(file => console.log(`   - ${file}`));
      }
    }
  });
  
  console.log('\n🚀 NEXT STEPS:');
  if (!foundMetadata) {
    console.log('1. ❗ URGENT: Run your executive-office-processor.js script first');
    console.log('2. Make sure your PNG files are in the right location');
    console.log('3. Then check /api/metadata endpoint');
  } else {
    console.log('1. ✅ Metadata exists - use the filenames shown above');
    console.log('2. Update your homepage categories with actual filenames');
    console.log('3. Deploy your changes');
  }
}

findEverything();