// integrate-kitchen-category.js - Automatically add kitchen category to all necessary files
// Save this file in your stream-backdrops/nextjs-site/ folder
// Run with: node integrate-kitchen-category.js

const fs = require('fs');
const path = require('path');

// Function to update the [slug].js file with kitchen category
function updateSlugFile() {
  const slugPath = path.join(__dirname, 'pages', 'category', '[slug].js');
  
  if (!fs.existsSync(slugPath)) {
    console.log('❌ [slug].js file not found');
    return false;
  }
  
  let content = fs.readFileSync(slugPath, 'utf8');
  let modified = false;
  
  // 1. Add kitchen to folderMap
  const folderMapPattern = /const folderMap = \{([^}]+)\};/s;
  const folderMapMatch = content.match(folderMapPattern);
  
  if (folderMapMatch && !folderMapMatch[1].includes("'kitchen'")) {
    const existingMap = folderMapMatch[1];
    const newMap = existingMap.trim() + ",\n    'kitchen': 'kitchen'";
    content = content.replace(folderMapPattern, `const folderMap = {${newMap}\n  };`);
    modified = true;
    console.log('✅ Added kitchen to folderMap');
  }
  
  // 2. Add kitchen to categoryInfo
  const categoryInfoPattern = /const categoryInfo = \{([^}]+(?:\}[^}]*)*)\};/s;
  const categoryInfoMatch = content.match(categoryInfoPattern);
  
  if (categoryInfoMatch && !categoryInfoMatch[1].includes("'kitchen'")) {
    // Find the last category entry and add kitchen after it
    const lastCategoryPattern = /('living-room':\s*\{[^}]+\})/;
    const kitchenCategory = `,\n  'kitchen': {\n    name: 'Kitchen Backgrounds',\n    description: 'Professional kitchen backgrounds for cooking shows, food blogs, and culinary video calls'\n  }`;
    
    if (content.match(lastCategoryPattern)) {
      content = content.replace(lastCategoryPattern, `$1${kitchenCategory}`);
      modified = true;
      console.log('✅ Added kitchen to categoryInfo');
    }
  }
  
  if (modified) {
    fs.writeFileSync(slugPath, content);
    console.log('✅ Updated [slug].js file');
    return true;
  } else {
    console.log('ℹ️ [slug].js already has kitchen category or couldn\'t find insertion points');
    return false;
  }
}

// Function to add kitchen category card to homepage
function updateHomepage() {
  const homePath = path.join(__dirname, 'pages', 'index.js');
  
  if (!fs.existsSync(homePath)) {
    console.log('❌ index.js file not found');
    return false;
  }
  
  let content = fs.readFileSync(homePath, 'utf8');
  
  // Check if kitchen category already exists
  if (content.includes('/category/kitchen') || content.includes('Kitchen Backgrounds')) {
    console.log('ℹ️ Kitchen category already exists on homepage');
    return false;
  }
  
  // Find where to insert the kitchen category card
  // Look for the living room category card and add kitchen after it
  const lastCategoryPattern = /(\{\/\*\s*Living Room.*?\<\/Link\>)/s;
  
  const kitchenCategoryCard = `
          {/* Kitchen Backgrounds */}
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
                  src="/images/kitchen/kitchen9.webp"
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
  
  if (content.match(lastCategoryPattern)) {
    content = content.replace(lastCategoryPattern, `$1${kitchenCategoryCard}`);
    fs.writeFileSync(homePath, content);
    console.log('✅ Added kitchen category card to homepage');
    return true;
  } else {
    console.log('❌ Could not find insertion point on homepage');
    console.log('💡 You may need to manually add the kitchen category card');
    
    // Output the card code for manual addition
    console.log('\n📋 Kitchen category card code for manual addition:');
    console.log('=' .repeat(60));
    console.log(kitchenCategoryCard.trim());
    console.log('=' .repeat(60));
    return false;
  }
}

// Function to update sitemap if it exists
function updateSitemap() {
  const sitemapPath = path.join(__dirname, 'pages', 'sitemap.xml.js');
  
  if (!fs.existsSync(sitemapPath)) {
    console.log('ℹ️ No sitemap.xml.js found, skipping');
    return false;
  }
  
  let content = fs.readFileSync(sitemapPath, 'utf8');
  
  if (content.includes('/category/kitchen')) {
    console.log('ℹ️ Kitchen already in sitemap');
    return false;
  }
  
  // Add kitchen to sitemap URLs
  const urlPattern = /(<url>\s*<loc>[^<]*\/category\/[^<]*<\/loc>[^<]*<\/url>)/g;
  const matches = content.match(urlPattern);
  
  if (matches && matches.length > 0) {
    const lastUrl = matches[matches.length - 1];
    const kitchenUrl = `
    <url>
      <loc>https://streambackdrops.com/category/kitchen</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
    
    content = content.replace(lastUrl, lastUrl + kitchenUrl);
    fs.writeFileSync(sitemapPath, content);
    console.log('✅ Added kitchen to sitemap');
    return true;
  }
  
  return false;
}

// Function to check if kitchen images exist
function checkKitchenImages() {
  const kitchenDir = path.join(__dirname, 'public', 'images', 'kitchen');
  
  if (!fs.existsSync(kitchenDir)) {
    console.log('❌ Kitchen images directory not found');
    return false;
  }
  
  const files = fs.readdirSync(kitchenDir);
  const webpFiles = files.filter(f => f.endsWith('.webp'));
  
  console.log(`✅ Found ${webpFiles.length} kitchen images`);
  
  // Check if kitchen9.webp exists for homepage
  if (fs.existsSync(path.join(kitchenDir, 'kitchen9.webp'))) {
    console.log('✅ kitchen9.webp found for homepage hero image');
  } else {
    console.log('⚠️ kitchen9.webp not found - you may need to use a different image number');
  }
  
  return webpFiles.length > 0;
}

// Main integration function
function integrateKitchenCategory() {
  console.log('🍳 Integrating Kitchen Category...\n');
  
  // Check prerequisites
  console.log('📋 Checking prerequisites:');
  const hasImages = checkKitchenImages();
  
  if (!hasImages) {
    console.log('\n❌ Cannot proceed without kitchen images. Run process-kitchen-category.js first.');
    return;
  }
  
  console.log('\n🔧 Making automatic updates:');
  
  // Make the updates
  const slugUpdated = updateSlugFile();
  const homepageUpdated = updateHomepage();
  const sitemapUpdated = updateSitemap();
  
  console.log('\n📊 Integration Summary:');
  console.log(`   [slug].js: ${slugUpdated ? '✅ Updated' : 'ℹ️ No changes needed'}`);
  console.log(`   index.js: ${homepageUpdated ? '✅ Updated' : '⚠️ Check manually'}`);
  console.log(`   Layout.js: ${layoutUpdated ? '✅ Updated' : '⚠️ Check manually'}`);
  console.log(`   categories-config.js: ${configUpdated ? '✅ Updated total to 167' : 'ℹ️ No changes needed'}`);
  console.log(`   sitemap: ${sitemapUpdated ? '✅ Updated' : 'ℹ️ Skipped'}`);
  
  if (slugUpdated || homepageUpdated || layoutUpdated || configUpdated || sitemapUpdated) {
    console.log('\n🎉 Kitchen category integration complete!');
    console.log('💡 Test by visiting: http://localhost:3000/category/kitchen');
  } else {
    console.log('\n⚠️ No automatic changes were made. Manual updates may be needed.');
  }
  
  console.log('\n📝 Next steps:');
  console.log('1. Test the /category/kitchen page');
  console.log('2. Verify kitchen category shows on homepage');
  console.log('3. Check that kitchen9.webp displays correctly');
  console.log('4. Commit your changes to git');
}

// Run the integration
if (require.main === module) {
  integrateKitchenCategory();
}

module.exports = { integrateKitchenCategory, updateSlugFile, updateHomepage };