// fix-category-images.js - Fix the category image references that are causing 404s
// Run with: node fix-category-images.js

const fs = require('fs');
const path = require('path');

function fixCategoryImages() {
  console.log('🔧 Fixing category image references...\n');
  
  // First, let's see what images we actually have
  const imagesDir = path.join(__dirname, 'public', 'images');
  const actualImages = fs.readdirSync(imagesDir)
    .filter(file => file.endsWith('.webp'))
    .sort();
  
  console.log(`📁 You have ${actualImages.length} actual images`);
  
  // Get some good replacement images from each category
  const homeLifestyleImages = actualImages.filter(img => img.includes('home-lifestyle'));
  const professionalShelvesImages = actualImages.filter(img => img.includes('professional-shelves'));
  
  console.log(`   home-lifestyle: ${homeLifestyleImages.length} images`);
  console.log(`   professional-shelves: ${professionalShelvesImages.length} images`);
  
  // Create mappings for the missing image keys (without .webp)
  const imageReplacements = {
    'scandinavian-home-office-1': homeLifestyleImages[0]?.replace('.webp', '') || 'home-lifestyle-minimalist-home-office-1',
    'luxury-ceo-corner-office-4': homeLifestyleImages[1]?.replace('.webp', '') || 'home-lifestyle-minimalist-home-office-2', 
    'corporate-lobby-with-reception-1': professionalShelvesImages[0]?.replace('.webp', '') || 'professional-shelves-scandinavian-professional-shelves-1',
    'minimalist-consultant-office-1': professionalShelvesImages[1]?.replace('.webp', '') || 'professional-shelves-scandinavian-professional-shelves-2',
    'professional-consultation-office-1': professionalShelvesImages[2]?.replace('.webp', '') || 'professional-shelves-scandinavian-professional-shelves-3'
  };
  
  console.log('\n🔄 Image replacements:');
  Object.entries(imageReplacements).forEach(([old, newKey]) => {
    console.log(`   ${old} -> ${newKey}`);
  });
  
  // Files that likely contain category definitions with image properties
  const filesToFix = [
    'pages/index.js',
    'pages/category/[slug].js',
    'components/CategoryCards.js',
    'components/Hero.js',
    'lib/categories.js',
    'utils/categories.js'
  ];
  
  let totalFixed = 0;
  
  filesToFix.forEach(relativePath => {
    const fullPath = path.join(__dirname, relativePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`   ⚠️  ${relativePath} - Not found`);
      return;
    }
    
    console.log(`\n🔍 Checking: ${relativePath}`);
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;
    let changeCount = 0;
    
    // Replace each missing image reference
    Object.entries(imageReplacements).forEach(([oldKey, newKey]) => {
      // Pattern 1: image: 'old-key'
      const pattern1 = new RegExp(`image:\\s*['"]${oldKey}['"]`, 'g');
      if (pattern1.test(content)) {
        content = content.replace(pattern1, `image: '${newKey}'`);
        changed = true;
        changeCount++;
        console.log(`   🔧 Fixed: image: '${oldKey}' -> image: '${newKey}'`);
      }
      
      // Pattern 2: 'old-key' as standalone string (might be in arrays or objects)
      const pattern2 = new RegExp(`['"]${oldKey}['"]`, 'g');
      const matches = content.match(pattern2);
      if (matches) {
        content = content.replace(pattern2, `'${newKey}'`);
        changed = true;
        changeCount += matches.length;
        console.log(`   🔧 Fixed ${matches.length} references: '${oldKey}' -> '${newKey}'`);
      }
    });
    
    if (changed) {
      // Backup first
      if (!fs.existsSync(fullPath + '.backup')) {
        fs.copyFileSync(fullPath, fullPath + '.backup');
      }
      
      fs.writeFileSync(fullPath, content);
      totalFixed++;
      console.log(`   ✅ Made ${changeCount} changes to ${relativePath}`);
    } else {
      console.log(`   ℹ️  No missing image references found`);
    }
  });
  
  console.log(`\n🎉 Fixed image references in ${totalFixed} files`);
  
  // Also check if there are any category objects we can display
  console.log('\n📋 Let me show you the category structure from index.js:');
  
  const indexPath = path.join(__dirname, 'pages', 'index.js');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    
    // Look for category objects
    const categoryMatch = content.match(/const\s+\w*[Cc]ategories?\s*=\s*{[\s\S]*?};/);
    if (categoryMatch) {
      console.log('Found category object:');
      console.log(categoryMatch[0].substring(0, 500) + '...');
    } else {
      console.log('No category object pattern found - checking for other structures...');
      
      // Look for any object that might contain image references
      const lines = content.split('\n');
      const imageLines = lines.filter(line => line.includes('image:'));
      if (imageLines.length > 0) {
        console.log('Lines with image: properties:');
        imageLines.forEach(line => console.log(`   ${line.trim()}`));
      }
    }
  }
  
  console.log('\n🚀 Next steps:');
  console.log('1. Stop your dev server (Ctrl+C)');
  console.log('2. Delete .next cache: rmdir /s .next');
  console.log('3. Restart: npm run dev');
  console.log('4. The 404 errors should be gone!');
  
  console.log('\n✅ Available replacement images:');
  console.log('Home & Lifestyle:');
  homeLifestyleImages.slice(0, 5).forEach(img => console.log(`   ${img}`));
  console.log('Professional Shelves:');  
  professionalShelvesImages.slice(0, 5).forEach(img => console.log(`   ${img}`));
}

fixCategoryImages();