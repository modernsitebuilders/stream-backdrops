// diagnostic-only.js
// ONLY SHOWS current state - MOVES NOTHING
// Use this to see what's where, then manually fix
// Run with: node diagnostic-only.js

const fs = require('fs');
const path = require('path');

function diagnosticOnly() {
  console.log('🔍 DIAGNOSTIC - Current category state (NO CHANGES MADE)\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  // Group by category
  const byCategory = {};
  Object.entries(metadata).forEach(([key, data]) => {
    const cat = data.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(data);
  });
  
  // Show each category
  Object.entries(byCategory).forEach(([category, images]) => {
    console.log(`📁 ${category.toUpperCase()} (${images.length} images):`);
    console.log('═'.repeat(50));
    
    images.forEach(data => {
      console.log(`   "${data.title}"`);
      console.log(`   File: ${data.filename}`);
      console.log('');
    });
    
    console.log('\n');
  });
  
  console.log('📊 Category counts:');
  Object.entries(byCategory).forEach(([cat, images]) => {
    console.log(`   ${cat}: ${images.length} images`);
  });
  
  console.log('\n💡 To manually fix:');
  console.log('1. Look at each category above');
  console.log('2. Identify misplaced images');
  console.log('3. Manually edit public/data/image-metadata.json');
  console.log('4. Change the "category" field for misplaced images');
  console.log('5. Or tell me specific images to move and I\'ll make a targeted script');
  
  console.log('\n🚨 NO CHANGES WERE MADE - This is just diagnostic info');
}

diagnosticOnly();