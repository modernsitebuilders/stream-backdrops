// process-office-spaces.js
// Process your 15 office space images and add them as a third category
// Save this file in your stream-backdrops/nextjs-site/ folder
// Run with: node process-office-spaces.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// CASUAL BACKGROUND IMAGES - Your actual 7 files from zoom-images folder
const officeSpaceImages = [
  'u9972584128_Minimalist_basement_office_wall_with_simple_shelv_c7c866d7-68d8-4ab1-b295-499ff38ca653_1.png',
  'u9972584128_Minimalist_kitchen_workspace_wall_with_open_shelv_e98908f2-e6e0-4347-a51d-d960a0b365ca_3.png',
  'u9972584128_Minimalist_spare_room_office_wall_with_basic_shel_162ad3d9-b905-40ab-976a-62eb112dec33_0.png',
  'u9972584128_Minimalist_student_bedroom_wall_with_simple_wood__211b40d0-57ca-4d59-b208-b11c099824c7_1.png',
  'u9972584128_Minimalist_student_bedroom_wall_with_simple_wood__211b40d0-57ca-4d59-b208-b11c099824c7_2.png',
  'u9972584128_Photorealistic_minimalist_cozy_home_office_wall_w_63489c2f-3223-4635-921b-3f6f7581a6fa_3.png',
  'u9972584128_Photorealistic_minimalist_garden_shed_wall_with_w_ffffdf96-986b-4913-a838-f2e0ab7ac84c_2.png'
];

// Manual mapping for better, descriptive names
function extractImageType(filename) {
  // Create a mapping of exact filenames to descriptive names
  const filenameMap = {
    'u9972584128_Minimalist_basement_office_wall_with_simple_shelv_c7c866d7-68d8-4ab1-b295-499ff38ca653_1.png': 'Casual Basement Office',
    
    'u9972584128_Minimalist_kitchen_workspace_wall_with_open_shelv_e98908f2-e6e0-4347-a51d-d960a0b365ca_3.png': 'Kitchen Workspace',
    
    'u9972584128_Minimalist_spare_room_office_wall_with_basic_shel_162ad3d9-b905-40ab-976a-62eb112dec33_0.png': 'Spare Room Office',
    
    'u9972584128_Minimalist_student_bedroom_wall_with_simple_wood__211b40d0-57ca-4d59-b208-b11c099824c7_1.png': 'Student Bedroom Office',
    'u9972584128_Minimalist_student_bedroom_wall_with_simple_wood__211b40d0-57ca-4d59-b208-b11c099824c7_2.png': 'Cozy Student Workspace',
    
    'u9972584128_Photorealistic_minimalist_cozy_home_office_wall_w_63489c2f-3223-4635-921b-3f6f7581a6fa_3.png': 'Cozy Home Office',
    
    'u9972584128_Photorealistic_minimalist_garden_shed_wall_with_w_ffffdf96-986b-4913-a838-f2e0ab7ac84c_2.png': 'Garden Shed Office'
  };
  
  // Return the mapped name or a fallback
  return filenameMap[filename] || 'Casual Home Office';
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
  return `casual-${cleanName}-${index + 1}.webp`;
}

// Function to generate metadata for casual backgrounds
function generateOfficeMetadata(filename) {
  const type = extractImageType(filename);
  
  const title = type;
  const description = `Casual ${type.toLowerCase()} virtual background perfect for relaxed video calls and remote work`;
  const keywords = ['casual office', 'virtual background', 'home office', 'remote work', 'video call', 'relaxed workspace', 'informal meeting'];
  
  return { title, description, keywords };
}

// Main processing function
function processOfficeSpaces() {
  console.log('🏠 Processing Casual Backgrounds category...\n');
  
  // Check if source directory exists
  const sourceDir = path.join(__dirname, '..', 'zoom-images');
  if (!fs.existsSync(sourceDir)) {
    console.log('❌ Source directory not found!');
    console.log(`Expected: ${sourceDir}`);
    return;
  }
  
  // Create output directories
  const outputDir = path.join(__dirname, 'public', 'images');
  const dataDir = path.join(__dirname, 'data');
  
  // Create directories if they don't exist
  [outputDir, dataDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
  
  console.log(`📊 Processing ${officeSpaceImages.length} casual background images...\n`);
  
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
        category: 'casual-backgrounds'
      });
      
    } catch (error) {
      console.log(`    ❌ Error processing ${filename}: ${error.message}`);
      errors.push(`${filename}: ${error.message}`);
    }
  });
  
  // Generate data file for casual backgrounds
  const officeSpacesData = {
    category: 'casual-backgrounds',
    name: 'Casual Backgrounds',
    description: 'Relaxed and approachable home office backgrounds for comfortable video calls',
    count: processedImages.length,
    images: processedImages
  };
  
  // Save data file
  const dataFile = path.join(dataDir, 'casual-backgrounds.json');
  fs.writeFileSync(dataFile, JSON.stringify(officeSpacesData, null, 2));
  
  console.log(`\n✅ Casual Backgrounds processing complete!`);
  console.log(`📊 Successfully processed: ${processedImages.length} images`);
  console.log(`❌ Errors: ${errors.length}`);
  console.log(`💾 Data saved to: ${dataFile}`);
  
  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach(error => console.log(`   ${error}`));
  }
  
  console.log('\n🔄 Next steps:');
  console.log('1. Update your homepage to include casual-backgrounds category');
  console.log('2. Create pages/category/casual-backgrounds.js page');
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
  console.log('\n📝 Add this to your homepage categories:');
  console.log('==========================================');
  console.log(`
          {/* Casual Backgrounds - NEW THIRD CATEGORY */}
          <Link href="/category/casual-backgrounds" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                height: '200px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img
                  src="/images/casual-cozy-home-office-6.webp"
                  alt="Casual home office background"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  loading="eager"
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.75rem'
                }}>
                  Casual Backgrounds
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.95rem',
                  lineHeight: '1.5'
                }}>
                  Relaxed and approachable home office backgrounds for comfortable video calls
                </p>
              </div>
            </div>
          </Link>`);
}

// Run the processing
if (require.main === module) {
  console.log('🏠 Casual Backgrounds Image Processor');
  console.log('====================================\n');
  
  const result = processOfficeSpaces();
  generateCategoryUpdate();
}

module.exports = { processOfficeSpaces, generateOfficeMetadata };