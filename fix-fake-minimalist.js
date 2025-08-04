// fix-fake-minimalist.js
// Moves incorrectly labeled "minimalist" images back to their proper categories
// Run with: node fix-fake-minimalist.js

const fs = require('fs');
const path = require('path');

function fixFakeMinimalist() {
  console.log('🔧 Fixing fake minimalist images...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  let metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  let fixedCount = 0;
  
  // Specific fake minimalist images to fix
  const fakeMinimalistTitles = [
    'Minimalist White Home Office'
  ];
  
  // Other potentially fake minimalist patterns (add more as needed)
  const suspiciousPatterns = [
    'minimalist white home office',
    'minimalist home office with', // Usually means it has lots of stuff
  ];
  
  console.log('🔍 Looking for fake minimalist images...\n');
  
  Object.keys(metadata).forEach(key => {
    const data = metadata[key];
    const title = (data.title || '').toLowerCase();
    const currentCategory = data.category;
    
    // Check if this is a fake minimalist
    let isFakeMinimalist = false;
    let newCategory = null;
    
    // Check exact title matches
    if (fakeMinimalistTitles.some(fakeTitle => title === fakeTitle.toLowerCase())) {
      isFakeMinimalist = true;
      newCategory = 'home-offices'; // Move white home offices back to home offices
    }
    
    // Check suspicious patterns
    suspiciousPatterns.forEach(pattern => {
      if (title.includes(pattern)) {
        isFakeMinimalist = true;
        // Determine correct category based on content
        if (title.includes('home office')) {
          newCategory = 'home-offices';
        } else if (title.includes('executive')) {
          newCategory = 'executive-offices';
        } else if (title.includes('lobby')) {
          newCategory = 'lobbies';
        } else if (title.includes('private') || title.includes('consultation')) {
          newCategory = 'private-offices';
        } else {
          newCategory = 'home-offices'; // Default fallback
        }
      }
    });
    
    // Move fake minimalist images back to correct category
    if (isFakeMinimalist && currentCategory === 'minimalist' && newCategory) {
      console.log(`🔄 FIXING FAKE MINIMALIST: "${data.title}"`);
      console.log(`   File: ${data.filename}`);
      console.log(`   minimalist → ${newCategory}`);
      console.log('');
      
      metadata[key].category = newCategory;
      fixedCount++;
    }
  });
  
  // Save changes
  try {
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`✅ Fixed ${fixedCount} fake minimalist images\n`);
  } catch (error) {
    console.error('❌ Error saving file:', error);
    return;
  }
  
  // Show updated counts
  const categoryCounts = {};
  Object.values(metadata).forEach(data => {
    categoryCounts[data.category] = (categoryCounts[data.category] || 0) + 1;
  });
  
  console.log('📊 Updated category distribution:');
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  // Show what's left in minimalist (should be truly minimalist now)
  const trueMinimalistImages = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'minimalist');
  
  console.log(`\n🎨 TRUE minimalist images remaining (${trueMinimalistImages.length} total):`);
  trueMinimalistImages.forEach(([key, data]) => {
    console.log(`   ✓ "${data.title}" - ${data.filename}`);
  });
  
  if (trueMinimalistImages.length > 0) {
    console.log('\n💡 Updated homepage suggestion for minimalist:');
    const firstImage = trueMinimalistImages[0][1];
    console.log(`   image: '${firstImage.filename}'  // ${firstImage.title}`);
  }
  
  console.log('\n🎉 Fake minimalist cleanup complete!');
  console.log('📝 Your minimalist category should now only have truly minimalist images.');
}

fixFakeMinimalist();