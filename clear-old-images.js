// clear-old-images.js - Clear existing images and metadata
// Save this file in your stream-backdrops/nextjs-site/ folder  
// Run with: node clear-old-images.js

const fs = require('fs');
const path = require('path');

function clearOldImages() {
  console.log('🧹 Starting cleanup of existing images and metadata...\n');
  
  // Paths
  const imagesDir = path.join(__dirname, 'public', 'images');
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  const backupDir = path.join(__dirname, 'backup-old-collection');
  
  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log(`📁 Created backup directory: ${backupDir}`);
  }
  
  let clearedCount = 0;
  
  // 1. Backup and clear images
  if (fs.existsSync(imagesDir)) {
    console.log('📸 Backing up and clearing images...');
    
    // Create backup images folder
    const backupImagesDir = path.join(backupDir, 'images');
    if (!fs.existsSync(backupImagesDir)) {
      fs.mkdirSync(backupImagesDir, { recursive: true });
    }
    
    // Get all image files
    const imageFiles = fs.readdirSync(imagesDir).filter(file => 
      file.endsWith('.webp') || file.endsWith('.png') || file.endsWith('.jpg')
    );
    
    console.log(`📊 Found ${imageFiles.length} existing images to clear`);
    
    // Move each image to backup
    imageFiles.forEach(filename => {
      const sourcePath = path.join(imagesDir, filename);
      const backupPath = path.join(backupImagesDir, filename);
      
      try {
        // Copy to backup first
        fs.copyFileSync(sourcePath, backupPath);
        // Then delete original
        fs.unlinkSync(sourcePath);
        clearedCount++;
        
        if (clearedCount % 10 === 0) {
          console.log(`   Cleared ${clearedCount}/${imageFiles.length} images...`);
        }
      } catch (error) {
        console.error(`❌ Error clearing ${filename}:`, error.message);
      }
    });
    
    console.log(`✅ Cleared ${clearedCount} images (backed up to: ${backupImagesDir})`);
  } else {
    console.log('⚠️  No existing images directory found');
  }
  
  // 2. Backup and clear metadata
  if (fs.existsSync(metadataPath)) {
    console.log('\n📋 Backing up and clearing metadata...');
    
    // Read existing metadata to see what we had
    const existingMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    const existingCount = Object.keys(existingMetadata).length;
    
    // Backup metadata
    const backupMetadataPath = path.join(backupDir, 'image-metadata-backup.json');
    fs.copyFileSync(metadataPath, backupMetadataPath);
    
    // Clear metadata (create fresh empty structure)
    const freshMetadata = {};
    fs.writeFileSync(metadataPath, JSON.stringify(freshMetadata, null, 2));
    
    console.log(`✅ Cleared metadata for ${existingCount} images`);
    console.log(`   Backup saved to: ${backupMetadataPath}`);
    
    // Show what categories we had
    const oldCategories = {};
    Object.values(existingMetadata).forEach(item => {
      oldCategories[item.category] = (oldCategories[item.category] || 0) + 1;
    });
    
    console.log('\n📊 Old collection summary (now backed up):');
    Object.entries(oldCategories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} images`);
    });
  } else {
    console.log('\n⚠️  No existing metadata found');
  }
  
  // 3. Verify cleanup
  console.log('\n🔍 Verification:');
  
  // Check images directory is empty
  const remainingImages = fs.existsSync(imagesDir) ? 
    fs.readdirSync(imagesDir).filter(file => 
      file.endsWith('.webp') || file.endsWith('.png') || file.endsWith('.jpg')
    ).length : 0;
  
  console.log(`   Images remaining: ${remainingImages}`);
  
  // Check metadata is empty
  const currentMetadata = fs.existsSync(metadataPath) ? 
    JSON.parse(fs.readFileSync(metadataPath, 'utf8')) : {};
  
  console.log(`   Metadata entries: ${Object.keys(currentMetadata).length}`);
  
  console.log('\n🎉 Cleanup complete!');
  console.log('📁 Your old collection is safely backed up in: backup-old-collection/');
  console.log('✨ Ready for your new curated collection!');
  
  console.log('\n💡 Next steps:');
  console.log('1. Process your new curated images');
  console.log('2. Convert them to WebP format');  
  console.log('3. Generate new metadata with your material-focused categories');
  console.log('4. Test the new collection');
}

// Safety check
function confirmCleanup() {
  console.log('🚨 WARNING: This will clear ALL existing images and metadata!');
  console.log('💾 Everything will be backed up to backup-old-collection/ folder');
  console.log('\nYour curated collection will replace:');
  console.log('- All images in public/images/');
  console.log('- All metadata in public/data/image-metadata.json');
  
  // Since we can't use readline in this environment, just run it
  console.log('\n🔄 Proceeding with cleanup...\n');
  clearOldImages();
}

confirmCleanup();