// process-curated-collection.js - Process your new curated collection
// Save this file in your stream-backdrops/nextjs-site/ folder
// Run with: node process-curated-collection.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// YOUR CURATED COLLECTION - Update these with your actual filenames from the curation session
// These are examples based on your curation - replace with your actual selected filenames

// YOUR ACTUAL CURATED COLLECTION - 90 carefully selected images
const curatedImages = [
  // Professional Shelves (42 images)
  'u9972584128_Minimalist_Scandinavian_wall_with_simple_floating_92f38129-e044-4915-a43e-63699519a42b_1.png',
  'u9972584128_Minimalist_Scandinavian_wall_with_simple_floating_92f38129-e044-4915-a43e-63699519a42b_3.png',
  'u9972584128_Minimalist_classic_office_wall_with_limestone_flo_81248775-e525-42e5-b883-4af2d87e4b26_0.png',
  'u9972584128_Minimalist_classic_office_wall_with_limestone_flo_81248775-e525-42e5-b883-4af2d87e4b26_1.png',
  'u9972584128_Minimalist_contemporary_office_wall_with_gunmetal_e7edf25c-d039-4c7b-a9e4-4900aeb61812_2.png',
  'u9972584128_Minimalist_culinary_wall_with_floating_shelves_a__d1f286ab-9a48-4888-8c14-d1ff7ddf2480_2.png',
  'u9972584128_Minimalist_culinary_wall_with_floating_shelves_a__d1f286ab-9a48-4888-8c14-d1ff7ddf2480_3.png',
  'u9972584128_Minimalist_executive_office_wall_with_stone_and_m_7a824727-b9bd-4bfd-a882-1019778e5ebf_0.png',
  'u9972584128_Minimalist_executive_office_wall_with_stone_and_m_7a824727-b9bd-4bfd-a882-1019778e5ebf_1.png',
  'u9972584128_Minimalist_executive_office_wall_with_stone_and_m_7a824727-b9bd-4bfd-a882-1019778e5ebf_2.png',
  'u9972584128_Minimalist_executive_office_wall_with_stone_and_m_7a824727-b9bd-4bfd-a882-1019778e5ebf_3.png',
  'u9972584128_Minimalist_gallery_wall_with_floating_wood_shelf__fe1fd818-3731-4dd1-9fa6-2b5a90834cd3_2.png',
  'u9972584128_Minimalist_gallery_wall_with_floating_wood_shelf__fe1fd818-3731-4dd1-9fa6-2b5a90834cd3_3.png',
  'u9972584128_Minimalist_home_bar_wall_with_floating_glass_shel_eb30794c-afdc-4599-8ded-c2048e55f1d4_0.png',
  'u9972584128_Minimalist_home_bar_wall_with_floating_glass_shel_eb30794c-afdc-4599-8ded-c2048e55f1d4_2.png',
  'u9972584128_Minimalist_home_office_wall_with_elegant_glass_cu_c448fa9d-2c22-41f7-aa7c-e087e895cb0e_0.png',
  'u9972584128_Minimalist_home_office_wall_with_elegant_glass_cu_c448fa9d-2c22-41f7-aa7c-e087e895cb0e_1.png',
  'u9972584128_Minimalist_indoor_garden_wall_with_floating_plant_29f17a8c-6773-4731-bbde-d74a4812e561_1.png',
  'u9972584128_Minimalist_indoor_garden_wall_with_floating_plant_5a076c22-4c97-4ae5-bce1-dc435ca6dd59_1.png',
  'u9972584128_Minimalist_indoor_garden_wall_with_floating_plant_5a076c22-4c97-4ae5-bce1-dc435ca6dd59_2.png',
  'u9972584128_Minimalist_industrial_home_office_wall_with_dark__bfbde256-d3eb-4fcf-9241-0b0d2bb9af48_0.png',
  'u9972584128_Minimalist_industrial_home_office_wall_with_dark__bfbde256-d3eb-4fcf-9241-0b0d2bb9af48_3.png',
  'u9972584128_Minimalist_industrial_office_wall_with_concrete_a_9e7df7d4-12f5-45c3-8ea2-e03c59e32441_0.png',
  'u9972584128_Minimalist_industrial_office_wall_with_concrete_a_9e7df7d4-12f5-45c3-8ea2-e03c59e32441_2.png',
  'u9972584128_Minimalist_industrial_office_wall_with_concrete_a_9e7df7d4-12f5-45c3-8ea2-e03c59e32441_3.png',
  'u9972584128_Minimalist_industrial_office_wall_with_concrete_f_5e4a8d4b-a059-46fc-898f-2322b956a82d_0.png',
  'u9972584128_Minimalist_industrial_office_wall_with_matte_blac_260c1c26-0274-4aff-b0bc-3bf393d393d9_1.png',
  'u9972584128_Minimalist_industrial_office_wall_with_matte_blac_260c1c26-0274-4aff-b0bc-3bf393d393d9_2.png',
  'u9972584128_Minimalist_kitchen_coffee_bar_wall_with_floating__2aff0ec7-da71-43da-965f-8a72bb00c65f_0.png',
  'u9972584128_Minimalist_kitchen_coffee_bar_wall_with_floating__2aff0ec7-da71-43da-965f-8a72bb00c65f_1.png',
  'u9972584128_Minimalist_kitchen_coffee_bar_wall_with_floating__2aff0ec7-da71-43da-965f-8a72bb00c65f_3.png',
  'u9972584128_Minimalist_laboratory_wall_with_floating_shelves__721c16b0-0315-49fa-ba15-312dd22c892b_1.png',
  'u9972584128_Minimalist_modern_office_wall_with_glass_and_wood_51b910c5-1195-4b9c-ae1a-0eb5d643af2e_0.png',
  'u9972584128_Minimalist_modern_office_wall_with_glass_and_wood_51b910c5-1195-4b9c-ae1a-0eb5d643af2e_1.png',
  'u9972584128_Minimalist_study_wall_with_floating_shelves_a_few_e10b6a74-8162-4772-b2f7-04d724b94618_0.png',
  'u9972584128_Minimalist_study_wall_with_floating_shelves_a_few_e10b6a74-8162-4772-b2f7-04d724b94618_3.png',
  'u9972584128_Minimalist_sunroom_wall_with_floating_shelves_a_f_dc764dfb-2ac8-407e-96de-9aab6be72d68_0.png',
  'u9972584128_Minimalist_sunroom_wall_with_floating_shelves_a_f_dc764dfb-2ac8-407e-96de-9aab6be72d68_3.png',
  'u9972584128_Minimalist_tech_office_wall_with_metal_and_glass__c7ca8ae2-21ec-4e0f-9b92-0ee5a71b7b04_1.png',
  'u9972584128_Minimalist_tech_office_wall_with_metal_and_glass__c7ca8ae2-21ec-4e0f-9b92-0ee5a71b7b04_3.png',
  'u9972584128_Minimalist_vintage_study_wall_with_floating_antiq_566398eb-82ec-47ad-9b0b-dd5f48c465e7_0.png',
  'u9972584128_Minimalist_vintage_study_wall_with_floating_antiq_566398eb-82ec-47ad-9b0b-dd5f48c465e7_1.png',

  // Home & Lifestyle (48 images)
  'u9972584128_Minimalist_Japandi_home_office_wall_with_simple_w_9eae218e-7ef4-4120-865b-d24420a64aeb_1.png',
  'u9972584128_Minimalist_Japandi_home_office_wall_with_simple_w_9eae218e-7ef4-4120-865b-d24420a64aeb_3.png',
  'u9972584128_Minimalist_contemporary_executive_office_wall_wit_3f251659-c059-44ee-ba59-2b577a3a4f07_1.png',
  'u9972584128_Minimalist_contemporary_executive_office_wall_wit_3f251659-c059-44ee-ba59-2b577a3a4f07_2.png',
  'u9972584128_Minimalist_contemporary_executive_office_wall_wit_3f251659-c059-44ee-ba59-2b577a3a4f07_3.png',
  'u9972584128_Minimalist_contemporary_office_wall_with_dark_sla_21017649-b8ba-4546-a88e-63770d5f00f6_1.png',
  'u9972584128_Minimalist_contemporary_office_wall_with_dark_sla_21017649-b8ba-4546-a88e-63770d5f00f6_3.png',
  'u9972584128_Minimalist_corner_executive_office_wall_with_prem_756a6138-1f21-4d4f-ad2d-2715406f1a4b_0.png',
  'u9972584128_Minimalist_corner_executive_office_wall_with_prem_756a6138-1f21-4d4f-ad2d-2715406f1a4b_1.png',
  'u9972584128_Minimalist_creative_workspace_wall_with_natural_w_aec24234-6a38-45b9-a62e-2ae72d1a2e7d_0.png',
  'u9972584128_Minimalist_creative_workspace_wall_with_natural_w_aec24234-6a38-45b9-a62e-2ae72d1a2e7d_1.png',
  'u9972584128_Minimalist_creative_workspace_wall_with_natural_w_aec24234-6a38-45b9-a62e-2ae72d1a2e7d_2.png',
  'u9972584128_Minimalist_doctors_office_wall_with_clean_floatin_86f5654b-f98b-41fb-ab31-87a53cf85459_0.png',
  'u9972584128_Minimalist_doctors_office_wall_with_clean_floatin_86f5654b-f98b-41fb-ab31-87a53cf85459_1.png',
  'u9972584128_Minimalist_executive_office_wall_with_polished_ch_9a9cf779-dd8f-4a28-97c3-09034fdffb06_1.png',
  'u9972584128_Minimalist_executive_office_wall_with_polished_ch_9a9cf779-dd8f-4a28-97c3-09034fdffb06_3.png',
  'u9972584128_Minimalist_executive_office_wall_with_white_marbl_59c2b0c4-130d-45a4-b6d0-c5e59cb14148_0.png',
  'u9972584128_Minimalist_executive_office_wall_with_white_marbl_59c2b0c4-130d-45a4-b6d0-c5e59cb14148_1.png',
  'u9972584128_Minimalist_fusion_office_wall_with_wood_and_steel_35376030-5539-437c-be69-827402dfccb9_2.png',
  'u9972584128_Minimalist_fusion_office_wall_with_wood_and_steel_35376030-5539-437c-be69-827402dfccb9_3.png',
  'u9972584128_Minimalist_high-end_executive_office_wall_with_de_d7a8de53-e000-49a0-baa8-1a50d88baf2a_0.png',
  'u9972584128_Minimalist_high-end_executive_office_wall_with_de_d7a8de53-e000-49a0-baa8-1a50d88baf2a_1.png',
  'u9972584128_Minimalist_international_executive_office_wall_wi_3d43fb1b-7852-4750-851c-fbe3e379891a_0.png',
  'u9972584128_Minimalist_international_executive_office_wall_wi_3d43fb1b-7852-4750-851c-fbe3e379891a_3.png',
  'u9972584128_Minimalist_library_corner_wall_with_built-in_book_95e2f0a7-bf1f-49b6-adc7-76f43899180a_1.png',
  'u9972584128_Minimalist_library_corner_wall_with_built-in_book_95e2f0a7-bf1f-49b6-adc7-76f43899180a_2.png',
  'u9972584128_Minimalist_luxury_executive_office_wall_with_dark_738104dc-48e1-4fe8-89f4-3f34bb5dbad7_0.png',
  'u9972584128_Minimalist_luxury_executive_office_wall_with_dark_738104dc-48e1-4fe8-89f4-3f34bb5dbad7_1.png',
  'u9972584128_Minimalist_mid-century_home_office_wall_with_teak_a1936467-dfca-4b8b-9061-6f920837778e_0.png',
  'u9972584128_Minimalist_mid-century_home_office_wall_with_teak_a1936467-dfca-4b8b-9061-6f920837778e_1.png',
  'u9972584128_Minimalist_mid-century_home_office_wall_with_teak_a1936467-dfca-4b8b-9061-6f920837778e_2.png',
  'u9972584128_Minimalist_mid-century_home_office_wall_with_teak_a1936467-dfca-4b8b-9061-6f920837778e_3.png',
  'u9972584128_Minimalist_modern_home_office_wall_with_white_flo_6b82db45-4faa-4c36-b092-b6fbf215c82f_0.png',
  'u9972584128_Minimalist_modern_home_office_wall_with_white_flo_6b82db45-4faa-4c36-b092-b6fbf215c82f_3.png',
  'u9972584128_Minimalist_modern_office_wall_with_brushed_steel__1ad81845-b910-4ead-a341-48c2a54c2e1d_0.png',
  'u9972584128_Minimalist_modern_office_wall_with_brushed_steel__1ad81845-b910-4ead-a341-48c2a54c2e1d_1.png',
  'u9972584128_Minimalist_modern_office_wall_with_copper_floatin_b8261fc9-a810-4b12-ac3d-7d2191fbf85f_0.png',
  'u9972584128_Minimalist_modern_office_wall_with_copper_floatin_b8261fc9-a810-4b12-ac3d-7d2191fbf85f_1.png',
  'u9972584128_Minimalist_modern_office_wall_with_copper_floatin_b8261fc9-a810-4b12-ac3d-7d2191fbf85f_3.png',
  'u9972584128_Minimalist_natural_office_wall_with_wood_and_ston_5a78ab69-e6f0-413f-a386-2ddbe48bb08e_0.png',
  'u9972584128_Minimalist_natural_office_wall_with_wood_and_ston_5a78ab69-e6f0-413f-a386-2ddbe48bb08e_1.png',
  'u9972584128_Minimalist_tech_office_wall_with_aluminum_floatin_df1fd163-d230-4f94-a524-efb4d75439bc_0.png',
  'u9972584128_Minimalist_tech_office_wall_with_aluminum_floatin_df1fd163-d230-4f94-a524-efb4d75439bc_2.png',
  'u9972584128_Minimalist_traditional_executive_office_wall_with_be1c4101-fe7f-4682-8f36-973b3fd272cb_0.png',
  'u9972584128_Minimalist_traditional_executive_office_wall_with_be1c4101-fe7f-4682-8f36-973b3fd272cb_3.png',
  'u9972584128_Minimalist_warm_office_wall_with_travertine_float_9b82e02d-1c1a-43d9-a769-487b46412125_0.png',
  'u9972584128_Minimalist_warm_office_wall_with_travertine_float_9b82e02d-1c1a-43d9-a769-487b46412125_1.png',
  'u9972584128_Minimalist_warm_office_wall_with_travertine_float_9b82e02d-1c1a-43d9-a769-487b46412125_2.png'
];

// CONSOLIDATED CATEGORIES - Maps image types to 6 main categories
const categoryMapping = {
  // Professional Shelves (12-15 images) - all your shelf materials
  'professional-shelves': [
    'light-wood', 'dark-wood', 'concrete', 'stone', 'metal', 'industrial', 
    'glass', 'mixed-materials', 'floating-shelves'
  ],
  
  // Home & Lifestyle (8-10 images) - comfortable, lifestyle-focused
  'home-lifestyle': [
    'home-bar', 'curio', 'minimalist', 'scandinavian', 'hygge', 'cozy'
  ],
  
  // Academic & Literary (8-10 images) - books, learning, intellectual
  'academic-literary': [
    'library', 'vintage-study', 'map-room', 'academic', 'bookshelf', 'study'
  ],
  
  // Creative & Artistic (6-8 images) - creative professionals
  'creative-artistic': [
    'gallery-wall', 'botanical', 'garden-wall', 'artistic', 'creative'
  ],
  
  // Specialized Professional (4-6 images) - specific industries
  'specialized-professional': [
    'science-lab', 'culinary', 'cooking', 'medical', 'technical'
  ],
  
  // Natural & Rustic (4-6 images) - nature, wood, organic
  'natural-rustic': [
    'rustic', 'reclaimed-wood', 'natural', 'organic', 'farmhouse'
  ]
};

// Function to intelligently categorize images and generate names
function categorizeAndName(filename) {
  const name = filename.toLowerCase();
  
  // Auto-detect category based on filename keywords
  if (name.includes('shelf') || name.includes('shelves') || name.includes('floating') ||
      name.includes('wood') && (name.includes('light') || name.includes('dark')) ||
      name.includes('concrete') || name.includes('stone') || name.includes('metal') ||
      name.includes('glass') || name.includes('industrial')) {
    return { category: 'professional-shelves', type: extractShelfType(name) };
  }
  
  if (name.includes('bar') || name.includes('curio') || name.includes('minimalist') ||
      name.includes('scandinavian') || name.includes('hygge') || name.includes('cozy')) {
    return { category: 'home-lifestyle', type: extractLifestyleType(name) };
  }
  
  if (name.includes('library') || name.includes('study') || name.includes('academic') ||
      name.includes('vintage') || name.includes('map') || name.includes('book')) {
    return { category: 'academic-literary', type: extractAcademicType(name) };
  }
  
  if (name.includes('gallery') || name.includes('botanical') || name.includes('garden') ||
      name.includes('artistic') || name.includes('creative')) {
    return { category: 'creative-artistic', type: extractCreativeType(name) };
  }
  
  if (name.includes('science') || name.includes('lab') || name.includes('culinary') ||
      name.includes('cooking') || name.includes('medical') || name.includes('technical')) {
    return { category: 'specialized-professional', type: extractSpecializedType(name) };
  }
  
  if (name.includes('rustic') || name.includes('reclaimed') || name.includes('natural') ||
      name.includes('organic') || name.includes('farmhouse')) {
    return { category: 'natural-rustic', type: extractNaturalType(name) };
  }
  
  // Default fallback
  return { category: 'professional-shelves', type: 'Professional Background' };
}

// Helper functions to extract specific types
function extractShelfType(name) {
  if (name.includes('light') && name.includes('wood')) return 'Light Wood Professional Shelves';
  if (name.includes('dark') && name.includes('wood')) return 'Dark Wood Professional Shelves';
  if (name.includes('concrete')) return 'Concrete Professional Shelves';
  if (name.includes('stone')) return 'Stone Professional Shelves';
  if (name.includes('metal')) return 'Metal Professional Shelves';
  if (name.includes('glass')) return 'Glass Professional Shelves';
  if (name.includes('industrial')) return 'Industrial Professional Shelves';
  return 'Professional Shelves';
}

function extractLifestyleType(name) {
  if (name.includes('bar')) return 'Home Bar Setup';
  if (name.includes('curio')) return 'Curio Display Cabinet';
  if (name.includes('minimalist')) return 'Minimalist Home Office';
  if (name.includes('scandinavian') || name.includes('hygge')) return 'Scandinavian Home Office';
  return 'Lifestyle Home Office';
}

function extractAcademicType(name) {
  if (name.includes('library')) return 'Professional Library';
  if (name.includes('vintage')) return 'Vintage Study';
  if (name.includes('academic')) return 'Academic Office';
  if (name.includes('map')) return 'Map Room Office';
  return 'Academic Professional Office';
}

function extractCreativeType(name) {
  if (name.includes('gallery')) return 'Gallery Wall Office';
  if (name.includes('botanical')) return 'Botanical Wall Office';
  if (name.includes('garden')) return 'Garden Wall Office';
  return 'Creative Professional Office';
}

function extractSpecializedType(name) {
  if (name.includes('science') || name.includes('lab')) return 'Science Lab Office';
  if (name.includes('culinary') || name.includes('cooking')) return 'Culinary Professional Office';
  if (name.includes('medical')) return 'Medical Professional Office';
  return 'Specialized Professional Office';
}

function extractNaturalType(name) {
  if (name.includes('rustic')) return 'Rustic Wood Office';
  if (name.includes('reclaimed')) return 'Reclaimed Wood Office';
  if (name.includes('farmhouse')) return 'Farmhouse Office';
  return 'Natural Wood Office';
}

// Function to create SEO-friendly filename  
function createSEOFilename(category, index) {
  const baseSlug = category.toLowerCase().replace(/-/g, '-');
  const suffix = index > 0 ? `-${index + 1}` : '';
  return `${baseSlug}${suffix}.webp`;
}

// Function to generate metadata based on consolidated categories
function generateMetadata(type, category) {
  // Create proper title
  const title = type;
  
  // Generate description and keywords based on consolidated categories
  let description = '';
  let keywords = [];
  
  switch(category) {
    case 'professional-shelves':
      description = `${type} virtual background featuring books and plants - perfect for professional video calls and remote work meetings`;
      keywords = ['professional background', 'office shelves', 'books and plants', 'video calls', 'remote work', 'zoom background'];
      break;
      
    case 'home-lifestyle':
      description = `${type} virtual background with books and plants - ideal for lifestyle professionals and creative consultants`;
      keywords = ['home office', 'lifestyle background', 'creative professional', 'books and plants', 'video calls', 'consultant'];
      break;
      
    case 'academic-literary':
      description = `${type} virtual background featuring books and plants - perfect for academics, authors, and intellectual professionals`;
      keywords = ['academic background', 'library office', 'books and plants', 'intellectual professional', 'author', 'researcher'];
      break;
      
    case 'creative-artistic':
      description = `${type} virtual background with books and plants - designed for creative professionals and artistic consultants`;
      keywords = ['creative background', 'artistic office', 'books and plants', 'creative professional', 'designer', 'artist'];
      break;
      
    case 'specialized-professional':
      description = `${type} virtual background featuring books and plants - ideal for specialized professionals and industry experts`;
      keywords = ['specialized background', 'professional office', 'books and plants', 'expert consultant', 'specialist', 'industry'];
      break;
      
    case 'natural-rustic':
      description = `${type} virtual background with books and plants - perfect for wellness professionals and nature-focused brands`;
      keywords = ['natural background', 'rustic office', 'books and plants', 'wellness professional', 'organic', 'nature'];
      break;
      
    default:
      description = `${type} virtual background with books and plants for professional video calls`;
      keywords = ['professional background', 'books and plants', 'video calls', 'virtual background'];
  }
  
  // Add universal keywords
  keywords = [...keywords, 'webp format', 'high quality'].slice(0, 8);
  
  const alt = `${title} - Professional virtual background with books and plants for video calls`;
  
  return { title, description, keywords, alt, category };
}

// Main processing function - handles flexible image quantities
function processCuratedCollection() {
  // UPDATE THIS PATH - where you put your curated images
  const sourceDir = path.join(__dirname, '..', 'curated-collection'); // Your curated images folder
  const targetDir = path.join(__dirname, 'public', 'images'); // Target folder
  
  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Load/create fresh metadata
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  const dataDir = path.dirname(metadataPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  let metadata = {};
  let processedCount = 0;
  
  console.log('🎨 Processing your curated collection...\n');
  console.log(`📁 Source: ${sourceDir}`);
  console.log(`📁 Target: ${targetDir}\n`);
  
  // Filter out placeholder filenames
  const actualImages = curatedImages.filter(filename => 
    filename && !filename.includes('filename') && !filename.includes('your-')
  );
  
  if (actualImages.length === 0) {
    console.log('🚨 Please update the curatedImages array with your actual filenames!');
    console.log('   Replace the placeholder filenames with your real selected images.');
    return;
  }
  
  console.log(`📊 Processing ${actualImages.length} curated images`);
  
  // Track category counts for display
  const categoryCounts = {};
  
  // Process each image
  actualImages.forEach((filename, globalIndex) => {
    if (fs.existsSync(path.join(sourceDir, filename))) {
      const result = categorizeAndName(filename);
      const { category, type } = result;
      
      // Count images in this category for unique naming
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      const categoryIndex = categoryCounts[category];
      
      // Create SEO-friendly filename
      const categorySlug = category.toLowerCase();
      const typeSlug = type.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const newFilename = categoryIndex === 1 ? 
        `${categorySlug}-${typeSlug}.webp` : 
        `${categorySlug}-${typeSlug}-${categoryIndex}.webp`;
      
      const oldPath = path.join(sourceDir, filename);
      const webpPath = path.join(targetDir, newFilename);
      
      try {
        // Convert PNG to lossless WebP using ImageMagick
        console.log(`📸 Converting: ${filename} → ${newFilename}`);
        execSync(`magick "${oldPath}" -define webp:lossless=true "${webpPath}"`, { stdio: 'inherit' });
        
        // Generate metadata
        const meta = generateMetadata(type, category);
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
        console.log(`✅ ${category}: ${meta.title}`);
        
      } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message);
      }
    } else {
      console.log(`⚠️  File not found: ${filename}`);
    }
  });
  
  // Write metadata JSON
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log(`\n🎉 Curated collection processing complete!`);
  console.log(`📊 Processed ${processedCount} curated images`);
  console.log(`📁 Metadata saved to: ${metadataPath}`);
  
  // Show final category breakdown
  const finalCounts = {};
  Object.values(metadata).forEach(item => {
    finalCounts[item.category] = (finalCounts[item.category] || 0) + 1;
  });
  
  console.log(`\n📋 Your new curated collection:`);
  Object.entries(finalCounts).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} images`);
  });
  
  console.log(`\n💡 Perfect! Now you have 6 meaningful categories instead of 20+`);
  console.log(`   Each category has enough images to be worthwhile for users.`);
}

// Check if ImageMagick is installed
try {
  execSync('magick -version', { stdio: 'ignore' });
  
  console.log('🚨 IMPORTANT: Update the curatedCollection object above with your actual filenames!');
  console.log('📝 Replace all the placeholder "filename1.png" entries with your real selected files\n');
  
  processCuratedCollection();
} catch (error) {
  console.error('❌ ImageMagick not found!');
  console.log('📥 Please install ImageMagick first:');
  console.log('   Windows: https://imagemagick.org/script/download.php#windows');
  console.log('   Mac: brew install imagemagick');
  console.log('   Linux: sudo apt-get install imagemagick');
  process.exit(1);
}