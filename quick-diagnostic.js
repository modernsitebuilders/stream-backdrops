// quick-diagnostic.js - Quick check of what's actually happening
// Run with: node quick-diagnostic.js

const fs = require('fs');
const path = require('path');

function quickDiagnostic() {
  console.log('🔍 Quick diagnostic of the 404 situation...\n');
  
  // 1. Check what images actually exist
  const imagesDir = path.join(__dirname, 'public', 'images');
  if (!fs.existsSync(imagesDir)) {
    console.log('❌ ERROR: public/images/ directory does not exist!');
    return;
  }
  
  const actualImages = fs.readdirSync(imagesDir)
    .filter(file => file.endsWith('.webp'))
    .sort();
  
  console.log(`📁 ACTUAL IMAGES (${actualImages.length} files):`);
  console.log('First 15 actual images:');
  actualImages.slice(0, 15).forEach((img, i) => console.log(`   ${(i+1).toString().padStart(2)}: ${img}`));
  
  // 2. Check the missing images
  const missingImages = [
    'scandinavian-home-office-1.webp',
    'luxury-ceo-corner-office-4.webp', 
    'corporate-lobby-with-reception-1.webp',
    'minimalist-consultant-office-1.webp',
    'professional-consultation-office-1.webp'
  ];
  
  console.log('\n🚨 MISSING IMAGES causing 404s:');
  missingImages.forEach(img => {
    const exists = actualImages.includes(img);
    console.log(`   ${exists ? '✅' : '❌'} ${img}`);
  });
  
  // 3. Check one specific component file
  const indexPath = path.join(__dirname, 'pages', 'index.js');
  if (fs.existsSync(indexPath)) {
    console.log('\n📄 Checking pages/index.js:');
    const content = fs.readFileSync(indexPath, 'utf8');
    
    missingImages.forEach(img => {
      const fullName = img;
      const keyName = img.replace('.webp', '');
      
      if (content.includes(fullName)) {
        console.log(`   🚨 FOUND: "${fullName}" in index.js`);
      }
      if (content.includes(keyName)) {
        console.log(`   🚨 FOUND: "${keyName}" in index.js`);
      }
    });
    
    // Show lines with image references
    const lines = content.split('\n');
    const imageLines = lines.filter(line => 
      line.includes('.webp') || 
      missingImages.some(img => line.includes(img.replace('.webp', '')))
    );
    
    if (imageLines.length > 0) {
      console.log('\n📋 Lines with image references in index.js:');
      imageLines.forEach((line, i) => {
        console.log(`   ${i+1}: ${line.trim()}`);
      });
    }
  }
  
  // 4. Find similar images that could be replacements
  console.log('\n🔄 Potential replacements from your actual images:');
  
  missingImages.forEach(missingImg => {
    console.log(`\nFor ${missingImg}:`);
    
    // Look for similar names
    const similarImages = actualImages.filter(img => {
      const missing = missingImg.toLowerCase().replace('.webp', '').replace(/-/g, '');
      const actual = img.toLowerCase().replace('.webp', '').replace(/-/g, '');
      
      // Check for common words
      const missingWords = missing.split(/[\s-_]+/);
      const actualWords = actual.split(/[\s-_]+/);
      
      const commonWords = missingWords.filter(word => 
        actualWords.some(aWord => aWord.includes(word) || word.includes(aWord))
      );
      
      return commonWords.length >= 1;
    });
    
    if (similarImages.length > 0) {
      console.log('   Possible replacements:');
      similarImages.slice(0, 3).forEach(img => console.log(`     - ${img}`));
    } else {
      console.log('   No similar images found - use any from your collection');
      actualImages.slice(0, 2).forEach(img => console.log(`     - ${img}`));
    }
  });
  
  console.log('\n💡 Next steps:');
  console.log('1. The fix script may not have found the right component files');
  console.log('2. OR the components might be getting image names from somewhere else');
  console.log('3. Let me search ALL JavaScript files for these specific missing images');
  
  // 5. Search ALL js files for these missing images
  console.log('\n🔍 Searching ALL .js files for missing image references...');
  
  function searchAllFiles(dir, results = []) {
    if (!fs.existsSync(dir)) return results;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        searchAllFiles(fullPath, results);
      } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        missingImages.forEach(img => {
          if (content.includes(img) || content.includes(img.replace('.webp', ''))) {
            results.push({ file: fullPath.replace(__dirname + '\\', ''), image: img });
          }
        });
      }
    });
    return results;
  }
  
  const foundReferences = searchAllFiles(__dirname);
  
  if (foundReferences.length > 0) {
    console.log('\n🎯 FOUND missing image references in:');
    foundReferences.forEach(({ file, image }) => {
      console.log(`   ${file} -> ${image}`);
    });
  } else {
    console.log('\n✅ No hardcoded references found in .js files');
    console.log('   The images might be coming from metadata or dynamic sources');
  }
}

quickDiagnostic();