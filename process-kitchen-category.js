// process-kitchen-category.js - Process kitchen images with simple naming
// Save this file in your stream-backdrops/nextjs-site/ folder
// Run with: node process-kitchen-category.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// YOUR ACTUAL KITCHEN IMAGE FILENAMES - 18 images
const kitchenImages = [
  'u9972584128_Professional_photography_of_empty_minimalist_mode_e60c0038-d105-42ce-bee0-94069517020e_1.png',
  'u9972584128_Professional_photography_of_empty_Scandinavian_ki_34d58d0a-2c06-4d56-ba31-b98291b2872d_0.png',
  'u9972584128_Professional_photography_of_empty_Scandinavian_ki_34d58d0a-2c06-4d56-ba31-b98291b2872d_2.png',
  'u9972584128_Professional_photography_of_lived-in_cottage_kitc_44a9301f-547f-4430-9fe8-14f9cac99c18_2.png',
  'u9972584128_Professional_photography_of_lived-in_luxury_kitch_e8735d03-e016-47e3-81fc-6fbba3b5a93d_1.png',
  'u9972584128_Professional_photography_of_lived-in_upscale_kitc_3768a6de-8ce9-460c-b802-8ebc45c7d8df_3.png',
  'u9972584128_Professional_photography_of_ultra-minimalist_gray_e9ed9427-c8e9-4481-91a7-cd3fc7bfd54e_2.png',
  'u9972584128_wide_view_of_Professional_photography_of_lived-in_2f5f5a39-11e7-49d8-82c6-358908cfb098_0.png',
  'u9972584128_wide_view_of_Professional_photography_of_lived-in_2f5f5a39-11e7-49d8-82c6-358908cfb098_3.png',
  'u9972584128_wide_view_of_Professional_photography_of_lived-in_482bd588-bc98-41a0-9227-775acb6a7aec_3.png',
  'u9972584128_wide_view_of_Professional_photography_of_lived-in_5f5117f8-7f83-4334-9856-a17d2f0adf0f_1.png',
  'u9972584128_wide_view_of_Professional_photography_of_lived-in_828935e5-c8fe-4ae4-ad2e-d1101e39d640_2.png',
  'u9972584128_wide_view_of_Professional_photography_of_lived-in_dd19c0a6-1870-4968-ad84-76cae804b815_0.png',
  'u9972584128_wide_view_of_Professional_photography_of_lived-in_dd19c0a6-1870-4968-ad84-76cae804b815_3.png',
  'u9972584128_wide_view_of_Professional_photography_of_lived-in_ec35b45f-0949-4682-987d-9effe2dc4569_1.png',
  'u9972584128_wide_view_of_Professional_photography_of_lived-in_ec35b45f-0949-4682-987d-9effe2dc4569_3.png',
  'u9972584128_wide_view_of_Professional_photography_of_lived-in_f09f782c-f799-48b9-95a3-d789caa825d0_1.png',
  'u9972584128_wide_view_of_Professional_photography_of_lived-in_f09f782c-f799-48b9-95a3-d789caa825d0_2.png'
];

// Function to extract meaningful kitchen type for metadata only
function extractKitchenType(filename) {
  // Remove the prefix and UUID parts
  let name = filename.replace('u9972584128_', '');
  name = name.replace(/_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}_\d+(\s\(\d+\))?\.png$/, '');
  
  // Convert underscores to spaces and clean up
  name = name.replace(/_/g, ' ');
  
  // Kitchen-specific patterns for metadata titles
  if (name.toLowerCase().includes('modern') || name.toLowerCase().includes('contemporary')) {
    return 'Modern Kitchen Background';
  }
  if (name.toLowerCase().includes('farmhouse') || name.toLowerCase().includes('rustic')) {
    return 'Farmhouse Kitchen Background';
  }
  if (name.toLowerCase().includes('minimalist') || name.toLowerCase().includes('clean')) {
    return 'Minimalist Kitchen Background';
  }
  if (name.toLowerCase().includes('industrial') || name.toLowerCase().includes('urban')) {
    return 'Industrial Kitchen Background';
  }
  if (name.toLowerCase().includes('traditional') || name.toLowerCase().includes('classic')) {
    return 'Traditional Kitchen Background';
  }
  if (name.toLowerCase().includes('scandinavian') || name.toLowerCase().includes('nordic')) {
    return 'Scandinavian Kitchen Background';
  }
  if (name.toLowerCase().includes('luxury') || name.toLowerCase().includes('high-end')) {
    return 'Luxury Kitchen Background';
  }
  if (name.toLowerCase().includes('coffee')) {
    return 'Kitchen Coffee Bar Background';
  }
  if (name.toLowerCase().includes('breakfast')) {
    return 'Kitchen Breakfast Area Background';
  }
  if (name.toLowerCase().includes('pantry')) {
    return 'Kitchen Pantry Background';
  }
  
  // Default fallback
  return 'Kitchen Virtual Background';
}

// Function to generate kitchen metadata
function generateKitchenMetadata(filename, index) {
  const type = extractKitchenType(filename);
  const title = type;
  
  // Kitchen-specific description and keywords
  const description = `Professional kitchen virtual background perfect for cooking shows, food blogs, culinary consultations, and chef video calls`;
  const keywords = ['kitchen background', 'culinary virtual background', 'cooking show background', 'food blog', 'kitchen workspace', 'chef background', 'virtual background', 'video calls'];
  const alt = `${title} for professional video calls and cooking content`;
  
  return { title, description, keywords, alt, category: 'kitchen' };
}

// Function to scan folder and get actual filenames
function scanKitchenFolder() {
  const sourceDir = path.join(__dirname, '..', 'kitchen-images'); // UPDATE THIS PATH
  
  console.log(`Scanning for PNG files in: ${sourceDir}`);
  
  if (!fs.existsSync(sourceDir)) {
    console.log('Kitchen images folder not found!');
    console.log(`Please create the folder: ${sourceDir}`);
    console.log('And put your kitchen PNG files in there.');
    return [];
  }
  
  const allFiles = fs.readdirSync(sourceDir);
  const pngFiles = allFiles.filter(file => file.toLowerCase().endsWith('.png'));
  
  console.log(`Found ${pngFiles.length} PNG files:`);
  pngFiles.forEach((file, index) => {
    console.log(`${(index + 1).toString().padStart(2, ' ')}. ${file}`);
  });
  
  if (pngFiles.length > 0) {
    console.log('\nCopy this array into the kitchenImages variable at the top of this file:');
    console.log('const kitchenImages = [');
    pngFiles.forEach(file => {
      console.log(`  '${file}',`);
    });
    console.log('];');
  }
  
  return pngFiles;
}

// Main processing function
function processKitchenCategory() {
  // UPDATE THESE PATHS FOR YOUR SETUP:
  const sourceDir = path.join(__dirname, '..', 'kitchen-images'); // Your kitchen images folder
  const targetDir = path.join(__dirname, 'public', 'images'); // Target folder (same as other images)
  
  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Load existing metadata
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  let metadata = {};
  
  if (fs.existsSync(metadataPath)) {
    try {
      const existingData = fs.readFileSync(metadataPath, 'utf8');
      metadata = JSON.parse(existingData);
      console.log(`Loaded existing metadata with ${Object.keys(metadata).length} images`);
    } catch (error) {
      console.log('Could not load existing metadata, starting fresh');
    }
  }
  
  let processedCount = 0;
  
  console.log('Starting Kitchen category processing...\n');
  console.log(`Source: ${sourceDir}`);
  console.log(`Target: ${targetDir}\n`);
  
  // Check if we have images in the array
  if (kitchenImages.length === 0) {
    console.log('No actual images specified. The array is empty.');
    return;
  }
  
  // Process each image with simple numbering
  kitchenImages.forEach((oldFilename, index) => {
    const newFilename = `kitchen${index + 1}.webp`; // Simple naming: kitchen1.webp, kitchen2.webp, etc.
    const oldPath = path.join(sourceDir, oldFilename);
    const webpPath = path.join(targetDir, newFilename);
    
    if (fs.existsSync(oldPath)) {
      try {
        // Convert PNG to lossless WebP using ImageMagick
        console.log(`Converting: ${oldFilename} → ${newFilename}`);
        execSync(`magick "${oldPath}" -define webp:lossless=true "${webpPath}"`, { stdio: 'inherit' });
        
        // Generate metadata
        const meta = generateKitchenMetadata(oldFilename, index);
        const key = `kitchen${index + 1}`; // Key matches filename without extension
        
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
      console.log(`⚠️ File not found: ${oldFilename}`);
      console.log(`     Looking in: ${oldPath}`);
    }
  });
  
  // Write updated metadata JSON
  const dataDir = path.dirname(metadataPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  console.log(`\n🎉 Kitchen category processing complete!`);
  console.log(`📊 Processed ${processedCount} new kitchen images`);
  console.log(`📊 Total images in metadata: ${Object.keys(metadata).length}`);
  console.log(`📂 Metadata saved to: ${metadataPath}`);
  
  // Count kitchen images
  const kitchenCount = Object.values(metadata).filter(item => item.category === 'kitchen').length;
  console.log(`🍳 Kitchen category now has: ${kitchenCount} images`);
  
  console.log(`\n💡 Next steps:`);
  console.log(`1. Images are saved as kitchen1.webp, kitchen2.webp, etc. in public/images/`);
  console.log(`2. Create pages/category/kitchen.js page`);
  console.log(`3. Add kitchen category to your homepage`);
  console.log(`4. Choose kitchen1.webp or another for the category card hero image`);
}

// Generate the category page code
function generateKitchenCategoryPage() {
  console.log('\n📄 Kitchen category page code:');
  console.log('Save this as pages/category/kitchen.js:');
  console.log('=====================================\n');
  
  const categoryPageCode = `import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ImageGrid from '../../components/ImageGrid';

export default function KitchenCategory() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      try {
        const response = await fetch('/data/image-metadata.json');
        const metadata = await response.json();
        
        // Filter for kitchen category images
        const kitchenImages = Object.entries(metadata)
          .filter(([key, data]) => data.category === 'kitchen')
          .map(([key, data]) => ({
            id: key,
            filename: data.filename,
            title: data.title,
            description: data.description,
            alt: data.alt,
            keywords: data.keywords,
            src: \`/images/\${data.filename}\`
          }));
        
        setImages(kitchenImages);
        setLoading(false);
      } catch (error) {
        console.error('Error loading kitchen images:', error);
        setLoading(false);
      }
    }

    loadImages();
  }, []);

  return (
    <>
      <Head>
        <title>Kitchen Virtual Backgrounds | Professional Culinary Backgrounds for Video Calls</title>
        <meta name="description" content="Professional kitchen virtual backgrounds perfect for cooking shows, food blogs, culinary consultations, and chef video calls. High-quality WebP format." />
        <meta name="keywords" content="kitchen virtual background, cooking show background, culinary professional, chef background, food blog, kitchen workspace" />
        <link rel="canonical" href="https://yoursite.com/category/kitchen" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        {/* Navigation */}
        <nav style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '1rem 0',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link href="/" style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#333',
              textDecoration: 'none'
            }}>
              Stream Backdrops
            </Link>
            <Link href="/" style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              ← Back to Categories
            </Link>
          </div>
        </nav>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          padding: '4rem 1rem 2rem',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Kitchen Virtual Backgrounds
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Professional kitchen backgrounds perfect for cooking shows, food blogs, culinary consultations, and chef video calls
          </p>
          <div style={{
            marginTop: '1.5rem',
            fontSize: '1rem',
            opacity: 0.8
          }}>
            {loading ? 'Loading...' : \`\${images.length} kitchen backgrounds available\`}
          </div>
        </div>

        {/* Images Grid */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem'
        }}>
          {loading ? (
            <div style={{
              textAlign: 'center',
              color: 'white',
              fontSize: '1.2rem',
              padding: '4rem'
            }}>
              Loading kitchen backgrounds...
            </div>
          ) : (
            <ImageGrid images={images} />
          )}
        </div>
      </div>
    </>
  );
}`;

  console.log(categoryPageCode);
}

// Generate homepage category card code
function generateHomepageKitchenCard() {
  console.log('\n\n🏠 Homepage category card code:');
  console.log('Add this to your homepage categories section:');
  console.log('============================================\n');
  
  const cardCode = `          {/* Kitchen Category */}
          <Link href="/category/kitchen" style={{ textDecoration: 'none' }}>
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
                  src="/images/kitchen1.webp"
                  alt="Kitchen virtual background"
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
                  Kitchen Backgrounds
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.95rem',
                  lineHeight: '1.5'
                }}>
                  Professional kitchen backgrounds for cooking shows, food blogs, and culinary video calls
                </p>
              </div>
            </div>
          </Link>`;

  console.log(cardCode);
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--scan')) {
    scanKitchenFolder();
  } else if (args.includes('--generate-pages')) {
    generateKitchenCategoryPage();
    generateHomepageKitchenCard();
  } else {
    // Check if ImageMagick is installed
    try {
      execSync('magick -version', { stdio: 'ignore' });
      processKitchenCategory();
    } catch (error) {
      console.error('❌ ImageMagick not found!');
      console.log('🔥 Please install ImageMagick first:');
      console.log('   Windows: https://imagemagick.org/script/download.php#windows');
      console.log('   Mac: brew install imagemagick');
      console.log('   Linux: sudo apt-get install imagemagick');
      process.exit(1);
    }
  }
}