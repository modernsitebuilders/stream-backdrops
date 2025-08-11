// fix-metadata-by-folders.js - Update metadata based on actual folder structure
const fs = require('fs');
const path = require('path');

function fixMetadataByFolders() {
  console.log('🔧 Fixing metadata based on actual folder structure...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  const imagesDir = path.join(__dirname, 'public', 'images');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  // Check what folders actually exist
  const folders = ['well-lit', 'ambient-lighting', 'office-spaces'];
  const folderContents = {};
  
  folders.forEach(folder => {
    const folderPath = path.join(imagesDir, folder);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath).filter(f => 
        f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg')
      );
      folderContents[folder] = files;
      console.log(`📁 ${folder}: ${files.length} images`);
    } else {
      console.log(`❌ Folder not found: ${folder}`);
      folderContents[folder] = [];
    }
  });
  
  // Load current metadata
  let metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  console.log(`\n📋 Current metadata: ${Object.keys(metadata).length} entries`);
  
  // Create new metadata based on actual folder structure
  const newMetadata = {};
  let totalProcessed = 0;
  
  folders.forEach(category => {
    const files = folderContents[category];
    console.log(`\n🔄 Processing ${category} (${files.length} files):`);
    
    files.forEach(filename => {
      const key = filename.replace(/\.(webp|png|jpg)$/i, '');
      
      // Check if this image already has metadata
      const existingData = Object.values(metadata).find(item => item.filename === filename);
      
      if (existingData) {
        // Update existing metadata with correct category
        newMetadata[key] = {
          ...existingData,
          category: category,
          filename: filename
        };
        console.log(`  ✅ Updated: ${filename} → ${category}`);
      } else {
        // Create new metadata entry
        const title = key
          .replace(/^(well-lit-|ambient-lighting-|office-spaces-)/, '')
          .replace(/^(home-lifestyle-|professional-shelves-)/, '')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        
        newMetadata[key] = {
          filename: filename,
          title: title,
          description: getCategoryDescription(category, title),
          category: category,
          keywords: getCategoryKeywords(category),
          alt: title,
          isPremium: filename.includes('premium') || filename.includes('4k')
        };
        console.log(`  🆕 Created: ${filename} → ${category}`);
      }
      
      totalProcessed++;
    });
  });
  
  // Save the corrected metadata
  fs.writeFileSync(metadataPath, JSON.stringify(newMetadata, null, 2));
  
  console.log(`\n🎉 Successfully processed ${totalProcessed} images!`);
  
  // Show final distribution
  const finalCounts = {};
  Object.values(newMetadata).forEach(item => {
    finalCounts[item.category] = (finalCounts[item.category] || 0) + 1;
  });
  
  console.log('\n📊 FINAL CORRECT distribution:');
  Object.entries(finalCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  console.log('\n✅ Metadata now matches your folder structure!');
  console.log('\n🚀 Next steps:');
  console.log('1. Restart dev server: npm run dev');
  console.log('2. Test all category pages - they should now show the correct images!');
}

function getCategoryDescription(category, title) {
  const descriptions = {
    'well-lit': `Well-lit ${title.toLowerCase()} perfect for professional video calls and online meetings`,
    'ambient-lighting': `Ambient lighting ${title.toLowerCase()} with atmospheric mood perfect for video calls`,
    'office-spaces': `Professional office space ${title.toLowerCase()} perfect for business meetings and video conferences`
  };
  return descriptions[category] || `${title} virtual background perfect for video calls`;
}

function getCategoryKeywords(category) {
  const baseKeywords = ['virtual background', 'video call background', 'zoom background', 'professional background'];
  const categoryKeywords = {
    'well-lit': ['well lit', 'bright lighting', 'natural light', 'daylight'],
    'ambient-lighting': ['ambient lighting', 'atmospheric', 'mood lighting', 'soft light'],
    'office-spaces': ['office space', 'business meeting', 'corporate', 'workplace', 'professional office']
  };
  return [...baseKeywords, ...(categoryKeywords[category] || [])];
}

fixMetadataByFolders();