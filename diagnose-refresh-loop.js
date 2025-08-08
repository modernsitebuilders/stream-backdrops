// diagnose-refresh-loop.js - Find what's causing the refresh loop
// Run with: node diagnose-refresh-loop.js

const fs = require('fs');
const path = require('path');

function diagnoseRefreshLoop() {
  console.log('🔍 Diagnosing refresh loop issues...\n');
  
  // Check the main components that could cause refresh loops
  const criticalFiles = [
    'pages/index.js',
    'pages/_app.js', 
    'components/CategoryCards.js',
    'pages/category/[slug].js'
  ];
  
  criticalFiles.forEach(relativePath => {
    const fullPath = path.join(__dirname, relativePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ ${relativePath} - Not found`);
      return;
    }
    
    console.log(`🔍 Checking ${relativePath}:`);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for common issues that cause refresh loops
    const issues = [];
    
    // 1. Unclosed JSX tags
    const openTags = content.match(/<[A-Za-z][^>]*(?!\/?>)/g) || [];
    const closeTags = content.match(/<\/[A-Za-z][^>]*>/g) || [];
    if (openTags.length !== closeTags.length) {
      issues.push(`Possible unclosed JSX tags: ${openTags.length} open, ${closeTags.length} close`);
    }
    
    // 2. Malformed template literals
    const templateLiterals = content.match(/`[^`]*`/g) || [];
    const malformedTemplates = templateLiterals.filter(template => 
      template.includes('{') && !template.includes('}')
    );
    if (malformedTemplates.length > 0) {
      issues.push(`Malformed template literals: ${malformedTemplates.join(', ')}`);
    }
    
    // 3. Missing closing braces
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      issues.push(`Brace mismatch: ${openBraces} open { vs ${closeBraces} close }`);
    }
    
    // 4. Missing closing parentheses
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      issues.push(`Parentheses mismatch: ${openParens} open ( vs ${closeParens} close )`);
    }
    
    // 5. Look for specific problem patterns
    const problemPatterns = [
      { pattern: /href="#"\s*`/g, issue: 'Malformed href with backtick' },
      { pattern: /href=\{[^}]*$/gm, issue: 'Unclosed href attribute' },
      { pattern: /src=\{[^}]*$/gm, issue: 'Unclosed src attribute' },
      { pattern: /<Link[^>]*>[^<]*$/gm, issue: 'Unclosed Link component' }
    ];
    
    problemPatterns.forEach(({ pattern, issue }) => {
      const matches = content.match(pattern);
      if (matches) {
        issues.push(`${issue}: ${matches.length} found`);
        matches.forEach(match => {
          console.log(`   🚨 ${match}`);
        });
      }
    });
    
    if (issues.length > 0) {
      console.log(`   ❌ Found ${issues.length} issues:`);
      issues.forEach(issue => console.log(`     - ${issue}`));
    } else {
      console.log(`   ✅ No obvious syntax issues`);
    }
    
    console.log('');
  });
  
  // Check metadata integrity  
  console.log('📋 Checking metadata integrity...');
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  if (fs.existsSync(metadataPath)) {
    try {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      const imageCount = Object.keys(metadata).length;
      console.log(`   ✅ Metadata valid: ${imageCount} images`);
      
      // Check if images have valid categories
      const categories = {};
      Object.values(metadata).forEach(item => {
        categories[item.category] = (categories[item.category] || 0) + 1;
      });
      
      console.log('   Categories:');
      Object.entries(categories).forEach(([cat, count]) => {
        console.log(`     ${cat}: ${count} images`);
      });
      
    } catch (error) {
      console.log(`   ❌ Metadata JSON invalid: ${error.message}`);
    }
  } else {
    console.log(`   ❌ Metadata file missing`);
  }
  
  // Check if images directory exists and has files
  console.log('\n📁 Checking images directory...');
  const imagesDir = path.join(__dirname, 'public', 'images');
  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.webp'));
    console.log(`   ✅ Images directory: ${imageFiles.length} WebP files`);
  } else {
    console.log(`   ❌ Images directory missing`);
  }
  
  console.log('\n💡 Common causes of refresh loops:');
  console.log('   1. Syntax errors in JSX components');
  console.log('   2. Missing or invalid metadata');
  console.log('   3. Trying to load non-existent images');
  console.log('   4. Unclosed components or malformed attributes');
  console.log('   5. JavaScript errors in browser console');
  
  console.log('\n🔧 Next steps:');
  console.log('   1. Check browser dev tools console for JavaScript errors');
  console.log('   2. Fix any syntax issues found above');
  console.log('   3. Try loading the site in incognito mode');
  console.log('   4. Clear browser cache completely');
}

diagnoseRefreshLoop();