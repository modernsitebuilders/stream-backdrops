// fix-broken-links.js - Fix the undefined href error in Link components
// Run with: node fix-broken-links.js

const fs = require('fs');
const path = require('path');

function fixBrokenLinks() {
  console.log('🔧 Fixing broken Link components with undefined href...\n');
  
  // Files that might have broken Link components
  const filesToCheck = [
    'pages/index.js',
    'components/Header.js',
    'components/Navigation.js', 
    'components/Navbar.js',
    'components/CategoryCards.js',
    'pages/_app.js',
    'components/Layout.js'
  ];
  
  let filesFixed = 0;
  
  filesToCheck.forEach(relativePath => {
    const fullPath = path.join(__dirname, relativePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`   ⚠️  ${relativePath} - Not found`);
      return;
    }
    
    console.log(`🔍 Checking: ${relativePath}`);
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;
    
    // Pattern 1: Look for specific broken premium links we might have missed
    const brokenPatterns = [
      /<Link href="#"[^>]*href="#"]*premium[^}]*}[^>]*>/g,
      /<Link href="#"[^>]*href="#"[^>]*>/g,
      /<Link href="#"[^>]*href="#"[^>]*>/g,
      /<Link href="#"[^>]*href="#"[^>]*>/g,
      /<Link href="#"[^>]*href="#"[^>]*>/g
    ];
    
    brokenPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          console.log(`   🚨 Found broken pattern: ${match}`);
          
          // Find and remove the entire Link component
          const fullPattern = new RegExp(`${match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s\\S]*?)<\\/Link>`, 'g');
          content = content.replace(fullPattern, (fullMatch, innerContent) => {
            console.log(`   ✅ Removed broken Link, keeping inner content`);
            return `<span>${innerContent}</span>`;
          });
          
          changed = true;
        });
      }
    });
    
    // Pattern 2: Look for any remaining undefined href references
    if (content.includes('href="#"')) {
      content = content.replace(/href="#"/g, 'href="#"');
      changed = true;
      console.log(`   ✅ Fixed undefined href references`);
    }
    
    // Save changes
    if (changed) {
      // Backup first
      if (!fs.existsSync(fullPath + '.backup')) {
        fs.copyFileSync(fullPath, fullPath + '.backup');
      }
      
      fs.writeFileSync(fullPath, content);
      filesFixed++;
      console.log(`   ✅ Fixed ${relativePath}`);
    } else {
      console.log(`   ℹ️  No broken links found`);
    }
  });
  
  console.log(`\n🎉 Fixed broken links in ${filesFixed} files`);
  console.log('\n🚀 Restart your dev server - the error should be gone!');
}

fixBrokenLinks();