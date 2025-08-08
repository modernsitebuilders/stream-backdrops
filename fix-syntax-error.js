// fix-syntax-error.js - Fix the malformed href in index.js
// Run with: node fix-syntax-error.js

const fs = require('fs');
const path = require('path');

function fixSyntaxError() {
  console.log('🔧 Fixing syntax error in index.js...\n');
  
  const indexPath = path.join(__dirname, 'pages', 'index.js');
  
  if (!fs.existsSync(indexPath)) {
    console.log('❌ pages/index.js not found!');
    return;
  }
  
  let content = fs.readFileSync(indexPath, 'utf8');
  console.log('📄 Read pages/index.js');
  
  // Fix the malformed href attribute
  const brokenPattern = /href="#"\s*`\s*}/g;
  const fixedHref = 'href={`/category/${slug}`}';
  
  if (brokenPattern.test(content)) {
    content = content.replace(brokenPattern, fixedHref);
    console.log('✅ Fixed malformed href="#"`} -> href={`/category/${slug}`}');
  }
  
  // Also fix any other similar patterns
  const otherPatterns = [
    { pattern: /href="#"\s*}/g, replacement: 'href={`/category/${slug}`}' },
    { pattern: /href="#"\s*`/g, replacement: 'href={`/category/${slug}`' },
    { pattern: /href="#"`/g, replacement: 'href={`/category/${slug}`}' }
  ];
  
  otherPatterns.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      console.log(`✅ Fixed pattern: ${pattern} -> ${replacement}`);
    }
  });
  
  // Backup first
  if (!fs.existsSync(indexPath + '.backup')) {
    fs.copyFileSync(indexPath, indexPath + '.backup');
  }
  
  // Write the fixed content
  fs.writeFileSync(indexPath, content);
  console.log('💾 Saved fixed index.js');
  
  // Verify the fix by checking for syntax issues
  console.log('\n🔍 Verifying the fix...');
  const lines = content.split('\n');
  let foundIssues = false;
  
  lines.forEach((line, index) => {
    if (line.includes('href="#"') && line.includes('`}')) {
      console.log(`🚨 Still found issue at line ${index + 1}: ${line.trim()}`);
      foundIssues = true;
    }
  });
  
  if (!foundIssues) {
    console.log('✅ No syntax issues found in the fix!');
  }
  
  // Show the corrected line
  const hrefLine = lines.find(line => line.includes('href={`/category/'));
  if (hrefLine) {
    console.log(`\n📝 Corrected href line:`);
    console.log(`   ${hrefLine.trim()}`);
  }
  
  console.log('\n🚀 Syntax error should be fixed! Try starting your dev server again.');
}

fixSyntaxError();