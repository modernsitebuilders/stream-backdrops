// process-images.js - Updated for Batch 2
// Save this file in your stream-backdrops/nextjs-site/ folder
// Run with: node process-images.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// BATCH 2 FILES - Your actual filenames from original_pngs_batch_2
const currentFiles = [
  'u9972584128_Contemporary_executive_home_office_with_sleek_bla_21e661d4-8912-436f-8cf3-5851fc50af3b_0.png',
  'u9972584128_Contemporary_executive_home_office_with_sleek_bla_21e661d4-8912-436f-8cf3-5851fc50af3b_2.png',
  'u9972584128_Contemporary_executive_home_office_with_sleek_bla_468eda8d-a5a6-473e-be7b-dd6ac1e36048_0.png',
  'u9972584128_Contemporary_executive_home_office_with_sleek_bla_468eda8d-a5a6-473e-be7b-dd6ac1e36048_1.png',
  'u9972584128_Contemporary_executive_home_office_with_sleek_bla_468eda8d-a5a6-473e-be7b-dd6ac1e36048_2.png',
  'u9972584128_Contemporary_executive_home_office_with_sleek_bla_468eda8d-a5a6-473e-be7b-dd6ac1e36048_3.png',
  'u9972584128_Empty_minimalist_consultant_office_with_single_mo_00d5dfe1-350b-4c51-8478-973a98ab1112_1.png',
  'u9972584128_Empty_minimalist_high-end_executive_office_with_s_2cab17be-6b5d-4e4b-8470-c2253e75caec_0.png',
  'u9972584128_Empty_minimalist_high-end_executive_office_with_s_2cab17be-6b5d-4e4b-8470-c2253e75caec_2.png',
  'u9972584128_Empty_minimalist_Japandi_home_office_with_single__d7873ac8-b470-43fd-be47-35f50ffe9fad_1.png',
  'u9972584128_Empty_minimalist_medical_lobby_with_single_clean__5376d3c6-1140-461f-90f4-fc5241420e67_2.png',
  'u9972584128_Farmhouse_home_office_with_distressed_wood_desk_i_4eab93d2-ee24-44e6-b45e-7d9c5d242c93_0.png',
  'u9972584128_Farmhouse_home_office_with_distressed_wood_desk_i_4eab93d2-ee24-44e6-b45e-7d9c5d242c93_1.png',
  'u9972584128_Modern_biophilic_home_office_with_natural_wood_de_bf0614b7-242d-450f-9319-ef0e2f865061_2.png',
  'u9972584128_Modern_home_office_with_large_plants_positioned_i_4d9cf929-7e77-40a4-bafc-38511971de1f_2.png',
  'u9972584128_Modern_minimalist_home_office_with_clean_white_de_0facadbd-2bee-49e3-9118-0e5b76723fd7_1.png',
  'u9972584128_Modern_minimalist_home_office_with_clean_white_de_0facadbd-2bee-49e3-9118-0e5b76723fd7_3.png',
  'u9972584128_Modern_minimalist_home_office_with_clean_white_de_234f81b1-da93-474e-9651-83f57a3e4947_2.png',
  'u9972584128_Modern_minimalist_home_office_with_clean_white_de_234f81b1-da93-474e-9651-83f57a3e4947_3.png',
  'u9972584128_Photorealistic_home_office_with_wood_accent_wall__32c2ca0f-782a-461f-bded-72e2b505b001_0.png',
  'u9972584128_Photorealistic_home_office_with_wood_accent_wall__32c2ca0f-782a-461f-bded-72e2b505b001_1.png',
  'u9972584128_Photorealistic_home_office_with_wood_accent_wall__32c2ca0f-782a-461f-bded-72e2b505b001_2.png',
  'u9972584128_Professional_consultation_office_interior_photogr_2a8e15a0-46b4-486a-9caa-82efdbe2e6bd_0.png',
  'u9972584128_Professional_consultation_office_interior_photogr_2a8e15a0-46b4-486a-9caa-82efdbe2e6bd_1.png',
  'u9972584128_Professional_consultation_office_interior_photogr_2a8e15a0-46b4-486a-9caa-82efdbe2e6bd_2.png',
  'u9972584128_Professional_consultation_office_interior_photogr_2a8e15a0-46b4-486a-9caa-82efdbe2e6bd_3.png',
  'u9972584128_Professional_home_office_with_clean_white_desk_mi_72058675-4bd7-4c5c-ab21-8d451f6c157e_0.png',
  'u9972584128_Professional_home_office_with_clean_white_desk_mi_72058675-4bd7-4c5c-ab21-8d451f6c157e_3.png',
  'u9972584128_Professional_interior_photograph_of_cozy_home_off_91b2f24b-10e2-4384-81ca-e72ee7e25d1b_0.png',
  'u9972584128_Professional_interior_photograph_of_cozy_home_off_91b2f24b-10e2-4384-81ca-e72ee7e25d1b_2.png',
  'u9972584128_Professional_interior_photograph_of_cozy_home_off_91b2f24b-10e2-4384-81ca-e72ee7e25d1b_3.png',
  'u9972584128_Professional_office_interior_photograph_with_sing_5f03ac15-f293-483c-8324-418ea938c0fa_0.png',
  'u9972584128_Professional_office_interior_photograph_with_sing_5f03ac15-f293-483c-8324-418ea938c0fa_1.png',
  'u9972584128_Professional_office_interior_photograph_with_sing_5f03ac15-f293-483c-8324-418ea938c0fa_3.png',
  'u9972584128_Realistic_artistic_home_office_with_standing_desk_3fcf36c2-5860-4d52-9087-4ee981d2187b_3.png',
  'u9972584128_Realistic_contemporary_physicians_office_with_med_2d46d94e-aba1-4953-96f4-e8e45609311b_1.png',
  'u9972584128_Realistic_modern_engineering_office_with_technica_901b9fd7-fdca-47a7-a073-6c677d76291c_1.png',
  'u9972584128_Realistic_modern_engineering_office_with_technica_901b9fd7-fdca-47a7-a073-6c677d76291c_2.png',
  'u9972584128_Realistic_modern_engineering_office_with_technica_901b9fd7-fdca-47a7-a073-6c677d76291c_3.png',
  'u9972584128_Realistic_upscale_real_estate_office_with_propert_b1ab0ca7-a033-4707-9c10-5ef46695a6c9_2.png',
  'u9972584128_Realistic_warm_therapy_office_with_comfortable_se_fa0702ee-30fa-4c0c-8346-20d14d82a0e1_0.png',
  'u9972584128_Realistic_warm_therapy_office_with_comfortable_se_fa0702ee-30fa-4c0c-8346-20d14d82a0e1_2.png',
  'u9972584128_Real_corner_office_photograph_with_floor-to-ceili_b587704b-319b-44a0-a04f-8ba5deb88785_0.png',
  'u9972584128_Real_corner_office_photograph_with_floor-to-ceili_b587704b-319b-44a0-a04f-8ba5deb88785_2.png',
  'u9972584128_Real_corner_office_photograph_with_floor-to-ceili_b587704b-319b-44a0-a04f-8ba5deb88785_3.png',
  'u9972584128_Real_corporate_lobby_photograph_with_single_recep_fb0495e6-14ac-44f0-82ae-fbde4ce15a20_0.png',
  'u9972584128_Real_corporate_lobby_photograph_with_single_recep_fb0495e6-14ac-44f0-82ae-fbde4ce15a20_2.png',
  'u9972584128_Real_glass_lobby_photograph_with_single_modern_se_4e495534-470e-44e8-aab0-1789246a2f01_0.png',
  'u9972584128_Real_glass_lobby_photograph_with_single_modern_se_4e495534-470e-44e8-aab0-1789246a2f01_1.png',
  'u9972584128_Real_glass_lobby_photograph_with_single_modern_se_4e495534-470e-44e8-aab0-1789246a2f01_2.png',
  'u9972584128_Real_glass_lobby_photograph_with_single_modern_se_4e495534-470e-44e8-aab0-1789246a2f01_3.png',
  'u9972584128_Real_home_office_photograph_natural_lighting_wood_5a78f507-ec7d-4be6-8b26-50236304b5fa_0.png',
  'u9972584128_Real_home_office_photograph_natural_lighting_wood_5a78f507-ec7d-4be6-8b26-50236304b5fa_3.png',
  'u9972584128_Real_home_office_photograph_single_plant_position_c79ad3d7-e2ff-444b-8c7d-7c8d75be3234_0.png',
  'u9972584128_Real_home_office_photograph_single_plant_position_c79ad3d7-e2ff-444b-8c7d-7c8d75be3234_1.png',
  'u9972584128_Real_home_office_photograph_single_plant_position_c79ad3d7-e2ff-444b-8c7d-7c8d75be3234_3.png',
  'u9972584128_Real_home_office_photograph_with_light_wood_accen_697e2714-c527-42a6-8cf3-d1b3c53a275d_0.png',
  'u9972584128_Real_home_office_photograph_with_light_wood_accen_697e2714-c527-42a6-8cf3-d1b3c53a275d_1.png',
  'u9972584128_Real_home_office_photograph_with_light_wood_accen_697e2714-c527-42a6-8cf3-d1b3c53a275d_2.png',
  'u9972584128_Real_home_office_photograph_with_single_concrete__f2a938b1-8bbf-4f96-b9f3-5e01d0674dc8_1.png',
  'u9972584128_Real_home_office_photograph_with_single_warm_wood_f96d8880-fca0-4f04-a07d-32bce6ae09b3_2.png',
  'u9972584128_Real_modern_office_lobby_photograph_with_single_l_d42674b0-7298-460c-8db8-5a522fed35b1_0.png',
  'u9972584128_Real_modern_office_lobby_photograph_with_single_l_d42674b0-7298-460c-8db8-5a522fed35b1_1.png',
  'u9972584128_Real_modern_office_lobby_photograph_with_single_l_d42674b0-7298-460c-8db8-5a522fed35b1_2.png',
  'u9972584128_Real_modern_office_lobby_photograph_with_single_l_d42674b0-7298-460c-8db8-5a522fed35b1_3.png',
  'u9972584128_Real_office_photograph_with_marble_accent_wall_on_52aa4fce-0760-4034-b21d-1acd6c2938f6_0.png',
  'u9972584128_Real_office_photograph_with_marble_accent_wall_on_52aa4fce-0760-4034-b21d-1acd6c2938f6_1.png',
  'u9972584128_Real_office_photograph_with_marble_accent_wall_on_52aa4fce-0760-4034-b21d-1acd6c2938f6_2.png',
  'u9972584128_Real_office_photograph_with_marble_accent_wall_on_52aa4fce-0760-4034-b21d-1acd6c2938f6_3.png',
  'u9972584128_Real_office_photograph_with_single_dark_wood_acce_dd48ae64-c8ed-43bc-8c63-3370109d1ff4_0.png',
  'u9972584128_Real_office_photograph_with_single_dark_wood_acce_dd48ae64-c8ed-43bc-8c63-3370109d1ff4_1.png',
  'u9972584128_Real_office_photograph_with_single_dark_wood_acce_dd48ae64-c8ed-43bc-8c63-3370109d1ff4_3.png',
  'u9972584128_Real_private_office_photograph_with_single_booksh_7e83009f-67a9-4ba7-9765-234f83e5d87c_0.png',
  'u9972584128_Real_private_office_photograph_with_single_booksh_7e83009f-67a9-4ba7-9765-234f83e5d87c_1.png',
  'u9972584128_Real_private_office_photograph_with_single_booksh_7e83009f-67a9-4ba7-9765-234f83e5d87c_2.png',
  'u9972584128_Real_private_office_photograph_with_single_booksh_7e83009f-67a9-4ba7-9765-234f83e5d87c_3.png',
  'u9972584128_Real_world_Clean_Scandinavian_home_office_with_wh_f74a7d7a-9d64-41b2-bc7e-9c0f207bdcae_0.png',
  'u9972584128_Real_world_Clean_Scandinavian_home_office_with_wh_f74a7d7a-9d64-41b2-bc7e-9c0f207bdcae_2.png'
];

// Function to extract meaningful name from filename
function extractImageType(filename) {
  // Remove the prefix and UUID parts
  let name = filename.replace('u9972584128_', '');
  name = name.replace(/_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_\d+(\s\(\d+\))?\.png$/, '');
  
  // Convert underscores to spaces and clean up
  name = name.replace(/_/g, ' ');
  
  // Handle specific patterns from your batch 2 images
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

// Function to determine category from filename and content
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
  
  // Conference rooms (if any survived)
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

// Function to generate title and description
function generateMetadata(filename) {
  const type = extractImageType(filename);
  const category = categorizeImage(filename);
  
  // Create proper title (title case)
  const title = type.replace(/\b\w/g, l => l.toUpperCase());
  
  // Generate description based on category and content
  let description = '';
  let keywords = [];
  
  if (category === 'home-offices') {
    description = `Professional ${type.toLowerCase()} virtual background perfect for remote work and video calls`;
    keywords = ['home office', 'remote work', 'virtual background', 'professional', 'video calls'];
  } else if (category === 'executive-offices') {
    description = `Luxury ${type.toLowerCase()} virtual background for executive meetings and leadership calls`;
    keywords = ['executive office', 'luxury', 'leadership', 'professional', 'business'];
  } else if (category === 'lobbies') {
    description = `Professional ${type.toLowerCase()} virtual background for client meetings and business calls`;
    keywords = ['lobby', 'reception', 'professional', 'business', 'client meetings'];
  } else if (category === 'conference-rooms') {
    description = `${title} virtual background ideal for team meetings and professional presentations`;
    keywords = ['conference room', 'meeting room', 'team meetings', 'presentations', 'professional'];
  } else if (category === 'private-offices') {
    description = `Specialized ${type.toLowerCase()} virtual background for professional consultations and meetings`;
    keywords = ['private office', 'consultation', 'professional', 'specialized', 'meetings'];
  } else if (category === 'open-offices') {
    description = `Modern ${type.toLowerCase()} virtual background for collaborative work and team calls`;
    keywords = ['open office', 'collaborative', 'modern', 'teamwork', 'professional'];
  }
  
  // Extract specific keywords from the type
  const typeWords = type.toLowerCase().split(' ');
  keywords = [...keywords, ...typeWords].slice(0, 8);
  
  const alt = `${title} virtual background for professional video calls`;
  
  return { title, description, keywords, alt, category };
}

// Main processing function
function processImages() {
  // UPDATE THESE PATHS FOR YOUR SETUP:
  const sourceDir = path.join(__dirname, '..', 'original_pngs_batch_2'); // Source folder
  const targetDir = path.join(__dirname, 'public', 'images'); // Target folder
  
  // Load existing metadata to avoid overwrites
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
  
  console.log('🚀 Starting Batch 2 image processing...\n');
  console.log(`📁 Source: ${sourceDir}`);
  console.log(`📁 Target: ${targetDir}\n`);
  
  // Group files by type to avoid duplicates
  const groupedFiles = {};
  currentFiles.forEach(filename => {
    const type = extractImageType(filename);
    if (!groupedFiles[type]) {
      groupedFiles[type] = [];
    }
    groupedFiles[type].push(filename);
  });
  
  // Process each group
  Object.entries(groupedFiles).forEach(([type, files]) => {
    files.forEach((oldFilename, index) => {
      const newFilename = createSEOFilename(oldFilename, index);
      const oldPath = path.join(sourceDir, oldFilename);
      const webpPath = path.join(targetDir, newFilename);
      
      if (fs.existsSync(oldPath)) {
        try {
          // Convert PNG to lossless WebP using ImageMagick
          console.log(`📸 Converting: ${oldFilename} → ${newFilename}`);
          execSync(`magick "${oldPath}" -define webp:lossless=true "${webpPath}"`, { stdio: 'inherit' });
          
          // Generate metadata
          const meta = generateMetadata(oldFilename);
          const key = newFilename.replace('.webp', '');
          
          metadata[key] = {
            filename: newFilename,
            title: meta.title,
            description: meta.description,
            category: meta.category,
            keywords: meta.keywords,
            alt: meta.alt
          };
          
          processedCount++;
          console.log(`✅ Processed: ${meta.title}`);
          
        } catch (error) {
          console.error(`❌ Error processing ${oldFilename}:`, error.message);
        }
      } else {
        console.log(`⚠️  File not found: ${oldFilename}`);
        console.log(`     Looking in: ${oldPath}`);
      }
    });
  });
  
  // Write updated metadata JSON
  const dataDir = path.dirname(metadataPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log(`\n🎉 Batch 2 processing complete!`);
  console.log(`📊 Processed ${processedCount} new images`);
  console.log(`📁 Total images in metadata: ${Object.keys(metadata).length}`);
  console.log(`📁 Metadata saved to: ${metadataPath}`);
  
  // Count by category
  const categoryCounts = {};
  Object.values(metadata).forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  
  console.log(`\n📋 Updated summary by category:`);
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} images`);
  });
}

// Check if ImageMagick is installed
try {
  execSync('magick -version', { stdio: 'ignore' });
  processImages();
} catch (error) {
  console.error('❌ ImageMagick not found!');
  console.log('📥 Please install ImageMagick first:');
  console.log('   Windows: https://imagemagick.org/script/download.php#windows');
  console.log('   Mac: brew install imagemagick');
  console.log('   Linux: sudo apt-get install imagemagick');
  process.exit(1);
}