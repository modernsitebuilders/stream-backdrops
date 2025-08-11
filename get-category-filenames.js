// get-category-filenames.js
// This script will scan your three folders and show you all filenames organized by category
// Run with: node get-category-filenames.js

const fs = require('fs');
const path = require('path');

function getCategoryFilenames() {
  console.log('📁 Scanning your image category folders...\n');
  
  const imagesDir = path.join(__dirname, 'public', 'images');
  const categories = ['light', 'dark', 'office-spaces'];
  
  const results = {};
  
  categories.forEach(category => {
    const categoryPath = path.join(imagesDir, category);
    
    console.log(`🔍 Checking: ${categoryPath}`);
    
    if (fs.existsSync(categoryPath)) {
      try {
        const files = fs.readdirSync(categoryPath)
          .filter(file => file.match(/\.(webp|png|jpg|jpeg)$/i))
          .sort();
        
        results[category] = files;
        
        console.log(`✅ Found ${files.length} images in ${category} folder`);
      } catch (error) {
        console.error(`❌ Error reading ${category} folder:`, error.message);
        results[category] = [];
      }
    } else {
      console.log(`❌ Folder not found: ${categoryPath}`);
      results[category] = [];
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('📋 COMPLETE FILENAME LISTS FOR YOUR CATEGORIES');
  console.log('='.repeat(80));
  
  // Display results for each category
  categories.forEach(category => {
    const files = results[category];
    const categoryName = category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    console.log(`\n☀️ ${categoryName.toUpperCase()} CATEGORY (${files.length} images):`);
    console.log('-'.repeat(50));
    
    if (files.length === 0) {
      console.log('   (No images found)');
    } else {
      files.forEach((file, index) => {
        console.log(`   ${(index + 1).toString().padStart(2, '0')}. ${file}`);
      });
    }
    
    // Show JavaScript array format for easy copying
    if (files.length > 0) {
      console.log(`\n📝 JavaScript Array for ${category}:`);
      console.log(`const ${category.replace('-', '')}Images = [`);
      files.forEach((file, index) => {
        // Create a title from filename
        const title = file
          .replace(/\.(webp|png|jpg|jpeg)$/i, '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        const comma = index < files.length - 1 ? ',' : '';
        console.log(`  { filename: '${file}', title: '${title}' }${comma}`);
      });
      console.log(`];`);
    }
  });
  
  // Summary
  const totalImages = Object.values(results).reduce((sum, files) => sum + files.length, 0);
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total images found: ${totalImages}`);
  
  categories.forEach(category => {
    const count = results[category].length;
    const percentage = totalImages > 0 ? ((count / totalImages) * 100).toFixed(1) : '0';
    console.log(`   ${category}: ${count} images (${percentage}%)`);
  });
  
  // Instructions for next steps
  console.log('\n🚀 NEXT STEPS:');
  console.log('1. Copy the JavaScript arrays above');
  console.log('2. Replace the empty images arrays in your pages/category/[slug].js file');
  console.log('3. Update your homepage to use these new categories');
  
  if (totalImages === 0) {
    console.log('\n⚠️  NO IMAGES FOUND!');
    console.log('Make sure your folder structure is:');
    console.log('   public/');
    console.log('   └── images/');
    console.log('       ├── light/');
    console.log('       ├── dark/');
    console.log('       └── office-spaces/');
  }
  
  return results;
}

// Run the scan
getCategoryFilenames();