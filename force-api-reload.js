// force-api-reload.js - Force your API to reload with office spaces
// Run with: node force-api-reload.js

const fs = require('fs');
const path = require('path');

function forceAPIReload() {
  console.log('🔄 Forcing API to reload with office spaces...\n');
  
  // 1. Check metadata file
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const totalImages = Object.keys(metadata).length;
  const officeSpaces = Object.values(metadata).filter(item => item.category === 'office-spaces').length;
  
  console.log(`📊 Metadata file contains:`);
  console.log(`   Total images: ${totalImages}`);
  console.log(`   Office spaces: ${officeSpaces}`);
  
  if (officeSpaces === 0) {
    console.log('❌ Metadata file does not have office spaces!');
    console.log('Run: node quick-add-office-metadata.js');
    return;
  }
  
  // 2. Update metadata with timestamp to force reload
  metadata._timestamp = Date.now();
  metadata._total = totalImages;
  
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log('✅ Updated metadata timestamp');
  
  // 3. Clear Next.js cache
  const nextCacheDir = path.join(__dirname, '.next');
  if (fs.existsSync(nextCacheDir)) {
    console.log('🗑️  Clearing Next.js cache...');
    
    // Delete cache folders
    const cacheFolders = [
      path.join(nextCacheDir, 'cache'),
      path.join(nextCacheDir, 'server'),
      path.join(nextCacheDir, 'static')
    ];
    
    cacheFolders.forEach(folder => {
      if (fs.existsSync(folder)) {
        try {
          fs.rmSync(folder, { recursive: true, force: true });
          console.log(`   Deleted: ${folder}`);
        } catch (error) {
          console.log(`   Could not delete: ${folder}`);
        }
      }
    });
  }
  
  // 4. Create new API file that forces fresh data
  const apiPath = path.join(__dirname, 'pages', 'api', 'metadata.js');
  
  const newAPI = `// pages/api/metadata.js - Updated with cache busting
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Prevent all caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Last-Modified', new Date().toUTCString());
    
    console.log('🔍 API called at:', new Date().toISOString());
    
    const metadataPath = path.join(process.cwd(), 'public', 'data', 'image-metadata.json');
    console.log('📁 Reading from:', metadataPath);
    
    if (!fs.existsSync(metadataPath)) {
      console.log('❌ Metadata file not found');
      return res.status(404).json({ error: 'Metadata file not found' });
    }
    
    // Read fresh data every time
    const rawData = fs.readFileSync(metadataPath, 'utf8');
    const metadata = JSON.parse(rawData);
    
    // Count categories
    const categoryCounts = {};
    Object.values(metadata).forEach(item => {
      if (item.category) {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      }
    });
    
    console.log('📊 Serving categories:', categoryCounts);
    
    const totalImages = Object.keys(metadata).length;
    console.log(\`✅ Serving \${totalImages} total images\`);
    
    // Return fresh data
    res.status(200).json(metadata);
    
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ 
      error: 'Failed to load metadata',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}`;
  
  // Backup and replace API
  if (fs.existsSync(apiPath)) {
    fs.copyFileSync(apiPath, apiPath + '.backup');
    console.log('💾 Backed up old API');
  }
  
  fs.writeFileSync(apiPath, newAPI);
  console.log('✅ Created new cache-busting API');
  
  console.log('\n🚀 NEXT STEPS:');
  console.log('==============');
  console.log('1. STOP your dev server (Ctrl+C)');
  console.log('2. START it again: npm run dev');
  console.log('3. Wait for it to fully load');
  console.log('4. Visit: http://localhost:3000/api/metadata');
  console.log('5. Search for "office-spaces" - you should find 15 entries');
  console.log('6. Visit: http://localhost:3000/category/office-spaces');
  console.log('7. You should now see 15 office space backgrounds!');
  
  console.log('\n📋 What this fix does:');
  console.log('- Forces fresh metadata loading');
  console.log('- Clears Next.js cache');
  console.log('- Prevents browser caching');
  console.log('- Adds debug logging to API');
}

forceAPIReload();