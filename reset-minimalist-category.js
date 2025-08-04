// reset-minimalist-category.js
// RESETS the minimalist category - moves everything back to logical categories
// Then only keeps images with "Minimalist" in the actual title
// Run with: node reset-minimalist-category.js

const fs = require('fs');
const path = require('path');

function resetMinimalistCategory() {
  console.log('🔄 RESETTING minimalist category chaos...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  let metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  let resetCount = 0;
  
  console.log('📋 BEFORE reset - current minimalist category:');
  const currentMinimalist = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'minimalist');
  
  currentMinimalist.forEach(([key, data]) => {
    console.log(`   • "${data.title}" - ${data.filename}`);
  });
  
  console.log('\n🔄 Moving images back to logical categories...\n');
  
  // Reset ALL images currently in minimalist category
  Object.keys(metadata).forEach(key => {
    const data = metadata[key];
    const title = (data.title || '').toLowerCase();
    const currentCategory = data.category;
    
    if (currentCategory === 'minimalist') {
      let newCategory = null;
      
      // Determine correct category based on content, not keywords
      if (title.includes('home office')) {
        newCategory = 'home-offices';
      } else if (title.includes('executive')) {
        newCategory = 'executive-offices';
      } else if (title.includes('lobby') || title.includes('reception')) {
        newCategory = 'lobbies';
      } else if (title.includes('private') || title.includes('consultation') || 
                 title.includes('medical') || title.includes('therapy') ||
                 title.includes('physician') || title.includes('engineering')) {
        newCategory = 'private-offices';
      } else if (title.includes('conference') || title.includes('meeting')) {
        newCategory = 'open-offices';
      } else {
        // Default fallback based on typical patterns
        if (title.includes('office')) {
          newCategory = 'home-offices'; // Generic office goes to home
        } else {
          newCategory = 'lobbies'; // Generic space goes to lobbies
        }
      }
      
      if (newCategory) {
        console.log(`📦 MOVING: "${data.title}"`);
        console.log(`   minimalist → ${newCategory}`);
        console.log(`   File: ${data.filename}`);
        console.log('');
        
        metadata[key].category = newCategory;
        resetCount++;
      }
    }
  });
  
  console.log(`✅ Reset ${resetCount} images from minimalist category\n`);
  
  // Now, only put back images that ACTUALLY have "Minimalist" in the title
  // AND make sense as minimalist
  let addedBack = 0;
  
  console.log('🎨 Adding back ONLY true minimalist images...\n');
  
  Object.keys(metadata).forEach(key => {
    const data = metadata[key];
    const title = data.title || '';
    
    // Only move back if:
    // 1. Actually has "Minimalist" in title (capital M)
    // 2. Is not the fake "Minimalist White Home Office" ones
    if (title.includes('Minimalist') && 
        title !== 'Minimalist White Home Office') {
      
      console.log(`✅ KEEPING: "${title}"`);
      console.log(`   ${data.category} → minimalist`);
      console.log(`   File: ${data.filename}`);
      console.log('');
      
      metadata[key].category = 'minimalist';
      addedBack++;
    }
  });
  
  // Save changes
  try {
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`✅ Reset complete! Added back ${addedBack} true minimalist images\n`);
  } catch (error) {
    console.error('❌ Error saving file:', error);
    return;
  }
  
  // Show final results
  const finalCounts = {};
  Object.values(metadata).forEach(data => {
    finalCounts[data.category] = (finalCounts[data.category] || 0) + 1;
  });
  
  console.log('📊 FINAL category distribution:');
  Object.entries(finalCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  // Show clean minimalist collection
  const cleanMinimalist = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'minimalist');
  
  console.log(`\n🎨 CLEAN minimalist collection (${cleanMinimalist.length} images):`);
  cleanMinimalist.forEach(([key, data]) => {
    console.log(`   ✓ "${data.title}" - ${data.filename}`);
  });
  
  if (cleanMinimalist.length > 0) {
    console.log('\n💡 Homepage image suggestion:');
    const firstImage = cleanMinimalist[0][1];
    console.log(`   image: '${firstImage.filename}'  // ${firstImage.title}`);
  }
  
  console.log('\n🎉 Minimalist category RESET complete!');
  console.log('📝 Should now only contain images with "Minimalist" in actual titles.');
}

resetMinimalistCategory();