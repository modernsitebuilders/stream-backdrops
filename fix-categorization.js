// fix-categorization.js
// This will fix the miscategorized images
// Run with: node fix-categorization.js

const fs = require('fs');
const path = require('path');

function fixCategorization() {
  console.log('🔧 Fixing image categorization...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  let fixedCount = 0;
  
  // Fix categorization based on title/filename content
  Object.entries(metadata).forEach(([key, data]) => {
    const filename = data.filename.toLowerCase();
    const title = (data.title || '').toLowerCase();
    const originalCategory = data.category;
    
    let newCategory = data.category;
    
    // Categorization rules based on title content
    if (title.includes('executive') || title.includes('ceo') || title.includes('luxury')) {
      newCategory = 'executive-offices';
    } else if (title.includes('home office') || title.includes('contemporary') || title.includes('scandinavian') || title.includes('minimalist home') || title.includes('mid-century') || title.includes('mediterranean villa') || title.includes('industrial loft') || title.includes('traditional library')) {
      newCategory = 'home-offices';
    } else if (title.includes('lobby') || title.includes('reception') || title.includes('hotel') || title.includes('university') || title.includes('startup incubator') || title.includes('law firm lobby')) {
      newCategory = 'lobbies';
    } else if (title.includes('private office') || title.includes('consultation') || title.includes('therapist') || title.includes('medical') || title.includes('wellness') || title.includes('legal counsel') || title.includes('architect')) {
      newCategory = 'private-offices';
    } else if (title.includes('conference room') || title.includes('meeting room')) {
      newCategory = 'conference-rooms';
    } else if (title.includes('open workspace') || title.includes('open office') || title.includes('software development') || title.includes('media company') || title.includes('consulting firm')) {
      newCategory = 'open-offices';
    }
    
    // Update if category changed
    if (newCategory !== originalCategory) {
      console.log(`📝 ${data.filename}`);
      console.log(`   "${data.title}"`);
      console.log(`   ${originalCategory} → ${newCategory}`);
      console.log('');
      
      data.category = newCategory;
      fixedCount++;
    }
  });
  
  // Save updated metadata
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log(`✅ Fixed ${fixedCount} image categorizations`);
  
  // Show new distribution
  const categoryCounts = {};
  Object.values(metadata).forEach(data => {
    categoryCounts[data.category] = (categoryCounts[data.category] || 0) + 1;
  });
  
  console.log('\n📊 New category distribution:');
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  // Suggest better homepage images
  console.log('\n🏠 Better homepage images:');
  ['home-offices', 'executive-offices', 'lobbies', 'private-offices'].forEach(category => {
    const categoryImages = Object.entries(metadata)
      .filter(([_, data]) => data.category === category && !data.isPremium)
      .slice(0, 1);
    
    if (categoryImages.length > 0) {
      const [key, data] = categoryImages[0];
      console.log(`   ${category}: '${data.filename}' // ${data.title}`);
    }
  });
}

fixCategorization();