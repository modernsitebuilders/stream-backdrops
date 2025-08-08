// regenerate-metadata.js - Completely regenerate metadata to match your actual WebP files
// Run with: node regenerate-metadata.js

const fs = require('fs');
const path = require('path');

function regenerateMetadata() {
  console.log('🔄 Completely regenerating metadata from scratch...\n');
  
  const imagesDir = path.join(__dirname, 'public', 'images');
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  // Get all actual WebP files in the images directory
  if (!fs.existsSync(imagesDir)) {
    console.log('❌ Images directory not found!');
    return;
  }
  
  const actualFiles = fs.readdirSync(imagesDir).filter(file => 
    file.endsWith('.webp')
  ).sort();
  
  console.log(`📁 Found ${actualFiles.length} WebP files in public/images/`);
  console.log('First 10 files:');
  actualFiles.slice(0, 10).forEach(file => console.log(`   ${file}`));
  
  if (actualFiles.length === 0) {
    console.log('❌ No WebP files found! Make sure your curated collection was processed.');
    return;
  }
  
  // Generate fresh metadata based on actual filenames
  const newMetadata = {};
  
  actualFiles.forEach(filename => {
    const key = filename.replace('.webp', '');
    
    // Determine category from filename
    let category = 'professional-shelves'; // default
    let title = 'Professional Background';
    let description = '';
    let keywords = [];
    
    if (filename.includes('home-lifestyle')) {
      category = 'home-lifestyle';
      
      // Extract specific type from filename
      if (filename.includes('executive')) {
        title = 'Executive Home Office';
        description = 'Executive home office virtual background with books and plants - ideal for leadership and professional video calls';
        keywords = ['executive office', 'home office', 'leadership', 'professional', 'books and plants', 'video calls', 'luxury', 'high quality'];
      } else if (filename.includes('minimalist')) {
        title = 'Minimalist Home Office';
        description = 'Minimalist home office virtual background with books and plants - perfect for modern professionals and clean video calls';
        keywords = ['minimalist office', 'home office', 'modern', 'professional', 'books and plants', 'video calls', 'clean', 'high quality'];
      } else if (filename.includes('japandi')) {
        title = 'Japandi Home Office';
        description = 'Japandi home office virtual background with books and plants - ideal for zen-inspired professional video calls';
        keywords = ['japandi office', 'home office', 'zen', 'professional', 'books and plants', 'video calls', 'minimalist', 'high quality'];
      } else if (filename.includes('mid-century')) {
        title = 'Mid-Century Home Office';
        description = 'Mid-century home office virtual background with books and plants - perfect for vintage-inspired professional video calls';
        keywords = ['mid-century office', 'home office', 'vintage', 'professional', 'books and plants', 'video calls', 'retro', 'high quality'];
      } else if (filename.includes('luxury')) {
        title = 'Luxury Home Office';
        description = 'Luxury home office virtual background with books and plants - designed for high-end professional video calls';
        keywords = ['luxury office', 'home office', 'premium', 'professional', 'books and plants', 'video calls', 'elegant', 'high quality'];
      } else {
        title = 'Stylish Home Office';
        description = 'Stylish home office virtual background with books and plants - ideal for creative professionals and lifestyle video calls';
        keywords = ['home office', 'stylish', 'creative', 'professional', 'books and plants', 'video calls', 'lifestyle', 'high quality'];
      }
    } 
    else if (filename.includes('professional-shelves')) {
      category = 'professional-shelves';
      
      // Extract specific type from filename
      if (filename.includes('scandinavian')) {
        title = 'Scandinavian Professional Shelves';
        description = 'Scandinavian professional shelves virtual background with books and plants - perfect for Nordic-inspired video calls';
        keywords = ['scandinavian shelves', 'professional', 'nordic', 'books and plants', 'video calls', 'minimalist', 'clean', 'high quality'];
      } else if (filename.includes('industrial')) {
        title = 'Industrial Professional Shelves';
        description = 'Industrial professional shelves virtual background with books and plants - ideal for modern business video calls';
        keywords = ['industrial shelves', 'professional', 'modern', 'books and plants', 'video calls', 'business', 'contemporary', 'high quality'];
      } else if (filename.includes('glass')) {
        title = 'Glass Professional Shelves';
        description = 'Glass professional shelves virtual background with books and plants - perfect for elegant business video calls';
        keywords = ['glass shelves', 'professional', 'elegant', 'books and plants', 'video calls', 'business', 'modern', 'high quality'];
      } else if (filename.includes('wood')) {
        title = 'Wood Professional Shelves';
        description = 'Wood professional shelves virtual background with books and plants - ideal for warm business video calls';
        keywords = ['wood shelves', 'professional', 'warm', 'books and plants', 'video calls', 'business', 'natural', 'high quality'];
      } else if (filename.includes('stone')) {
        title = 'Stone Professional Shelves';
        description = 'Stone professional shelves virtual background with books and plants - perfect for sophisticated video calls';
        keywords = ['stone shelves', 'professional', 'sophisticated', 'books and plants', 'video calls', 'business', 'luxury', 'high quality'];
      } else if (filename.includes('metal')) {
        title = 'Metal Professional Shelves';
        description = 'Metal professional shelves virtual background with books and plants - ideal for contemporary video calls';
        keywords = ['metal shelves', 'professional', 'contemporary', 'books and plants', 'video calls', 'business', 'modern', 'high quality'];
      } else if (filename.includes('concrete')) {
        title = 'Concrete Professional Shelves';
        description = 'Concrete professional shelves virtual background with books and plants - perfect for industrial-style video calls';
        keywords = ['concrete shelves', 'professional', 'industrial', 'books and plants', 'video calls', 'business', 'modern', 'high quality'];
      } else {
        title = 'Professional Shelves';
        description = 'Professional shelves virtual background featuring books and plants - perfect for business video calls and remote work';
        keywords = ['professional shelves', 'office background', 'books and plants', 'video calls', 'remote work', 'business', 'zoom background', 'high quality'];
      }
    }
    
    const alt = `${title} - Professional virtual background with books and plants for video calls`;
    
    newMetadata[key] = {
      filename: filename,
      title: title,
      description: description,
      category: category,
      keywords: keywords,
      alt: alt
    };
  });
  
  // Backup old metadata
  if (fs.existsSync(metadataPath)) {
    const backupPath = metadataPath.replace('.json', '-old-backup.json');
    fs.copyFileSync(metadataPath, backupPath);
    console.log(`💾 Backed up old metadata to: ${backupPath}`);
  }
  
  // Write completely new metadata
  const dataDir = path.dirname(metadataPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(metadataPath, JSON.stringify(newMetadata, null, 2));
  
  console.log(`✅ Generated fresh metadata: ${metadataPath}`);
  console.log(`📊 Total images: ${Object.keys(newMetadata).length}`);
  
  // Show new category breakdown
  const categoryCount = {};
  Object.values(newMetadata).forEach(item => {
    categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
  });
  
  console.log('\n📁 New category breakdown:');
  Object.entries(categoryCount).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  // Show sample entries
  console.log('\n📋 Sample metadata entries:');
  const sampleKeys = Object.keys(newMetadata).slice(0, 3);
  sampleKeys.forEach(key => {
    const item = newMetadata[key];
    console.log(`\n${key}:`);
    console.log(`   Title: ${item.title}`);
    console.log(`   Category: ${item.category}`);
    console.log(`   File: ${item.filename}`);
  });
  
  console.log('\n🎉 Metadata completely regenerated!');
  console.log('\n🚀 Next steps:');
  console.log('1. Delete .next folder: rmdir /s .next');  
  console.log('2. Clear browser cache');
  console.log('3. Restart: npm run dev');
  console.log('4. Your site should now show the correct categories and images!');
}

regenerateMetadata();