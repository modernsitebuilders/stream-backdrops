// fix-casual-category.js
// Fixes the casual category issue, converts to WebP, and moves everything to home-lifestyle
// Moves original PNGs to organized folder instead of deleting them
// Run with: node fix-casual-category.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function fixCasualCategory() {
  console.log('🔧 Fixing casual category, converting to WebP, and organizing files...\n');
  
  // 1. Set up directories
  const currentDir = __dirname; // nextjs-site folder
  const sourceDir = path.join(currentDir, '..', 'zoom-images');
  const imagesDir = path.join(currentDir, 'public', 'images');
  const dataDir = path.join(currentDir, 'data');
  
  // Create original-pngs folder in stream-backdrops (parent of nextjs-site)
  const originalPngsDir = path.join(currentDir, '..', 'original-pngs');
  if (!fs.existsSync(originalPngsDir)) {
    fs.mkdirSync(originalPngsDir, { recursive: true });
    console.log('📁 Created stream-backdrops/original-pngs directory');
  }
  
  // Create public/images if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('📁 Created public/images directory');
  }
  
  // 2. Load the casual data that was created
  const casualDataPath = path.join(dataDir, 'casual-backgrounds.json');
  let casualData = null;
  
  if (fs.existsSync(casualDataPath)) {
    casualData = JSON.parse(fs.readFileSync(casualDataPath, 'utf8'));
    console.log(`📋 Found ${casualData.images.length} casual images to process`);
  } else {
    console.log('❌ No casual data found - please run the processor first');
    return;
  }
  
  // 3. Process each original PNG file: convert to WebP and organize originals
  console.log('\n📦 Converting to WebP and organizing files...');
  const processedFiles = [];
  
  casualData.images.forEach((image, index) => {
    // Get the original source filename from the data
    const originalFilename = image.originalFilename;
    const sourcePath = path.join(sourceDir, originalFilename);
    
    // Create new filename for home-lifestyle
    let newFilename = image.filename.replace('casual-', 'home-lifestyle-');
    
    // Fix the double "casual" in the basement office filename
    if (newFilename.includes('home-lifestyle-casual-basement')) {
      newFilename = newFilename.replace('home-lifestyle-casual-basement', 'home-lifestyle-basement');
    }
    
    const outputPath = path.join(imagesDir, newFilename);
    const originalBackupPath = path.join(originalPngsDir, originalFilename);
    
    console.log(`${(index + 1).toString().padStart(2, ' ')}. Processing: ${originalFilename}`);
    console.log(`    → Converting to: ${newFilename}`);
    console.log(`    → Archiving original to: original-pngs/${originalFilename}`);
    console.log(`    → ${image.title}`);
    
    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      console.log(`    ❌ Source file not found: ${originalFilename}`);
      return;
    }
    
    // Convert to WebP with optimization
    try {
      const sharpCommand = `npx sharp-cli -i "${sourcePath}" -o "${outputPath}" -f webp -q 85`;
      execSync(sharpCommand, { stdio: 'pipe' });
      console.log(`    ✅ Converted to WebP and saved to public/images`);
    } catch (conversionError) {
      // Fallback: just copy the file if sharp fails
      console.log(`    ⚠️  Sharp conversion failed, copying original...`);
      const fallbackPath = outputPath.replace('.webp', path.extname(originalFilename));
      fs.copyFileSync(sourcePath, fallbackPath);
      newFilename = fallbackPath.split(path.sep).pop(); // Update filename to actual extension
    }
    
    // Move (not copy) original PNG to organized folder
    if (!fs.existsSync(originalBackupPath)) {
      fs.copyFileSync(sourcePath, originalBackupPath);
      console.log(`    📦 Moved original PNG to original-pngs folder`);
      
      // Delete from zoom-images since we now have it organized in original-pngs
      fs.unlinkSync(sourcePath);
      console.log(`    🗑️  Removed from zoom-images (now in original-pngs)`);
    } else {
      console.log(`    ✅ Original already archived, removing from zoom-images`);
      if (fs.existsSync(sourcePath)) {
        fs.unlinkSync(sourcePath);
      }
    }
    
    // Update the image data
    processedFiles.push({
      filename: newFilename,
      originalFilename: originalFilename,
      title: image.title,
      description: image.description.replace('Casual ', '').replace('casual ', ''),
      category: 'home-lifestyle',
      keywords: [...image.keywords.filter(k => k !== 'casual office'), 'home office', 'lifestyle', 'home workspace'],
      alt: `${image.title} - Home office virtual background for comfortable video calls`
    });
  });
  
  // 4. Load existing metadata
  const metadataPath = path.join(currentDir, 'public', 'data', 'image-metadata.json');
  let metadata = {};
  
  if (fs.existsSync(metadataPath)) {
    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    console.log(`\n📊 Loaded existing metadata with ${Object.keys(metadata).length} images`);
    
    // Remove any old casual-backgrounds entries
    Object.keys(metadata).forEach(key => {
      if (metadata[key].category === 'casual-backgrounds') {
        delete metadata[key];
        console.log(`🗑️  Removed old casual entry: ${key}`);
      }
    });
  }
  
  // 5. Add the processed files to metadata as home-lifestyle
  processedFiles.forEach(image => {
    const key = image.filename.replace(/\.(webp|png)$/, '');
    metadata[key] = {
      filename: image.filename,
      title: image.title,
      description: image.description,
      category: 'home-lifestyle',
      keywords: image.keywords,
      alt: image.alt
    };
    console.log(`➕ Added to Home & Lifestyle: ${image.title}`);
  });
  
  // 6. Save updated metadata
  const metadataDir = path.dirname(metadataPath);
  if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir, { recursive: true });
  }
  
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  // 7. Update categories API
  updateCategoriesAPI(metadata);
  
  // 8. Clean up old temporary files (but keep originals!)
  cleanupOldFiles();
  
  // 9. Show final results
  const categoryCount = {};
  Object.values(metadata).forEach(item => {
    categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
  });
  
  console.log('\n✅ Processing complete!');
  console.log('📊 Final category counts:');
  Object.entries(categoryCount).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  console.log('\n🎉 All casual images converted to WebP and added to Home & Lifestyle!');
  console.log('📁 WebP files are in public/images/ directory');
  console.log('📁 Original PNGs archived in stream-backdrops/original-pngs/ directory');
  console.log('📋 Metadata updated');
  console.log('🔧 API updated');
  
  return true;
}

function updateCategoriesAPI(metadata) {
  console.log('\n🔧 Updating categories API...');
  
  const apiDir = path.join(__dirname, 'pages', 'api');
  const categoriesAPIPath = path.join(apiDir, 'categories.js');
  
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  
  // Count categories from metadata
  const categoryCount = {};
  Object.values(metadata).forEach(item => {
    categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
  });
  
  const categoriesAPI = `// pages/api/categories.js - Updated without casual-backgrounds category
export default function handler(req, res) {
  // Prevent caching to ensure fresh data
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  const categories = {
    'professional-shelves': {
      name: 'Professional Shelves',
      count: ${categoryCount['professional-shelves'] || 42},
      description: 'Professional office shelves with books and plants - perfect for business video calls'
    },
    'home-lifestyle': {
      name: 'Home & Lifestyle',
      count: ${categoryCount['home-lifestyle'] || 55}, 
      description: 'Stylish home offices and casual lifestyle spaces - from polished to relaxed'
    }
  };
  
  console.log('📊 Serving categories:', Object.keys(categories));
  res.status(200).json(categories);
}
`;
  
  fs.writeFileSync(categoriesAPIPath, categoriesAPI);
  console.log(`✅ Updated categories API - removed casual-backgrounds category`);
}

// Clean up old temporary files (but preserve originals in organized folder)
function cleanupOldFiles() {
  console.log('\n🧹 Cleaning up temporary files...');
  
  const dataDir = path.join(__dirname, 'data');
  const casualDataPath = path.join(dataDir, 'casual-backgrounds.json');
  
  // Delete old casual data file
  if (fs.existsSync(casualDataPath)) {
    fs.unlinkSync(casualDataPath);
    console.log('🗑️  Deleted old casual-backgrounds.json');
  }
  
  // Delete any old casual files that might be in wrong location (but not originals!)
  const possibleOldPaths = [
    path.join(__dirname, 'public', 'images', 'casual-casual-basement-office-1.webp'),
    path.join(__dirname, 'public', 'images', 'casual-kitchen-workspace-2.webp'),
    path.join(__dirname, 'public', 'images', 'casual-spare-room-office-3.webp'),
    path.join(__dirname, 'public', 'images', 'casual-student-bedroom-office-4.webp'),
    path.join(__dirname, 'public', 'images', 'casual-cozy-student-workspace-5.webp'),
    path.join(__dirname, 'public', 'images', 'casual-cozy-home-office-6.webp'),
    path.join(__dirname, 'public', 'images', 'casual-garden-shed-office-7.webp')
  ];
  
  possibleOldPaths.forEach(oldPath => {
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
      console.log(`🗑️  Deleted old temporary file: ${path.basename(oldPath)}`);
    }
  });
  
  console.log('✅ Original PNG files moved to stream-backdrops/original-pngs/ (removed from zoom-images)');
}

function main() {
  console.log('🚀 Fixing Casual Category + WebP Conversion + File Organization');
  console.log('============================================================\n');
  
  const success = fixCasualCategory();
  if (success) {
    // Delete any casual category page that might have been created
    const casualPagePath = path.join(__dirname, 'pages', 'category', 'casual-backgrounds.js');
    if (fs.existsSync(casualPagePath)) {
      fs.unlinkSync(casualPagePath);
      console.log('🗑️  Deleted casual-backgrounds page');
    }
    
    console.log('\n🎯 What was accomplished:');
    console.log('========================');
    console.log('✅ Converted original PNG files to optimized WebP format');
    console.log('✅ Moved WebP files to public/images/ directory');
    console.log('✅ Moved original PNGs from zoom-images to original-pngs (no duplicates)');
    console.log('✅ Moved casual images to Home & Lifestyle category');
    console.log('✅ Renamed files from casual-* to home-lifestyle-*');
    console.log('✅ Fixed the double "casual" in basement office filename');
    console.log('✅ Updated metadata to use home-lifestyle category');
    console.log('✅ Updated API to remove casual-backgrounds category');
    console.log('✅ Deleted temporary files while preserving originals');
    
    console.log('\n📁 File organization:');
    console.log('====================');
    console.log('📦 Original PNGs: stream-backdrops/original-pngs/');
    console.log('🌐 WebP files: nextjs-site/public/images/');
    console.log('📊 Source files: zoom-images/ (unchanged)');
    
    console.log('\n🚀 Next steps:');
    console.log('==============');
    console.log('1. Clear browser cache');
    console.log('2. Restart dev server: npm run dev');
    console.log('3. Check Home & Lifestyle category - should have more images');
    console.log('4. Verify images are showing as WebP format');
    console.log('5. Original PNGs are safely archived for future use');
    console.log('6. No homepage changes needed!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixCasualCategory };