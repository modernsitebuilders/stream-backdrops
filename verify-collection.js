// verify-collection.js - Check if your curated collection processed correctly
// Run with: node verify-collection.js

const fs = require('fs');
const path = require('path');

function verifyCollection() {
  console.log('🔍 Verifying your curated collection...\n');
  
  const imagesDir = path.join(__dirname, 'public', 'images');
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  // Check if directories exist
  if (!fs.existsSync(imagesDir)) {
    console.log('❌ Images directory not found!');
    return;
  }
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  // Count images
  const imageFiles = fs.readdirSync(imagesDir).filter(file => 
    file.endsWith('.webp') || file.endsWith('.png') || file.endsWith('.jpg')
  );
  
  // Load metadata
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const metadataCount = Object.keys(metadata).length;
  
  console.log('📊 Processing Results:');
  console.log('=====================');
  console.log(`Images processed: ${imageFiles.length} WebP files`);
  console.log(`Metadata entries: ${metadataCount} records`);
  console.log(`Expected: 90 curated images`);
  
  if (imageFiles.length === 90 && metadataCount === 90) {
    console.log('✅ Perfect! All 90 images processed successfully');
  } else {
    console.log('⚠️  Count mismatch - some images may have failed processing');
  }
  
  // Show category breakdown
  const categoryCounts = {};
  Object.values(metadata).forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  
  console.log('\n📁 Your new collection by category:');
  console.log('===================================');
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`${category.padEnd(25)}: ${count} images`);
  });
  
  // Show some sample processed images
  console.log('\n📸 Sample processed images:');
  console.log('===========================');
  imageFiles.slice(0, 5).forEach(filename => {
    console.log(`   ${filename}`);
  });
  
  // Show sample metadata
  console.log('\n📋 Sample metadata:');
  console.log('===================');
  const firstKey = Object.keys(metadata)[0];
  if (firstKey) {
    const sample = metadata[firstKey];
    console.log(`Title: ${sample.title}`);
    console.log(`Category: ${sample.category}`);
    console.log(`Description: ${sample.description.substring(0, 80)}...`);
    console.log(`Keywords: ${sample.keywords.join(', ')}`);
  }
  
  console.log('\n🎉 Collection verification complete!');
  
  if (imageFiles.length === 90) {
    console.log('\n💡 Next steps:');
    console.log('1. Test your website to see the new collection');
    console.log('2. Update any category navigation if needed');
    console.log('3. Check that all images load properly');
    console.log('4. Plan your "Living Backgrounds" premium offering');
  } else {
    console.log('\n🔧 Troubleshooting needed:');
    console.log('1. Check console output from processing for errors');
    console.log('2. Verify all PNG files were in the curated-collection folder');
    console.log('3. Re-run processing if needed');
  }
}

verifyCollection();