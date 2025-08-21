// add-living-room-images-safe.js
// This script ADDS images to existing living room collection WITHOUT touching Next.js pages
// Run with: node add-living-room-images-safe.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function addMoreLivingRoomImagesSafe() {
  console.log('🏠 Adding MORE Living Room Images (SAFE MODE - no page updates)...\n');
  
  const imagesDir = path.join(__dirname, 'public', 'images');
  const downloadsDir = path.join(imagesDir, 'downloads');
  const livingRoomDir = path.join(imagesDir, 'living-room');
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  // Ensure directories exist
  if (!fs.existsSync(livingRoomDir)) {
    fs.mkdirSync(livingRoomDir, { recursive: true });
    console.log('📁 Created living-room directory');
  }
  
  // Check existing living room images to find next number
  const existingFiles = fs.existsSync(livingRoomDir) 
    ? fs.readdirSync(livingRoomDir).filter(f => f.endsWith('.webp'))
    : [];
  
  console.log(`🔍 Found ${existingFiles.length} existing living room images:`);
  existingFiles.forEach(file => console.log(`   - ${file}`));
  
  // Find the highest number in existing files
  let highestNum = 0;
  existingFiles.forEach(file => {
    const match = file.match(/living-room-(\d+)\.webp$/);
    if (match) {
      const num = parseInt(match[1]);
      if (num > highestNum) highestNum = num;
    }
  });
  
  console.log(`\n🔢 Next images will start from: living-room-${highestNum + 1}.webp`);
  
  // Check downloads folder
  if (!fs.existsSync(downloadsDir)) {
    console.log('❌ Downloads folder not found: public/images/downloads');
    console.log('📁 Creating downloads folder...');
    fs.mkdirSync(downloadsDir, { recursive: true });
    console.log('✅ Downloads folder created. Please add your images there and run again.');
    return;
  }
  
  // Find all images in downloads
  const allFiles = fs.readdirSync(downloadsDir).filter(file => {
    const filePath = path.join(downloadsDir, file);
    const isFile = fs.statSync(filePath).isFile();
    const isImage = /\.(jpg|jpeg|png|webp)$/i.test(file);
    return isFile && isImage;
  });
  
  console.log(`\n🔍 Found ${allFiles.length} images in downloads folder`);
  
  if (allFiles.length === 0) {
    console.log('❌ No images found in downloads folder.');
    console.log('📋 Please add your new living room images to: public/images/downloads/');
    return;
  }
  
  // List available images
  console.log(`\n📋 Available images to add:`);
  allFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  
  // Process ALL images in downloads
  const imagesToProcess = allFiles;
  console.log(`\n🔄 Processing ${imagesToProcess.length} new images...\n`);
  
  // Load existing metadata
  let metadata = {};
  if (fs.existsSync(metadataPath)) {
    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  } else {
    // Create metadata directory if it doesn't exist
    const dataDir = path.join(__dirname, 'public', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }
  
  const processedImages = [];
  let currentNum = highestNum + 1;
  
  for (let i = 0; i < imagesToProcess.length; i++) {
    const originalFile = imagesToProcess[i];
    const originalPath = path.join(downloadsDir, originalFile);
    
    // Generate new filename with incremental number
    const newFilename = `living-room-${currentNum}.webp`;
    const newPath = path.join(livingRoomDir, newFilename);
    
    try {
      // Convert to WebP
      await sharp(originalPath)
        .webp({ 
          quality: 85, 
          effort: 6 
        })
        .toFile(newPath);
      
      console.log(`✅ ${originalFile} → ${newFilename}`);
      
      // Generate metadata
      const metadataKey = newFilename.replace('.webp', '');
      const imageMetadata = {
        filename: newFilename,
        title: `Living Room ${currentNum}`,
        description: `Comfortable living room background perfect for casual video calls and personal meetings`,
        category: 'living-room',
        isPremium: false,
        keywords: [
          'living room background',
          'home background',
          'casual video calls',
          'comfortable setting',
          'personal meetings',
          'relaxed atmosphere',
          'cozy living room',
          'home office alternative'
        ],
        dimensions: {
          width: 1920,
          height: 1080
        },
        lastModified: new Date().toISOString(),
        originalFile: originalFile // Keep track of source
      };
      
      // Get file size
      const stats = fs.statSync(newPath);
      imageMetadata.fileSize = `${Math.round(stats.size / 1024)}KB`;
      
      // Add to metadata
      metadata[metadataKey] = imageMetadata;
      processedImages.push(imageMetadata);
      currentNum++;
      
    } catch (error) {
      console.error(`❌ Error processing ${originalFile}:`, error.message);
    }
  }
  
  // Save updated metadata
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`\n💾 Updated metadata with ${processedImages.length} new images`);
  
  // SAFE: Only update categories-config.js if it exists and won't break hot reload
  const categoriesConfigPath = path.join(__dirname, 'lib', 'categories-config.js');
  if (fs.existsSync(categoriesConfigPath)) {
    try {
      let configContent = fs.readFileSync(categoriesConfigPath, 'utf8');
      
      // Count total living room images
      const totalLivingRoomImages = Object.values(metadata)
        .filter(img => img.category === 'living-room').length;
      
      // Update the living-room count
      const updatedConfig = configContent.replace(
        /"living-room": \{[\s\S]*?"count": \d+/,
        `"living-room": {
    "name": "Living Room",
    "description": "Comfortable living room backgrounds for casual meetings and personal video calls",
    "count": ${totalLivingRoomImages}`
      );
      
      if (updatedConfig !== configContent) {
        fs.writeFileSync(categoriesConfigPath, updatedConfig);
        console.log(`📊 Updated categories-config.js with new count: ${totalLivingRoomImages}`);
      }
    } catch (error) {
      console.log('⚠️  Could not update categories-config.js (this is OK)');
    }
  }
  
  // Show summary
  console.log('\n🎉 Successfully Added More Images!');
  console.log('='.repeat(50));
  console.log(`✅ Added: ${processedImages.length} new images`);
  console.log(`🔍 Total living room images: ${currentNum - 1}`);
  console.log(`📋 All metadata updated`);
  
  console.log('\n🔍 New Images Added:');
  processedImages.forEach((img, index) => {
    console.log(`   ${highestNum + index + 1}. ${img.filename} (${img.fileSize})`);
  });
  
  // Archive processed files (move them to avoid reprocessing)
  const archiveDir = path.join(downloadsDir, 'processed');
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }
  
  console.log('\n📦 Moving processed files to archive...');
  for (const originalFile of imagesToProcess) {
    const sourcePath = path.join(downloadsDir, originalFile);
    const archivePath = path.join(archiveDir, originalFile);
    
    try {
      fs.renameSync(sourcePath, archivePath);
      console.log(`📁 Archived: ${originalFile}`);
    } catch (error) {
      console.log(`⚠️  Could not archive ${originalFile}: ${error.message}`);
    }
  }
  
  console.log('\n🚀 Next Steps:');
  console.log('1. ✅ Images processed and metadata updated');
  console.log('2. 🔄 Restart your Next.js dev server to see changes');
  console.log('3. 🌐 Check images at: http://localhost:3000/category/living-room');
  console.log('4. 🚀 Deploy when ready');
  
  console.log('\n📋 Quick Deploy Commands:');
  console.log('git add .');
  console.log(`git commit -m "Add ${processedImages.length} more living room images"`);
  console.log('git push origin main');
  
  console.log('\n⚠️  IMPORTANT: Restart your dev server to see the new images!');
}

// Check if sharp is installed
function checkSharpInstallation() {
  try {
    require('sharp');
    return true;
  } catch (error) {
    console.log('📦 Sharp not found. Installing...');
    console.log('Run: npm install sharp');
    return false;
  }
}

// Main execution
if (require.main === module) {
  if (checkSharpInstallation()) {
    addMoreLivingRoomImagesSafe().catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
  }
}