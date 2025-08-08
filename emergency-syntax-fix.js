// emergency-syntax-fix.js - Fix all the critical syntax errors
// Run with: node emergency-syntax-fix.js

const fs = require('fs');
const path = require('path');

function emergencySyntaxFix() {
  console.log('🚨 EMERGENCY: Fixing critical syntax errors...\n');
  
  const criticalFiles = [
    'pages/index.js',
    'pages/_app.js',
    'components/CategoryCards.js', 
    'pages/category/[slug].js'
  ];
  
  criticalFiles.forEach(relativePath => {
    const fullPath = path.join(__dirname, relativePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  ${relativePath} - Not found`);
      return;
    }
    
    console.log(`🔧 FIXING: ${relativePath}`);
    let content = fs.readFileSync(fullPath, 'utf8');
    let changeCount = 0;
    
    // Fix 1: Remove duplicate href attributes
    const duplicateHrefPattern = /href="#"\s+href="([^"]*)"/g;
    let matches = content.match(duplicateHrefPattern);
    if (matches) {
      content = content.replace(duplicateHrefPattern, 'href="$1"');
      changeCount += matches.length;
      console.log(`   ✅ Fixed ${matches.length} duplicate href attributes`);
    }
    
    // Fix 2: Fix malformed href with backticks
    const malformedHrefPattern = /href="#"\s*`\s*}/g;
    if (malformedHrefPattern.test(content)) {
      content = content.replace(malformedHrefPattern, 'href={`/category/${slug}`}');
      changeCount++;
      console.log(`   ✅ Fixed malformed href="#"\`}`);
    }
    
    // Fix 3: Fix other malformed href patterns
    const otherMalformedPatterns = [
      { pattern: /href="#"\s*`/g, replacement: 'href={`/category/${slug}`' },
      { pattern: /href="#"`/g, replacement: 'href={`/category/${slug}`}' }
    ];
    
    otherMalformedPatterns.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        changeCount += matches.length;
        console.log(`   ✅ Fixed ${matches.length} malformed href patterns`);
      }
    });
    
    // Fix 4: Remove premium links (they're causing issues)
    const premiumLinkPattern = /<Link[^>]*href="\/premium"[^>]*>[\s\S]*?<\/Link>/g;
    const premiumMatches = content.match(premiumLinkPattern);
    if (premiumMatches) {
      content = content.replace(premiumLinkPattern, '');
      changeCount += premiumMatches.length;
      console.log(`   ✅ Removed ${premiumMatches.length} broken premium links`);
    }
    
    // Fix 5: Fix specific broken patterns in CategoryCards.js
    if (relativePath.includes('CategoryCards.js')) {
      // Fix the broken key and href pattern
      const brokenCategoryPattern = /key={key}\s*href="#"\s*`\s*}/g;
      if (brokenCategoryPattern.test(content)) {
        content = content.replace(brokenCategoryPattern, 'key={key}\n          href={`/category/${key}`}');
        changeCount++;
        console.log(`   ✅ Fixed broken category link pattern`);
      }
    }
    
    // Fix 6: Ensure all Link components have proper closing
    const unclosedLinkPattern = /<Link[^>]*>\s*$/gm;
    const unclosedMatches = content.match(unclosedLinkPattern);
    if (unclosedMatches) {
      console.log(`   ⚠️  Found ${unclosedMatches.length} potentially unclosed Link components`);
      // This one needs manual inspection as it's complex to auto-fix
    }
    
    // Fix 7: Remove any remaining href="#" that should be dynamic
    if (relativePath.includes('[slug].js')) {
      // In slug pages, fix the category navigation hrefs
      const staticHrefPattern = /href="#"\s*}/g;
      if (staticHrefPattern.test(content)) {
        content = content.replace(staticHrefPattern, 'href={`/category/${categorySlug}`}');
        changeCount++;
        console.log(`   ✅ Fixed static href="#" in category navigation`);
      }
    }
    
    if (changeCount > 0) {
      // Backup first
      if (!fs.existsSync(fullPath + '.emergency-backup')) {
        fs.copyFileSync(fullPath, fullPath + '.emergency-backup');
      }
      
      fs.writeFileSync(fullPath, content);
      console.log(`   💾 Applied ${changeCount} fixes to ${relativePath}`);
    } else {
      console.log(`   ℹ️  No automatic fixes applied`);
    }
    
    console.log('');
  });
  
  console.log('🚨 CRITICAL: Some issues may need manual fixes!');
  console.log('\n🔧 Manual fixes needed:');
  console.log('1. Check that all <Link> components are properly closed');
  console.log('2. Verify JSX tag balance (open vs close tags)');
  console.log('3. Check for any remaining malformed attributes');
  
  console.log('\n💡 If site still refreshes:');
  console.log('1. Try: npm run dev');
  console.log('2. Check browser console for remaining errors'); 
  console.log('3. Use emergency restore if needed: restore .emergency-backup files');
  
  console.log('\n🆘 EMERGENCY RESTORE (if needed):');
  criticalFiles.forEach(file => {
    const backupPath = path.join(__dirname, file + '.emergency-backup');
    if (fs.existsSync(backupPath)) {
      console.log(`   cp ${file}.emergency-backup ${file}`);
    }
  });
}

emergencySyntaxFix();