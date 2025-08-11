// update-metadata-filenames.js
// This will update all metadata files to use the new consistent filenames

const fs = require('fs');
const path = require('path');

// Check for all possible metadata files
const possibleMetadataFiles = [
  'public/data/image-metadata.json',
  'public/data/image-metadata-cleaned.json',
  'public/data/image-metadata-with-office-spaces.json',
  'pages/api/metadata.js',
  'lib/imageMetadata.js'
];

// Mapping from old filenames to new filenames (based on your successful rename)
const filenameMapping = {
  // WELL-LIT CATEGORY MAPPING
  'professional-shelves-metal-professional-shelves-39.webp': 'well-lit-metal-shelves-1.webp',
  'professional-shelves-metal-professional-shelves-40.webp': 'well-lit-metal-shelves-2.webp',
  
  // AMBIENT-LIGHTING CATEGORY MAPPING
  'home-lifestyle-basement-office-1.webp': 'ambient-basement-office-1.webp',
  'home-lifestyle-cozy-student-workspace-5.webp': 'ambient-cozy-student-workspace-1.webp',
  'home-lifestyle-garden-shed-office-7.webp': 'ambient-garden-shed-office-1.webp',
  'home-lifestyle-kitchen-workspace-2.webp': 'ambient-kitchen-workspace-1.webp',
  'home-lifestyle-minimalist-home-office-19.webp': 'ambient-minimalist-office-1.webp',
  'home-lifestyle-minimalist-home-office-20.webp': 'ambient-minimalist-office-2.webp',
  'home-lifestyle-minimalist-home-office-21.webp': 'ambient-minimalist-office-3.webp',
  'home-lifestyle-minimalist-home-office-22.webp': 'ambient-minimalist-office-4.webp',
  'home-lifestyle-minimalist-home-office-25.webp': 'ambient-minimalist-office-5.webp',
  'home-lifestyle-minimalist-home-office-26.webp': 'ambient-minimalist-office-6.webp',
  'home-lifestyle-minimalist-home-office-27.webp': 'ambient-minimalist-office-7.webp',
  'home-lifestyle-minimalist-home-office-28.webp': 'ambient-minimalist-office-8.webp',
  'home-lifestyle-minimalist-home-office-30.webp': 'ambient-minimalist-office-9.webp',
  'home-lifestyle-minimalist-home-office-32.webp': 'ambient-minimalist-office-10.webp',
  'home-lifestyle-minimalist-home-office-38.webp': 'ambient-minimalist-office-11.webp',
  'home-lifestyle-minimalist-home-office-39.webp': 'ambient-minimalist-office-12.webp',
  'home-lifestyle-minimalist-home-office-40.webp': 'ambient-minimalist-office-13.webp',
  'home-lifestyle-minimalist-home-office-41.webp': 'ambient-minimalist-office-14.webp',
  'home-lifestyle-minimalist-home-office-44.webp': 'ambient-minimalist-office-15.webp',
  'home-lifestyle-minimalist-home-office-45.webp': 'ambient-minimalist-office-16.webp',
  'home-lifestyle-minimalist-home-office-46.webp': 'ambient-minimalist-office-17.webp',
  'home-lifestyle-minimalist-home-office-48.webp': 'ambient-minimalist-office-18.webp',
  'home-lifestyle-minimalist-home-office-6.webp': 'ambient-minimalist-office-19.webp',
  'home-lifestyle-minimalist-home-office-7.webp': 'ambient-minimalist-office-20.webp',
  'home-lifestyle-spare-room-office-3.webp': 'ambient-spare-room-office-1.webp',
  'home-lifestyle-student-bedroom-office-4.webp': 'ambient-student-bedroom-office-1.webp',
  'professional-shelves-concrete-professional-shelves-23.webp': 'ambient-concrete-shelves-1.webp',
  'professional-shelves-concrete-professional-shelves-24.webp': 'ambient-concrete-shelves-2.webp',
  'professional-shelves-concrete-professional-shelves-25.webp': 'ambient-concrete-shelves-3.webp',
  'professional-shelves-concrete-professional-shelves-26.webp': 'ambient-concrete-shelves-4.webp',
  'professional-shelves-glass-professional-shelves-14.webp': 'ambient-glass-shelves-1.webp',
  'professional-shelves-glass-professional-shelves-15.webp': 'ambient-glass-shelves-2.webp',
  'professional-shelves-glass-professional-shelves-16.webp': 'ambient-glass-shelves-3.webp',
  'professional-shelves-glass-professional-shelves-17.webp': 'ambient-glass-shelves-4.webp',
  'professional-shelves-metal-professional-shelves-5.webp': 'ambient-metal-shelves-1.webp',
  'professional-shelves-professional-shelves-29.webp': 'ambient-wood-shelves-1.webp',
  'professional-shelves-professional-shelves-35.webp': 'ambient-wood-shelves-2.webp',
  'professional-shelves-professional-shelves-36.webp': 'ambient-wood-shelves-3.webp',
  'professional-shelves-professional-shelves-37.webp': 'ambient-wood-shelves-4.webp',
  'professional-shelves-professional-shelves-38.webp': 'ambient-wood-shelves-5.webp',
  'professional-shelves-professional-shelves-41.webp': 'ambient-wood-shelves-6.webp',
  'professional-shelves-professional-shelves-42.webp': 'ambient-wood-shelves-7.webp',
  'professional-shelves-stone-professional-shelves-10.webp': 'ambient-stone-shelves-1.webp',
  'professional-shelves-stone-professional-shelves-4.webp': 'ambient-stone-shelves-2.webp',
  'professional-shelves-stone-professional-shelves-9.webp': 'ambient-stone-shelves-3.webp',
  
  // WELL-LIT renamed files (keep these mappings for already renamed files)
  'home-lifestyle-cozy-home-office-6.webp': 'well-lit-cozy-home-office-1.webp',
  'home-lifestyle-minimalist-home-office-10.webp': 'well-lit-minimalist-office-1.webp',
  'home-lifestyle-minimalist-home-office-11.webp': 'well-lit-minimalist-office-2.webp',
  'home-lifestyle-minimalist-home-office-12.webp': 'well-lit-minimalist-office-3.webp',
  'home-lifestyle-minimalist-home-office-13.webp': 'well-lit-minimalist-office-4.webp',
  'home-lifestyle-minimalist-home-office-14.webp': 'well-lit-minimalist-office-5.webp',
  'home-lifestyle-minimalist-home-office-15.webp': 'well-lit-minimalist-office-6.webp',
  'home-lifestyle-minimalist-home-office-16.webp': 'well-lit-minimalist-office-7.webp',
  'home-lifestyle-minimalist-home-office-17.webp': 'well-lit-minimalist-office-8.webp',
  'home-lifestyle-minimalist-home-office-18.webp': 'well-lit-minimalist-office-9.webp',
  'home-lifestyle-minimalist-home-office-2.webp': 'well-lit-minimalist-office-10.webp',
  'home-lifestyle-minimalist-home-office-23.webp': 'well-lit-minimalist-office-11.webp',
  'home-lifestyle-minimalist-home-office-24.webp': 'well-lit-minimalist-office-12.webp',
  'home-lifestyle-minimalist-home-office-29.webp': 'well-lit-minimalist-office-13.webp',
  'home-lifestyle-minimalist-home-office-3.webp': 'well-lit-minimalist-office-14.webp',
  'home-lifestyle-minimalist-home-office-31.webp': 'well-lit-minimalist-office-15.webp',
  'home-lifestyle-minimalist-home-office-33.webp': 'well-lit-minimalist-office-16.webp',
  'home-lifestyle-minimalist-home-office-34.webp': 'well-lit-minimalist-office-17.webp',
  'home-lifestyle-minimalist-home-office-35.webp': 'well-lit-minimalist-office-18.webp',
  'home-lifestyle-minimalist-home-office-36.webp': 'well-lit-minimalist-office-19.webp',
  'home-lifestyle-minimalist-home-office-37.webp': 'well-lit-minimalist-office-20.webp',
  'home-lifestyle-minimalist-home-office-4.webp': 'well-lit-minimalist-office-21.webp',
  'home-lifestyle-minimalist-home-office-42.webp': 'well-lit-minimalist-office-22.webp',
  'home-lifestyle-minimalist-home-office-43.webp': 'well-lit-minimalist-office-23.webp',
  'home-lifestyle-minimalist-home-office-47.webp': 'well-lit-minimalist-office-24.webp',
  'home-lifestyle-minimalist-home-office-5.webp': 'well-lit-minimalist-office-25.webp',
  'home-lifestyle-minimalist-home-office-8.webp': 'well-lit-minimalist-office-26.webp',
  'home-lifestyle-minimalist-home-office-9.webp': 'well-lit-minimalist-office-27.webp',
  'home-lifestyle-minimalist-home-office.webp': 'well-lit-minimalist-office-28.webp',
  'professional-shelves-glass-professional-shelves-33.webp': 'well-lit-glass-shelves-1.webp',
  'professional-shelves-glass-professional-shelves-34.webp': 'well-lit-glass-shelves-2.webp',
  'professional-shelves-professional-shelves-12.webp': 'well-lit-wood-shelves-1.webp',
  'professional-shelves-professional-shelves-13.webp': 'well-lit-wood-shelves-2.webp',
  'professional-shelves-professional-shelves-18.webp': 'well-lit-wood-shelves-3.webp',
  'professional-shelves-professional-shelves-19.webp': 'well-lit-wood-shelves-4.webp',
  'professional-shelves-professional-shelves-2.webp': 'well-lit-wood-shelves-5.webp',
  'professional-shelves-professional-shelves-20.webp': 'well-lit-wood-shelves-6.webp',
  'professional-shelves-professional-shelves-30.webp': 'well-lit-wood-shelves-7.webp',
  'professional-shelves-professional-shelves-31.webp': 'well-lit-wood-shelves-8.webp',
  'professional-shelves-professional-shelves-32.webp': 'well-lit-wood-shelves-9.webp',
  'professional-shelves-professional-shelves-6.webp': 'well-lit-wood-shelves-10.webp',
  'professional-shelves-professional-shelves-7.webp': 'well-lit-wood-shelves-11.webp',
  'professional-shelves-professional-shelves.webp': 'well-lit-wood-shelves-12.webp',
  'professional-shelves-stone-professional-shelves-11.webp': 'well-lit-stone-shelves-1.webp',
  'professional-shelves-stone-professional-shelves-3.webp': 'well-lit-stone-shelves-2.webp',
  'professional-shelves-stone-professional-shelves-8.webp': 'well-lit-stone-shelves-3.webp',
  
  // OFFICE-SPACES (these should already have correct names)
  'corner-office-with-floor-to-ceiling-windows-8.webp': 'office-spaces-corner-office-windows-1.webp',
  'home-office-with-light-wood-accent-9.webp': 'office-spaces-light-wood-accent-1.webp',
  'home-office-with-wood-accent-wall-2.webp': 'office-spaces-wood-accent-wall-1.webp',
  'home-office-with-wood-accent-wall-3.webp': 'office-spaces-wood-accent-wall-2.webp',
  'minimalist-executive-office-1.webp': 'office-spaces-minimalist-executive-1.webp',
  'modern-home-office-with-concrete-wall-10.webp': 'office-spaces-concrete-wall-1.webp',
  'office-with-dark-wood-accent-14.webp': 'office-spaces-dark-wood-accent-1.webp',
  'office-with-dark-wood-accent-15.webp': 'office-spaces-dark-wood-accent-2.webp',
  'office-with-marble-accent-wall-11.webp': 'office-spaces-marble-accent-1.webp',
  'office-with-marble-accent-wall-12.webp': 'office-spaces-marble-accent-2.webp',
  'office-with-marble-accent-wall-13.webp': 'office-spaces-marble-accent-3.webp',
  'professional-consultation-office-4.webp': 'office-spaces-consultation-office-1.webp',
  'professional-consultation-office-5.webp': 'office-spaces-consultation-office-2.webp',
  'professional-office-interior-6.webp': 'office-spaces-office-interior-1.webp',
  'professional-office-interior-7.webp': 'office-spaces-office-interior-2.webp'
};

// Category mapping from old to new
const categoryMapping = {
  'home-lifestyle': 'well-lit',
  'professional-shelves': 'ambient-lighting',
  'home-offices': 'well-lit',
  'executive-offices': 'office-spaces',
  'lobbies': 'office-spaces',
  'conference-rooms': 'office-spaces',
  'private-offices': 'office-spaces',
  'open-offices': 'office-spaces'
};

function updateMetadataFile(filePath) {
  console.log(`\n📄 Processing: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let isJSFile = filePath.endsWith('.js');
    let changed = false;
    let changeCount = 0;
    
    if (isJSFile) {
      // Handle JS files - update strings and object properties
      for (const [oldFilename, newFilename] of Object.entries(filenameMapping)) {
        const oldPattern = new RegExp(`['"\`]${oldFilename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"\`]`, 'g');
        if (oldPattern.test(content)) {
          content = content.replace(oldPattern, `'${newFilename}'`);
          changed = true;
          changeCount++;
        }
      }
      
      // Update category references
      for (const [oldCategory, newCategory] of Object.entries(categoryMapping)) {
        const categoryPattern = new RegExp(`['"\`]${oldCategory}['"\`]`, 'g');
        if (categoryPattern.test(content)) {
          content = content.replace(categoryPattern, `'${newCategory}'`);
          changed = true;
          changeCount++;
        }
      }
    } else {
      // Handle JSON files
      const data = JSON.parse(content);
      
      // Update each entry in the metadata
      for (const [key, metadata] of Object.entries(data)) {
        let entryChanged = false;
        
        // Update filename if it has an old name
        if (metadata.filename && filenameMapping[metadata.filename]) {
          console.log(`   📝 ${metadata.filename} → ${filenameMapping[metadata.filename]}`);
          data[key].filename = filenameMapping[metadata.filename];
          entryChanged = true;
          changeCount++;
        }
        
        // Update category if it's an old category
        if (metadata.category && categoryMapping[metadata.category]) {
          console.log(`   📁 Category: ${metadata.category} → ${categoryMapping[metadata.category]}`);
          data[key].category = categoryMapping[metadata.category];
          entryChanged = true;
          changeCount++;
        }
        
        if (entryChanged) {
          changed = true;
        }
      }
      
      if (changed) {
        content = JSON.stringify(data, null, 2);
      }
    }
    
    if (changed) {
      // Backup original file
      fs.copyFileSync(filePath, filePath + '.backup');
      console.log(`💾 Backed up original to: ${filePath}.backup`);
      
      // Write updated content
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated ${changeCount} items in ${filePath}`);
      return true;
    } else {
      console.log(`✨ No changes needed in ${filePath}`);
      return true;
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function updateAllMetadata() {
  console.log('🔄 Updating all metadata files with new filenames...\n');
  
  let processedCount = 0;
  let successCount = 0;
  
  possibleMetadataFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    processedCount++;
    
    if (updateMetadataFile(fullPath)) {
      successCount++;
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 SUMMARY:`);
  console.log(`✅ Successfully processed: ${successCount}/${processedCount} files`);
  console.log('='.repeat(60));
  
  if (successCount > 0) {
    console.log('\n🎉 Metadata files updated with new filenames!');
    console.log('\n📝 NEXT STEPS:');
    console.log('1. Restart your dev server (Ctrl+C, then npm run dev)');
    console.log('2. Clear browser cache (Ctrl+Shift+R)');
    console.log('3. Check /api/metadata endpoint');
    console.log('4. Test your category pages');
    console.log('5. Deploy to Vercel when everything works');
  }
  
  // Show final category counts
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  if (fs.existsSync(metadataPath)) {
    try {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      const categoryCounts = {};
      
      Object.values(metadata).forEach(item => {
        if (item.category) {
          categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
        }
      });
      
      console.log('\n📊 Updated category counts:');
      Object.entries(categoryCounts).forEach(([category, count]) => {
        console.log(`   ${category}: ${count} images`);
      });
    } catch (error) {
      console.log('Could not read final category counts');
    }
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log('🎯 Metadata Filename Updater');
    console.log('─'.repeat(40));
    console.log('Updates all metadata files to use the new consistent filenames');
    console.log('\nUsage:');
    console.log('  node update-metadata-filenames.js           # Update all files');
    console.log('  node update-metadata-filenames.js --help    # Show this help');
  } else {
    updateAllMetadata();
  }
}

module.exports = { updateAllMetadata, filenameMapping, categoryMapping };