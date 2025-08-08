// fix-metadata-categories.js - Update metadata to match new category structure
const fs = require('fs');
const path = require('path');

const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata-cleaned.json');

console.log('🔧 Fixing metadata categories to match new structure...\n');

if (fs.existsSync(metadataPath)) {
  let metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  let changedCount = 0;
  
  // Update each image's category based on its filename
  Object.entries(metadata).forEach(([key, data]) => {
    let newCategory = null;
    
    // Check the actual filename to determine correct category
    if (data.filename && data.filename.includes('home-lifestyle')) {
      newCategory = 'home-lifestyle';
    } else if (data.filename && (data.filename.includes('professional-shelves') || 
                                data.filename.includes('professional') ||
                                data.filename.includes('shelves'))) {
      newCategory = 'professional-shelves';
    } else {
      // If filename doesn't match, determine by current category
      if (data.category === 'home-offices' || data.category === 'minimalist') {
        newCategory = 'home-lifestyle';
      } else {
        newCategory = 'professional-shelves';
      }
    }
    
    if (newCategory && data.category !== newCategory) {
      console.log(`📝 ${data.filename}: ${data.category} → ${newCategory}`);
      metadata[key].category = newCategory;
      changedCount++;
    }
  });
  
  // Save updated metadata
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log(`\n✅ Updated ${changedCount} images to new categories`);
  
  // Show final counts
  const finalCounts = {};
  Object.values(metadata).forEach(item => {
    finalCounts[item.category] = (finalCounts[item.category] || 0) + 1;
  });
  
  console.log('\n📊 Final category counts:');
  Object.entries(finalCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
} else {
  console.log('❌ Metadata file not found!');
}