// filename-cleaner.js
// Renames messy auto-generated filenames to clean, SEO-friendly ones
// Also updates metadata to match new filenames
// Run with: node filename-cleaner.js

const fs = require('fs');
const path = require('path');

class FilenameCleaner {
  constructor() {
    this.metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
    this.imagesDir = path.join(__dirname, 'public', 'images');
    this.metadata = {};
    this.renames = [];
    
    this.loadMetadata();
  }

  loadMetadata() {
    if (fs.existsSync(this.metadataPath)) {
      this.metadata = JSON.parse(fs.readFileSync(this.metadataPath, 'utf8'));
      console.log(`✅ Loaded metadata: ${Object.keys(this.metadata).length} images`);
    } else {
      console.log('❌ Metadata file not found!');
      process.exit(1);
    }
  }

  saveMetadata() {
    fs.writeFileSync(this.metadataPath, JSON.stringify(this.metadata, null, 2));
    console.log('💾 Metadata saved successfully!');
  }

  // Generate clean filename based on title and type
  generateCleanFilename(title, oldFilename, index = 1) {
    // Base filename from title
    let cleanName = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens  
      .replace(/-+/g, '-') // Remove multiple hyphens
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    // Add number if needed
    const extension = path.extname(oldFilename);
    const newFilename = `${cleanName}-${index}${extension}`;
    
    return newFilename;
  }

  // Find all messy executive office filenames that need cleaning
  findMessyFilenames() {
    const messy = [];
    
    Object.entries(this.metadata).forEach(([filename, data]) => {
      if (data.category === 'executive-offices') {
        // Check if filename is messy (contains long auto-generated parts)
        if (filename.includes('u9972584128') || 
            filename.length > 50 || 
            filename.includes('activefinancial') ||
            filename.includes('activeluxury') ||
            filename.includes('workingcorner')) {
          messy.push({ filename, data });
        }
      }
    });
    
    return messy;
  }

  // Plan all the renames before executing
  planRenames() {
    const messy = this.findMessyFilenames();
    console.log(`\n🎯 Found ${messy.length} messy filenames to clean up:`);
    console.log('=' .repeat(80));
    
    // Group by title to handle duplicates
    const titleGroups = {};
    
    messy.forEach(({ filename, data }) => {
      const baseTitle = data.title || 'Executive Office';
      
      if (!titleGroups[baseTitle]) {
        titleGroups[baseTitle] = [];
      }
      titleGroups[baseTitle].push({ filename, data });
    });
    
    // Generate clean filenames
    Object.entries(titleGroups).forEach(([title, items]) => {
      items.forEach((item, index) => {
        const newFilename = this.generateCleanFilename(title, item.filename, index + 1);
        
        this.renames.push({
          oldFilename: item.filename,
          newFilename: newFilename,
          title: title,
          data: item.data
        });
        
        console.log(`📄 ${title}`);
        console.log(`   OLD: ${item.filename}`);
        console.log(`   NEW: ${newFilename}`);
        console.log('');
      });
    });
    
    console.log(`📊 Total renames planned: ${this.renames.length}`);
    return this.renames.length > 0;
  }

  // Execute the file renames and metadata updates
  executeRenames(dryRun = true) {
    if (this.renames.length === 0) {
      console.log('❌ No renames planned. Run planRenames() first.');
      return;
    }
    
    console.log(`\n${dryRun ? '🔍 DRY RUN' : '🚀 EXECUTING'} - ${this.renames.length} renames`);
    console.log('=' .repeat(60));
    
    let successCount = 0;
    let errorCount = 0;
    const newMetadata = {};
    
    // First, copy over all existing metadata for non-renamed files
    Object.entries(this.metadata).forEach(([filename, data]) => {
      const isBeingRenamed = this.renames.some(r => r.oldFilename === filename);
      if (!isBeingRenamed) {
        newMetadata[filename] = data;
      }
    });
    
    this.renames.forEach((rename, index) => {
      const oldPath = path.join(this.imagesDir, rename.oldFilename);
      const newPath = path.join(this.imagesDir, rename.newFilename);
      
      console.log(`${index + 1}. ${rename.title}`);
      console.log(`   ${rename.oldFilename} → ${rename.newFilename}`);
      
      if (!dryRun) {
        try {
          // Check if old file exists
          if (fs.existsSync(oldPath)) {
            // Check if new filename already exists
            if (fs.existsSync(newPath)) {
              console.log(`   ⚠️  Target file already exists: ${rename.newFilename}`);
              // Use a different number
              const baseName = rename.newFilename.replace(/(-\d+)(\.\w+)$/, '$2');
              const ext = path.extname(rename.newFilename);
              const nameWithoutExt = baseName.replace(ext, '');
              let counter = 2;
              let alternateFilename;
              
              do {
                alternateFilename = `${nameWithoutExt}-${counter}${ext}`;
                counter++;
              } while (fs.existsSync(path.join(this.imagesDir, alternateFilename)));
              
              rename.newFilename = alternateFilename;
              console.log(`   🔄 Using alternate: ${alternateFilename}`);
            }
            
            // Rename the actual file
            fs.renameSync(oldPath, path.join(this.imagesDir, rename.newFilename));
            
            // Update metadata with new filename
            const updatedData = {
              ...rename.data,
              filename: rename.newFilename
            };
            newMetadata[rename.newFilename] = updatedData;
            
            console.log(`   ✅ SUCCESS`);
            successCount++;
            
          } else {
            console.log(`   ❌ File not found: ${rename.oldFilename}`);
            errorCount++;
            
            // Still update metadata even if file doesn't exist
            const updatedData = {
              ...rename.data,
              filename: rename.newFilename
            };
            newMetadata[rename.newFilename] = updatedData;
          }
        } catch (error) {
          console.log(`   ❌ ERROR: ${error.message}`);
          errorCount++;
          
          // Keep old metadata if rename failed
          newMetadata[rename.oldFilename] = rename.data;
        }
      } else {
        // Dry run - just check file exists
        if (fs.existsSync(oldPath)) {
          console.log(`   ✅ File found, ready to rename`);
          successCount++;
        } else {
          console.log(`   ⚠️  File not found: ${rename.oldFilename}`);
          errorCount++;
        }
      }
      console.log('');
    });
    
    if (!dryRun) {
      // Save updated metadata
      this.metadata = newMetadata;
      this.saveMetadata();
    }
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
    if (dryRun) {
      console.log(`\n🚀 To execute the renames, run with --execute flag:`);
      console.log(`node filename-cleaner.js --execute`);
    } else {
      console.log(`\n🎉 File cleanup complete! Your executive office filenames are now clean and SEO-friendly.`);
      console.log(`📝 Next steps:`);
      console.log(`1. Check your website to make sure images still load correctly`);
      console.log(`2. Run the image order manager if you want to reorder`);
      console.log(`3. Deploy your changes`);
    }
  }

  // Show what would be cleaned
  showCleanupPreview() {
    const messy = this.findMessyFilenames();
    
    if (messy.length === 0) {
      console.log(`✅ All executive office filenames are already clean!`);
      return false;
    }
    
    console.log(`\n📋 MESSY FILENAMES TO CLEAN (${messy.length} files):`);
    console.log('=' .repeat(80));
    
    messy.forEach((item, index) => {
      console.log(`${index + 1}. ${item.data.title || 'No Title'}`);
      console.log(`   📄 ${item.filename}`);
      console.log(`   📏 Length: ${item.filename.length} characters`);
    });
    
    return true;
  }
}

// Main execution
function main() {
  const cleaner = new FilenameCleaner();
  const args = process.argv.slice(2);
  const isExecute = args.includes('--execute');
  
  console.log('🧹 EXECUTIVE OFFICE FILENAME CLEANER');
  console.log('====================================');
  
  // Show current messy filenames
  const hasMessyFiles = cleaner.showCleanupPreview();
  
  if (!hasMessyFiles) {
    return;
  }
  
  // Plan the renames
  const hasRenames = cleaner.planRenames();
  
  if (!hasRenames) {
    console.log('❌ No renames could be planned.');
    return;
  }
  
  if (isExecute) {
    console.log('\n⚠️  WARNING: This will rename actual files and update metadata!');
    console.log('Make sure you have a backup before proceeding.');
    console.log('\nProceeding in 3 seconds...');
    
    setTimeout(() => {
      cleaner.executeRenames(false);
    }, 3000);
  } else {
    // Dry run
    cleaner.executeRenames(true);
  }
}

if (require.main === module) {
  main();
}

module.exports = FilenameCleaner;