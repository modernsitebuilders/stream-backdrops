// debug-category-loading.js - Debug why images aren't loading in categories
const fs = require('fs');
const path = require('path');

console.log('🔍 Debugging category image loading...\n');

// 1. Check what metadata files exist
const dataDir = path.join(__dirname, 'public', 'data');
console.log('📁 Files in public/data/:');
if (fs.existsSync(dataDir)) {
  const files = fs.readdirSync(dataDir);
  files.forEach(file => console.log(`   ${file}`));
} else {
  console.log('   Directory does not exist!');
}

// 2. Check what's in the metadata
const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata-cleaned.json');
if (fs.existsSync(metadataPath)) {
  try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    console.log(`\n📊 Metadata summary:`);
    console.log(`   Total images: ${Object.keys(metadata).length}`);
    
    // Count by category
    const categories = {};
    Object.values(metadata).forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    
    console.log('\n📋 Images per category:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} images`);
    });
    
    // Show first few images
    console.log('\n🖼️  First 3 images:');
    Object.entries(metadata).slice(0, 3).forEach(([key, data]) => {
      console.log(`   ${key}: ${data.title} (${data.category})`);
    });
    
  } catch (error) {
    console.log(`   ❌ Error reading metadata: ${error.message}`);
  }
} else {
  console.log('\n❌ image-metadata-cleaned.json not found!');
}

// 3. Check what images actually exist
const imagesDir = path.join(__dirname, 'public', 'images');
if (fs.existsSync(imagesDir)) {
  const imageFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.webp'));
  console.log(`\n📸 Actual image files: ${imageFiles.length}`);
  console.log('   First 3 files:');
  imageFiles.slice(0, 3).forEach(file => console.log(`   ${file}`));
} else {
  console.log('\n❌ public/images directory not found!');
}

// 4. Check API endpoint
const apiPath = path.join(__dirname, 'pages', 'api', 'metadata.js');
if (fs.existsSync(apiPath)) {
  console.log('\n✅ API metadata.js exists');
  // Show what file it's trying to read
  const apiContent = fs.readFileSync(apiPath, 'utf8');
  if (apiContent.includes('image-metadata-cleaned.json')) {
    console.log('   ✅ API is looking for image-metadata-cleaned.json');
  } else if (apiContent.includes('image-metadata.json')) {
    console.log('   ⚠️  API is looking for image-metadata.json (different file!)');
  }
} else {
  console.log('\n❌ API metadata.js not found!');
}