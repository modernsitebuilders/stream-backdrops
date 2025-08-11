// complete-file-renamer.js
// This will rename ALL remaining files to have consistent naming

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'public', 'images');

// Complete mapping to rename ALL files to consistent format
const completeRenameMap = {
  // WELL-LIT CATEGORY - rename remaining old files
  'well-lit': {
    // These two metal shelves should be renamed to well-lit format
    'professional-shelves-metal-professional-shelves-39.webp': 'well-lit-metal-shelves-1.webp',
    'professional-shelves-metal-professional-shelves-40.webp': 'well-lit-metal-shelves-2.webp',
    
    // All the well-lit files are already correctly named, no changes needed
  },

  // AMBIENT-LIGHTING CATEGORY - rename ALL to consistent ambient- format
  'ambient-lighting': {
    // Rename the correctly named ones to stay consistent
    'ambient-industrial-shelves-1.webp': 'ambient-industrial-shelves-1.webp', // already correct
    'ambient-industrial-shelves-2.webp': 'ambient-industrial-shelves-2.webp', // already correct
    'ambient-industrial-shelves-7.webp': 'ambient-industrial-shelves-3.webp', // renumber
    'ambient-industrial-shelves-8.webp': 'ambient-industrial-shelves-4.webp', // renumber
    
    // Rename all the home-lifestyle files
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
    
    // Rename professional shelves to ambient format
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
    'professional-shelves-stone-professional-shelves-9.webp': 'ambient-stone-shelves-3.webp'
  },

  // OFFICE-SPACES CATEGORY - all already correctly named, no changes needed
  'office-spaces': {
    // All files are already correctly named with office-spaces- prefix
  }
};

// Function to safely rename files
function renameFile(oldPath, newPath) {
  try {
    if (fs.existsSync(oldPath)) {
      // Only rename if the new name is different
      if (oldPath !== newPath) {
        // Create directory if it doesn't exist
        const dir = path.dirname(newPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.renameSync(oldPath, newPath);
        console.log(`✅ Renamed: ${path.basename(oldPath)} → ${path.basename(newPath)}`);
        return true;
      } else {
        console.log(`✨ Already correct: ${path.basename(oldPath)}`);
        return true;
      }
    } else {
      console.log(`⚠️  File not found: ${oldPath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error renaming ${oldPath}:`, error.message);
    return false;
  }
}

// Main function to complete all renaming
function completeAllRenaming() {
  console.log('🔄 Completing file renaming to consistent format...\n');
  
  let totalRenamed = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  
  // Process each category
  for (const [category, files] of Object.entries(completeRenameMap)) {
    if (Object.keys(files).length === 0) {
      console.log(`\n📁 ${category}: All files already have correct naming ✅`);
      continue;
    }
    
    console.log(`\n📁 Processing ${category} category:`);
    console.log('─'.repeat(50));
    
    const categoryDir = path.join(BASE_DIR, category);
    
    // Process files in this category
    for (const [oldFilename, newFilename] of Object.entries(files)) {
      const oldPath = path.join(categoryDir, oldFilename);
      const newPath = path.join(categoryDir, newFilename);
      
      if (oldFilename === newFilename) {
        console.log(`✨ Already correct: ${oldFilename}`);
        totalSkipped++;
      } else {
        const result = renameFile(oldPath, newPath);
        if (result) {
          totalRenamed++;
        } else {
          totalErrors++;
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 SUMMARY:`);
  console.log(`✅ Successfully renamed: ${totalRenamed} files`);
  console.log(`✨ Already correct: ${totalSkipped} files`);
  console.log(`❌ Errors: ${totalErrors} files`);
  console.log('='.repeat(60));
  
  if (totalErrors === 0) {
    console.log('🎉 All files now have consistent naming!');
    console.log('\n📝 NEXT STEPS:');
    console.log('1. Run the file scanner again to see the clean results');
    console.log('2. Update your category page files with the new consistent names');
    console.log('3. Create Pinterest pins with the properly organized content');
  } else {
    console.log('\n⚠️  Some files had errors. Please check the logs above.');
  }
}

// Show what changes will be made (dry run)
function showChanges() {
  console.log('📋 Changes that will be made:\n');
  
  for (const [category, files] of Object.entries(completeRenameMap)) {
    if (Object.keys(files).length === 0) {
      console.log(`📁 ${category}: No changes needed ✅`);
      continue;
    }
    
    console.log(`\n📁 ${category.toUpperCase()}:`);
    console.log('─'.repeat(50));
    
    for (const [oldFilename, newFilename] of Object.entries(files)) {
      if (oldFilename !== newFilename) {
        console.log(`  ${oldFilename}`);
        console.log(`  → ${newFilename}\n`);
      }
    }
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--preview')) {
    showChanges();
  } else if (args.includes('--rename')) {
    completeAllRenaming();
  } else {
    console.log('🎯 Complete File Renamer');
    console.log('─'.repeat(40));
    console.log('This will rename ALL files to have consistent naming:');
    console.log('• well-lit-[type]-[number].webp');
    console.log('• ambient-[type]-[number].webp'); 
    console.log('• office-spaces-[type]-[number].webp');
    console.log('\nUsage:');
    console.log('  node complete-file-renamer.js --preview    # Show what changes will be made');
    console.log('  node complete-file-renamer.js --rename     # Actually rename the files');
    console.log('\n💡 Run --preview first to see what will change!');
  }
}

module.exports = { completeAllRenaming, showChanges };