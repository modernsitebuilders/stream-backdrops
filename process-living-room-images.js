// process-living-room-images.js
// Finds, renames, converts to WebP, and creates metadata for living room images
// Run with: node process-living-room-images.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processLivingRoomImages() {
  console.log('🏠 Processing Living Room Images...\n');
  
  const imagesDir = path.join(__dirname, 'public', 'images');
  const downloadsDir = path.join(imagesDir, 'downloads');
  const livingRoomDir = path.join(imagesDir, 'living-room');
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  // Check if downloads folder exists
  if (!fs.existsSync(downloadsDir)) {
    console.log('❌ Downloads folder not found: public/images/downloads');
    console.log('💡 Please create the folder and add your 3 living room images');
    return;
  }
  
  // Create living-room directory if it doesn't exist
  if (!fs.existsSync(livingRoomDir)) {
    fs.mkdirSync(livingRoomDir, { recursive: true });
    console.log('📁 Created living-room directory');
  }
  
  // Load existing metadata
  let metadata = {};
  if (fs.existsSync(metadataPath)) {
    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    console.log('📋 Loaded existing metadata');
  }
  
  // Find all images in public/images/downloads
  const allFiles = fs.readdirSync(downloadsDir).filter(file => {
    const filePath = path.join(downloadsDir, file);
    const isFile = fs.statSync(filePath).isFile();
    const isImage = /\.(jpg|jpeg|png|webp)$/i.test(file);
    return isFile && isImage;
  });
  
  console.log(`🔍 Found ${allFiles.length} images in downloads folder`);
  
  if (allFiles.length === 0) {
    console.log('\n❌ No images found in downloads folder.');
    console.log('💡 Please add your 3 living room images to public/images/downloads/');
    return;
  }
  
  // Process all images in downloads folder (up to 3)
  const imagesToProcess = allFiles.slice(0, 3);
  
  console.log(`🎯 Processing all ${imagesToProcess.length} images:`);
  imagesToProcess.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  
  console.log(`\n🔄 Converting to living room backgrounds...\n`);
  
  const processedImages = [];
  
  for (let i = 0; i < imagesToProcess.length; i++) {
    const originalFile = imagesToProcess[i];
    const originalPath = path.join(downloadsDir, originalFile);
    
    // Generate new filename
    const newFilename = `living-room-${i + 1}.webp`;
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
        title: `Living Room ${i + 1}`,
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
        fileSize: 'TBD', // Will be calculated after conversion
        lastModified: new Date().toISOString()
      };
      
      // Get file size
      const stats = fs.statSync(newPath);
      imageMetadata.fileSize = `${Math.round(stats.size / 1024)}KB`;
      
      // Add to metadata
      metadata[metadataKey] = imageMetadata;
      processedImages.push(imageMetadata);
      
    } catch (error) {
      console.error(`❌ Error processing ${originalFile}:`, error.message);
    }
  }
  
  // Save updated metadata
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`\n💾 Updated metadata with ${processedImages.length} new images`);
  
  // Update category count in categories-config.js
  const categoriesConfigPath = path.join(__dirname, 'lib', 'categories-config.js');
  if (fs.existsSync(categoriesConfigPath)) {
    let configContent = fs.readFileSync(categoriesConfigPath, 'utf8');
    
    // Update the living-room count
    configContent = configContent.replace(
      /"living-room": \{[\s\S]*?"count": \d+/,
      `"living-room": {
    "name": "Living Room",
    "description": "Comfortable living room backgrounds for casual meetings and personal video calls",
    "count": ${processedImages.length}`
    );
    
    fs.writeFileSync(categoriesConfigPath, configContent);
    console.log('📊 Updated categories-config.js with new count');
  }
  
  // Show summary
  console.log('\n🎉 Processing Complete!');
  console.log('=' .repeat(50));
  console.log(`✅ Processed: ${processedImages.length} images`);
  console.log(`📁 Location: public/images/living-room/`);
  console.log(`📋 Metadata: Updated in image-metadata.json`);
  console.log(`🏷️  Category: living-room`);
  
  console.log('\n📝 Generated Images:');
  processedImages.forEach((img, index) => {
    console.log(`   ${index + 1}. ${img.filename} (${img.fileSize})`);
    console.log(`      Title: ${img.title}`);
    console.log(`      Keywords: ${img.keywords.slice(0, 3).join(', ')}...`);
    console.log('');
  });
  
  console.log('🚀 Next Steps:');
  console.log('1. Check the generated images in public/images/living-room/');
  console.log('2. Test your living room category: http://localhost:3000/category/living-room');
  console.log('3. Move your original files from downloads to project folder');
  console.log('4. Deploy the changes');
  
  console.log('\n📋 Quick Deploy:');
  console.log('git add .');
  console.log('git commit -m "Add living room category with 3 images"');
  console.log('git push origin main');
  console.log('vercel --prod');
}

// Install sharp if not already installed
function checkSharpInstallation() {
  try {
    require('sharp');
    return true;
  } catch (error) {
    console.log('📦 Sharp not found. Installing...');
    console.log('Run: npm install sharp');
    console.log('Then run this script again.');
    return false;
  }
}

// Run the processor
if (checkSharpInstallation()) {
  processLivingRoomImages().catch(error => {
    console.error('❌ Error:', error);
  });
}