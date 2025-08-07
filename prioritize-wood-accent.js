// prioritize-wood-accent.js
// Move the wood accent minimalist images to display first
// Run with: node prioritize-wood-accent.js

const fs = require('fs');
const path = require('path');

function prioritizeWoodAccent() {
  console.log('🪵 Prioritizing wood accent minimalist images...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  let metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  // Find all minimalist images
  const minimalistImages = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'minimalist');
  
  console.log(`📋 Current minimalist images (${minimalistImages.length} total):`);
  minimalistImages.forEach(([key, data]) => {
    console.log(`   • "${data.title}" - ${data.filename}`);
  });
  
  // Look for wood accent images
  const woodAccentImages = minimalistImages.filter(([_, data]) => {
    const title = (data.title || '').toLowerCase();
    const filename = (data.filename || '').toLowerCase();
    return title.includes('wood accent') || filename.includes('wood-accent');
  });
  
  console.log(`\n🪵 Found wood accent images (${woodAccentImages.length}):`);
  woodAccentImages.forEach(([key, data]) => {
    console.log(`   ✓ "${data.title}" - ${data.filename}`);
  });
  
  if (woodAccentImages.length === 0) {
    console.log('\n❌ No wood accent images found in minimalist category!');
    console.log('Looking for them in other categories...');
    
    // Search all categories for wood accent images
    const allWoodAccent = Object.entries(metadata).filter(([_, data]) => {
      const title = (data.title || '').toLowerCase();
      const filename = (data.filename || '').toLowerCase();
      return title.includes('wood accent') || filename.includes('wood-accent');
    });
    
    console.log(`\n🔍 Found wood accent images in other categories (${allWoodAccent.length}):`);
    allWoodAccent.forEach(([key, data]) => {
      console.log(`   • "${data.title}" - ${data.filename} (in ${data.category})`);
    });
    
    // Move the first 3 to minimalist
    if (allWoodAccent.length > 0) {
      console.log('\n📦 Moving first 3 wood accent images to minimalist...');
      allWoodAccent.slice(0, 3).forEach(([key, data]) => {
        console.log(`   Moving: ${data.filename} to minimalist`);
        metadata[key].category = 'minimalist';
        metadata[key].title = 'Minimalist Home Office With Wood Accent';
      });
    }
  }
  
  // Add priority sorting by updating the titles with prefixes
  let priorityCounter = 1;
  Object.keys(metadata).forEach(key => {
    const data = metadata[key];
    if (data.category === 'minimalist') {
      const title = (data.title || '').toLowerCase();
      const filename = (data.filename || '').toLowerCase();
      
      if (title.includes('wood accent') || filename.includes('wood-accent')) {
        // Add priority prefix (A, B, C) so they sort first
        const priorityPrefix = String.fromCharCode(64 + priorityCounter); // A, B, C
        metadata[key].sortPriority = priorityCounter;
        metadata[key].title = `Minimalist Home Office With Wood Accent ${priorityCounter}`;
        priorityCounter++;
        console.log(`   ⭐ Priority ${priorityPrefix}: ${data.filename}`);
      }
    }
  });
  
  // Save the updated metadata
  try {
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`\n✅ Successfully updated metadata file`);
  } catch (error) {
    console.error('❌ Error saving file:', error);
    return;
  }
  
  // Show final minimalist category
  const finalMinimalist = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'minimalist')
    .sort((a, b) => {
      // Sort by priority first, then by filename
      const aPriority = a[1].sortPriority || 999;
      const bPriority = b[1].sortPriority || 999;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a[1].filename.localeCompare(b[1].filename);
    });
  
  console.log(`\n🎨 Final minimalist category (${finalMinimalist.length} images):`);
  finalMinimalist.forEach(([key, data], index) => {
    const star = data.sortPriority ? '⭐' : '  ';
    console.log(`${star} ${index + 1}. "${data.title}" - ${data.filename}`);
  });
  
  console.log('\n🎉 Wood accent images are now prioritized in minimalist category!');
  console.log('The first 3 images will be the wood accent ones.');
}

prioritizeWoodAccent();