// fix-site-issues.js - Find and fix the glitchy category/image issues
// Run with: node fix-site-issues.js

const fs = require('fs');
const path = require('path');

function findAndFixIssues() {
  console.log('🔧 Diagnosing site issues...\n');
  
  // Check what's in the current metadata
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  let currentMetadata = {};
  
  if (fs.existsSync(metadataPath)) {
    currentMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    console.log(`✅ Current metadata has ${Object.keys(currentMetadata).length} images`);
    
    // Show current categories
    const currentCategories = {};
    Object.values(currentMetadata).forEach(item => {
      currentCategories[item.category] = (currentCategories[item.category] || 0) + 1;
    });
    
    console.log('\n📁 Current categories in metadata:');
    Object.entries(currentCategories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} images`);
    });
  } else {
    console.log('❌ No metadata file found!');
  }
  
  // Check for files that might have hardcoded old categories
  const filesToSearch = [
    'pages/index.js',
    'pages/_app.js',
    'components/ImageGallery.js',
    'components/CategoryFilter.js',
    'components/Gallery.js',
    'pages/api/images.js',
    'pages/api/metadata.js',
    'lib/imageData.js',
    'utils/imageUtils.js'
  ];
  
  console.log('\n🔍 Searching for hardcoded categories:');
  console.log('=====================================');
  
  const problematicFiles = [];
  const oldCategoryPatterns = [
    'home-offices',
    'executive-offices', 
    'minimalist',
    'lobbies',
    'conference-rooms',
    'private-offices',
    'open-offices'
  ];
  
  filesToSearch.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for old category references
      const foundOldCategories = oldCategoryPatterns.filter(pattern => 
        content.includes(`'${pattern}'`) || content.includes(`"${pattern}"`) || content.includes(`${pattern}:`)
      );
      
      if (foundOldCategories.length > 0) {
        problematicFiles.push({ file: filePath, categories: foundOldCategories });
        console.log(`🚨 ${filePath}:`);
        foundOldCategories.forEach(cat => console.log(`   - Contains: ${cat}`));
      } else {
        console.log(`✅ ${filePath}: Clean`);
      }
    }
  });
  
  // Create a quick fix script for common issues
  console.log('\n🛠️  Quick fixes:');
  console.log('================');
  
  if (problematicFiles.length > 0) {
    console.log('Files with old category references found. Creating fixes...\n');
    
    // Create a replacement mapping
    const categoryMapping = `
// CATEGORY MAPPING - Replace old categories with new ones
const CATEGORY_MAPPING = {
  'home-offices': 'home-lifestyle',
  'executive-offices': 'home-lifestyle', 
  'minimalist': 'professional-shelves',
  'lobbies': 'professional-shelves',
  'conference-rooms': 'professional-shelves',
  'private-offices': 'professional-shelves',
  'open-offices': 'professional-shelves'
};

// NEW CATEGORIES - Use these instead
const NEW_CATEGORIES = {
  'professional-shelves': 'Professional Shelves',
  'home-lifestyle': 'Home & Lifestyle'
};
`;
    
    // Save the mapping for reference
    fs.writeFileSync(path.join(__dirname, 'category-mapping.js'), categoryMapping);
    console.log('✅ Created category-mapping.js for reference');
  }
  
  // Check if there are any cached/old API responses
  const apiCachePaths = [
    'pages/api/categories.js',
    '.next/cache',
    'node_modules/.cache'
  ];
  
  console.log('\n🗑️  Cache clearing needed:');
  console.log('==========================');
  console.log('1. Stop your dev server (Ctrl+C)');
  console.log('2. Delete .next folder: rm -rf .next');
  console.log('3. Clear any browser cache/localStorage');
  console.log('4. Restart dev server: npm run dev');
  
  // Create a simple category API file if needed
  const apiPath = path.join(__dirname, 'pages', 'api', 'categories.js');
  if (!fs.existsSync(apiPath)) {
    const apiDir = path.dirname(apiPath);
    if (!fs.existsSync(apiDir)) {
      fs.mkdirSync(apiDir, { recursive: true });
    }
    
    const categoryAPI = `// pages/api/categories.js - Updated for new category structure
export default function handler(req, res) {
  const categories = {
    'professional-shelves': {
      name: 'Professional Shelves',
      count: 42,
      description: 'Professional office shelves with books and plants'
    },
    'home-lifestyle': {
      name: 'Home & Lifestyle',
      count: 48, 
      description: 'Stylish home offices and lifestyle spaces'
    }
  };
  
  res.status(200).json(categories);
}
`;
    
    fs.writeFileSync(apiPath, categoryAPI);
    console.log('✅ Created updated categories API');
  }
  
  console.log('\n🎯 Action items to fix the glitchy site:');
  console.log('=======================================');
  console.log('1. Stop your dev server');
  console.log('2. Delete .next folder');
  console.log('3. Update the files listed above to use new categories');
  console.log('4. Clear browser cache/localStorage'); 
  console.log('5. Restart: npm run dev');
  
  if (problematicFiles.length > 0) {
    console.log('\n📝 Files that need manual updates:');
    problematicFiles.forEach(({ file, categories }) => {
      console.log(`\n${file}:`);
      categories.forEach(oldCat => {
        const newCat = oldCat.includes('home') || oldCat.includes('executive') ? 'home-lifestyle' : 'professional-shelves';
        console.log(`   Replace '${oldCat}' with '${newCat}'`);
      });
    });
  }
}

findAndFixIssues();