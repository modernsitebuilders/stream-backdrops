// overhaul-metadata-categories.js - Update ALL metadata to match current category structure
const fs = require('fs');
const path = require('path');

function overhaulMetadata() {
  console.log('🔧 OVERHAULING metadata to match current categories...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  // Load current metadata
  let metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  console.log(`📋 Loaded ${Object.keys(metadata).length} images`);
  
  // Show current broken state
  const beforeCounts = {};
  Object.values(metadata).forEach(item => {
    beforeCounts[item.category] = (beforeCounts[item.category] || 0) + 1;
  });
  
  console.log('📊 BEFORE - Current (broken) categories:');
  Object.entries(beforeCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  console.log('\n🎯 TARGET categories: well-lit, ambient-lighting, office-spaces\n');
  
  // Strategy: Categorize based on filename and title content
  let changedCount = 0;
  
  Object.keys(metadata).forEach(key => {
    const data = metadata[key];
    const filename = (data.filename || '').toLowerCase();
    const title = (data.title || '').toLowerCase();
    
    let newCategory = null;
    
    // Categorization logic based on filename/title keywords
    if (filename.includes('well-lit') || 
        title.includes('well lit') || 
        title.includes('bright') ||
        filename.includes('bright')) {
      newCategory = 'well-lit';
    }
    else if (filename.includes('ambient') || 
             filename.includes('ambiant') ||
             title.includes('ambient') ||
             title.includes('atmospheric') ||
             title.includes('mood') ||
             filename.includes('professional-shelves')) {
      newCategory = 'ambient-lighting';
    }
    else if (filename.includes('office') ||
             title.includes('office') ||
             title.includes('executive') ||
             title.includes('workplace') ||
             title.includes('corporate') ||
             filename.includes('home-lifestyle')) {
      newCategory = 'office-spaces';
    }
    else {
      // Default fallback - distribute evenly
      const hash = key.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      if (hash % 3 === 0) newCategory = 'well-lit';
      else if (hash % 3 === 1) newCategory = 'ambient-lighting';
      else newCategory = 'office-spaces';
    }
    
    if (newCategory && data.category !== newCategory) {
      const oldCategory = data.category;
      metadata[key].category = newCategory;
      changedCount++;
      console.log(`✅ ${data.filename}: ${oldCategory} → ${newCategory}`);
    }
  });
  
  // Update descriptions and keywords to match new categories
  Object.keys(metadata).forEach(key => {
    const data = metadata[key];
    const category = data.category;
    
    // Update description based on new category
    let newDescription = '';
    if (category === 'well-lit') {
      newDescription = `Well-lit ${data.title?.toLowerCase() || 'background'} perfect for professional video calls and online meetings`;
    } else if (category === 'ambient-lighting') {
      newDescription = `Ambient lighting ${data.title?.toLowerCase() || 'background'} with atmospheric mood perfect for video calls`;
    } else if (category === 'office-spaces') {
      newDescription = `Professional office space ${data.title?.toLowerCase() || 'background'} perfect for business meetings and video conferences`;
    }
    
    metadata[key].description = newDescription;
    
    // Update keywords
    const baseKeywords = ['virtual background', 'video call background', 'zoom background', 'professional background'];
    const categoryKeywords = {
      'well-lit': ['well lit', 'bright lighting', 'natural light'],
      'ambient-lighting': ['ambient lighting', 'atmospheric', 'mood lighting'],
      'office-spaces': ['office space', 'business meeting', 'corporate', 'workplace']
    };
    
    metadata[key].keywords = [...baseKeywords, ...categoryKeywords[category]];
  });
  
  // Save updated metadata
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log(`\n✅ Updated ${changedCount} image categories`);
  
  // Show final correct state
  const afterCounts = {};
  Object.values(metadata).forEach(item => {
    afterCounts[item.category] = (afterCounts[item.category] || 0) + 1;
  });
  
  console.log('\n📊 AFTER - Fixed categories:');
  Object.entries(afterCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  // Show sample images for each category
  console.log('\n🖼️  Sample images per category:');
  ['well-lit', 'ambient-lighting', 'office-spaces'].forEach(category => {
    const categoryImages = Object.entries(metadata)
      .filter(([_, data]) => data.category === category)
      .slice(0, 2);
    
    console.log(`\n${category}:`);
    categoryImages.forEach(([key, data]) => {
      console.log(`   - ${data.filename} (${data.title})`);
    });
  });
  
  console.log('\n🎉 METADATA OVERHAUL COMPLETE!');
  console.log('\nYour categories now match your website structure:');
  console.log('✅ well-lit');
  console.log('✅ ambient-lighting'); 
  console.log('✅ office-spaces');
  
  console.log('\n🚀 Next steps:');
  console.log('1. Restart dev server: npm run dev');
  console.log('2. Test all category pages:');
  console.log('   - http://localhost:3000/category/well-lit');
  console.log('   - http://localhost:3000/category/ambient-lighting');
  console.log('   - http://localhost:3000/category/office-spaces');
  console.log('3. Images should now appear on all category pages!');
}

overhaulMetadata();