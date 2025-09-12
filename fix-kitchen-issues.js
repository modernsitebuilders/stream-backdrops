// fix-kitchen-issues.js - Fix the kitchen category issues
const fs = require('fs');
const path = require('path');

function fixKitchenCategoryInfo() {
  const slugPath = path.join(__dirname, 'pages', 'category', '[slug].js');
  let content = fs.readFileSync(slugPath, 'utf8');
  
  // Add kitchen section with images array to categoryInfo
  const kitchenSection = `,
  
  'kitchen': {
    name: 'Kitchen Backgrounds',
    description: 'Professional kitchen backgrounds for cooking shows, food blogs, and culinary video calls',
    seoDescription: 'Download free kitchen virtual backgrounds for video calls. Professional kitchen environments for cooking content.',
    images: [
      { filename: 'kitchen1.webp', title: 'Minimalist Kitchen Background' },
      { filename: 'kitchen2.webp', title: 'Scandinavian Kitchen Background' },
      { filename: 'kitchen3.webp', title: 'Scandinavian Kitchen Background' },
      { filename: 'kitchen4.webp', title: 'Kitchen Virtual Background' },
      { filename: 'kitchen5.webp', title: 'Luxury Kitchen Background' },
      { filename: 'kitchen6.webp', title: 'Kitchen Virtual Background' },
      { filename: 'kitchen7.webp', title: 'Minimalist Kitchen Background' },
      { filename: 'kitchen8.webp', title: 'Kitchen Virtual Background' },
      { filename: 'kitchen9.webp', title: 'Kitchen Virtual Background' },
      { filename: 'kitchen10.webp', title: 'Kitchen Virtual Background' },
      { filename: 'kitchen11.webp', title: 'Kitchen Virtual Background' },
      { filename: 'kitchen12.webp', title: 'Kitchen Virtual Background' },
      { filename: 'kitchen13.webp', title: 'Kitchen Virtual Background' },
      { filename: 'kitchen14.webp', title: 'Kitchen Virtual Background' },
      { filename: 'kitchen15.webp', title: 'Kitchen Virtual Background' },
      { filename: 'kitchen16.webp', title: 'Kitchen Virtual Background' },
      { filename: 'kitchen17.webp', title: 'Kitchen Virtual Background' },
      { filename: 'kitchen18.webp', title: 'Kitchen Virtual Background' }
    ]
  }`;
  
  // Find the end of living-room section and add kitchen after it
  const livingRoomEndPattern = /(\s+\]\s+\}\s*\};)/;
  
  if (content.match(livingRoomEndPattern)) {
    // Insert kitchen section before the closing of categoryInfo
    content = content.replace(livingRoomEndPattern, `$1${kitchenSection}`);
    content = content.replace(kitchenSection + '  };', kitchenSection + '\n};');
    
    fs.writeFileSync(slugPath, content);
    console.log('✅ Added kitchen images array to categoryInfo');
  } else {
    console.log('❌ Could not find insertion point for kitchen');
  }
}

function updateGetStaticPaths() {
  const slugPath = path.join(__dirname, 'pages', 'category', '[slug].js');
  let content = fs.readFileSync(slugPath, 'utf8');
  
  // Add kitchen to getStaticPaths
  const pathsPattern = /(const paths = \[['"][^'"\]]+['"][^\]]+)\]/;
  
  if (content.match(pathsPattern) && !content.includes("'kitchen'")) {
    content = content.replace(pathsPattern, "$1, 'kitchen']");
    fs.writeFileSync(slugPath, content);
    console.log('✅ Added kitchen to getStaticPaths');
  }
}

function checkHomepageVideo() {
  const homePath = path.join(__dirname, 'pages', 'index.js');
  
  if (fs.existsSync(homePath)) {
    const content = fs.readFileSync(homePath, 'utf8');
    
    const hasVideo = content.includes('<video') || content.includes('video');
    const hasHeroSection = content.includes('hero') || content.includes('Hero');
    
    console.log(`\n🔍 Homepage check:`);
    console.log(`   Video element found: ${hasVideo}`);
    console.log(`   Hero section found: ${hasHeroSection}`);
    
    if (!hasVideo) {
      console.log('⚠️ Video missing - check for index.js backup files');
      
      // Check for backup files
      const backupFiles = fs.readdirSync(__dirname).filter(f => 
        f.startsWith('index.js') && f.includes('backup')
      );
      
      if (backupFiles.length > 0) {
        console.log(`   Backup files found: ${backupFiles.join(', ')}`);
      }
    }
  }
}

function addLayoutKitchenNav() {
  const layoutPath = path.join(__dirname, 'components', 'Layout.js');
  
  if (fs.existsSync(layoutPath)) {
    let content = fs.readFileSync(layoutPath, 'utf8');
    
    if (!content.includes('/category/kitchen')) {
      // Find living room link and add kitchen after it
      const livingRoomPattern = /(Living Room\s*<\/Link>)/;
      const kitchenNav = `
  
  <Link href="/category/kitchen" style={{
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: currentPage === 'kitchen' ? '#2563eb' : '#374151',
    fontWeight: '500',
    fontSize: '0.9rem',
    background: '#f9fafb',
    border: currentPage === 'kitchen' ? '2px solid #2563eb' : '1px solid #d1d5db',
    transition: 'all 0.3s ease'
  }}>
    Kitchen
  </Link>`;
      
      if (content.match(livingRoomPattern)) {
        content = content.replace(livingRoomPattern, `$1${kitchenNav}`);
        fs.writeFileSync(layoutPath, content);
        console.log('✅ Added Kitchen to Layout navigation');
      } else {
        console.log('❌ Could not find Living Room link in Layout');
      }
    } else {
      console.log('ℹ️ Kitchen already in Layout navigation');
    }
  } else {
    console.log('❌ Layout.js not found');
  }
}

function runFixes() {
  console.log('🔧 Fixing kitchen category issues...\n');
  
  fixKitchenCategoryInfo();
  updateGetStaticPaths();
  addLayoutKitchenNav();
  checkHomepageVideo();
  
  console.log('\n🎯 Next steps:');
  console.log('1. Restart your dev server: npm run dev');
  console.log('2. Test /category/kitchen page');
  console.log('3. Check homepage for video');
  console.log('4. Check that kitchen appears in header navigation');
  console.log('5. If video missing, restore from backup file');
}

runFixes();