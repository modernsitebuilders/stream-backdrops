// fix-title-error.js
const fs = require('fs');
const path = require('path');

const categoryPagePath = path.join(__dirname, 'pages', 'category', '[slug].js');

if (fs.existsSync(categoryPagePath)) {
  let content = fs.readFileSync(categoryPagePath, 'utf8');
  
  // Fix the broken title tag - look for array concatenation in title
  content = content.replace(
    /<title>\{([^}]+)\}\s*-\s*([^<]+)<\/title>/g,
    '<title>{`${$1} - $2`}</title>'
  );
  
  // Also fix any other title patterns with variables
  content = content.replace(
    /<title>\{([^}]+)\s*\+\s*['""]([^'"]*)['""][^}]*\}<\/title>/g,
    '<title>{`${$1}$2`}</title>'
  );
  
  // Backup and save
  fs.writeFileSync(categoryPagePath + '.backup', fs.readFileSync(categoryPagePath));
  fs.writeFileSync(categoryPagePath, content);
  
  console.log('✅ Fixed title tag error in category page');
} else {
  console.log('❌ Category page not found');
}