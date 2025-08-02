// process-images.js
// Save this file in your stream-backdrops/nextjs-site/ folder
// Run with: node process-images.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Your actual filenames from the paste
const currentFiles = [
  'u9972584128_Architect_private_studio_with_drafting_table_to_r_b926b6a8-9dfe-45ad-b31f-6ccbbfe89c7a_1.png',
  'u9972584128_Architect_private_studio_with_drafting_table_to_r_b926b6a8-9dfe-45ad-b31f-6ccbbfe89c7a_2.png',
  'u9972584128_Architect_private_studio_with_drafting_table_to_r_b926b6a8-9dfe-45ad-b31f-6ccbbfe89c7a_3.png',
  'u9972584128_Consulting_firm_open_workspace_with_strategy_desk_e21b3d9f-8dc2-4b8e-9444-3f86bcff40d6_0.png',
  'u9972584128_Consulting_firm_open_workspace_with_strategy_desk_e21b3d9f-8dc2-4b8e-9444-3f86bcff40d6_1.png',
  'u9972584128_Consulting_firm_open_workspace_with_strategy_desk_e21b3d9f-8dc2-4b8e-9444-3f86bcff40d6_2.png',
  'u9972584128_Consulting_firm_open_workspace_with_strategy_desk_e21b3d9f-8dc2-4b8e-9444-3f86bcff40d6_3.png',
  'u9972584128_Contemporary_glass_home_office_with_transparent_d_0e35ece5-5714-4720-96d5-b5647f427302_0.png',
  'u9972584128_Contemporary_glass_home_office_with_transparent_d_0e35ece5-5714-4720-96d5-b5647f427302_1.png',
  'u9972584128_Contemporary_glass_home_office_with_transparent_d_0e35ece5-5714-4720-96d5-b5647f427302_2.png',
  'u9972584128_Contemporary_glass_home_office_with_transparent_d_0e35ece5-5714-4720-96d5-b5647f427302_3.png',
  'u9972584128_Corporate_executive_office_with_large_wooden_desk_9b4f972a-70d9-41ed-bc50-c7efadcc0627_1.png',
  'u9972584128_Corporate_executive_office_with_large_wooden_desk_9b4f972a-70d9-41ed-bc50-c7efadcc0627_2.png',
  'u9972584128_Corporate_executive_office_with_large_wooden_desk_9b4f972a-70d9-41ed-bc50-c7efadcc0627_3.png',
  'u9972584128_Creative_executive_office_with_artistic_desk_posi_2f40169c-d7f9-412f-ba40-7b1ba4a64526_0.png',
  'u9972584128_Creative_executive_office_with_artistic_desk_posi_2f40169c-d7f9-412f-ba40-7b1ba4a64526_1.png',
  'u9972584128_Creative_executive_office_with_artistic_desk_posi_2f40169c-d7f9-412f-ba40-7b1ba4a64526_3.png',
  'u9972584128_Financial_firm_conference_room_with_polished_tabl_9a2f72bc-9075-4487-89d9-9ee9698173d6_1.png',
  'u9972584128_Financial_firm_conference_room_with_polished_tabl_9a2f72bc-9075-4487-89d9-9ee9698173d6_2.png',
  'u9972584128_Hotel_conference_room_with_elegant_table_in_lower_dcd0a6d3-8731-4494-8dec-52a745bacc91_0.png',
  'u9972584128_Hotel_conference_room_with_elegant_table_in_lower_dcd0a6d3-8731-4494-8dec-52a745bacc91_1.png',
  'u9972584128_Hotel_conference_room_with_elegant_table_in_lower_dcd0a6d3-8731-4494-8dec-52a745bacc91_2.png',
  'u9972584128_Hotel_conference_room_with_elegant_table_in_lower_dcd0a6d3-8731-4494-8dec-52a745bacc91_3.png',
  'u9972584128_Industrial_loft_home_office_with_exposed_brick_wa_353f390c-3b3d-479a-b977-1dd9ae436e66_0.png',
  'u9972584128_Industrial_loft_home_office_with_exposed_brick_wa_353f390c-3b3d-479a-b977-1dd9ae436e66_1.png',
  'u9972584128_Industrial_loft_home_office_with_exposed_brick_wa_353f390c-3b3d-479a-b977-1dd9ae436e66_2.png',
  'u9972584128_Industrial_loft_home_office_with_exposed_brick_wa_353f390c-3b3d-479a-b977-1dd9ae436e66_3.png',
  'u9972584128_International_executive_office_with_global_desk_t_0be7d783-fee0-4fc2-8713-02aa4c310952_0.png',
  'u9972584128_International_executive_office_with_global_desk_t_0be7d783-fee0-4fc2-8713-02aa4c310952_1.png',
  'u9972584128_International_executive_office_with_global_desk_t_0be7d783-fee0-4fc2-8713-02aa4c310952_2.png',
  'u9972584128_International_executive_office_with_global_desk_t_0be7d783-fee0-4fc2-8713-02aa4c310952_3.png',
  'u9972584128_Law_firm_lobby_with_traditional_reception_to_righ_7cc6d22e-dd11-4360-90b0-3e6c891c4bb5_0.png',
  'u9972584128_Law_firm_lobby_with_traditional_reception_to_righ_7cc6d22e-dd11-4360-90b0-3e6c891c4bb5_1.png',
  'u9972584128_Law_firm_lobby_with_traditional_reception_to_righ_7cc6d22e-dd11-4360-90b0-3e6c891c4bb5_2.png',
  'u9972584128_Law_firm_lobby_with_traditional_reception_to_righ_7cc6d22e-dd11-4360-90b0-3e6c891c4bb5_3.png',
  'u9972584128_Legal_counsel_private_office_with_consultation_de_be9a3512-8553-4f0e-a72b-168a56e6b2f7_0.png',
  'u9972584128_Legal_counsel_private_office_with_consultation_de_be9a3512-8553-4f0e-a72b-168a56e6b2f7_1.png',
  'u9972584128_Legal_counsel_private_office_with_consultation_de_be9a3512-8553-4f0e-a72b-168a56e6b2f7_3.png',
  'u9972584128_Luxury_CEO_corner_office_with_panoramic_city_view_91602419-8e77-42c8-b1e4-4b9d0ebac8e8_0.png',
  'u9972584128_Luxury_CEO_corner_office_with_panoramic_city_view_91602419-8e77-42c8-b1e4-4b9d0ebac8e8_1.png',
  'u9972584128_Luxury_CEO_corner_office_with_panoramic_city_view_91602419-8e77-42c8-b1e4-4b9d0ebac8e8_2.png',
  'u9972584128_Luxury_CEO_corner_office_with_panoramic_city_view_91602419-8e77-42c8-b1e4-4b9d0ebac8e8_3.png',
  'u9972584128_Media_company_open_workspace_with_editing_station_d24690f8-0915-49a7-99ee-db7406c22f97_0.png',
  'u9972584128_Media_company_open_workspace_with_editing_station_d24690f8-0915-49a7-99ee-db7406c22f97_1.png',
  'u9972584128_Media_company_open_workspace_with_editing_station_d24690f8-0915-49a7-99ee-db7406c22f97_2.png',
  'u9972584128_Media_company_open_workspace_with_editing_station_d24690f8-0915-49a7-99ee-db7406c22f97_3.png',
  'u9972584128_Medical_executive_office_with_professional_desk_t_e7cf8287-e1a3-476a-a7f5-f1ec58af718a_0.png',
  'u9972584128_Medical_executive_office_with_professional_desk_t_e7cf8287-e1a3-476a-a7f5-f1ec58af718a_1.png',
  'u9972584128_Medical_executive_office_with_professional_desk_t_e7cf8287-e1a3-476a-a7f5-f1ec58af718a_2.png',
  'u9972584128_Medical_executive_office_with_professional_desk_t_e7cf8287-e1a3-476a-a7f5-f1ec58af718a_3.png',
  'u9972584128_Mediterranean_villa_home_office_with_terracotta_t_7b1b1d04-b473-4d0d-b23c-e036ba952a3d_0.png',
  'u9972584128_Mediterranean_villa_home_office_with_terracotta_t_7b1b1d04-b473-4d0d-b23c-e036ba952a3d_1.png',
  'u9972584128_Mediterranean_villa_home_office_with_terracotta_t_7b1b1d04-b473-4d0d-b23c-e036ba952a3d_2.png',
  'u9972584128_Mediterranean_villa_home_office_with_terracotta_t_7b1b1d04-b473-4d0d-b23c-e036ba952a3d_3.png',
  'u9972584128_Mid-century_modern_home_office_with_teak_wood_des_8c7b0ebe-9251-4435-9b17-7d5bbe0891ab_1.png',
  'u9972584128_Mid-century_modern_home_office_with_teak_wood_des_8c7b0ebe-9251-4435-9b17-7d5bbe0891ab_2.png',
  'u9972584128_Mid-century_modern_home_office_with_teak_wood_des_8c7b0ebe-9251-4435-9b17-7d5bbe0891ab_3.png',
  'u9972584128_Mid-century_modern_home_office_with_teak_wood_des_9a34b44c-adf9-4441-8d06-d61730e12669_0.png',
  'u9972584128_Minimalist_conference_room_with_white_rectangular_3930e75c-d433-4f5c-8927-41c6d8b0ceb2_1.png',
  'u9972584128_Minimalist_conference_room_with_white_rectangular_3930e75c-d433-4f5c-8927-41c6d8b0ceb2_3.png',
  'u9972584128_Modern_glass_conference_room_with_large_oval_tabl_3596e74c-a523-49ed-8634-2fe8cd1ec1f0_0.png',
  'u9972584128_Modern_glass_conference_room_with_large_oval_tabl_3596e74c-a523-49ed-8634-2fe8cd1ec1f0_1.png',
  'u9972584128_Modern_glass_conference_room_with_large_oval_tabl_3596e74c-a523-49ed-8634-2fe8cd1ec1f0_2.png',
  'u9972584128_Modern_glass_conference_room_with_large_oval_tabl_3596e74c-a523-49ed-8634-2fe8cd1ec1f0_3.png',
  'u9972584128_Modern_open_office_workspace_with_desks_positione_ea35bd79-5fca-48d8-b26b-7df437bd70e6_0.png',
  'u9972584128_Modern_open_office_workspace_with_desks_positione_ea35bd79-5fca-48d8-b26b-7df437bd70e6_1.png',
  'u9972584128_Modern_open_office_workspace_with_desks_positione_ea35bd79-5fca-48d8-b26b-7df437bd70e6_2.png',
  'u9972584128_Modern_open_office_workspace_with_desks_positione_ea35bd79-5fca-48d8-b26b-7df437bd70e6_3.png',
  'u9972584128_Scandinavian_minimalist_home_office_with_white_oa_7f1cebf1-f20f-4544-8731-546a74e5f72f_0.png',
  'u9972584128_Scandinavian_minimalist_home_office_with_white_oa_7f1cebf1-f20f-4544-8731-546a74e5f72f_1.png',
  'u9972584128_Scandinavian_minimalist_home_office_with_white_oa_7f1cebf1-f20f-4544-8731-546a74e5f72f_2.png',
  'u9972584128_Scandinavian_minimalist_home_office_with_white_oa_7f1cebf1-f20f-4544-8731-546a74e5f72f_3.png',
  'u9972584128_Software_development_open_workspace_with_coding_s_12eed624-fd6e-4532-ae2a-992f2645e13d_0.png',
  'u9972584128_Software_development_open_workspace_with_coding_s_12eed624-fd6e-4532-ae2a-992f2645e13d_1.png',
  'u9972584128_Software_development_open_workspace_with_coding_s_12eed624-fd6e-4532-ae2a-992f2645e13d_2.png',
  'u9972584128_Software_development_open_workspace_with_coding_s_12eed624-fd6e-4532-ae2a-992f2645e13d_3.png',
  'u9972584128_Startup_incubator_lobby_with_innovation_desk_to_s_84c1fb42-3b2e-4d1e-b5e8-ce20337f2066_0.png',
  'u9972584128_Startup_incubator_lobby_with_innovation_desk_to_s_84c1fb42-3b2e-4d1e-b5e8-ce20337f2066_1.png',
  'u9972584128_Startup_incubator_lobby_with_innovation_desk_to_s_84c1fb42-3b2e-4d1e-b5e8-ce20337f2066_2.png',
  'u9972584128_Startup_incubator_lobby_with_innovation_desk_to_s_84c1fb42-3b2e-4d1e-b5e8-ce20337f2066_3.png',
  'u9972584128_Tech_startup_conference_room_with_collaborative_t_e4455d89-c69b-495c-a16d-1204302a70e5_0.png',
  'u9972584128_Tech_startup_conference_room_with_collaborative_t_e4455d89-c69b-495c-a16d-1204302a70e5_1.png',
  'u9972584128_Tech_startup_conference_room_with_collaborative_t_e4455d89-c69b-495c-a16d-1204302a70e5_2.png',
  'u9972584128_Tech_startup_conference_room_with_collaborative_t_e4455d89-c69b-495c-a16d-1204302a70e5_3.png',
  'u9972584128_Therapist_private_office_with_consultation_desk_p_5e90b0c8-9600-4022-8491-e457739a2212_0 (1).png',
  'u9972584128_Therapist_private_office_with_consultation_desk_p_5e90b0c8-9600-4022-8491-e457739a2212_0.png',
  'u9972584128_Therapist_private_office_with_consultation_desk_p_5e90b0c8-9600-4022-8491-e457739a2212_1 (1).png',
  'u9972584128_Therapist_private_office_with_consultation_desk_p_5e90b0c8-9600-4022-8491-e457739a2212_1.png',
  'u9972584128_Therapist_private_office_with_consultation_desk_p_5e90b0c8-9600-4022-8491-e457739a2212_2 (1).png',
  'u9972584128_Therapist_private_office_with_consultation_desk_p_5e90b0c8-9600-4022-8491-e457739a2212_2.png',
  'u9972584128_Therapist_private_office_with_consultation_desk_p_5e90b0c8-9600-4022-8491-e457739a2212_3 (1).png',
  'u9972584128_Therapist_private_office_with_consultation_desk_p_5e90b0c8-9600-4022-8491-e457739a2212_3.png',
  'u9972584128_Traditional_library_home_office_with_dark_wood_pa_24f03229-877c-4bf4-94c5-1dc58d543318_0.png',
  'u9972584128_Traditional_library_home_office_with_dark_wood_pa_24f03229-877c-4bf4-94c5-1dc58d543318_1.png',
  'u9972584128_Traditional_library_home_office_with_dark_wood_pa_24f03229-877c-4bf4-94c5-1dc58d543318_2.png',
  'u9972584128_Traditional_library_home_office_with_dark_wood_pa_24f03229-877c-4bf4-94c5-1dc58d543318_3.png',
  'u9972584128_University_lobby_with_information_desk_to_left_si_9a98d19d-5d5a-4700-b187-6747848cdf40_0.png',
  'u9972584128_University_lobby_with_information_desk_to_left_si_9a98d19d-5d5a-4700-b187-6747848cdf40_1.png',
  'u9972584128_University_lobby_with_information_desk_to_left_si_9a98d19d-5d5a-4700-b187-6747848cdf40_2.png',
  'u9972584128_University_lobby_with_information_desk_to_left_si_9a98d19d-5d5a-4700-b187-6747848cdf40_3.png',
  'u9972584128_Wellness_practitioner_private_office_with_treatme_f8c0d774-6887-4df9-8d96-53fbba74b45a_0.png',
  'u9972584128_Wellness_practitioner_private_office_with_treatme_f8c0d774-6887-4df9-8d96-53fbba74b45a_1.png',
  'u9972584128_Wellness_practitioner_private_office_with_treatme_f8c0d774-6887-4df9-8d96-53fbba74b45a_2.png',
  'u9972584128_Wellness_practitioner_private_office_with_treatme_f8c0d774-6887-4df9-8d96-53fbba74b45a_3.png'
];

// Function to extract meaningful name from filename
function extractImageType(filename) {
  // Remove the prefix and UUID parts
  let name = filename.replace('u9972584128_', '');
  name = name.replace(/_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_\d+(\s\(\d+\))?\.png$/, '');
  
  // Convert underscores to spaces and clean up
  name = name.replace(/_/g, ' ');
  
  // Truncate if too long (Midjourney cuts off descriptions)
  if (name.includes(' with ')) {
    name = name.split(' with ')[0];
  }
  
  return name;
}

// Function to determine category from filename
function categorizeImage(filename) {
  const name = filename.toLowerCase();
  
  if (name.includes('home_office')) return 'home-offices';
  if (name.includes('conference_room') || name.includes('meeting_room')) return 'conference-rooms';
  if (name.includes('executive_office')) return 'executive-offices';
  if (name.includes('lobby')) return 'lobbies';
  if (name.includes('open_workspace') || name.includes('open_office')) return 'open-offices';
  if (name.includes('private_office') || name.includes('private_studio')) return 'private-offices';
  
  // Fallback
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
  
  // Generate description based on category
  let description = '';
  let keywords = [];
  
  if (category === 'home-offices') {
    description = `Professional ${type.toLowerCase()} virtual background perfect for remote work and video calls`;
    keywords = ['home office', 'remote work', 'virtual background', 'professional', 'video calls'];
  } else if (category === 'conference-rooms') {
    description = `${title} virtual background ideal for team meetings and professional presentations`;
    keywords = ['conference room', 'meeting room', 'team meetings', 'presentations', 'professional'];
  } else if (category === 'executive-offices') {
    description = `Luxury ${type.toLowerCase()} virtual background for executive meetings and leadership calls`;
    keywords = ['executive office', 'luxury', 'leadership', 'professional', 'business'];
  } else if (category === 'lobbies') {
    description = `Professional ${type.toLowerCase()} virtual background for client meetings and business calls`;
    keywords = ['lobby', 'reception', 'professional', 'business', 'client meetings'];
  } else if (category === 'open-offices') {
    description = `Modern ${type.toLowerCase()} virtual background for collaborative work and team calls`;
    keywords = ['open office', 'collaborative', 'modern', 'teamwork', 'professional'];
  } else if (category === 'private-offices') {
    description = `Specialized ${type.toLowerCase()} virtual background for professional consultations and meetings`;
    keywords = ['private office', 'consultation', 'professional', 'specialized', 'meetings'];
  }
  
  // Extract specific keywords from the type
  const typeWords = type.toLowerCase().split(' ');
  keywords = [...keywords, ...typeWords].slice(0, 8);
  
  const alt = `${title} virtual background for professional video calls`;
  
  return { title, description, keywords, alt, category };
}

// Main processing function
function processImages() {
  const imagesDir = path.join(__dirname, 'public', 'images');
  const metadata = {};
  let processedCount = 0;
  
  console.log('🚀 Starting image processing...\n');
  
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
      const oldPath = path.join(imagesDir, oldFilename);
      const webpPath = path.join(imagesDir, newFilename);
      
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
      }
    });
  });
  
  // Write metadata JSON
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  // Ensure data directory exists
  const dataDir = path.dirname(metadataPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log(`\n🎉 Processing complete!`);
  console.log(`📊 Processed ${processedCount} images`);
  console.log(`📁 Metadata saved to: ${metadataPath}`);
  console.log(`\n📋 Summary by category:`);
  
  // Count by category
  const categoryCounts = {};
  Object.values(metadata).forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} images`);
  });
  
  console.log(`\n🧹 Next steps:`);
  console.log(`1. Remove original PNG files if conversion looks good`);
  console.log(`2. Test your site: npm run dev`);
  console.log(`3. Check images load at: http://localhost:3000/images/[filename]`);
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