// fix-metadata.js
const fs = require('fs');
const path = require('path');

function fixMetadata() {
  // Read existing metadata
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  // Get actual images in the folder
  const imagesDir = path.join(__dirname, 'public', 'images');
  const actualImages = fs.readdirSync(imagesDir).filter(file => 
    file.endsWith('.webp') || file.endsWith('.png') || file.endsWith('.jpg')
  );
  
  console.log(`Found ${actualImages.length} actual images in public/images/`);
  console.log(`Metadata contains ${Object.keys(metadata).length} entries`);
  
  // Check which metadata entries have missing images
  const missingImages = [];
  const validEntries = {};
  
  Object.entries(metadata).forEach(([key, data]) => {
    if (actualImages.includes(data.filename)) {
      validEntries[key] = data;
      console.log(`✅ Found: ${data.filename}`);
    } else {
      missingImages.push(data.filename);
      console.log(`❌ Missing: ${data.filename}`);
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`Valid entries: ${Object.keys(validEntries).length}`);
  console.log(`Missing images: ${missingImages.length}`);
  
  // Check for images without metadata
  const metadataFilenames = Object.values(metadata).map(m => m.filename);
  const orphanImages = actualImages.filter(img => !metadataFilenames.includes(img));
  
  if (orphanImages.length > 0) {
    console.log(`\n🔍 Images without metadata (${orphanImages.length}):`);
    orphanImages.forEach(img => console.log(`  - ${img}`));
  }
  
  // Save a cleaned version with only valid entries
  const cleanedPath = path.join(__dirname, 'public', 'data', 'image-metadata-cleaned.json');
  fs.writeFileSync(cleanedPath, JSON.stringify(validEntries, null, 2));
  console.log(`\n✅ Saved cleaned metadata to: image-metadata-cleaned.json`);
  console.log(`   Contains ${Object.keys(validEntries).length} valid entries`);
  
  // Show category breakdown of valid entries
  const categories = {};
  Object.values(validEntries).forEach(item => {
    categories[item.category] = (categories[item.category] || 0) + 1;
  });
  console.log(`\n📁 Valid images by category:`);
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
}

fixMetadata();