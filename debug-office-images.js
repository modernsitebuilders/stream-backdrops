// debug-office-images.js - Debug why office images aren't showing
// Run with: node debug-office-images.js

const fs = require('fs');
const path = require('path');

function debugOfficeImages() {
  console.log('🔍 Debugging Office Spaces images...\n');
  
  // 1. Check if images physically exist
  console.log('1️⃣ CHECKING PHYSICAL IMAGE FILES:');
  console.log('================================');
  
  const imagesDir = path.join(__dirname, 'public', 'images');
  if (!fs.existsSync(imagesDir)) {
    console.log('❌ public/images directory does not exist!');
    return;
  }
  
  const allImageFiles = fs.readdirSync(imagesDir).filter(file => 
    file.endsWith('.webp') || file.endsWith('.png') || file.endsWith('.jpg')
  );
  
  console.log(`📊 Total image files in public/images: ${allImageFiles.length}`);
  
  // Look for office-related files
  const officeFiles = allImageFiles.filter(file => {
    const name = file.toLowerCase();
    return name.includes('office') || 
           name.includes('executive') || 
           name.includes('minimalist') ||
           name.includes('consultation') ||
           name.includes('marble') ||
           name.includes('wood') ||
           name.includes('corner');
  });
  
  console.log(`🏢 Office-related files found: ${officeFiles.length}`);
  officeFiles.forEach(file => console.log(`   - ${file}`));
  
  // 2. Check metadata
  console.log('\n2️⃣ CHECKING METADATA:');
  console.log('=====================');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file does not exist!');
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const officeMetadata = Object.entries(metadata).filter(([_, data]) => 
    data.category === 'office-spaces'
  );
  
  console.log(`📋 Office spaces in metadata: ${officeMetadata.length}`);
  
  // 3. Check filename matches
  console.log('\n3️⃣ CHECKING FILENAME MATCHES:');
  console.log('=============================');
  
  let matchCount = 0;
  let missingFiles = [];
  
  officeMetadata.forEach(([key, data]) => {
    const expectedFile = data.filename;
    const exists = allImageFiles.includes(expectedFile);
    
    console.log(`${exists ? '✅' : '❌'} ${expectedFile} - ${exists ? 'EXISTS' : 'MISSING'}`);
    
    if (exists) {
      matchCount++;
    } else {
      missingFiles.push(expectedFile);
    }
  });
  
  console.log(`\n📊 Summary: ${matchCount}/${officeMetadata.length} files found`);
  
  // 4. Test API response
  console.log('\n4️⃣ CHECKING API ENDPOINT:');
  console.log('=========================');
  
  const apiPath = path.join(__dirname, 'pages', 'api', 'metadata.js');
  if (fs.existsSync(apiPath)) {
    console.log('✅ API file exists');
    
    // Read the API file content
    const apiContent = fs.readFileSync(apiPath, 'utf8');
    console.log('📄 API file preview (first 500 chars):');
    console.log(apiContent.substring(0, 500) + '...');
    
    if (apiContent.includes('office-spaces')) {
      console.log('✅ API includes office-spaces references');
    } else {
      console.log('❌ API does not include office-spaces references');
    }
  } else {
    console.log('❌ API file does not exist');
  }
  
  // 5. Provide specific fixes
  console.log('\n🛠️  DIAGNOSIS & FIXES:');
  console.log('=====================');
  
  if (officeFiles.length === 0) {
    console.log('❌ NO OFFICE IMAGES FOUND');
    console.log('Fix: Your office space images were not moved to public/images/');
    console.log('Action: Copy your processed office images to public/images/');
  } else if (matchCount === 0) {
    console.log('❌ FILENAME MISMATCH');
    console.log('Fix: The metadata expects different filenames than what exists');
    console.log('Action: Either rename files or update metadata');
    
    console.log('\n📝 Expected vs Found:');
    officeMetadata.slice(0, 5).forEach(([key, data]) => {
      const expectedFile = data.filename;
      const similarFile = officeFiles.find(f => 
        f.includes('office') || f.includes('executive') || f.includes('minimalist')
      );
      console.log(`Expected: ${expectedFile}`);
      console.log(`Similar:  ${similarFile || 'none found'}`);
      console.log('---');
    });
  } else if (matchCount < officeMetadata.length) {
    console.log('⚠️  PARTIAL MATCH');
    console.log(`Fix: ${missingFiles.length} files are missing`);
    console.log('Missing files:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
  } else {
    console.log('✅ ALL FILES MATCH!');
    console.log('The issue might be:');
    console.log('1. Browser cache - try hard refresh (Ctrl+Shift+R)');
    console.log('2. API not serving data correctly');
    console.log('3. Frontend not calling API correctly');
    
    console.log('\n🧪 Quick test - try visiting:');
    console.log('http://localhost:3000/api/metadata');
    console.log('You should see office-spaces entries in the JSON');
  }
  
  // 6. Generate quick fix script if needed
  if (officeFiles.length > 0 && matchCount < officeFiles.length) {
    console.log('\n🚀 QUICK FIX SCRIPT:');
    console.log('===================');
    
    console.log('// Copy this code to fix-office-filenames.js and run it:');
    console.log('const fs = require("fs");');
    console.log('const path = require("path");');
    console.log('');
    console.log('const metadataPath = path.join(__dirname, "public", "data", "image-metadata.json");');
    console.log('const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));');
    console.log('');
    
    // Generate rename suggestions
    let fixCount = 0;
    officeMetadata.forEach(([key, data], index) => {
      if (index < officeFiles.length && !allImageFiles.includes(data.filename)) {
        console.log(`metadata["${key}"].filename = "${officeFiles[index]}";`);
        fixCount++;
      }
    });
    
    if (fixCount > 0) {
      console.log('');
      console.log('fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));');
      console.log(`console.log("Fixed ${fixCount} filenames");`);
    }
  }
}

debugOfficeImages();