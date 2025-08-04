// desktop-exec-scanner.js
// Run with: node desktop-exec-scanner.js

const fs = require('fs');
const path = require('path');
const os = require('os');

function scanDesktopExecutiveOffices() {
  // Common desktop paths
  const desktopPath = path.join(os.homedir(), 'Desktop');
  
  // You'll need to update this with your actual folder name
  const execFolderName = 'executive-offices'; // Change this to your actual folder name
  const execFolderPath = path.join(desktopPath, execFolderName);
  
  console.log('🔍 Scanning for executive office files...');
  console.log(`Looking in: ${execFolderPath}`);
  
  try {
    if (!fs.existsSync(execFolderPath)) {
      console.log('\n❌ Executive office folder not found!');
      console.log('Please update the folder name in the script:');
      console.log(`const execFolderName = 'your-actual-folder-name';`);
      return;
    }
    
    // Scan free folder
    const freePath = path.join(execFolderPath, 'free');
    const premiumPath = path.join(execFolderPath, 'premium');
    
    let freeFiles = [];
    let premiumFiles = [];
    
    // Get free files
    if (fs.existsSync(freePath)) {
      const allFreeFiles = fs.readdirSync(freePath);
      freeFiles = allFreeFiles.filter(file => 
        file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg')
      );
      console.log(`\n📁 Found ${freeFiles.length} files in free folder`);
    }
    
    // Get premium files  
    if (fs.existsSync(premiumPath)) {
      const allPremiumFiles = fs.readdirSync(premiumPath);
      premiumFiles = allPremiumFiles.filter(file => 
        file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg')
      );
      console.log(`📁 Found ${premiumFiles.length} files in premium folder`);
    }
    
    // Combine all files
    const allExecFiles = [...freeFiles, ...premiumFiles];
    
    if (allExecFiles.length === 0) {
      console.log('\n⚠️  No image files found in executive office folders');
      return;
    }
    
    console.log('\n🏢 EXECUTIVE OFFICE FILES FOR PROCESSING:');
    console.log('=========================================');
    
    // Format as JavaScript array
    const jsArray = allExecFiles.map(file => `  '${file}'`).join(',\n');
    console.log('const executiveOfficeFiles = [');
    console.log(jsArray);
    console.log('];');
    
    console.log('\n💎 PREMIUM FILES CLASSIFICATION:');
    console.log('================================');
    const premiumJsArray = premiumFiles.map(file => `  '${file}'`).join(',\n');
    console.log('const premiumFiles = [');
    console.log(premiumJsArray);
    console.log('];');
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Free files: ${freeFiles.length}`);
    console.log(`   Premium files: ${premiumFiles.length}`);
    console.log(`   Total: ${allExecFiles.length}`);
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Copy the arrays above into your executive-office-processor.js');
    console.log('2. Move all these files to your public/images/ folder');
    console.log('3. Run the processor script');
    
  } catch (error) {
    console.error('❌ Error scanning desktop:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the folder exists on your Desktop');
    console.log('2. Update the execFolderName variable with correct folder name');
    console.log('3. Check folder permissions');
  }
}

// Alternative: Manual path input
function scanCustomPath() {
  console.log('\n📝 MANUAL PATH OPTION:');
  console.log('If automatic detection fails, manually update these paths:');
  console.log('const freePath = "C:\\\\Users\\\\YourName\\\\Desktop\\\\executive-offices\\\\free";');
  console.log('const premiumPath = "C:\\\\Users\\\\YourName\\\\Desktop\\\\executive-offices\\\\premium";');
}

console.log('🖥️  Executive Office Desktop Scanner');
console.log('===================================');

scanDesktopExecutiveOffices();
scanCustomPath();