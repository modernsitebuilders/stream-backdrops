// diagnose-office-page.js
// Run with: node diagnose-office-page.js

const fs = require('fs');
const path = require('path');

function diagnoseOfficePage() {
  console.log('🔍 DIAGNOSING OFFICE PAGE ISSUE\n');
  console.log('=====================================\n');

  // 1. Check if the files that were changed exist
  const filesToCheck = [
    'vercel.json',
    'middleware.js', 
    'pages/_app.js',
    'pages/category/[slug].js',
    'pages/api/metadata.js'
  ];

  console.log('1️⃣ CHECKING MODIFIED FILES:');
  console.log('============================');
  
  filesToCheck.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      console.log(`✅ ${file} - ${content.length} chars`);
      
      // Check for common syntax errors
      if (file.endsWith('.js')) {
        const openBraces = (content.match(/{/g) || []).length;
        const closeBraces = (content.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
          console.log(`   ⚠️  SYNTAX ERROR: ${openBraces} { vs ${closeBraces} }`);
        }
        
        // Check for specific problematic patterns
        if (content.includes('office-spaces') && file.includes('middleware')) {
          console.log(`   🚨 middleware.js references office-spaces - this might redirect the page!`);
        }
        if (content.includes('"office-spaces"') && file.includes('vercel')) {
          console.log(`   🚨 vercel.json references office-spaces - this might cause routing conflicts!`);
        }
      }
    } else {
      console.log(`❌ ${file} - NOT FOUND`);
    }
  });

  // 2. Check vercel.json for redirects/rewrites that might break office-spaces
  console.log('\n2️⃣ CHECKING VERCEL.JSON:');
  console.log('=========================');
  
  const vercelPath = path.join(__dirname, 'vercel.json');
  if (fs.existsSync(vercelPath)) {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    console.log('Vercel config found:');
    
    if (vercelConfig.redirects) {
      console.log(`📍 ${vercelConfig.redirects.length} redirects found:`);
      vercelConfig.redirects.forEach((redirect, i) => {
        console.log(`   ${i+1}. ${redirect.source} → ${redirect.destination}`);
        if (redirect.source.includes('office') || redirect.destination.includes('office')) {
          console.log(`      🚨 This redirect affects office pages!`);
        }
      });
    }
    
    if (vercelConfig.rewrites) {
      console.log(`🔄 ${vercelConfig.rewrites.length} rewrites found:`);
      vercelConfig.rewrites.forEach((rewrite, i) => {
        console.log(`   ${i+1}. ${rewrite.source} → ${rewrite.destination}`);
        if (rewrite.source.includes('office') || rewrite.destination.includes('office')) {
          console.log(`      🚨 This rewrite affects office pages!`);
        }
      });
    }
  } else {
    console.log('No vercel.json found');
  }

  // 3. Check middleware.js for route conflicts
  console.log('\n3️⃣ CHECKING MIDDLEWARE.JS:');
  console.log('===========================');
  
  const middlewarePath = path.join(__dirname, 'middleware.js');
  if (fs.existsSync(middlewarePath)) {
    const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
    console.log('Middleware found');
    
    if (middlewareContent.includes('office-spaces')) {
      console.log('🚨 FOUND: middleware.js contains "office-spaces"');
      console.log('This might be intercepting requests to /category/office-spaces');
    }
    if (middlewareContent.includes('/category/')) {
      console.log('🚨 FOUND: middleware.js handles /category/ routes');
      console.log('This might be redirecting category pages');
    }
    if (middlewareContent.includes('redirect') || middlewareContent.includes('rewrite')) {
      console.log('🚨 FOUND: middleware.js does redirects/rewrites');
    }
  } else {
    console.log('No middleware.js found');
  }

  // 4. Check if office-spaces images exist
  console.log('\n4️⃣ CHECKING OFFICE-SPACES IMAGES:');
  console.log('==================================');
  
  const officeImagesPath = path.join(__dirname, 'public', 'images', 'office-spaces');
  if (fs.existsSync(officeImagesPath)) {
    const officeImages = fs.readdirSync(officeImagesPath).filter(f => f.endsWith('.webp'));
    console.log(`✅ Found ${officeImages.length} office images in public/images/office-spaces/`);
    if (officeImages.length < 5) {
      console.log('⚠️  Very few images - might cause page load issues');
    }
  } else {
    console.log('❌ public/images/office-spaces/ directory not found!');
    console.log('This would definitely cause the page to not work');
  }

  // 5. Check the category page itself
  console.log('\n5️⃣ CHECKING CATEGORY PAGE:');
  console.log('===========================');
  
  const categoryPagePath = path.join(__dirname, 'pages', 'category', '[slug].js');
  if (fs.existsSync(categoryPagePath)) {
    const categoryContent = fs.readFileSync(categoryPagePath, 'utf8');
    
    if (categoryContent.includes('office-spaces')) {
      console.log('✅ Category page includes office-spaces');
    } else {
      console.log('❌ Category page does NOT include office-spaces');
      console.log('The page might not handle office-spaces as a valid category');
    }
    
    // Check for hardcoded categories vs dynamic loading
    if (categoryContent.includes('categoryInfo = {')) {
      console.log('📋 Page uses hardcoded categories');
    } else if (categoryContent.includes('/api/') || categoryContent.includes('metadata')) {
      console.log('📡 Page loads categories dynamically from API');
    }
  }

  // 6. Generate a quick fix
  console.log('\n🛠️  QUICK FIX SUGGESTIONS:');
  console.log('===========================');
  
  console.log('Try these fixes in order:');
  console.log('');
  console.log('1. RESTART DEV SERVER:');
  console.log('   Press Ctrl+C in your terminal');
  console.log('   Run: npm run dev');
  console.log('');
  console.log('2. CLEAR BROWSER CACHE:');
  console.log('   Press Ctrl+Shift+R (hard refresh)');
  console.log('   Or open DevTools → Application → Clear Storage');
  console.log('');
  console.log('3. CHECK SPECIFIC URL:');
  console.log('   Visit: http://localhost:3000/category/office-spaces');
  console.log('   Check browser console for errors');
  console.log('');
  console.log('4. TEST API DIRECTLY:');
  console.log('   Visit: http://localhost:3000/api/metadata');
  console.log('   Look for office-spaces entries');
  console.log('');
  console.log('5. DISABLE MIDDLEWARE TEMPORARILY:');
  console.log('   Rename middleware.js to middleware.js.backup');
  console.log('   Test if office-spaces page works');
  console.log('');
  console.log('6. CHECK VERCEL.JSON:');
  console.log('   Look for any redirects that affect /category/office-spaces');
  console.log('   Comment them out temporarily');

  console.log('\n📞 WHAT TO TELL ME:');
  console.log('===================');
  console.log('After running this diagnostic, tell me:');
  console.log('1. Any 🚨 warnings you see above');
  console.log('2. What happens when you visit /category/office-spaces');
  console.log('3. Any errors in browser console');
  console.log('4. Does the API work: /api/metadata');
}

diagnoseOfficePage();