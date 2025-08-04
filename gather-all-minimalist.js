// gather-all-minimalist.js
// Finds ALL minimalist images across categories and moves them to minimalist category
// Run with: node gather-all-minimalist.js

const fs = require('fs');
const path = require('path');

function gatherAllMinimalist() {
  console.log('🔍 Finding ALL minimalist images across categories...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  let metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  let movedCount = 0;
  
  // First, show what's currently in each category with "minimalist" in title
  console.log('📋 Current minimalist images by category:');
  const minimalistByCategory = {};
  
  Object.entries(metadata).forEach(([key, data]) => {
    const title = (data.title || '').toLowerCase();
    if (title.includes('minimalist') && title !== 'minimalist white home office') { // Exclude the fake ones
      const category = data.category;
      if (!minimalistByCategory[category]) {
        minimalistByCategory[category] = [];
      }
      minimalistByCategory[category].push(data);
    }
  });
  
  Object.entries(minimalistByCategory).forEach(([category, images]) => {
    console.log(`\n📁 ${category.toUpperCase()}:`);
    images.forEach(data => {
      console.log(`   • "${data.title}" - ${data.filename}`);
    });
  });
  
  console.log('\n🔄 Moving ALL minimalist images to minimalist category...\n');
  
  // Move ALL images with "minimalist" in title to minimalist category
  // EXCEPT the fake ones we already moved
  Object.keys(metadata).forEach(key => {
    const data = metadata[key];
    const title = (data.title || '').toLowerCase();
    const currentCategory = data.category;
    
    // Move if:
    // 1. Has "minimalist" in title
    // 2. NOT the fake "minimalist white home office" ones
    // 3. NOT already in minimalist category
    if (title.includes('minimalist') && 
        title !== 'minimalist white home office' && 
        currentCategory !== 'minimalist') {
      
      console.log(`📦 MOVING: "${data.title}"`);
      console.log(`   ${currentCategory} → minimalist`);
      console.log(`   File: ${data.filename}`);
      console.log('');
      
      metadata[key].category = 'minimalist';
      movedCount++;
    }
  });
  
  // Save changes
  try {
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`✅ Successfully moved ${movedCount} images to minimalist category\n`);
  } catch (error) {
    console.error('❌ Error saving file:', error);
    return;
  }
  
  // Show final results
  const finalCounts = {};
  Object.values(metadata).forEach(data => {
    finalCounts[data.category] = (finalCounts[data.category] || 0) + 1;
  });
  
  console.log('📊 Final category distribution:');
  Object.entries(finalCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  // Show complete minimalist collection
  const allMinimalistImages = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'minimalist');
  
  console.log(`\n🎨 Complete MINIMALIST collection (${allMinimalistImages.length} images):`);
  allMinimalistImages.forEach(([key, data]) => {
    console.log(`   ✓ "${data.title}" - ${data.filename}`);
  });
  
  if (allMinimalistImages.length > 0) {
    console.log('\n💡 Homepage image suggestion for minimalist:');
    const bestImage = allMinimalistImages[0][1];
    console.log(`   image: '${bestImage.filename}'  // ${bestImage.title}`);
  }
  
  console.log('\n🎉 All minimalist images gathered!');
  console.log('📝 Your /category/minimalist page should now show all truly minimalist images.');
}

gatherAllMinimalist();