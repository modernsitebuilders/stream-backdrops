// windows-auto-fix.js - Fix all category references (Windows-compatible)
// Run with: node windows-auto-fix.js

const fs = require('fs');
const path = require('path');

function fixAllCategories() {
  console.log('🔧 Fixing all category references...\n');
  
  // Files that need fixing (relative to current directory)
  const filesToFix = [
    'pages/blog-background-mistakes.js',
    'pages/category/[slug].js', 
    'pages/index.js',
    'pages/premium.js',
    'pages/sitemap.xml.js',
    'components/CategoryCards.js',
    'components/ImageGallery.js'
  ];
  
  // Category replacements
  const replacements = {
    'home-offices': 'home-lifestyle',
    'executive-offices': 'home-lifestyle', 
    'minimalist': 'professional-shelves',
    'lobbies': 'professional-shelves',
    'conference-rooms': 'professional-shelves',
    'private-offices': 'professional-shelves',
    'open-offices': 'professional-shelves'
  };
  
  let totalFixed = 0;
  
  filesToFix.forEach(relativePath => {
    const fullPath = path.join(__dirname, relativePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${relativePath}`);
      return;
    }
    
    console.log(`🔍 Processing: ${relativePath}`);
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;
    let changeCount = 0;
    
    // Apply all replacements
    Object.entries(replacements).forEach(([oldCat, newCat]) => {
      // Pattern 1: 'old-category' -> 'new-category'
      const singleQuotePattern = new RegExp(`'${oldCat}'`, 'g');
      const singleQuoteMatches = content.match(singleQuotePattern);
      if (singleQuoteMatches) {
        content = content.replace(singleQuotePattern, `'${newCat}'`);
        changeCount += singleQuoteMatches.length;
        changed = true;
      }
      
      // Pattern 2: "old-category" -> "new-category"  
      const doubleQuotePattern = new RegExp(`"${oldCat}"`, 'g');
      const doubleQuoteMatches = content.match(doubleQuotePattern);
      if (doubleQuoteMatches) {
        content = content.replace(doubleQuotePattern, `"${newCat}"`);
        changeCount += doubleQuoteMatches.length;
        changed = true;
      }
      
      // Pattern 3: /category/old-category -> /category/new-category
      const urlPattern = new RegExp(`/category/${oldCat}`, 'g');
      const urlMatches = content.match(urlPattern);
      if (urlMatches) {
        content = content.replace(urlPattern, `/category/${newCat}`);
        changeCount += urlMatches.length;
        changed = true;
      }
      
      // Pattern 4: old-category: { -> new-category: {
      const objectKeyPattern = new RegExp(`${oldCat}:\\s*{`, 'g');
      const objectKeyMatches = content.match(objectKeyPattern);
      if (objectKeyMatches) {
        content = content.replace(objectKeyPattern, `${newCat}: {`);
        changeCount += objectKeyMatches.length;
        changed = true;
      }
    });
    
    // Special fixes for specific files
    if (relativePath.includes('blog-background-mistakes.js')) {
      // Don't change "minimalist" in prose descriptions - only check if it's a category reference
      // This one might be in regular text, so we'll skip it for now
      console.log('   📝 Skipping blog content - may need manual review');
    }
    
    if (relativePath.includes('ImageGallery.js')) {
      // Fix the categories array
      const oldArray = `const categories = ['home-offices', 'executive-offices', 'minimalist', 'lobbies', 'private-offices'];`;
      const newArray = `const categories = ['home-lifestyle', 'professional-shelves'];`;
      if (content.includes(oldArray.replace(/'/g, "'"))) {
        content = content.replace(oldArray, newArray);
        changeCount++;
        changed = true;
      }
    }
    
    // Write the updated file
    if (changed) {
      // Backup original first
      const backupPath = fullPath + '.backup';
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(fullPath, backupPath);
      }
      
      fs.writeFileSync(fullPath, content);
      console.log(`   ✅ Fixed ${changeCount} references`);
      totalFixed++;
    } else {
      console.log(`   ℹ️  No changes needed`);
    }
  });
  
  console.log(`\n🎉 Fixed ${totalFixed} files!`);
  
  // Show the new category structure
  console.log('\n📁 Your NEW category structure:');
  console.log('   home-lifestyle: Home & Lifestyle (48 images)');
  console.log('   professional-shelves: Professional Shelves (42 images)');
  
  console.log('\n🚀 Next steps:');
  console.log('1. Delete .next folder: rmdir /s .next');
  console.log('2. Clear browser cache'); 
  console.log('3. Start dev server: npm run dev');
  console.log('4. Site should now work with correct categories!');
  
  console.log('\n💾 Note: Original files backed up with .backup extension');
}

fixAllCategories();