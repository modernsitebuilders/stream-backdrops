// diagnose-kitchen-issues.js - Check what went wrong and fix it
const fs = require('fs');
const path = require('path');

function checkSlugFile() {
  const slugPath = path.join(__dirname, 'pages', 'category', '[slug].js');
  
  if (fs.existsSync(slugPath)) {
    const content = fs.readFileSync(slugPath, 'utf8');
    
    console.log('🔍 [slug].js analysis:');
    console.log(`   Kitchen in folderMap: ${content.includes("'kitchen': 'kitchen'")}`);
    console.log(`   Kitchen in categoryInfo: ${content.includes("'kitchen':")}`);
    
    // Show the categoryInfo section
    const categoryInfoMatch = content.match(/const categoryInfo = \{([^}]+(?:\}[^}]*)*)\};/s);
    if (categoryInfoMatch) {
      console.log('\n📋 Current categoryInfo:');
      console.log('const categoryInfo = {' + categoryInfoMatch[1] + '};');
    }
  } else {
    console.log('❌ [slug].js not found');
  }
}

function checkHomepage() {
  const homePath = path.join(__dirname, 'pages', 'index.js');
  
  if (fs.existsExists(homePath)) {
    const content = fs.readFileSync(homePath, 'utf8');
    
    console.log('\n🔍 Homepage analysis:');
    console.log(`   Has video element: ${content.includes('<video') || content.includes('video')}`);
    console.log(`   Kitchen category card: ${content.includes('/category/kitchen')}`);
    console.log(`   Hero section exists: ${content.includes('hero') || content.includes('Hero')}`);
    
    // Check for any broken elements
    if (!content.includes('<video') && !content.includes('video')) {
      console.log('⚠️ Video element missing from homepage');
    }
  } else {
    console.log('❌ index.js not found');
  }
}

function checkKitchenImages() {
  const kitchenDir = path.join(__dirname, 'public', 'images', 'kitchen');
  
  if (fs.existsSync(kitchenDir)) {
    const files = fs.readdirSync(kitchenDir);
    const webpFiles = files.filter(f => f.endsWith('.webp'));
    
    console.log(`\n🔍 Kitchen images: ${webpFiles.length} files found`);
    console.log(`   kitchen9.webp exists: ${files.includes('kitchen9.webp')}`);
    
    // Show first few files
    console.log('   First 5 files:');
    webpFiles.slice(0, 5).forEach(file => {
      console.log(`     ${file}`);
    });
  } else {
    console.log('\n❌ Kitchen images directory not found');
  }
}

function createKitchenFixScript() {
  console.log('\n🔧 Creating fix script...');
  
  const fixScript = `// quick-kitchen-fix.js - Fix the kitchen category issues
const fs = require('fs');
const path = require('path');

// Fix 1: Ensure kitchen is properly added to [slug].js
function fixSlugFile() {
  const slugPath = path.join(__dirname, 'pages', 'category', '[slug].js');
  let content = fs.readFileSync(slugPath, 'utf8');
  
  // Make sure kitchen is in categoryInfo (this might be missing)
  if (!content.includes("'kitchen':")) {
    const pattern = /('living-room':\\s*\\{[^}]+\\})/;
    const kitchenInfo = \`,
  'kitchen': {
    name: 'Kitchen Backgrounds',
    description: 'Professional kitchen backgrounds for cooking shows, food blogs, and culinary video calls'
  }\`;
    
    content = content.replace(pattern, \`$1\${kitchenInfo}\`);
    fs.writeFileSync(slugPath, content);
    console.log('✅ Fixed categoryInfo in [slug].js');
  }
}

// Fix 2: Check if homepage hero section got damaged
function checkHeroSection() {
  const homePath = path.join(__dirname, 'pages', 'index.js');
  let content = fs.readFileSync(homePath, 'utf8');
  
  if (!content.includes('video') && !content.includes('Video')) {
    console.log('⚠️ Video missing from homepage - you may need to restore from backup');
    console.log('   Check for index.js.backup file');
  } else {
    console.log('✅ Video element found on homepage');
  }
}

fixSlugFile();
checkHeroSection();

console.log('\\n🎯 Next steps:');
console.log('1. Restart your dev server: npm run dev');
console.log('2. Test /category/kitchen page');
console.log('3. Check homepage video');
console.log('4. If video still missing, restore from backup');
`;

  fs.writeFileSync(path.join(__dirname, 'quick-kitchen-fix.js'), fixScript);
  console.log('✅ Created quick-kitchen-fix.js');
}

function runDiagnostic() {
  console.log('🔍 Diagnosing kitchen integration issues...\n');
  
  checkSlugFile();
  checkHomepage();
  checkKitchenImages();
  createKitchenFixScript();
  
  console.log('\n💡 Quick fixes:');
  console.log('1. Run: node quick-kitchen-fix.js');
  console.log('2. Restart your dev server');
  console.log('3. If video is missing, restore from backup');
  console.log('4. Manual Layout.js edit needed for header nav');
}

runDiagnostic();