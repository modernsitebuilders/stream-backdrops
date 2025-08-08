// update-site-categories.js - Update your site to use the new category structure
// Run with: node update-site-categories.js

const fs = require('fs');
const path = require('path');

function updateSiteCategories() {
  console.log('🔄 Updating site for new category structure...\n');
  
  // Your new category structure
  const newCategories = {
    'professional-shelves': {
      name: 'Professional Shelves',
      description: 'Professional office shelves with books and plants - perfect for business video calls',
      count: 42
    },
    'home-lifestyle': {
      name: 'Home & Lifestyle', 
      description: 'Stylish home offices and lifestyle spaces - ideal for creative professionals',
      count: 48
    }
  };
  
  console.log('📁 Your new category structure:');
  console.log('==============================');
  Object.entries(newCategories).forEach(([slug, info]) => {
    console.log(`${info.name.padEnd(20)}: ${info.count} images`);
    console.log(`   ${info.description}`);
    console.log('');
  });
  
  // Find files that might need updating
  const filesToCheck = [
    'pages/index.js',
    'components/ImageGallery.js', 
    'components/CategoryFilter.js',
    'pages/api/images.js',
    'pages/api/categories.js',
    'lib/categories.js',
    'utils/categories.js'
  ];
  
  console.log('🔍 Checking for files that need category updates:');
  console.log('=================================================');
  
  let foundFiles = [];
  
  filesToCheck.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      foundFiles.push(filePath);
      console.log(`✅ Found: ${filePath}`);
    }
  });
  
  if (foundFiles.length === 0) {
    console.log('⚠️  No standard category files found - manual check needed');
  }
  
  // Create a categories config file for easy updating
  const categoriesConfig = {
    categories: newCategories,
    displayOrder: ['professional-shelves', 'home-lifestyle'],
    defaultCategory: 'professional-shelves',
    totalImages: 90
  };
  
  const configPath = path.join(__dirname, 'lib', 'categories-config.js');
  const configDir = path.dirname(configPath);
  
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  const configContent = `// categories-config.js - Auto-generated category configuration
// Updated for curated collection

export const CATEGORIES = ${JSON.stringify(newCategories, null, 2)};

export const CATEGORY_ORDER = ${JSON.stringify(categoriesConfig.displayOrder, null, 2)};

export const DEFAULT_CATEGORY = '${categoriesConfig.defaultCategory}';

export const TOTAL_IMAGES = ${categoriesConfig.totalImages};

// Helper function to get category display name
export function getCategoryName(slug) {
  return CATEGORIES[slug]?.name || slug;
}

// Helper function to get all categories as array
export function getAllCategories() {
  return Object.entries(CATEGORIES).map(([slug, info]) => ({
    slug,
    ...info
  }));
}
`;
  
  fs.writeFileSync(configPath, configContent);
  console.log(`✅ Created category config: ${configPath}`);
  
  console.log('\n💡 Manual updates needed:');
  console.log('========================');
  console.log('1. Update any hardcoded category arrays in your components');
  console.log('2. Import and use the new categories-config.js file');
  console.log('3. Update category filter dropdowns/buttons');
  console.log('4. Update any category-specific styling');
  
  if (foundFiles.length > 0) {
    console.log('\n🔧 Files to manually check and update:');
    foundFiles.forEach(file => console.log(`   - ${file}`));
  }
  
  console.log('\n📝 Example import usage:');
  console.log('=======================');
  console.log(`import { CATEGORIES, getAllCategories } from './lib/categories-config.js';`);
  console.log('');
  console.log(`// Use in your components:`);
  console.log(`const categories = getAllCategories();`);
  console.log(`console.log(categories); // Array of category objects`);
  
  console.log('\n🚀 Next steps:');
  console.log('1. Start your dev server: npm run dev');
  console.log('2. Check if categories display correctly');
  console.log('3. Update any broken category references using the config file');
  console.log('4. Test image filtering and loading');
}

updateSiteCategories();