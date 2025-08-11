// rename-files-to-new-categories.js
// Run this script to rename all your image files to match the new categories

const fs = require('fs');
const path = require('path');

// IMPORTANT: Update these paths to match your setup
const BASE_DIR = path.join(__dirname, 'public', 'images');
const CATEGORIES = ['well-lit', 'ambient-lighting', 'office-spaces'];

// Mapping from old filenames to new categorized filenames
const fileRenameMap = {
  // WELL-LIT CATEGORY (48 images) - bright, well-lit backgrounds
  'well-lit': {
    // Cozy home offices
    'home-lifestyle-cozy-home-office-6.webp': 'well-lit-cozy-home-office-1.webp',
    
    // Minimalist home offices (rename to well-lit)
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
    
    // Bright professional shelves that are well-lit
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
    
    // Stone shelves that are well-lit
    'professional-shelves-stone-professional-shelves-11.webp': 'well-lit-stone-shelves-1.webp',
    'professional-shelves-stone-professional-shelves-3.webp': 'well-lit-stone-shelves-2.webp',
    'professional-shelves-stone-professional-shelves-8.webp': 'well-lit-stone-shelves-3.webp',
  },

  // AMBIENT LIGHTING CATEGORY (49 images) - atmospheric, softer lighting
  'ambient-lighting': {
    // Industrial/metal shelves with ambient lighting
    'professional-shelves-industrial-professional-shelves-21.webp': 'ambient-industrial-shelves-1.webp',
    'professional-shelves-industrial-professional-shelves-22.webp': 'ambient-industrial-shelves-2.webp',
    'professional-shelves-industrial-professional-shelves-23.webp': 'ambient-industrial-shelves-3.webp',
    'professional-shelves-industrial-professional-shelves-24.webp': 'ambient-industrial-shelves-4.webp',
    'professional-shelves-industrial-professional-shelves-25.webp': 'ambient-industrial-shelves-5.webp',
    'professional-shelves-industrial-professional-shelves-26.webp': 'ambient-industrial-shelves-6.webp',
    'professional-shelves-industrial-professional-shelves-27.webp': 'ambient-industrial-shelves-7.webp',
    'professional-shelves-industrial-professional-shelves-28.webp': 'ambient-industrial-shelves-8.webp',
    'professional-shelves-industrial-professional-shelves-29.webp': 'ambient-industrial-shelves-9.webp',
    'professional-shelves-industrial-professional-shelves-35.webp': 'ambient-industrial-shelves-10.webp',
    'professional-shelves-industrial-professional-shelves-36.webp': 'ambient-industrial-shelves-11.webp',
    'professional-shelves-industrial-professional-shelves-37.webp': 'ambient-industrial-shelves-12.webp',
    'professional-shelves-industrial-professional-shelves-38.webp': 'ambient-industrial-shelves-13.webp',
    'professional-shelves-industrial-professional-shelves-41.webp': 'ambient-industrial-shelves-14.webp',
    'professional-shelves-industrial-professional-shelves-44.webp': 'ambient-industrial-shelves-15.webp',
    'professional-shelves-industrial-professional-shelves-45.webp': 'ambient-industrial-shelves-16.webp',
    'professional-shelves-industrial-professional-shelves-46.webp': 'ambient-industrial-shelves-17.webp',
    'professional-shelves-industrial-professional-shelves-48.webp': 'ambient-industrial-shelves-18.webp',
    'professional-shelves-industrial-professional-shelves.webp': 'ambient-industrial-shelves-19.webp',
    
    // Metal shelves with ambient lighting
    'professional-shelves-metal-professional-shelves-39.webp': 'ambient-metal-shelves-1.webp',
    'professional-shelves-metal-professional-shelves-40.webp': 'ambient-metal-shelves-2.webp',
    
    // Dark/concrete shelves with ambient lighting
    'professional-shelves-concrete-professional-shelves-14.webp': 'ambient-concrete-shelves-1.webp',
    'professional-shelves-concrete-professional-shelves-15.webp': 'ambient-concrete-shelves-2.webp',
    'professional-shelves-concrete-professional-shelves-16.webp': 'ambient-concrete-shelves-3.webp',
    'professional-shelves-concrete-professional-shelves-17.webp': 'ambient-concrete-shelves-4.webp',
    'professional-shelves-concrete-professional-shelves-4.webp': 'ambient-concrete-shelves-5.webp',
    'professional-shelves-concrete-professional-shelves-5.webp': 'ambient-concrete-shelves-6.webp',
    'professional-shelves-concrete-professional-shelves-9.webp': 'ambient-concrete-shelves-7.webp',
    
    // Dark wood shelves with ambient lighting
    'professional-shelves-dark-wood-professional-shelves-1.webp': 'ambient-dark-wood-shelves-1.webp',
    'professional-shelves-dark-wood-professional-shelves-10.webp': 'ambient-dark-wood-shelves-2.webp',
    
    // Academic/library style with ambient lighting
    'academic-literary-library-office-1.webp': 'ambient-library-office-1.webp',
    'academic-literary-library-office-10.webp': 'ambient-library-office-2.webp',
    'academic-literary-library-office-11.webp': 'ambient-library-office-3.webp',
    'academic-literary-library-office-12.webp': 'ambient-library-office-4.webp',
    'academic-literary-library-office-13.webp': 'ambient-library-office-5.webp',
    'academic-literary-library-office-2.webp': 'ambient-library-office-6.webp',
    'academic-literary-library-office-3.webp': 'ambient-library-office-7.webp',
    'academic-literary-library-office-4.webp': 'ambient-library-office-8.webp',
    'academic-literary-library-office-5.webp': 'ambient-library-office-9.webp',
    'academic-literary-library-office-6.webp': 'ambient-library-office-10.webp',
    'academic-literary-library-office-7.webp': 'ambient-library-office-11.webp',
    'academic-literary-library-office-8.webp': 'ambient-library-office-12.webp',
    'academic-literary-library-office-9.webp': 'ambient-library-office-13.webp',
    'academic-literary-library-office.webp': 'ambient-library-office-14.webp',
    
    // Creative spaces with ambient lighting
    'creative-artistic-gallery-wall-1.webp': 'ambient-gallery-wall-1.webp',
    'creative-artistic-gallery-wall-2.webp': 'ambient-gallery-wall-2.webp',
    'creative-artistic-gallery-wall-3.webp': 'ambient-gallery-wall-3.webp',
    'creative-artistic-gallery-wall-4.webp': 'ambient-gallery-wall-4.webp',
    'creative-artistic-gallery-wall-5.webp': 'ambient-gallery-wall-5.webp',
  },

  // OFFICE SPACES CATEGORY (15 images) - dedicated office environments
  'office-spaces': {
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
    'professional-office-interior-7.webp': 'office-spaces-office-interior-2.webp',
  }
};

// Function to safely rename files
function renameFile(oldPath, newPath) {
  try {
    if (fs.existsSync(oldPath)) {
      // Create directory if it doesn't exist
      const dir = path.dirname(newPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.renameSync(oldPath, newPath);
      console.log(`✅ Renamed: ${path.basename(oldPath)} → ${path.basename(newPath)}`);
      return true;
    } else {
      console.log(`⚠️  File not found: ${oldPath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error renaming ${oldPath}:`, error.message);
    return false;
  }
}

// Main rename function
function renameAllFiles() {
  console.log('🚀 Starting file rename process...\n');
  
  let totalRenamed = 0;
  let totalErrors = 0;
  
  // Process each category
  for (const [category, files] of Object.entries(fileRenameMap)) {
    console.log(`\n📁 Processing ${category} category:`);
    console.log('─'.repeat(50));
    
    const categoryDir = path.join(BASE_DIR, category);
    
    // Create category directory if it doesn't exist
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
      console.log(`📂 Created directory: ${categoryDir}`);
    }
    
    // Rename files in this category
    for (const [oldFilename, newFilename] of Object.entries(files)) {
      const oldPath = path.join(BASE_DIR, category, oldFilename);
      const newPath = path.join(BASE_DIR, category, newFilename);
      
      if (renameFile(oldPath, newPath)) {
        totalRenamed++;
      } else {
        totalErrors++;
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 SUMMARY:`);
  console.log(`✅ Successfully renamed: ${totalRenamed} files`);
  console.log(`❌ Errors: ${totalErrors} files`);
  console.log('='.repeat(60));
  
  if (totalErrors === 0) {
    console.log('🎉 All files renamed successfully!');
    console.log('\n📝 NEXT STEPS:');
    console.log('1. Update your category page files to use the new filenames');
    console.log('2. Update any metadata files that reference the old filenames');
    console.log('3. Test your website to ensure all images load correctly');
  } else {
    console.log('\n⚠️  Some files had errors. Please check the logs above.');
  }
}

// Backup function (run this first!)
function createBackup() {
  const backupDir = path.join(__dirname, 'backup-images');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  console.log('💾 Creating backup...');
  
  // Copy all image files to backup
  CATEGORIES.forEach(category => {
    const sourceDir = path.join(BASE_DIR, category);
    const destDir = path.join(backupDir, category);
    
    if (fs.existsSync(sourceDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      
      const files = fs.readdirSync(sourceDir);
      files.forEach(file => {
        if (file.endsWith('.webp')) {
          fs.copyFileSync(
            path.join(sourceDir, file),
            path.join(destDir, file)
          );
        }
      });
      
      console.log(`📦 Backed up ${category}: ${files.length} files`);
    }
  });
  
  console.log('✅ Backup complete!\n');
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--backup')) {
    createBackup();
  } else if (args.includes('--rename')) {
    renameAllFiles();
  } else if (args.includes('--full')) {
    createBackup();
    console.log('⏳ Waiting 3 seconds before rename...\n');
    setTimeout(renameAllFiles, 3000);
  } else {
    console.log('🎯 File Renamer for New Categories');
    console.log('─'.repeat(40));
    console.log('Usage:');
    console.log('  node rename-files-to-new-categories.js --backup    # Create backup only');
    console.log('  node rename-files-to-new-categories.js --rename    # Rename files only');
    console.log('  node rename-files-to-new-categories.js --full      # Backup + rename');
    console.log('\n⚠️  IMPORTANT: Always run backup first!');
  }
}

module.exports = { renameAllFiles, createBackup, fileRenameMap };