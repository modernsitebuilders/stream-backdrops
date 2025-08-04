// fix-metadata-issues.js
// Fixes homepage blanks, premium categorization, and unused categories
// Run with: node fix-metadata-issues.js

const fs = require('fs');
const path = require('path');

function fixMetadataIssues() {
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  const imagesDir = path.join(__dirname, 'public', 'images');
  
  // Load current metadata
  let metadata = {};
  try {
    const jsonData = fs.readFileSync(metadataPath, 'utf8');
    metadata = JSON.parse(jsonData);
    console.log(`📋 Loaded metadata with ${Object.keys(metadata).length} images`);
  } catch (error) {
    console.error('❌ Could not load metadata:', error);
    return;
  }
  
  // Get list of actual image files
  const actualFiles = fs.readdirSync(imagesDir)
    .filter(file => file.endsWith('.webp') || file.endsWith('.png'))
    .map(file => file.replace(/\.(webp|png)$/, ''));
  
  console.log(`📁 Found ${actualFiles.length} actual image files`);
  
  // 1. Remove metadata entries for missing files
  const cleanedMetadata = {};
  let removedCount = 0;
  
  Object.entries(metadata).forEach(([key, data]) => {
    if (actualFiles.includes(key)) {
      cleanedMetadata[key] = data;
    } else {
      console.log(`🗑️  Removing missing image: ${key}`);
      removedCount++;
    }
  });
  
  console.log(`🧹 Removed ${removedCount} missing image entries`);
  
  // 2. Fix premium categorization
  // Option A: Keep premiums in their original categories (recommended)
  // Option B: Move all premiums to 'premium-4k' category
  
  console.log('\n💎 Premium categorization options:');
  console.log('A: Keep premiums in original categories (home-offices, executive-offices, lobbies)');
  console.log('B: Move all premiums to separate premium-4k category');
  
  // For now, let's implement Option A (keep in original categories)
  // This is better for SEO and user browsing
  
  // 3. Update homepage to use existing images
  // First, let's see what categories have the most images
  const categoryCounts = {};
  Object.values(cleanedMetadata).forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  
  console.log('\n📊 Images per category:');
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} images`);
  });
  
  // Find representative images for homepage (first image from each category)
  const homepageImages = {};
  Object.entries(cleanedMetadata).forEach(([key, data]) => {
    if (!homepageImages[data.category]) {
      homepageImages[data.category] = {
        key: key,
        filename: data.filename,
        title: data.title
      };
    }
  });
  
  console.log('\n🏠 Suggested homepage images:');
  Object.entries(homepageImages).forEach(([category, image]) => {
    console.log(`   ${category}: ${image.filename}`);
  });
  
  // 4. Write cleaned metadata
  fs.writeFileSync(metadataPath, JSON.stringify(cleanedMetadata, null, 2));
  
  console.log(`\n✅ Metadata cleaned and saved!`);
  console.log(`📊 Final count: ${Object.keys(cleanedMetadata).length} images`);
  
  // 5. Show premium summary
  const premiumImages = Object.values(cleanedMetadata).filter(item => item.isPremium);
  console.log(`💎 Premium images: ${premiumImages.length}`);
  
  if (premiumImages.length > 0) {
    const premiumByCategory = {};
    premiumImages.forEach(item => {
      premiumByCategory[item.category] = (premiumByCategory[item.category] || 0) + 1;
    });
    
    console.log('\n💎 Premium images by category:');
    Object.entries(premiumByCategory).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} premium images`);
    });
  }
  
  // 6. Generate updated categories for your site
  const activeCategories = Object.keys(categoryCounts);
  console.log('\n📋 Active categories for your site:');
  activeCategories.forEach(category => {
    console.log(`   - ${category} (${categoryCounts[category]} images)`);
  });
  
  // 7. Suggest homepage fixes
  console.log('\n🔧 To fix homepage blanks:');
  console.log('Update these images in your pages/index.js:');
  Object.entries(homepageImages).forEach(([category, image]) => {
    const slug = category;
    const filename = image.filename;
    console.log(`   ${slug}: '${filename}' // ${image.title}`);
  });
  
  return {
    totalImages: Object.keys(cleanedMetadata).length,
    premiumImages: premiumImages.length,
    categoryCounts: categoryCounts,
    homepageImages: homepageImages
  };
}

// Run the fix
console.log('🚀 Starting metadata cleanup...\n');
const results = fixMetadataIssues();
console.log('\n🎉 Cleanup complete!');