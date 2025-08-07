// emergency-site-diagnosis.js
// Diagnoses what's wrong with your site and provides exact fixes
// Run with: node emergency-site-diagnosis.js

const fs = require('fs');
const path = require('path');

function emergencyDiagnosis() {
  console.log('🚨 EMERGENCY SITE DIAGNOSIS');
  console.log('='.repeat(50));
  
  // 1. Check if metadata exists
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  console.log('\n📊 METADATA CHECK:');
  
  let metadata = {};
  if (fs.existsSync(metadataPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      console.log(`✅ Metadata file exists: ${Object.keys(metadata).length} entries`);
    } catch (error) {
      console.log('❌ Metadata file is corrupted');
      return;
    }
  } else {
    console.log('❌ NO METADATA FILE FOUND');
    console.log('   Create it by running: node executive-office-processor.js');
    return;
  }
  
  // 2. Check actual image files
  const imagesDir = path.join(__dirname, 'public', 'images');
  console.log('\n🖼️  IMAGE FILES CHECK:');
  
  if (!fs.existsSync(imagesDir)) {
    console.log('❌ NO IMAGES DIRECTORY FOUND');
    return;
  }
  
  const actualImages = fs.readdirSync(imagesDir)
    .filter(file => file.endsWith('.webp') || file.endsWith('.png') || file.endsWith('.jpg'));
  
  console.log(`✅ Found ${actualImages.length} actual image files`);
  
  // 3. Match metadata to actual files
  console.log('\n🔍 METADATA VS ACTUAL FILES:');
  const workingImages = {};
  const missingImages = [];
  
  Object.entries(metadata).forEach(([key, data]) => {
    if (actualImages.includes(data.filename)) {
      workingImages[key] = data;
    } else {
      missingImages.push(data.filename);
    }
  });
  
  console.log(`✅ Working images: ${Object.keys(workingImages).length}`);
  console.log(`❌ Missing images: ${missingImages.length}`);
  
  if (missingImages.length > 0) {
    console.log('\n❌ MISSING IMAGES (first 5):');
    missingImages.slice(0, 5).forEach(img => console.log(`   - ${img}`));
  }
  
  // 4. Category breakdown of working images
  console.log('\n📁 WORKING IMAGES BY CATEGORY:');
  const categoryCounts = {};
  Object.values(workingImages).forEach(data => {
    categoryCounts[data.category] = (categoryCounts[data.category] || 0) + 1;
  });
  
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} images`);
    
    // Show first image for each category
    const firstImage = Object.values(workingImages).find(img => img.category === category);
    if (firstImage) {
      console.log(`     Example: ${firstImage.filename}`);
    }
  });
  
  // 5. Generate working homepage code
  console.log('\n🏠 HOMEPAGE FIX:');
  console.log('Replace your homepage categoryInfo with this:');
  console.log('='.repeat(50));
  
  const homepageCategories = {};
  ['home-offices', 'executive-offices', 'lobbies', 'private-offices', 'minimalist'].forEach(category => {
    const categoryImages = Object.values(workingImages).filter(img => img.category === category);
    if (categoryImages.length > 0) {
      const firstImage = categoryImages[0];
      // Remove .webp extension for homepage
      const imageKey = firstImage.filename.replace('.webp', '');
      
      homepageCategories[category] = {
        name: category.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        description: `Professional ${category.replace('-', ' ')} backgrounds`,
        image: imageKey
      };
    }
  });
  
  console.log('const categoryInfo = {');
  Object.entries(homepageCategories).forEach(([slug, info]) => {
    console.log(`  '${slug}': {`);
    console.log(`    name: '${info.name}',`);
    console.log(`    description: '${info.description}',`);
    console.log(`    image: '${info.image}'`);
    console.log(`  },`);
  });
  console.log('};');
  
  // 6. Save cleaned metadata
  const cleanedMetadataPath = path.join(__dirname, 'public', 'data', 'image-metadata-working.json');
  fs.writeFileSync(cleanedMetadataPath, JSON.stringify(workingImages, null, 2));
  console.log(`\n💾 Saved working metadata to: image-metadata-working.json`);
  
  // 7. Quick fixes summary
  console.log('\n🚀 EMERGENCY FIXES:');
  console.log('1. Replace your homepage categoryInfo with the code above');
  console.log('2. Your category pages should now load properly');
  console.log(`3. You have ${Object.keys(workingImages).length} working images`);
  console.log('4. Deploy these changes immediately');
  
  console.log('\n📋 QUICK DEPLOY:');
  console.log('git add .');
  console.log('git commit -m "Emergency fix: use working images only"');
  console.log('git push origin main');
  console.log('vercel --prod');
}

emergencyDiagnosis();