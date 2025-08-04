// move-true-minimalist.js
// Moves genuinely minimalist images to minimalist category
// Run with: node move-true-minimalist.js

const fs = require('fs');
const path = require('path');

function moveTrueMinimalist() {
  console.log('🎨 Moving true minimalist images to minimalist category...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  let metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  let movedCount = 0;
  
  // List of images that should be moved to minimalist category
  // Based on titles that are truly minimalist in style
  const trueMinimalistTitles = [
    // Scandinavian (inherently minimalist style)
    'Scandinavian Home Office',
    'Clean Scandinavian Home Office',
    'Scandinavian Home Office with Wood Accent - Premium 4K',
    
    // Clean/Modern combinations (minimalist aesthetic)
    'Clean Modern Home Office',
    'Modern Home Office With Plants', // If it's clean modern style
    
    // These "Minimalist White" were moved back but might actually be minimalist
    'Minimalist White Home Office', // Let's check if these are actually minimalist
    
    // Modern Glass (very clean, minimalist style)
    'Modern Glass Lobby',
    'Modern Glass Lobby - Premium 4K',
    
    // Contemporary with minimalist aesthetic
    'Contemporary Executive Home Office' // Only if they're truly minimal
  ];
  
  console.log('🔍 Evaluating candidates for minimalist category...\n');
  
  Object.keys(metadata).forEach(key => {
    const data = metadata[key];
    const title = data.title || '';
    const currentCategory = data.category;
    
    // Skip if already in minimalist
    if (currentCategory === 'minimalist') return;
    
    let shouldMove = false;
    
    // Scandinavian is inherently minimalist
    if (title.includes('Scandinavian')) {
      shouldMove = true;
    }
    // Clean + Modern combination suggests minimalist
    else if (title.includes('Clean') && title.includes('Modern')) {
      shouldMove = true;
    }
    // Modern Glass is typically very minimalist
    else if (title.includes('Modern Glass')) {
      shouldMove = true;
    }
    // Let's be selective with Contemporary - only if it seems minimal
    else if (title === 'Contemporary Executive Home Office') {
      // These might be minimalist, let's move a few
      shouldMove = true;
    }
    
    if (shouldMove) {
      console.log(`📦 MOVING: "${title}"`);
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
  
  // Show updated counts
  const finalCounts = {};
  Object.values(metadata).forEach(data => {
    finalCounts[data.category] = (finalCounts[data.category] || 0) + 1;
  });
  
  console.log('📊 Updated category distribution:');
  Object.entries(finalCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  // Show complete minimalist collection
  const allMinimalistImages = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'minimalist')
    .sort(([,a], [,b]) => a.title.localeCompare(b.title));
  
  console.log(`\n🎨 Complete MINIMALIST collection (${allMinimalistImages.length} images):`);
  allMinimalistImages.forEach(([key, data]) => {
    console.log(`   ✓ "${data.title}" - ${data.filename}`);
  });
  
  if (allMinimalistImages.length > 0) {
    console.log('\n💡 Homepage image suggestion for minimalist:');
    // Pick a good representative image
    const bestImage = allMinimalistImages.find(([,data]) => 
      data.title.includes('Scandinavian') || data.title.includes('Clean')
    ) || allMinimalistImages[0];
    
    console.log(`   image: '${bestImage[1].filename}'  // ${bestImage[1].title}`);
  }
  
  console.log('\n🎉 True minimalist images moved!');
  console.log('📝 Your /category/minimalist should now have a proper collection.');
}

moveTrueMinimalist();