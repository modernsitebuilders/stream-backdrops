// create-minimalist-category.js
// Creates a separate "minimalist" category for all minimalist images
// Run with: node create-minimalist-category.js

const fs = require('fs');
const path = require('path');

function createMinimalistCategory() {
  console.log('🎨 Creating separate MINIMALIST category...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  let movedCount = 0;
  
  console.log('🔍 Moving all minimalist images to minimalist category...\n');
  
  Object.entries(metadata).forEach(([key, data]) => {
    const title = (data.title || '').toLowerCase();
    const currentCategory = data.category;
    
    // Move ALL minimalist images to minimalist category
    if (title.includes('minimalist')) {
      const newCategory = 'minimalist';
      
      if (currentCategory !== newCategory) {
        console.log(`📦 MOVING: "${data.title}"`);
        console.log(`   File: ${data.filename}`);
        console.log(`   ${currentCategory} → ${newCategory}`);
        console.log('');
        
        data.category = newCategory;
        movedCount++;
      }
    }
  });
  
  // Save updated metadata
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log(`✅ Moved ${movedCount} images to minimalist category\n`);
  
  // Show new distribution
  const categoryCounts = {};
  Object.values(metadata).forEach(data => {
    categoryCounts[data.category] = (categoryCounts[data.category] || 0) + 1;
  });
  
  console.log('📊 New category distribution:');
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  // Show what's in the new minimalist category
  console.log('\n🎨 Images in new MINIMALIST category:');
  const minimalistImages = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'minimalist')
    .slice(0, 10); // Show first 10
  
  minimalistImages.forEach(([key, data]) => {
    console.log(`   ✓ "${data.title}" - ${data.filename}`);
  });
  
  if (minimalistImages.length > 10) {
    console.log(`   ... and ${Object.values(metadata).filter(data => data.category === 'minimalist').length - 10} more`);
  }
  
  // Suggest homepage image for minimalist
  if (minimalistImages.length > 0) {
    console.log('\n💡 For your homepage, add minimalist category:');
    console.log(`{
  name: 'Minimalist',
  slug: 'minimalist',
  description: 'Clean, minimalist backgrounds for modern professionals',
  image: '${minimalistImages[0][1].filename}'  // ${minimalistImages[0][1].title}
}`);
  }
  
  console.log('\n🎉 Minimalist category created!');
  console.log('📝 Next steps:');
  console.log('1. Add minimalist to your categoryInfo in [slug].js');
  console.log('2. Add minimalist card to homepage categories array');
}

createMinimalistCategory();