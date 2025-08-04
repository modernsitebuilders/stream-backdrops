// debug-homepage-images.js
// Run with: node debug-homepage-images.js

const fs = require('fs');
const path = require('path');

function debugHomepageImages() {
  console.log('🔍 Debugging homepage image categories...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  // Check the specific images homepage is trying to load
  const homepageImages = [
    'contemporary-executive-home-office-1.webp',
    'minimalist-executive-office-1.webp', 
    'minimalist-medical-lobby-1.webp',
    'professional-consultation-office-1.webp'
  ];
  
  console.log('📋 Homepage Images Analysis:');
  console.log('=' .repeat(50));
  
  homepageImages.forEach((filename, index) => {
    const key = filename.replace('.webp', '');
    const imageData = metadata[key];
    
    const categories = ['home-offices', 'executive-offices', 'lobbies', 'private-offices'];
    const expectedCategory = categories[index];
    
    if (imageData) {
      console.log(`✅ ${filename}`);
      console.log(`   Expected: ${expectedCategory}`);
      console.log(`   Actual: ${imageData.category}`);
      console.log(`   Title: ${imageData.title}`);
      console.log(`   Match: ${imageData.category === expectedCategory ? '✅ CORRECT' : '❌ WRONG CATEGORY'}`);
      console.log('');
    } else {
      console.log(`❌ ${filename} - NOT FOUND IN METADATA`);
      console.log('');
    }
  });
  
  // Find better homepage images for each category
  console.log('🏠 Better Homepage Images by Category:');
  console.log('=' .repeat(50));
  
  ['home-offices', 'executive-offices', 'lobbies', 'private-offices'].forEach(category => {
    const categoryImages = Object.entries(metadata)
      .filter(([_, data]) => data.category === category && !data.isPremium)
      .slice(0, 3); // Get first 3 non-premium
    
    console.log(`\n📁 ${category.toUpperCase()}:`);
    categoryImages.forEach(([key, data]) => {
      console.log(`   ${data.filename} - "${data.title}"`);
    });
  });
}

debugHomepageImages();