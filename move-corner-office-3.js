// move-corner-office-3.js
// Moves the 3rd "Corner Office With City Views" to minimalist category
// Run with: node move-corner-office-3.js

const fs = require('fs');
const path = require('path');

function moveCornerOffice3() {
  console.log('🎯 Moving Corner Office With City Views #3 to minimalist...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  let metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  let moved = false;
  
  // Find the 3rd corner office image
  const targetFilename = 'corner-office-with-city-views-3.webp';
  
  Object.keys(metadata).forEach(key => {
    const data = metadata[key];
    
    if (data.filename === targetFilename) {
      const oldCategory = data.category;
      const oldTitle = data.title;
      
      console.log(`🔄 MOVING: "${oldTitle}"`);
      console.log(`   File: ${targetFilename}`);
      console.log(`   ${oldCategory} → minimalist`);
      console.log(`   Title: "${oldTitle}" → "Minimalist Corner Office With City Views"`);
      console.log('');
      
      // Update category and title
      metadata[key].category = 'minimalist';
      metadata[key].title = 'Minimalist Corner Office With City Views';
      moved = true;
    }
  });
  
  if (!moved) {
    console.log(`❌ Could not find: ${targetFilename}`);
    console.log('Available corner office files:');
    Object.values(metadata).forEach(data => {
      if (data.title && data.title.includes('Corner Office')) {
        console.log(`   • "${data.title}" - ${data.filename}`);
      }
    });
    return;
  }
  
  // Save changes
  try {
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`✅ Successfully moved Corner Office #3 to minimalist\n`);
  } catch (error) {
    console.error('❌ Error saving file:', error);
    return;
  }
  
  // Show updated counts
  const counts = {};
  Object.values(metadata).forEach(data => {
    counts[data.category] = (counts[data.category] || 0) + 1;
  });
  
  console.log('📊 Updated category distribution:');
  Object.entries(counts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  // Show updated minimalist collection
  const minimalistImages = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'minimalist');
  
  console.log(`\n🎨 Updated MINIMALIST collection (${minimalistImages.length} images):`);
  minimalistImages.forEach(([key, data]) => {
    console.log(`   ✓ "${data.title}" - ${data.filename}`);
  });
  
  console.log('\n🎉 Corner Office #3 moved to minimalist!');
}

moveCornerOffice3();