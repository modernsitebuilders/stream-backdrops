// scan-actual-files.js
// This will show you exactly what files you have in each category

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'public', 'images');
const CATEGORIES = ['well-lit', 'ambient-lighting', 'office-spaces'];

function scanFiles() {
  console.log('📂 Scanning actual files in your directories...\n');
  
  CATEGORIES.forEach(category => {
    const categoryDir = path.join(BASE_DIR, category);
    
    console.log(`\n📁 ${category.toUpperCase()} CATEGORY:`);
    console.log('─'.repeat(60));
    
    if (fs.existsSync(categoryDir)) {
      const files = fs.readdirSync(categoryDir)
        .filter(file => file.endsWith('.webp'))
        .sort();
      
      console.log(`Total files: ${files.length}`);
      console.log('\nFiles list:');
      
      files.forEach((file, index) => {
        // Extract descriptive part from filename
        let description = file.replace('.webp', '');
        
        if (file.startsWith('well-lit-')) {
          description = description.replace('well-lit-', '');
        } else if (file.startsWith('ambient-')) {
          description = description.replace('ambient-', '');
        } else if (file.startsWith('office-spaces-')) {
          description = description.replace('office-spaces-', '');
        }
        
        console.log(`  ${(index + 1).toString().padStart(2, '0')}. ${file}`);
        console.log(`      → ${description}`);
      });
      
      // Generate code format for easy copy-paste
      console.log(`\n💻 Code format for ${category}:`);
      console.log("images: [");
      files.forEach(file => {
        // Create a nice title from filename
        let title = file
          .replace('.webp', '')
          .replace(/^(well-lit-|ambient-|office-spaces-)/, '')
          .replace(/-\d+$/, '') // Remove trailing numbers
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        console.log(`  { filename: '${file}', title: '${title}' },`);
      });
      console.log("]");
      
    } else {
      console.log(`❌ Directory not found: ${categoryDir}`);
    }
  });
}

if (require.main === module) {
  scanFiles();
}

module.exports = { scanFiles };