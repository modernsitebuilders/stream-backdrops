// fix-blog-syntax.js - Fix the broken blog page
const fs = require('fs');
const path = require('path');

const blogPath = path.join(__dirname, 'pages', 'blog.js');

if (fs.existsSync(blogPath)) {
  let content = fs.readFileSync(blogPath, 'utf8');
  
  // Fix the broken href="#"' (should be href="#")
  content = content.replace(/href="#"'/g, 'href="#"');
  
  // Fix any other common syntax issues
  content = content.replace(/href='#'"/g, 'href="#"');
  content = content.replace(/href="#''/g, 'href="#"');
  
  // Backup and save
  fs.writeFileSync(blogPath + '.broken', fs.readFileSync(blogPath));
  fs.writeFileSync(blogPath, content);
  
  console.log('✅ Fixed blog page syntax error');
} else {
  console.log('❌ Blog page not found');
}