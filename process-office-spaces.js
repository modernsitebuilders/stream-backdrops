// process-office-spaces.js
// Process your 15 office space images and add them as a third category
// Save this file in your stream-backdrops/nextjs-site/ folder
// Run with: node process-office-spaces.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// OFFICE SPACE IMAGES - Your actual 15 files from zoom-images folder
const officeSpaceImages = [
  'u9972584128_Empty_minimalist_high-end_executive_office_with_s_2cab17be-6b5d-4e4b-8470-c2253e75caec_0.png',
  'u9972584128_Photorealistic_home_office_with_wood_accent_wall__32c2ca0f-782a-461f-bded-72e2b505b001_1.png',
  'u9972584128_Photorealistic_home_office_with_wood_accent_wall__32c2ca0f-782a-461f-bded-72e2b505b001_2.png',
  'u9972584128_Professional_consultation_office_interior_photogr_2a8e15a0-46b4-486a-9caa-82efdbe2e6bd_0.png',
  'u9972584128_Professional_consultation_office_interior_photogr_2a8e15a0-46b4-486a-9caa-82efdbe2e6bd_1.png',
  'u9972584128_Professional_office_interior_photograph_with_sing_5f03ac15-f293-483c-8324-418ea938c0fa_0.png',
  'u9972584128_Professional_office_interior_photograph_with_sing_5f03ac15-f293-483c-8324-418ea938c0fa_1.png',
  'u9972584128_Real_corner_office_photograph_with_floor-to-ceili_b587704b-319b-44a0-a04f-8ba5deb88785_0.png',
  'u9972584128_Real_home_office_photograph_with_light_wood_accen_697e2714-c527-42a6-8cf3-d1b3c53a275d_1.png',
  'u9972584128_Real_home_office_photograph_with_single_concrete__f2a938b1-8bbf-4f96-b9f3-5e01d0674dc8_1.png',
  'u9972584128_Real_office_photograph_with_marble_accent_wall_on_52aa4fce-0760-4034-b21d-1acd6c2938f6_0.png',
  'u9972584128_Real_office_photograph_with_marble_accent_wall_on_52aa4fce-0760-4034-b21d-1acd6c2938f6_2.png',
  'u9972584128_Real_office_photograph_with_marble_accent_wall_on_52aa4fce-0760-4034-b21d-1acd6c2938f6_3.png',
  'u9972584128_Real_office_photograph_with_single_dark_wood_acce_dd48ae64-c8ed-43bc-8c63-3370109d1ff4_0.png',
  'u9972584128_Real_office_photograph_with_single_dark_wood_acce_dd48ae64-c8ed-43bc-8c63-3370109d1ff4_3.png'
];

// Function to extract meaningful name from filename
function extractImageType(filename) {
  // Remove the prefix and UUID parts
  let name = filename.replace('u9972584128_', '');
  name = name.replace(/_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_\d+\.png$/, '');
  
  // Convert underscores to spaces and clean up
  name = name.replace(/_/g, ' ');
  
  // Handle specific patterns from your office space images
  if (name.includes('Empty minimalist high-end executive office with s')) {
    return 'Minimalist Executive Office';
  }
  if (name.includes('Photorealistic home office with wood accent wall')) {
    return 'Home Office with Wood Accent Wall';
  }
  if (name.includes('Professional consultation office interior photogr')) {
    return 'Professional Consultation Office';
  }
  if (name.includes('Professional office interior photograph with sing')) {
    return 'Professional Office Interior';
  }
  if (name.includes('Real corner office photograph with floor-to-ceili')) {
    return 'Corner Office with Floor-to-Ceiling Windows';
  }
  if (name.includes('Real home office photograph with light wood accen')) {
    return 'Home Office with Light Wood Accent';
  }
  if (name.includes('Real home office photograph with single concrete')) {
    return 'Modern Home Office with Concrete Wall';
  }
  if (name.includes('Real office photograph with marble accent wall on')) {
    return 'Office with Marble Accent Wall';
  }
  if (name.includes('Real office photograph with single dark wood acce')) {
    return 'Office with Dark Wood Accent';
  }
  
  // Fallback cleanup
  if (name.includes(' with ')) {
    name = name.split(' with ')[0];
  }
  
  // Capitalize properly
  name = name.replace(/\b\w/g, l => l.toUpperCase());
  
  return name || 'Professional Office Space';
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
    
  // Add index to avoid duplicates
  return `${cleanName}-${index + 1}.webp`;
}

// Function to generate metadata for office spaces
function generateOfficeMetadata(filename) {
  const type = extractImageType(filename);
  
  const title = type;
  const description = `Professional ${type.toLowerCase()} virtual background perfect for business meetings and video conferences`;
  const keywords = ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace'];
  
  return { title, description, keywords };
}

// Main processing function
function processOfficeSpaces() {
  console.log('🏢 Processing Office Spaces category...\n');
  
  // Check if source directory exists
  const sourceDir = path.join(__dirname, '..', 'zoom-images');
  if (!fs.existsSync(sourceDir)) {
    console.log('❌ Source directory not found!');
    console.log(`Expected: ${sourceDir}`);
    return;
  }
  
  // Create output directories
  const outputDir = path.join(__dirname, 'public', 'images', 'office-spaces');
  const dataDir = path.join(__dirname, 'data');
  
  // Create directories if they don't exist
  [outputDir, dataDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
  
  console.log(`📊 Processing ${officeSpaceImages.length} office space images...\n`);
  
  const processedImages = [];
  const errors = [];
  
  officeSpaceImages.forEach((filename, index) => {
    try {
      const sourcePath = path.join(sourceDir, filename);
      
      // Check if source file exists
      if (!fs.existsSync(sourcePath)) {
        console.log(`⚠️  File not found: ${filename}`);
        errors.push(`File not found: ${filename}`);
        return;
      }
      
      // Generate new filename and metadata
      const newFilename = createSEOFilename(filename, index);
      const outputPath = path.join(outputDir, newFilename);
      const metadata = generateOfficeMetadata(filename);
      
      console.log(`${(index + 1).toString().padStart(2, ' ')}. Processing: ${filename}`);
      console.log(`    → ${newFilename}`);
      console.log(`    → ${metadata.title}`);
      
      // Convert to WebP with optimization
      try {
        // Using sharp via npx (you can also install sharp locally)
        const sharpCommand = `npx sharp-cli -i "${sourcePath}" -o "${outputPath}" -f webp -q 85`;
        execSync(sharpCommand, { stdio: 'pipe' });
        
        console.log(`    ✅ Converted and optimized`);
      } catch (conversionError) {
        // Fallback: just copy the file if sharp fails
        console.log(`    ⚠️  Sharp conversion failed, copying original...`);
        const fallbackPath = outputPath.replace('.webp', path.extname(filename));
        fs.copyFileSync(sourcePath, fallbackPath);
      }
      
      // Add to processed list
      processedImages.push({
        filename: newFilename,
        originalFilename: filename,
        title: metadata.title,
        description: metadata.description,
        keywords: metadata.keywords,
        category: 'office-spaces'
      });
      
    } catch (error) {
      console.log(`    ❌ Error processing ${filename}: ${error.message}`);
      errors.push(`${filename}: ${error.message}`);
    }
  });
  
  // Generate data file for office spaces
  const officeSpacesData = {
    category: 'office-spaces',
    name: 'Office Spaces',
    description: 'Professional office environments and workspace backgrounds for business video calls',
    count: processedImages.length,
    images: processedImages
  };
  
  // Save data file
  const dataFile = path.join(dataDir, 'office-spaces.json');
  fs.writeFileSync(dataFile, JSON.stringify(officeSpacesData, null, 2));
  
  console.log(`\n✅ Office Spaces processing complete!`);
  console.log(`📊 Successfully processed: ${processedImages.length} images`);
  console.log(`❌ Errors: ${errors.length}`);
  console.log(`💾 Data saved to: ${dataFile}`);
  
  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach(error => console.log(`   ${error}`));
  }
  
  console.log('\n🔄 Next steps:');
  console.log('1. Update your site configuration to include the "office-spaces" category');
  console.log('2. Add office-spaces to your navigation menu');
  console.log('3. Test the category page to ensure images load correctly');
  console.log('4. Upload the processed images to your hosting/CDN');
  
  return {
    processed: processedImages.length,
    errors: errors.length,
    data: officeSpacesData
  };
}

// Update category configuration helper
function generateCategoryUpdate() {
  console.log('\n📝 Add this to your category configuration:');
  console.log('==========================================');
  console.log(`
  'office-spaces': {
    name: 'Office Spaces',
    description: 'Professional office environments and workspace backgrounds for business video calls',
    image: 'minimalist-executive-office-1', // Use your first processed image name
    count: ${officeSpaceImages.length}
  }`);
}

// Run the processing
if (require.main === module) {
  console.log('🏢 Office Spaces Image Processor');
  console.log('================================\n');
  
  const result = processOfficeSpaces();
  generateCategoryUpdate();
}

module.exports = { processOfficeSpaces, generateOfficeMetadata };