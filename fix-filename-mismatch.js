// fix-filename-mismatch.js - Update metadata filenames to match actual files
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing filename mismatch between metadata and actual files...\n');

const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata-cleaned.json');
const imagesDir = path.join(__dirname, 'public', 'images');

// Get list of actual image files
const actualFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.webp'));
console.log(`📸 Found ${actualFiles.length} actual image files`);

// Load metadata
let metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
console.log(`📋 Loaded metadata for ${Object.keys(metadata).length} images\n`);

// Create new metadata based on actual files
const newMetadata = {};
let matchedCount = 0;

actualFiles.forEach(filename => {
  const key = filename.replace('.webp', '');
  
  // Determine category from filename
  let category = 'professional-shelves'; // default
  if (filename.includes('home-lifestyle')) {
    category = 'home-lifestyle';
  }
  
  // Create clean title from filename
  let title = key
    .replace(/^(home-lifestyle-|professional-shelves-)/, '') // Remove category prefix
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
  
  // Create new metadata entry
  newMetadata[key] = {
    filename: filename,
    title: title,
    description: `${title} virtual background perfect for video calls`,
    category: category,
    keywords: `virtual background, ${category.replace('-', ' ')}, video calls, zoom background`,
    alt: title,
    isPremium: filename.includes('premium')
  };
  
  console.log(`✅ ${filename} → ${category} (${title})`);
  matchedCount++;
});

// Save the corrected metadata
fs.writeFileSync(metadataPath, JSON.stringify(newMetadata, null, 2));

console.log(`\n🎉 Successfully created metadata for ${matchedCount} actual images`);

// Show final counts
const finalCounts = {};
Object.values(newMetadata).forEach(item => {
  finalCounts[item.category] = (finalCounts[item.category] || 0) + 1;
});

console.log('\n📊 Final category counts:');
Object.entries(finalCounts).forEach(([cat, count]) => {
  console.log(`   ${cat}: ${count} images`);
});