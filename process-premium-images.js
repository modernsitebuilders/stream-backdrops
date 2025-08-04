// process-premium-images.js
// Save this file in your stream-backdrops/nextjs-site/ folder
// Run with: node process-premium-images.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// PREMIUM 4K FILES from 2nd_premiums_originals
const premiumFiles = [
  'u9972584128_Professional_office_interior_photograph_with_single_e5bc7421-8a91-48c0-8577-5eec8b0a4ef9.png',
  'u9972584128_Real_corner_office_photograph_with_floor-to-ceiling_3fd1d45d-9616-4caa-9afb-828c0b06146b.png',
  'u9972584128_Real_corporate_lobby_photograph_with_single_recepti_c833a662-5e3b-456a-abd2-b3fa1aaf8ca7.png',
  'u9972584128_Real_glass_lobby_photograph_with_single_modern_seat_16bc5891-3424-4f5e-8cb4-d1eba8738a2e.png',
  'u9972584128_Real_home_office_photograph_with_light_wood_accent__f2a6b356-c092-417d-8b8c-65b647e4aad5.png',
  'u9972584128_Real_office_photograph_with_marble_accent_wall_on_l_d8c4ebb3-6541-4055-8a80-8d2a95167615.png',
  'u9972584128_Real_office_photograph_with_single_dark_wood_accent_f3f6b8da-d5d7-4167-8ffd-944244cc95fb.png'
];

// Function to extract meaningful name from premium filename
function extractPremiumImageType(filename) {
  // Remove the prefix and UUID parts
  let name = filename.replace('u9972584128_', '');
  name = name.replace(/_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.png$/, '');
  
  // Convert underscores to spaces and clean up
  name = name.replace(/_/g, ' ');
  
  // Handle specific premium patterns
  if (name.includes('Professional office interior photograph with single')) {
    return 'Executive Office with City View';
  }
  if (name.includes('Real corner office photograph with floor-to-ceiling')) {
    return 'Corner Executive Office with Floor-to-Ceiling Windows';
  }
  if (name.includes('Real corporate lobby photograph with single recepti')) {
    return 'Luxury Corporate Lobby';
  }
  if (name.includes('Real glass lobby photograph with single modern seat')) {
    return 'Modern Glass Lobby';
  }
  if (name.includes('Real home office photograph with light wood accent')) {
    return 'Scandinavian Home Office with Wood Accent';
  }
  if (name.includes('Real office photograph with marble accent wall on l')) {
    return 'Executive Office with Marble Accent Wall';
  }
  if (name.includes('Real office photograph with single dark wood accent')) {
    return 'Executive Office with Dark Wood Accent';
  }
  
  // Fallback cleanup
  if (name.includes(' with ')) {
    name = name.split(' with ')[0];
  }
  
  return name;
}

// Function to determine premium category
function categorizePremiumImage(filename) {
  const name = filename.toLowerCase();
  
  // Home office variations
  if (name.includes('home_office') || name.includes('scandinavian') || 
      name.includes('wood_accent') && name.includes('home')) {
    return 'home-offices';
  }
  
  // Executive offices
  if (name.includes('corner_office') || name.includes('executive_office') ||
      name.includes('marble_accent') || name.includes('dark_wood_accent') ||
      name.includes('floor-to-ceiling') || name.includes('professional_office')) {
    return 'executive-offices';
  }
  
  // Lobbies
  if (name.includes('lobby') || name.includes('corporate_lobby') || 
      name.includes('glass_lobby')) {
    return 'lobbies';
  }
  
  // Default to premium category
  return 'premium-4k';
}

// Function to create premium SEO filename
function createPremiumSEOFilename(originalName, index) {
  let cleanName = extractPremiumImageType(originalName);
  
  // Convert to URL-friendly format
  cleanName = cleanName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
    
  // Add premium prefix and index
  return `premium-4k-${cleanName}-${index + 1}.webp`;
}

// Function to generate premium metadata
function generatePremiumMetadata(filename) {
  const type = extractPremiumImageType(filename);
  const category = categorizePremiumImage(filename);
  
  // Create premium title
  const title = `${type} - Premium 4K`;
  
  // Generate premium description
  let description = '';
  let keywords = [];
  let price = '9.99'; // Default premium price
  
  if (category === 'home-offices') {
    description = `Ultra high-definition ${type.toLowerCase()} virtual background in stunning 4K quality. Perfect for executive video calls and professional remote work presentations.`;
    keywords = ['premium virtual background', '4K quality', 'home office', 'executive', 'professional', 'ultra HD'];
    price = '7.99';
  } else if (category === 'executive-offices') {
    description = `Luxury ${type.toLowerCase()} virtual background in premium 4K resolution. Designed for C-suite executives, leadership meetings, and high-stakes professional presentations.`;
    keywords = ['luxury virtual background', '4K executive office', 'premium quality', 'leadership', 'C-suite', 'professional'];
    price = '12.99';
  } else if (category === 'lobbies') {
    description = `Premium ${type.toLowerCase()} virtual background in ultra-high 4K quality. Perfect for client meetings, business presentations, and professional video conferences.`;
    keywords = ['premium lobby background', '4K quality', 'client meetings', 'business', 'professional', 'luxury'];
    price = '9.99';
  }
  
  // Add premium-specific keywords
  keywords = [...keywords, 'premium virtual background', '4K resolution', 'ultra HD', 'professional quality'];
  
  const alt = `${title} - Premium 4K virtual background for professional video calls`;
  
  // Generate Gumroad permalink (URL-friendly version)
  const gumroadPermalink = type
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') + '-4k-premium';
  
  return { 
    title, 
    description, 
    keywords, 
    alt, 
    category,
    isPremium: true,
    price: price,
    resolution: '4K (3840x2160)',
    gumroadPermalink: gumroadPermalink
  };
}

// Main premium processing function
function processPremiumImages() {
  // UPDATE THESE PATHS FOR YOUR SETUP:
  const sourceDir = path.join(__dirname, '..', '2nd_premiums_originals'); // Source folder
  const targetDir = path.join(__dirname, 'public', 'images'); // Target folder
  
  // Load existing metadata
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  let metadata = {};
  
  if (fs.existsSync(metadataPath)) {
    try {
      const existingData = fs.readFileSync(metadataPath, 'utf8');
      metadata = JSON.parse(existingData);
      console.log(`📋 Loaded existing metadata with ${Object.keys(metadata).length} images`);
    } catch (error) {
      console.log('⚠️  Could not load existing metadata, starting fresh');
    }
  }
  
  let processedCount = 0;
  
  console.log('🌟 Starting PREMIUM 4K image processing...\n');
  console.log(`📁 Source: ${sourceDir}`);
  console.log(`📁 Target: ${targetDir}\n`);
  
  // Process each premium file
  premiumFiles.forEach((oldFilename, index) => {
    const newFilename = createPremiumSEOFilename(oldFilename, index);
    const oldPath = path.join(sourceDir, oldFilename);
    const webpPath = path.join(targetDir, newFilename);
    
    if (fs.existsSync(oldPath)) {
      try {
        // Convert PNG to high-quality WebP (premium quality)
        console.log(`🌟 Converting PREMIUM: ${oldFilename} → ${newFilename}`);
        execSync(`magick "${oldPath}" -quality 95 -define webp:method=6 "${webpPath}"`, { stdio: 'inherit' });
        
        // Generate premium metadata
        const meta = generatePremiumMetadata(oldFilename);
        const key = newFilename.replace('.webp', '');
        
        metadata[key] = {
          filename: newFilename,
          title: meta.title,
          description: meta.description,
          category: meta.category,
          keywords: meta.keywords,
          alt: meta.alt,
          isPremium: meta.isPremium,
          price: meta.price,
          resolution: meta.resolution,
          gumroadPermalink: meta.gumroadPermalink
        };
        
        processedCount++;
        console.log(`✨ PREMIUM Processed: ${meta.title} - $${meta.price}`);
        
      } catch (error) {
        console.error(`❌ Error processing premium ${oldFilename}:`, error.message);
      }
    } else {
      console.log(`⚠️  Premium file not found: ${oldFilename}`);
      console.log(`     Looking in: ${oldPath}`);
    }
  });
  
  // Write updated metadata JSON
  const dataDir = path.dirname(metadataPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log(`\n🌟 Premium processing complete!`);
  console.log(`💎 Processed ${processedCount} premium 4K images`);
  console.log(`📊 Total images in metadata: ${Object.keys(metadata).length}`);
  console.log(`📁 Metadata saved to: ${metadataPath}`);
  
  // Count premium vs free
  const premiumCount = Object.values(metadata).filter(item => item.isPremium).length;
  const freeCount = Object.keys(metadata).length - premiumCount;
  
  console.log(`\n💰 Revenue Summary:`);
  console.log(`   Free images: ${freeCount}`);
  console.log(`   Premium 4K images: ${premiumCount}`);
  
  // Show premium breakdown by price
  const priceBreakdown = {};
  Object.values(metadata).forEach(item => {
    if (item.isPremium) {
      const price = item.price || '9.99';
      priceBreakdown[price] = (priceBreakdown[price] || 0) + 1;
    }
  });
  
  console.log(`\n💎 Premium pricing breakdown:`);
  Object.entries(priceBreakdown).forEach(([price, count]) => {
    console.log(`   $${price}: ${count} images`);
  });
  
  console.log(`\n🔗 Next steps:`);
  console.log(`1. Update your Gumroad products with the gumroadPermalink values`);
  console.log(`2. Test premium downloads on your site`);
  console.log(`3. Verify 4K quality and pricing display`);
}

// Check if ImageMagick is installed
try {
  execSync('magick -version', { stdio: 'ignore' });
  processPremiumImages();
} catch (error) {
  console.error('❌ ImageMagick not found!');
  console.log('📥 Please install ImageMagick first:');
  console.log('   Windows: https://imagemagick.org/script/download.php#windows');
  console.log('   Mac: brew install imagemagick');
  console.log('   Linux: sudo apt-get install imagemagick');
  process.exit(1);
}