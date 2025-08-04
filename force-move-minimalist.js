// force-move-minimalist.js
// FORCE moves all images with "minimalist" in title to minimalist category
// Run with: node force-move-minimalist.js

const fs = require('fs');
const path = require('path');

function forceMoveMinimalist() {
  console.log('💪 FORCE moving minimalist images...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  let metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  let movedCount = 0;
  
  // First, show current state
  console.log('📋 BEFORE moving:');
  const beforeCounts = {};
  Object.values(metadata).forEach(data => {
    beforeCounts[data.category] = (beforeCounts[data.category] || 0) + 1;
  });
  Object.entries(beforeCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  console.log('\n🔍 Looking for images with "minimalist" in title...\n');
  
  // Force move ALL images with "minimalist" in title
  Object.keys(metadata).forEach(key => {
    const data = metadata[key];
    const title = (data.title || '').toLowerCase();
    
    if (title.includes('minimalist')) {
      const oldCategory = data.category;
      console.log(`📦 MOVING: "${data.title}"`);
      console.log(`   Current category: ${oldCategory}`);
      console.log(`   File: ${data.filename}`);
      
      // FORCE change the category
      metadata[key].category = 'minimalist';
      movedCount++;
      console.log(`   ✅ Moved to: minimalist\n`);
    }
  });
  
  // Write the changes back to file
  try {
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`✅ Successfully saved ${movedCount} changes to metadata file\n`);
  } catch (error) {
    console.error('❌ Error saving file:', error);
    return;
  }
  
  // Show AFTER state
  console.log('📋 AFTER moving:');
  const afterCounts = {};
  Object.values(metadata).forEach(data => {
    afterCounts[data.category] = (afterCounts[data.category] || 0) + 1;
  });
  Object.entries(afterCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  // Show what's now in minimalist category
  const minimalistImages = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'minimalist');
  
  console.log(`\n🎨 Images now in MINIMALIST category (${minimalistImages.length} total):`);
  minimalistImages.forEach(([key, data]) => {
    console.log(`   ✓ "${data.title}" - ${data.filename}`);
  });
  
  if (minimalistImages.length > 0) {
    console.log('\n💡 Suggested homepage image for minimalist:');
    const firstImage = minimalistImages[0][1];
    console.log(`   image: '${firstImage.filename}'  // ${firstImage.title}`);
  }
  
  console.log('\n🎉 Force move complete! Check /category/minimalist now.');
}

forceMoveMinimalist();