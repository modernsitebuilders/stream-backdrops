// scan-image-folders.js
// Scans your three image folders and lists all filenames
// Run with: node scan-image-folders.js

const fs = require('fs');
const path = require('path');

function scanImageFolders() {
  console.log('🔍 Scanning image folders...\n');
  
  const basePath = path.join(__dirname, 'public', 'images');
  const folders = ['light', 'dark', 'office-spaces'];
  
  folders.forEach(folder => {
    const folderPath = path.join(basePath, folder);
    
    console.log(`📁 ${folder.toUpperCase()} FOLDER:`);
    console.log('='.repeat(50));
    
    if (!fs.existsSync(folderPath)) {
      console.log(`❌ Folder not found: ${folderPath}\n`);
      return;
    }
    
    try {
      const files = fs.readdirSync(folderPath)
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.webp', '.jpg', '.jpeg', '.png'].includes(ext);
        })
        .sort();
      
      console.log(`📊 Total images: ${files.length}\n`);
      
      if (files.length === 0) {
        console.log('   (No image files found)\n');
        return;
      }
      
      // List all files
      files.forEach((file, index) => {
        console.log(`   ${(index + 1).toString().padStart(2, '0')}. ${file}`);
      });
      
      console.log('\n📋 JavaScript Array Format:');
      console.log(`const ${folder}Images = [`);
      files.forEach((file, index) => {
        const comma = index < files.length - 1 ? ',' : '';
        console.log(`  '${file}'${comma}`);
      });
      console.log('];\n');
      
      console.log('=' + '='.repeat(49) + '\n');
      
    } catch (error) {
      console.log(`❌ Error reading folder: ${error.message}\n`);
    }
  });
  
  // Summary
  console.log('📈 SUMMARY:');
  console.log('='.repeat(30));
  
  let totalImages = 0;
  folders.forEach(folder => {
    const folderPath = path.join(basePath, folder);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath)
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.webp', '.jpg', '.jpeg', '.png'].includes(ext);
        });
      console.log(`${folder}: ${files.length} images`);
      totalImages += files.length;
    } else {
      console.log(`${folder}: folder not found`);
    }
  });
  
  console.log(`Total: ${totalImages} images`);
  console.log('\n✅ Scan complete!');
}

scanImageFolders();