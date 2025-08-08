// update-categories.js
const fs = require('fs');
const path = require('path');

const categoryPagePath = path.join(__dirname, 'pages', 'category', '[slug].js');

if (fs.existsSync(categoryPagePath)) {
  let content = fs.readFileSync(categoryPagePath, 'utf8');
  
  // Replace the old categoryInfo with new one
  const newCategoryInfo = `const categoryInfo = {
  'professional-shelves': {
    name: 'Professional Shelves',
    description: 'Professional office shelves with books and plants - perfect for business video calls'
  },
  'home-lifestyle': {
    name: 'Home & Lifestyle', 
    description: 'Stylish home offices and lifestyle spaces - ideal for creative professionals'
  }
};`;
  
  // Replace the old categoryInfo
  content = content.replace(
    /const categoryInfo = \{[\s\S]*?\};/,
    newCategoryInfo
  );
  
  fs.writeFileSync(categoryPagePath, content);
  console.log('✅ Updated category info for new structure');
} else {
  console.log('❌ Category page not found');
}