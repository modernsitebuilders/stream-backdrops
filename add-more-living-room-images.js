// add-more-living-room-images.js
// This script ADDS images to existing living room collection without overwriting
// Run with: node add-more-living-room-images.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function addMoreLivingRoomImages() {
  console.log('🏠 Adding MORE Living Room Images (without overwriting)...\n');
  
  const imagesDir = path.join(__dirname, 'public', 'images');
  const downloadsDir = path.join(imagesDir, 'downloads');
  const livingRoomDir = path.join(imagesDir, 'living-room');
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  // Check existing living room images to find next number
  const existingFiles = fs.existsSync(livingRoomDir) 
    ? fs.readdirSync(livingRoomDir).filter(f => f.endsWith('.webp'))
    : [];
  
  console.log(`📁 Found ${existingFiles.length} existing living room images:`);
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
    return;
  }
  
  // Ask user how many to process
  console.log(`\n📋 Available images to add:`);
  allFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  
  // Process ALL images in downloads (you can modify this)
  const imagesToProcess = allFiles;
  console.log(`\n🔄 Processing ${imagesToProcess.length} new images...\n`);
  
  // Load existing metadata
  let metadata = {};
  if (fs.existsSync(metadataPath)) {
    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
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
  
  // Update category count in categories-config.js
  const categoriesConfigPath = path.join(__dirname, 'lib', 'categories-config.js');
  if (fs.existsSync(categoriesConfigPath)) {
    let configContent = fs.readFileSync(categoriesConfigPath, 'utf8');
    
    // Count total living room images
    const totalLivingRoomImages = Object.values(metadata)
      .filter(img => img.category === 'living-room').length;
    
    // Update the living-room count
    configContent = configContent.replace(
      /"living-room": \{[\s\S]*?"count": \d+/,
      `"living-room": {
    "name": "Living Room",
    "description": "Comfortable living room backgrounds for casual meetings and personal video calls",
    "count": ${totalLivingRoomImages}`
    );
    
    fs.writeFileSync(categoriesConfigPath, configContent);
    console.log(`📊 Updated categories-config.js with new count: ${totalLivingRoomImages}`);
  }
  
  // Update the category page with new images
  console.log('\n🔄 Updating category page...');
  const categoryPagePath = path.join(__dirname, 'pages', 'category', '[slug].js');
  if (fs.existsSync(categoryPagePath)) {
    let pageContent = fs.readFileSync(categoryPagePath, 'utf8');
    
    // Generate new images array for living-room
    const livingRoomImages = Object.values(metadata)
      .filter(img => img.category === 'living-room')
      .sort((a, b) => {
        const numA = parseInt(a.filename.match(/living-room-(\d+)/)?.[1] || '0');
        const numB = parseInt(b.filename.match(/living-room-(\d+)/)?.[1] || '0');
        return numA - numB;
      })
      .map(img => `      { filename: '${img.filename}', title: '${img.title}' }`);
    
    // Create the new living-room section
    const newLivingRoomSection = `  'living-room': {
    name: 'Living Room (more coming soon!!)',
    description: 'Comfortable living room backgrounds for casual meetings and personal video calls',
    seoDescription: 'Download free living room virtual backgrounds for video calls. Comfortable home settings for casual meetings.',
    images: [
${livingRoomImages.join(',\n')}
    ]
  }`;
    
    // Replace the existing living-room section
    pageContent = pageContent.replace(
      /'living-room': \{[\s\S]*?images: \[[\s\S]*?\]\s*\}/,
      newLivingRoomSection
    );
    
    fs.writeFileSync(categoryPagePath, pageContent);
    console.log('✅ Updated category page with new images');
  }
  
  // Show summary
  console.log('\n🎉 Successfully Added More Images!');
  console.log('=' .repeat(50));
  console.log(`✅ Added: ${processedImages.length} new images`);
  console.log(`📁 Total living room images: ${currentNum - 1}`);
  console.log(`📋 All metadata updated`);
  
  console.log('\n📝 New Images Added:');
  processedImages.forEach((img, index) => {
    console.log(`   ${highestNum + index + 1}. ${img.filename} (${img.fileSize})`);
  });
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Check all images: http://localhost:3000/category/living-room');
  console.log('2. Move processed files from downloads to project folder');
  console.log('3. Deploy the changes');
  
  console.log('\n📋 Quick Deploy:');
  console.log('git add .');
  console.log(`git commit -m "Add ${processedImages.length} more living room images"`);
  console.log('git push origin main');
}

// Install sharp if not already installed
function checkSharpInstallation() {
  try {
    require('sharp');
    return true;
  } catch (error) {
    console.log('📦 Sharp not found. Run: npm install sharp');
    return false;
  }
}

if (checkSharpInstallation()) {
  addMoreLivingRoomImages().catch(error => {
    console.error('❌ Error:', error);
  });
}