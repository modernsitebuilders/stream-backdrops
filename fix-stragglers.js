// fix-stragglers.js
// Fixes the specific problematic images you mentioned
// Run with: node fix-stragglers.js

const fs = require('fs');
const path = require('path');

function fixStragglers() {
  console.log('🎯 Fixing specific straggler images...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  let fixedCount = 0;
  
  // Specific problem titles and their correct categories
  const fixes = {
    'Contemporary Physicians Office': 'private-offices',
    'Modern Engineering Office': 'private-offices', 
    'Upscale Real Estate Office': 'private-offices',
    'Professional Office With Windows': 'private-offices',
    'Warm Therapy Office': 'private-offices'
  };
  
  console.log('🔍 Looking for problem images...\n');
  
  Object.entries(metadata).forEach(([key, data]) => {
    const title = data.title || '';
    
    // Check if this title matches any of our problem images
    Object.entries(fixes).forEach(([problemTitle, correctCategory]) => {
      if (title.includes(problemTitle)) {
        const oldCategory = data.category;
        
        if (oldCategory !== correctCategory) {
          console.log(`🔧 FIXING: "${title}"`);
          console.log(`   File: ${data.filename}`);
          console.log(`   ${oldCategory} → ${correctCategory}`);
          console.log('');
          
          data.category = correctCategory;
          fixedCount++;
        }
      }
    });
  });
  
  // Save updated metadata
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log(`✅ Fixed ${fixedCount} straggler images\n`);
  
  // Show updated counts
  const categoryCounts = {};
  Object.values(metadata).forEach(data => {
    categoryCounts[data.category] = (categoryCounts[data.category] || 0) + 1;
  });
  
  console.log('📊 Updated category counts:');
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  // Show what's left in home-offices to verify it's clean
  console.log('\n🏠 First 8 images remaining in home-offices:');
  const homeImages = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'home-offices')
    .slice(0, 8);
  
  homeImages.forEach(([key, data]) => {
    console.log(`   ✓ "${data.title}" - ${data.filename}`);
  });
  
  if (homeImages.length > 0) {
    console.log('\n💡 Suggested better homepage image for home-offices:');
    console.log(`   image: '${homeImages[0][1].filename}'  // ${homeImages[0][1].title}`);
  }
  
  console.log('\n🎉 Stragglers fixed! Your home-offices should be clean now.');
}

fixStragglers();