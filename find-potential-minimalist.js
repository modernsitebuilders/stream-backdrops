// find-potential-minimalist.js
// Searches for images that might be minimalist based on keywords beyond just "minimalist"
// Run with: node find-potential-minimalist.js

const fs = require('fs');
const path = require('path');

function findPotentialMinimalist() {
  console.log('🔍 Searching for potentially minimalist images...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  // Keywords that might indicate minimalist style
  const minimalistKeywords = [
    'clean',
    'simple',
    'modern',
    'contemporary',
    'scandinavian',
    'white',
    'neutral',
    'uncluttered',
    'sleek',
    'minimal', // Note: minimal vs minimalist
    'sparse',
    'zen',
    'nordic'
  ];
  
  console.log('📋 Searching all categories for potential minimalist images...\n');
  
  const potentialMinimalist = [];
  
  Object.entries(metadata).forEach(([key, data]) => {
    const title = (data.title || '').toLowerCase();
    const description = (data.description || '').toLowerCase();
    const keywords = (data.keywords || []).map(k => k.toLowerCase());
    const category = data.category;
    
    // Skip images already in minimalist category
    if (category === 'minimalist') return;
    
    // Check if title, description, or keywords contain minimalist indicators
    const hasMinimalistKeyword = minimalistKeywords.some(keyword => 
      title.includes(keyword) || 
      description.includes(keyword) || 
      keywords.includes(keyword)
    );
    
    if (hasMinimalistKeyword) {
      potentialMinimalist.push({
        ...data,
        key,
        matchedKeywords: minimalistKeywords.filter(keyword => 
          title.includes(keyword) || 
          description.includes(keyword) || 
          keywords.includes(keyword)
        )
      });
    }
  });
  
  // Group by current category
  const byCategory = {};
  potentialMinimalist.forEach(image => {
    const cat = image.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(image);
  });
  
  console.log(`🎯 Found ${potentialMinimalist.length} potentially minimalist images:\n`);
  
  Object.entries(byCategory).forEach(([category, images]) => {
    console.log(`📁 ${category.toUpperCase()} (${images.length} candidates):`);
    images.forEach(image => {
      console.log(`   • "${image.title}"`);
      console.log(`     File: ${image.filename}`);
      console.log(`     Keywords: ${image.matchedKeywords.join(', ')}`);
      console.log('');
    });
  });
  
  if (potentialMinimalist.length === 0) {
    console.log('🤷 No additional minimalist-style images found.');
    console.log('Your minimalist collection of 5 images might be complete!');
    
    // Show current minimalist collection again
    const currentMinimalist = Object.entries(metadata)
      .filter(([_, data]) => data.category === 'minimalist');
    
    console.log('\n🎨 Your current minimalist collection:');
    currentMinimalist.forEach(([key, data]) => {
      console.log(`   ✓ "${data.title}" - ${data.filename}`);
    });
  } else {
    console.log('\n💡 Suggestions:');
    console.log('1. Review the candidates above');
    console.log('2. Manually move truly minimalist ones to minimalist category');
    console.log('3. Or create a script to move specific ones you identify');
  }
  
  console.log('\n📊 Current category distribution:');
  const counts = {};
  Object.values(metadata).forEach(data => {
    counts[data.category] = (counts[data.category] || 0) + 1;
  });
  Object.entries(counts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
}

findPotentialMinimalist();