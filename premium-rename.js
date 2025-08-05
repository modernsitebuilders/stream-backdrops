// premium-rename.js - Rename premium images for AWS upload
// Save this file in your stream-backdrops/nextjs-site/ folder
// Run with: node premium-rename.js

const fs = require('fs');
const path = require('path');

// Function to extract meaningful name from filename (same logic as your process-images.js)
function extractImageType(filename) {
  // Remove the prefix and UUID parts
  let name = filename.replace('u9972584128_', '');
  name = name.replace(/_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_\d+(\s\(\d+\))?\.png$/, '');
  
  // Convert underscores to spaces and clean up
  name = name.replace(/_/g, ' ');
  
  // Handle specific patterns from your images
  if (name.includes('Contemporary executive home office with sleek')) {
    return 'Contemporary executive home office';
  }
  if (name.includes('Empty minimalist consultant office')) {
    return 'Minimalist consultant office';
  }
  if (name.includes('Empty minimalist high-end executive office')) {
    return 'Minimalist executive office';
  }
  if (name.includes('Empty minimalist Japandi home office')) {
    return 'Japandi minimalist home office';
  }
  if (name.includes('Empty minimalist medical lobby')) {
    return 'Minimalist medical lobby';
  }
  if (name.includes('Farmhouse home office with distressed wood')) {
    return 'Farmhouse home office';
  }
  if (name.includes('Modern biophilic home office')) {
    return 'Biophilic home office with plants';
  }
  if (name.includes('Modern home office with large plants')) {
    return 'Modern home office with plants';
  }
  if (name.includes('Modern minimalist home office with clean white')) {
    return 'Minimalist white home office';
  }
  if (name.includes('Photorealistic home office with wood accent wall')) {
    return 'Home office with wood accent wall';
  }
  if (name.includes('Professional consultation office interior')) {
    return 'Professional consultation office';
  }
  if (name.includes('Professional home office with clean white desk')) {
    return 'Clean modern home office';
  }
  if (name.includes('Professional interior photograph of cozy home')) {
    return 'Cozy professional home office';
  }
  if (name.includes('Professional office interior photograph with sing')) {
    return 'Professional office with windows';
  }
  if (name.includes('Realistic artistic home office with standing')) {
    return 'Artistic home office with standing desk';
  }
  if (name.includes('Realistic contemporary physicians office')) {
    return 'Contemporary physicians office';
  }
  if (name.includes('Realistic modern engineering office')) {
    return 'Modern engineering office';
  }
  if (name.includes('Realistic upscale real estate office')) {
    return 'Upscale real estate office';
  }
  if (name.includes('Realistic warm therapy office')) {
    return 'Warm therapy office';
  }
  if (name.includes('Real corner office photograph with floor-to-ceili')) {
    return 'Corner office with city views';
  }
  if (name.includes('Real corporate lobby photograph with single recep')) {
    return 'Corporate lobby with reception';
  }
  if (name.includes('Real glass lobby photograph with single modern')) {
    return 'Modern glass lobby';
  }
  if (name.includes('Real home office photograph natural lighting wood')) {
    return 'Home office with natural wood';
  }
  if (name.includes('Real home office photograph single plant position')) {
    return 'Home office with plant accent';
  }
  if (name.includes('Real home office photograph with light wood accen')) {
    return 'Scandinavian home office';
  }
  if (name.includes('Real home office photograph with single concrete')) {
    return 'Industrial home office with concrete';
  }
  if (name.includes('Real home office photograph with single warm wood')) {
    return 'Traditional home office with wood';
  }
  if (name.includes('Real office photograph with marble accent wall')) {
    return 'Executive office with marble wall';
  }
  if (name.includes('Real office photograph with single dark wood')) {
    return 'Executive office with dark wood';
  }
  if (name.includes('Real private office photograph with single booksh')) {
    return 'Private office with bookshelf';
  }
  if (name.includes('Real world Clean Scandinavian home office')) {
    return 'Clean Scandinavian home office';
  }
  
  // Truncate if too long (Midjourney cuts off descriptions)
  if (name.includes(' with ')) {
    name = name.split(' with ')[0];
  }
  
  return name;
}

// Function to create SEO-friendly filename
function createSEOFilename(originalName, index) {
  let cleanName = extractImageType(originalName);
  
  // Convert to URL-friendly format
  cleanName = cleanName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
    
  // Add index to avoid duplicates and premium suffix
  return `${cleanName}-${index + 1}-premium-4k.png`;
}

// Function to determine category from filename
function categorizeImage(filename) {
  const name = filename.toLowerCase();
  
  // Home office variations
  if (name.includes('home_office') || name.includes('scandinavian') || name.includes('mediterranean')) {
    return 'home-offices';
  }
  
  // Executive offices
  if (name.includes('ceo_office') || name.includes('executive_office') || 
      name.includes('luxury_ceo') || name.includes('corner_office') ||
      name.includes('marble_accent') || name.includes('city_view')) {
    return 'executive-offices';
  }
  
  // Lobbies
  if (name.includes('lobby') || name.includes('reception') || 
      name.includes('corporate_lobby') || name.includes('glass_lobby')) {
    return 'lobbies';
  }
  
  // Conference rooms
  if (name.includes('conference_room') || name.includes('meeting_room') || 
      name.includes('boardroom')) {
    return 'conference-rooms';
  }
  
  // Private offices
  if (name.includes('private_office') || name.includes('consultation') || 
      name.includes('therapist') || name.includes('counseling')) {
    return 'private-offices';
  }
  
  // Open offices
  if (name.includes('open_office') || name.includes('open_workspace')) {
    return 'open-offices';
  }
  
  // Fallback to home offices
  return 'home-offices';
}

// Function to generate metadata for premium images
function generatePremiumMetadata(filename, newFilename) {
  const type = extractImageType(filename);
  const category = categorizeImage(filename);
  
  // Create proper title (title case)
  const title = `${type.replace(/\b\w/g, l => l.toUpperCase())} - Premium 4K`;
  
  // Generate description based on category and content
  let description = '';
  let keywords = [];
  
  if (category === 'home-offices') {
    description = `Premium 4K ${type.toLowerCase()} virtual background with ultra-high definition quality for professional remote work`;
    keywords = ['premium 4k', 'home office', 'remote work', 'virtual background', 'professional', 'ultra hd'];
  } else if (category === 'executive-offices') {
    description = `Luxury 4K ${type.toLowerCase()} virtual background for executive meetings and high-level business calls`;
    keywords = ['premium 4k', 'executive office', 'luxury', 'leadership', 'professional', 'business', 'ultra hd'];
  } else if (category === 'lobbies') {
    description = `Professional 4K ${type.toLowerCase()} virtual background for premium client meetings and business presentations`;
    keywords = ['premium 4k', 'lobby', 'reception', 'professional', 'business', 'client meetings', 'ultra hd'];
  } else if (category === 'conference-rooms') {
    description = `Premium 4K ${title.toLowerCase()} virtual background ideal for executive team meetings and presentations`;
    keywords = ['premium 4k', 'conference room', 'meeting room', 'team meetings', 'presentations', 'professional', 'ultra hd'];
  } else if (category === 'private-offices') {
    description = `Specialized 4K ${type.toLowerCase()} virtual background for premium professional consultations`;
    keywords = ['premium 4k', 'private office', 'consultation', 'professional', 'specialized', 'meetings', 'ultra hd'];
  } else if (category === 'open-offices') {
    description = `Modern 4K ${type.toLowerCase()} virtual background for premium collaborative work environments`;
    keywords = ['premium 4k', 'open office', 'collaborative', 'modern', 'teamwork', 'professional', 'ultra hd'];
  }
  
  // Extract specific keywords from the type
  const typeWords = type.toLowerCase().split(' ');
  keywords = [...keywords, ...typeWords].slice(0, 8);
  
  const alt = `${title} virtual background for professional video calls`;
  
  return { 
    title, 
    description, 
    keywords, 
    alt, 
    category,
    isPremium: true,
    price: '5.99',
    resolution: '4K Ultra HD',
    format: 'PNG'
  };
}

// Main processing function
function renamePremiumImages() {
  // UPDATE THESE PATHS FOR YOUR SETUP:
  const sourceDir = path.join(__dirname, 'premium labels'); // Your premium images folder
  const targetDir = path.join(__dirname, 'premium-renamed'); // Where renamed files will go
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Load existing metadata to update with premium entries
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
  
  console.log('🏆 Starting Premium Images Renaming...\n');
  console.log(`📁 Source: ${sourceDir}`);
  console.log(`📁 Target: ${targetDir}\n`);
  
  // Check if source directory exists
  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Source directory not found: ${sourceDir}`);
    console.log('💡 Make sure you have a "premium labels" folder with your premium PNG files');
    return;
  }
  
  // Get all PNG files from the source directory
  const files = fs.readdirSync(sourceDir).filter(file => file.toLowerCase().endsWith('.png'));
  
  if (files.length === 0) {
    console.log('⚠️  No PNG files found in the premium labels directory');
    return;
  }
  
  console.log(`📄 Found ${files.length} PNG files to process\n`);
  
  // Group files by type to avoid duplicates
  const groupedFiles = {};
  files.forEach(filename => {
    const type = extractImageType(filename);
    if (!groupedFiles[type]) {
      groupedFiles[type] = [];
    }
    groupedFiles[type].push(filename);
  });
  
  let processedCount = 0;
  let renameMap = {}; // To track old -> new filename mapping
  
  // Process each group
  Object.entries(groupedFiles).forEach(([type, fileList]) => {
    fileList.forEach((oldFilename, index) => {
      const newFilename = createSEOFilename(oldFilename, index);
      const oldPath = path.join(sourceDir, oldFilename);
      const newPath = path.join(targetDir, newFilename);
      
      try {
        // Copy file with new name (keeping original PNG format)
        console.log(`📸 Renaming: ${oldFilename} → ${newFilename}`);
        fs.copyFileSync(oldPath, newPath);
        
        // Generate premium metadata
        const meta = generatePremiumMetadata(oldFilename, newFilename);
        const key = newFilename.replace('.png', '');
        
        // Add to metadata as premium image
        metadata[key] = {
          filename: newFilename,
          title: meta.title,
          description: meta.description,
          category: meta.category,
          keywords: meta.keywords,
          alt: meta.alt,
          isPremium: true,
          price: meta.price,
          resolution: meta.resolution,
          format: meta.format
        };
        
        // Track the rename mapping
        renameMap[oldFilename] = newFilename;
        
        processedCount++;
        console.log(`✅ Processed: ${meta.title}`);
        
      } catch (error) {
        console.error(`❌ Error processing ${oldFilename}:`, error.message);
      }
    });
  });
  
  // Write updated metadata JSON
  const dataDir = path.dirname(metadataPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  // Create a rename mapping file for AWS upload reference
  const renameMappingPath = path.join(targetDir, 'rename-mapping.json');
  fs.writeFileSync(renameMappingPath, JSON.stringify(renameMap, null, 2));
  
  console.log(`\n🎉 Premium image renaming complete!`);
  console.log(`📊 Processed ${processedCount} premium images`);
  console.log(`📁 Renamed files saved to: ${targetDir}`);
  console.log(`📁 Updated metadata saved to: ${metadataPath}`);
  console.log(`📁 Rename mapping saved to: ${renameMappingPath}`);
  
  // Count by category
  const premiumCategoryCounts = {};
  Object.values(metadata).forEach(item => {
    if (item.isPremium) {
      premiumCategoryCounts[item.category] = (premiumCategoryCounts[item.category] || 0) + 1;
    }
  });
  
  console.log(`\n📋 Premium images by category:`);
  Object.entries(premiumCategoryCounts).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} premium images`);
  });
  
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Upload files from "${targetDir}" to your AWS S3 bucket`);
  console.log(`   2. Update your premium download API to use the new filenames`);
  console.log(`   3. Test the premium purchase flow`);
}

// Run the renaming process
renamePremiumImages();