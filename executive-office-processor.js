// executive-office-processor.js
// Run with: node executive-office-processor.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Your executive office files
const executiveOfficeFiles = [
  'u9972584128_Active_financial_executive_office_with_marble_acc_a8408b71-d833-4ce7-9042-3ceb41e797d3_1.png',
  'u9972584128_Active_luxury_executive_office_with_forest_green__5492720f-c1ee-4912-bca9-53c9f6b48761_0.png',
  'u9972584128_Active_luxury_executive_office_with_forest_green__5492720f-c1ee-4912-bca9-53c9f6b48761_1.png',
  'u9972584128_Active_luxury_executive_office_with_single_leathe_569dddf4-9bcd-42f2-ad26-9522de60e7e9_3.png',
  'u9972584128_Professional_medical_executive_office_with_calmin_6e3e8123-a47e-41a9-af7d-f787b454a65f_2.png',
  'u9972584128_Professional_medical_executive_office_with_calmin_6e3e8123-a47e-41a9-af7d-f787b454a65f_3.png',
  'u9972584128_Professional_working_executive_office_with_rich_m_9c557d07-0e36-4b20-82ae-516354b94884_1.png',
  'u9972584128_Professional_working_executive_office_with_white__383a2f7f-3fe1-450f-9e5d-0b49c031d9e6_1.png',
  'u9972584128_Professional_working_executive_office_with_white__383a2f7f-3fe1-450f-9e5d-0b49c031d9e6R_2.png',
  'u9972584128_Professional_working_executive_office_with_white__383a2f7f-3fe1-450f-9e5d-0b49c031d9e6_3.png',
  'u9972584128_Working_corner_executive_office_with_floor-to-cei_5279c0bb-31c4-4971-b982-71796df3be3d_0.png',
  'u9972584128_Working_corner_executive_office_with_floor-to-cei_5279c0bb-31c4-4971-b982-71796df3be3d_1.png',
  'u9972584128_Working_corner_executive_office_with_travertine_s_45b9eba4-5c64-4914-ad3f-86b3e8a9496a_0.png',
  'u9972584128_Working_corner_executive_office_with_travertine_s_45b9eba4-5c64-4914-ad3f-86b3e8a9496a_1.png',
  'u9972584128_Active_financial_executive_office_with_marble_accen_65c0bd76-3e11-4220-a06a-09012006b4cb.png',
  'u9972584128_Active_luxury_executive_office_with_forest_green_wa_4333c768-0b51-4049-8375-8b490a2df836.png',
  'u9972584128_Professional_medical_executive_office_with_calming__d4a03724-95be-4383-ab7b-03299fa2854a.png',
  'u9972584128_Professional_working_executive_office_with_white_ma_467d9f0f-dcf7-48e9-a378-d335b6a73de0.png'
];

// Premium vs Free classification
const premiumFiles = [
  'u9972584128_Active_financial_executive_office_with_marble_accen_65c0bd76-3e11-4220-a06a-09012006b4cb.png',
  'u9972584128_Active_luxury_executive_office_with_forest_green_wa_4333c768-0b51-4049-8375-8b490a2df836.png',
  'u9972584128_Professional_medical_executive_office_with_calming__d4a03724-95be-4383-ab7b-03299fa2854a.png',
  'u9972584128_Professional_working_executive_office_with_white_ma_467d9f0f-dcf7-48e9-a378-d335b6a73de0.png'
];

// Generate SEO-friendly filename
function createSEOFilename(originalName, index, isPremium = false) {
  let cleanName = originalName
    .replace(/\.png$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
    
  const suffix = isPremium ? '-premium' : '';
  return `executive-office-${cleanName}${suffix}-${index + 1}.webp`;
}

// Generate metadata for executive offices
function generateExecutiveMetadata(filename, isPremium = false) {
  const baseTypes = {
    'financial': {
      title: 'Financial Executive Office with Marble Accent',
      description: 'Professional marble accent executive office virtual background perfect for financial sector video calls',
      keywords: ['financial office', 'marble executive', 'luxury background', 'finance CEO', 'marble accent wall']
    },
    'forest_green': {
      title: 'Forest Green Executive Office',
      description: 'Classic forest green wainscoting executive office virtual background for professional authority',
      keywords: ['forest green office', 'wainscoting', 'executive authority', 'traditional executive', 'luxury wainscoting']
    },
    'leather': {
      title: 'Luxury Leather Executive Office',
      description: 'Sophisticated leather executive office virtual background for high-end business meetings',
      keywords: ['leather office', 'luxury executive', 'premium background', 'sophisticated office', 'executive leather']
    },
    'medical': {
      title: 'Medical Executive Office',
      description: 'Calming sage green medical executive office virtual background for healthcare leadership',
      keywords: ['medical executive', 'healthcare office', 'sage green', 'medical leadership', 'healthcare background']
    },
    'marble': {
      title: 'Marble Executive Office',
      description: 'Professional marble accent executive office virtual background perfect for C-suite video calls',
      keywords: ['marble office', 'luxury executive', 'premium background', 'CEO office', 'marble accent wall']
    },
    'corner': {
      title: 'Corner Executive Office',
      description: 'Prestigious corner executive office virtual background for leadership calls',
      keywords: ['corner office', 'executive prestige', 'leadership background', 'windows office', 'corner views']
    },
    'travertine': {
      title: 'Natural Stone Executive Office',
      description: 'Sophisticated travertine stone accent executive office virtual background for luxury meetings',
      keywords: ['stone accent', 'natural materials', 'luxury office', 'sophisticated background', 'executive stone']
    }
  };

  // Determine type from filename
  let type = 'marble'; // default
  if (filename.toLowerCase().includes('financial')) type = 'financial';
  else if (filename.toLowerCase().includes('forest_green') || filename.toLowerCase().includes('forest-green')) type = 'forest_green';
  else if (filename.toLowerCase().includes('leather')) type = 'leather';
  else if (filename.toLowerCase().includes('medical')) type = 'medical';
  else if (filename.toLowerCase().includes('corner')) type = 'corner';
  else if (filename.toLowerCase().includes('travertine')) type = 'travertine';

  const meta = baseTypes[type];
  const category = 'executive-offices';
  
  return {
    title: isPremium ? `${meta.title} - Premium 4K` : meta.title,
    description: isPremium ? `${meta.description} - Ultra high-definition 4K quality` : meta.description,
    category: category,
    keywords: isPremium ? [...meta.keywords, 'premium 4K', 'ultra HD'] : meta.keywords,
    alt: `${meta.title} virtual background for professional video calls`,
    isPremium: isPremium,
    resolution: isPremium ? '4K' : '2K'
  };
}

// Main processing function
function processExecutiveOffices() {
  const imagesDir = path.join(__dirname, 'public', 'images');
  const metadata = {};
  let processedCount = 0;
  
  console.log('🏢 Starting executive office processing...\n');
  
  executiveOfficeFiles.forEach((filename, index) => {
    const isPremium = premiumFiles.includes(filename);
    const oldPath = path.join(imagesDir, filename);
    const newFilename = createSEOFilename(filename, index, isPremium);
    const webpPath = path.join(imagesDir, newFilename);
    
    if (fs.existsSync(oldPath)) {
      try {
        // Convert to WebP with appropriate quality
        const quality = isPremium ? 95 : 85; // Higher quality for premium
        console.log(`🔄 Converting: ${filename} → ${newFilename} (${isPremium ? 'PREMIUM' : 'FREE'})`);
        
        execSync(`magick "${oldPath}" -quality ${quality} "${webpPath}"`, { stdio: 'inherit' });
        
        // Generate metadata
        const meta = generateExecutiveMetadata(filename, isPremium);
        const key = newFilename.replace('.webp', '');
        
        metadata[key] = {
          filename: newFilename,
          title: meta.title,
          description: meta.description,
          category: meta.category,
          keywords: meta.keywords,
          alt: meta.alt,
          isPremium: meta.isPremium,
          resolution: meta.resolution,
          ...(isPremium && { price: '5.99', gumroadPermalink: `executive-office-${key}` })
        };
        
        processedCount++;
        console.log(`✅ Processed: ${meta.title} ${isPremium ? '(PREMIUM 4K)' : '(FREE 2K)'}`);
        
      } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message);
      }
    } else {
      console.log(`⚠️  File not found: ${filename}`);
    }
  });
  
  // Load existing metadata and merge
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  let existingMetadata = {};
  
  if (fs.existsSync(metadataPath)) {
    try {
      existingMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      console.log(`📖 Loaded existing metadata: ${Object.keys(existingMetadata).length} images`);
    } catch (error) {
      console.log('⚠️  Could not load existing metadata, creating new file');
    }
  }
  
  // Merge new executive office metadata
  const updatedMetadata = { ...existingMetadata, ...metadata };
  
  // Write updated metadata
  const dataDir = path.dirname(metadataPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(metadataPath, JSON.stringify(updatedMetadata, null, 2));
  
  console.log(`\n🎉 Executive office processing complete!`);
  console.log(`📊 Added ${processedCount} new executive office images`);
  console.log(`📁 Total images in database: ${Object.keys(updatedMetadata).length}`);
  
  // Count by tier
  const premiumCount = Object.values(metadata).filter(item => item.isPremium).length;
  const freeCount = Object.values(metadata).filter(item => !item.isPremium).length;
  
  console.log(`\n💎 Executive Office Summary:`);
  console.log(`   Premium 4K: ${premiumCount} images`);
  console.log(`   Free 2K: ${freeCount} images`);
  console.log(`   Total: ${processedCount} images`);
  
  console.log(`\n🚀 Next steps:`);
  console.log(`1. Update your executive-offices category page`);
  console.log(`2. Add premium purchase links`);
  console.log(`3. Test image loading: http://localhost:3000/category/executive-offices`);
  console.log(`4. Deploy to production when ready`);
}

// Check dependencies and run
try {
  execSync('magick -version', { stdio: 'ignore' });
  processExecutiveOffices();
} catch (error) {
  console.error('❌ ImageMagick not found!');
  console.log('📥 Please install ImageMagick first:');
  console.log('   Windows: https://imagemagick.org/script/download.php#windows');
  console.log('   Mac: brew install imagemagick');
  console.log('   Linux: sudo apt-get install imagemagick');
  process.exit(1);
}