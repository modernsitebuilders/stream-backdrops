// fix-missing-images.js - Fix the specific 5 missing images causing 404s
// Run with: node fix-missing-images.js

const fs = require('fs');
const path = require('path');

function fixMissingImages() {
  console.log('🔧 Fixing the 5 specific missing images causing 404s...\n');
  
  // The exact missing images from your error log
  const missingImages = [
    'scandinavian-home-office-1.webp',
    'luxury-ceo-corner-office-4.webp', 
    'corporate-lobby-with-reception-1.webp',
    'minimalist-consultant-office-1.webp',
    'professional-consultation-office-1.webp'
  ];
  
  // Get list of actual image files
  const imagesDir = path.join(__dirname, 'public', 'images');
  if (!fs.existsSync(imagesDir)) {
    console.log('❌ Images directory not found!');
    return;
  }
  
  const actualImages = fs.readdirSync(imagesDir)
    .filter(file => file.endsWith('.webp'))
    .sort();
  
  console.log(`📁 You have ${actualImages.length} actual WebP files`);
  console.log('First 10 actual images:');
  actualImages.slice(0, 10).forEach(img => console.log(`   ${img}`));
  
  // Load metadata to see categories
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  // Separate images by category
  const homeLifestyleImages = [];
  const professionalShelvesImages = [];
  
  Object.entries(metadata).forEach(([key, data]) => {
    if (data.category === 'home-lifestyle') {
      homeLifestyleImages.push(data.filename);
    } else if (data.category === 'professional-shelves') {
      professionalShelvesImages.push(data.filename);
    }
  });
  
  console.log(`\n📊 Available images:`);
  console.log(`   home-lifestyle: ${homeLifestyleImages.length} images`);
  console.log(`   professional-shelves: ${professionalShelvesImages.length} images`);
  
  // Create smart replacements based on the missing image names
  const replacements = {
    'scandinavian-home-office-1.webp': homeLifestyleImages.find(img => 
      img.includes('scandinavian') || img.includes('home-office')
    ) || homeLifestyleImages[0],
    
    'luxury-ceo-corner-office-4.webp': homeLifestyleImages.find(img => 
      img.includes('luxury') || img.includes('executive') || img.includes('corner')
    ) || homeLifestyleImages[1],
    
    'corporate-lobby-with-reception-1.webp': professionalShelvesImages.find(img => 
      img.includes('lobby') || img.includes('corporate') || img.includes('reception')
    ) || professionalShelvesImages[0],
    
    'minimalist-consultant-office-1.webp': professionalShelvesImages.find(img => 
      img.includes('minimalist') || img.includes('consultant')
    ) || professionalShelvesImages[1],
    
    'professional-consultation-office-1.webp': professionalShelvesImages.find(img => 
      img.includes('consultation') || img.includes('professional')
    ) || professionalShelvesImages[2]
  };
  
  console.log('\n🔄 Replacement mapping:');
  Object.entries(replacements).forEach(([missing, replacement]) => {
    console.log(`   ${missing} -> ${replacement}`);
  });
  
  // Find and fix all files with these hardcoded references
  const filesToCheck = [
    'pages/index.js',
    'components/CategoryCards.js', 
    'components/ImageGallery.js',
    'components/FeaturedImages.js',
    'components/Hero.js',
    'pages/category/[slug].js',
    'pages/premium.js'
  ];
  
  let totalFixed = 0;
  
  filesToCheck.forEach(relativePath => {
    const fullPath = path.join(__dirname, relativePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`   ⚠️  ${relativePath} - Not found`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;
    let changeCount = 0;
    
    // Replace each missing image with its replacement
    Object.entries(replacements).forEach(([missingImg, replacementImg]) => {
      // Replace full filename with extension
      if (content.includes(missingImg)) {
        content = content.replace(new RegExp(missingImg, 'g'), replacementImg);
        changed = true;
        changeCount++;
        console.log(`   🔧 ${relativePath}: ${missingImg} -> ${replacementImg}`);
      }
      
      // Replace filename without extension (for image keys)
      const missingKey = missingImg.replace('.webp', '');
      const replacementKey = replacementImg.replace('.webp', '');
      
      const keyPatterns = [
        new RegExp(`'${missingKey}'`, 'g'),
        new RegExp(`"${missingKey}"`, 'g'),
        new RegExp(`image: '${missingKey}'`, 'g'),
        new RegExp(`image: "${missingKey}"`, 'g')
      ];
      
      keyPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          content = content.replace(pattern, (match) => match.replace(missingKey, replacementKey));
          changed = true;
          changeCount++;
          console.log(`   🔧 ${relativePath}: '${missingKey}' -> '${replacementKey}'`);
        }
      });
    });
    
    if (changed) {
      // Backup original
      if (!fs.existsSync(fullPath + '.backup')) {
        fs.copyFileSync(fullPath, fullPath + '.backup');
      }
      
      fs.writeFileSync(fullPath, content);
      totalFixed++;
      console.log(`   ✅ ${relativePath}: Made ${changeCount} replacements`);
    } else {
      console.log(`   ℹ️  ${relativePath}: No missing images found`);
    }
  });
  
  console.log(`\n🎉 Fixed ${totalFixed} files with missing image references`);
  
  console.log('\n🔍 Let me also check what images you DO have that match:');
  console.log('\nHome & Lifestyle images:');
  homeLifestyleImages.slice(0, 8).forEach(img => console.log(`   ${img}`));
  
  console.log('\nProfessional Shelves images:');
  professionalShelvesImages.slice(0, 8).forEach(img => console.log(`   ${img}`));
  
  console.log('\n🚀 Next steps:');
  console.log('1. Stop your dev server (Ctrl+C)');
  console.log('2. Delete .next folder: rmdir /s .next'); 
  console.log('3. Restart: npm run dev');
  console.log('4. Check if 404 errors are gone!');
  
  console.log('\n💡 If you still see 404s:');
  console.log('1. Check browser dev tools Network tab for exact missing files');
  console.log('2. Make sure the replacement images actually exist');
  console.log('3. Clear browser cache completely');
}

fixMissingImages();