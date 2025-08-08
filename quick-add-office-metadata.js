// quick-add-office-metadata.js - Quick fix to add your office spaces to the API
// Run with: node quick-add-office-metadata.js

const fs = require('fs');
const path = require('path');

// Your 15 office space images - we'll create metadata for them
const officeSpacesMetadata = {
  'minimalist-executive-office-1': {
    filename: 'minimalist-executive-office-1.webp',
    title: 'Minimalist Executive Office',
    description: 'Professional minimalist executive office virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'minimalist', 'executive']
  },
  'home-office-with-wood-accent-wall-2': {
    filename: 'home-office-with-wood-accent-wall-2.webp',
    title: 'Home Office with Wood Accent Wall',
    description: 'Professional home office with wood accent wall virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'wood', 'accent']
  },
  'home-office-with-wood-accent-wall-3': {
    filename: 'home-office-with-wood-accent-wall-3.webp',
    title: 'Home Office with Wood Accent Wall',
    description: 'Professional home office with wood accent wall virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'wood', 'accent']
  },
  'professional-consultation-office-4': {
    filename: 'professional-consultation-office-4.webp',
    title: 'Professional Consultation Office',
    description: 'Professional professional consultation office virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'consultation']
  },
  'professional-consultation-office-5': {
    filename: 'professional-consultation-office-5.webp',
    title: 'Professional Consultation Office',
    description: 'Professional professional consultation office virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'consultation']
  },
  'professional-office-interior-6': {
    filename: 'professional-office-interior-6.webp',
    title: 'Professional Office Interior',
    description: 'Professional professional office interior virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'interior']
  },
  'professional-office-interior-7': {
    filename: 'professional-office-interior-7.webp',
    title: 'Professional Office Interior',
    description: 'Professional professional office interior virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'interior']
  },
  'corner-office-with-floor-to-ceiling-windows-8': {
    filename: 'corner-office-with-floor-to-ceiling-windows-8.webp',
    title: 'Corner Office with Floor-to-Ceiling Windows',
    description: 'Professional corner office with floor-to-ceiling windows virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'corner', 'windows']
  },
  'home-office-with-light-wood-accent-9': {
    filename: 'home-office-with-light-wood-accent-9.webp',
    title: 'Home Office with Light Wood Accent',
    description: 'Professional home office with light wood accent virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'light', 'wood']
  },
  'modern-home-office-with-concrete-wall-10': {
    filename: 'modern-home-office-with-concrete-wall-10.webp',
    title: 'Modern Home Office with Concrete Wall',
    description: 'Professional modern home office with concrete wall virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'modern', 'concrete']
  },
  'office-with-marble-accent-wall-11': {
    filename: 'office-with-marble-accent-wall-11.webp',
    title: 'Office with Marble Accent Wall',
    description: 'Professional office with marble accent wall virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'marble', 'accent']
  },
  'office-with-marble-accent-wall-12': {
    filename: 'office-with-marble-accent-wall-12.webp',
    title: 'Office with Marble Accent Wall',
    description: 'Professional office with marble accent wall virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'marble', 'accent']
  },
  'office-with-marble-accent-wall-13': {
    filename: 'office-with-marble-accent-wall-13.webp',
    title: 'Office with Marble Accent Wall',
    description: 'Professional office with marble accent wall virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'marble', 'accent']
  },
  'office-with-dark-wood-accent-14': {
    filename: 'office-with-dark-wood-accent-14.webp',
    title: 'Office with Dark Wood Accent',
    description: 'Professional office with dark wood accent virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'dark', 'wood']
  },
  'office-with-dark-wood-accent-15': {
    filename: 'office-with-dark-wood-accent-15.webp',
    title: 'Office with Dark Wood Accent',
    description: 'Professional office with dark wood accent virtual background perfect for business meetings and video conferences',
    category: 'office-spaces',
    keywords: ['office space', 'virtual background', 'professional', 'business meeting', 'video conference', 'corporate', 'workplace', 'dark', 'wood']
  }
};

function addOfficeMetadata() {
  console.log('🏢 Adding Office Spaces metadata...\n');
  
  // Find your main metadata file
  const possiblePaths = [
    path.join(__dirname, 'public', 'data', 'image-metadata.json'),
    path.join(__dirname, 'data', 'image-metadata.json'),
    path.join(__dirname, 'metadata.json')
  ];
  
  let metadataPath = null;
  let existingMetadata = {};
  
  // Find existing metadata
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      metadataPath = testPath;
      try {
        existingMetadata = JSON.parse(fs.readFileSync(testPath, 'utf8'));
        console.log(`✅ Found existing metadata: ${testPath}`);
        console.log(`📊 Current images: ${Object.keys(existingMetadata).length}`);
        break;
      } catch (error) {
        console.log(`⚠️  Found file but couldn't read: ${testPath}`);
      }
    }
  }
  
  // If no metadata file found, create one
  if (!metadataPath) {
    metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
    const dir = path.dirname(metadataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    console.log(`📁 Creating new metadata file: ${metadataPath}`);
  }
  
  // Merge office spaces metadata
  const updatedMetadata = { ...existingMetadata, ...officeSpacesMetadata };
  
  // Write updated metadata
  fs.writeFileSync(metadataPath, JSON.stringify(updatedMetadata, null, 2));
  
  console.log(`\n✅ Office Spaces metadata added successfully!`);
  console.log(`📊 Total images: ${Object.keys(updatedMetadata).length}`);
  console.log(`🏢 Office Spaces: 15 images`);
  
  // Count by category
  const categoryCounts = {};
  Object.values(updatedMetadata).forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  
  console.log(`\n📈 Category breakdown:`);
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} images`);
  });
  
  console.log(`\n🚀 Next steps:`);
  console.log(`1. Check your office spaces images are in: public/images/office-spaces/`);
  console.log(`2. Visit: http://localhost:3000/category/office-spaces`);
  console.log(`3. You should now see 15 office space backgrounds!`);
  
  return updatedMetadata;
}

// Run the fix
addOfficeMetadata();