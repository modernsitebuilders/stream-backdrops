// check-current-state.js - See what we still have vs what we might need to restore
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking current site state...\n');

// Check key files that might have been affected
const filesToCheck = [
  'pages/index.js',
  'pages/_app.js', 
  'pages/category/[slug].js',
  'components/Header.js',
  'components/Footer.js',
  'components/Layout.js',
  'next.config.js',
  'package.json'
];

filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    console.log(`✅ ${file} (${(stats.size / 1024).toFixed(1)}KB)`);
    
    // Check for key features
    if (file === 'pages/index.js') {
      if (content.includes('Stream Backdrops')) console.log('   ✅ Has site title');
      if (content.includes('professional-shelves')) console.log('   ✅ Has new categories');
      if (content.includes('gradient')) console.log('   ✅ Has styling');
    }
    
    if (file === 'pages/category/[slug].js') {
      if (content.includes('Image')) console.log('   ✅ Has image components');
      if (content.includes('download')) console.log('   ✅ Has download functionality');
    }
    
  } else {
    console.log(`❌ ${file} - Missing`);
  }
});

// Check what's in your backup files
console.log('\n📋 Available backups:');
const files = fs.readdirSync(__dirname);
const backups = files.filter(f => f.includes('.backup'));
backups.forEach(backup => {
  console.log(`   📁 ${backup}`);
});

console.log('\n🎯 What we might need to restore:');
console.log('   • Homepage styling and layout');
console.log('   • Category page design');
console.log('   • Navigation components');
console.log('   • Any premium features');
console.log('   • Footer and header components');