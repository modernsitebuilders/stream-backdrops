// aggressive-categorization-fix.js
// This will FORCE recategorization based on titles
// Run with: node aggressive-categorization-fix.js

const fs = require('fs');
const path = require('path');

function aggressiveCategorization() {
  console.log('🔧 AGGRESSIVE categorization fix...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  let changedCount = 0;
  
  console.log('📋 BEFORE categorization:');
  const beforeCounts = {};
  Object.values(metadata).forEach(data => {
    beforeCounts[data.category] = (beforeCounts[data.category] || 0) + 1;
  });
  Object.entries(beforeCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  // FORCE recategorization - be very specific about keywords
  Object.entries(metadata).forEach(([key, data]) => {
    const title = (data.title || '').toLowerCase();
    const filename = (data.filename || '').toLowerCase();
    const originalCategory = data.category;
    
    let newCategory = null;
    
    // EXECUTIVE OFFICES - very specific keywords
    if (title.includes('executive') || 
        title.includes('ceo') || 
        title.includes('luxury') ||
        title.includes('corporate executive') ||
        title.includes('international executive') ||
        filename.includes('executive')) {
      newCategory = 'executive-offices';
    }
    // LOBBIES - specific keywords
    else if (title.includes('lobby') || 
             title.includes('reception') || 
             title.includes('hotel') ||
             title.includes('university') ||
             title.includes('startup incubator') ||
             title.includes('law firm') ||
             filename.includes('lobby')) {
      newCategory = 'lobbies';
    }
    // PRIVATE OFFICES - specific keywords  
    else if (title.includes('private office') ||
             title.includes('consultation') ||
             title.includes('therapist') ||
             title.includes('medical') ||
             title.includes('wellness') ||
             title.includes('legal counsel') ||
             title.includes('architect') ||
             filename.includes('private')) {
      newCategory = 'private-offices';
    }
    // CONFERENCE ROOMS - move to open-offices for now
    else if (title.includes('conference room') ||
             title.includes('meeting room') ||
             filename.includes('conference')) {
      newCategory = 'open-offices';
    }
    // OPEN OFFICES
    else if (title.includes('open workspace') ||
             title.includes('open office') ||
             title.includes('software development') ||
             title.includes('media company') ||
             title.includes('consulting firm') ||
             filename.includes('open')) {
      newCategory = 'open-offices';
    }
    // HOME OFFICES - everything else that mentions home
    else if (title.includes('home office') ||
             title.includes('contemporary') ||
             title.includes('scandinavian') ||
             title.includes('minimalist') ||
             title.includes('mid-century') ||
             title.includes('mediterranean') ||
             title.includes('industrial loft') ||
             title.includes('traditional library') ||
             filename.includes('home')) {
      newCategory = 'home-offices';
    }
    
    // Apply the change if we determined a new category
    if (newCategory && newCategory !== originalCategory) {
      console.log(`🔄 CHANGING: "${data.title}"`);
      console.log(`   ${originalCategory} → ${newCategory}`);
      console.log(`   File: ${data.filename}`);
      console.log('');
      
      data.category = newCategory;
      changedCount++;
    }
  });
  
  // Save the updated metadata
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log(`✅ FORCED ${changedCount} category changes\n`);
  
  // Show new distribution
  console.log('📋 AFTER categorization:');
  const afterCounts = {};
  Object.values(metadata).forEach(data => {
    afterCounts[data.category] = (afterCounts[data.category] || 0) + 1;
  });
  Object.entries(afterCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  // Show some examples from home-offices to verify
  console.log('\n🏠 First 5 images now in home-offices:');
  const homeImages = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'home-offices')
    .slice(0, 5);
  
  homeImages.forEach(([key, data]) => {
    console.log(`   ✓ "${data.title}" - ${data.filename}`);
  });
  
  console.log('\n🏢 First 5 images now in executive-offices:');
  const execImages = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'executive-offices')
    .slice(0, 5);
  
  execImages.forEach(([key, data]) => {
    console.log(`   ✓ "${data.title}" - ${data.filename}`);
  });
  
  console.log('\n🎉 Categorization complete! Check your homepage now.');
}

aggressiveCategorization();