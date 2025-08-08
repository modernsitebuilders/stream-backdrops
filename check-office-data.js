// check-office-data.js - Find your office spaces data
// Run with: node check-office-data.js

const fs = require('fs');
const path = require('path');

function checkOfficeData() {
  console.log('🔍 Checking for Office Spaces data...\n');
  
  // Check main locations where data might be
  const possibleLocations = [
    path.join(__dirname, 'data', 'office-spaces.json'),
    path.join(__dirname, 'public', 'data', 'office-spaces.json'),
    path.join(__dirname, 'public', 'data', 'image-metadata.json'),
    path.join(__dirname, 'pages', 'api', 'metadata.js'),
    path.join(__dirname, 'lib', 'image-data.js')
  ];
  
  console.log('📁 Searching these locations:');
  possibleLocations.forEach(location => {
    console.log(`   ${location}`);
    if (fs.existsSync(location)) {
      console.log(`   ✅ Found!`);
      
      if (location.endsWith('.json')) {
        try {
          const content = JSON.parse(fs.readFileSync(location, 'utf8'));
          if (typeof content === 'object') {
            console.log(`   📊 Contains: ${Object.keys(content).length} items`);
            
            // Check for office-spaces category
            const officeItems = Object.values(content).filter(item => 
              item.category === 'office-spaces' || 
              (typeof item === 'string' && item.includes('office'))
            );
            
            if (officeItems.length > 0) {
              console.log(`   🏢 Found ${officeItems.length} office-spaces items!`);
            }
          }
        } catch (error) {
          console.log(`   ❌ Error reading JSON: ${error.message}`);
        }
      } else if (location.endsWith('.js')) {
        const content = fs.readFileSync(location, 'utf8');
        if (content.includes('office-spaces')) {
          console.log(`   🏢 Contains office-spaces references!`);
        }
      }
    } else {
      console.log(`   ❌ Not found`);
    }
  });
  
  // Check for processed images
  console.log('\n🖼️  Checking for processed images:');
  const imageLocations = [
    path.join(__dirname, 'public', 'images', 'office-spaces'),
    path.join(__dirname, 'public', 'images'),
  ];
  
  imageLocations.forEach(location => {
    console.log(`   ${location}`);
    if (fs.existsSync(location)) {
      const files = fs.readdirSync(location).filter(f => 
        f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg')
      );
      
      const officeFiles = files.filter(f => 
        f.includes('office') || f.includes('executive') || f.includes('minimalist')
      );
      
      console.log(`   ✅ Found ${files.length} total images, ${officeFiles.length} office-related`);
      
      if (officeFiles.length > 0) {
        console.log(`   📸 Sample office images:`);
        officeFiles.slice(0, 3).forEach(file => console.log(`      - ${file}`));
      }
    } else {
      console.log(`   ❌ Directory not found`);
    }
  });
  
  // Check your API endpoint
  console.log('\n🔌 Checking API endpoint:');
  const apiPath = path.join(__dirname, 'pages', 'api', 'metadata.js');
  if (fs.existsSync(apiPath)) {
    console.log(`   ✅ API file exists: ${apiPath}`);
    const apiContent = fs.readFileSync(apiPath, 'utf8');
    
    if (apiContent.includes('office-spaces')) {
      console.log(`   🏢 API already includes office-spaces!`);
    } else {
      console.log(`   ⚠️  API doesn't include office-spaces yet`);
    }
  } else {
    console.log(`   ❌ API file not found: ${apiPath}`);
  }
  
  console.log('\n💡 What to do next:');
  console.log('==================');
  console.log('Based on what we found above:');
  console.log('');
  console.log('If you found office-spaces data:');
  console.log('  → You need to add it to your API endpoint');
  console.log('');
  console.log('If you found processed images but no data:');
  console.log('  → You need to create metadata for your images');
  console.log('');
  console.log('If you found neither:');
  console.log('  → You need to re-run the process-office-spaces.js script');
}

// Run the check
checkOfficeData();