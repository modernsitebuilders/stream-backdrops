// image-order-manager.js
// Visual tool to see and reorder images for each category
// Run with: node image-order-manager.js

const fs = require('fs');
const path = require('path');

class ImageOrderManager {
  constructor() {
    this.metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
    this.metadata = {};
    this.loadMetadata();
  }

  loadMetadata() {
    if (fs.existsSync(this.metadataPath)) {
      this.metadata = JSON.parse(fs.readFileSync(this.metadataPath, 'utf8'));
      console.log(`✅ Loaded metadata: ${Object.keys(this.metadata).length} images`);
    } else {
      console.log('❌ Metadata file not found!');
      process.exit(1);
    }
  }

  saveMetadata() {
    fs.writeFileSync(this.metadataPath, JSON.stringify(this.metadata, null, 2));
    console.log('💾 Metadata saved successfully!');
  }

  // Get images by category in current display order
  getImagesByCategory(categorySlug) {
    return Object.entries(this.metadata)
      .filter(([_, data]) => data.category === categorySlug && !data.isPremium) // Only free images
      .map(([filename, data]) => ({
        filename,
        ...data,
        key: filename
      }))
      .sort((a, b) => {
        // Same sorting logic as your website
        if (a.sortPriority && !b.sortPriority) return -1;
        if (!a.sortPriority && b.sortPriority) return 1;
        if (a.sortPriority && b.sortPriority) return a.sortPriority - b.sortPriority;
        if (a.isPremium !== b.isPremium) return a.isPremium ? -1 : 1;
        return a.filename.localeCompare(b.filename);
      });
  }

  // Display current order for a category
  showCategoryOrder(categorySlug) {
    const images = this.getImagesByCategory(categorySlug);
    const categoryNames = {
      'home-offices': 'Home Offices',
      'executive-offices': 'Executive Offices',
      'minimalist': 'Minimalist',
      'lobbies': 'Lobbies',
      'private-offices': 'Private Offices'
    };

    console.log(`\n📋 CURRENT ORDER: ${categoryNames[categorySlug]} (${images.length} images)`);
    console.log('=' .repeat(80));
    
    images.forEach((img, index) => {
      const priority = img.sortPriority ? `[P${img.sortPriority}]` : '[--]';
      const title = img.title || 'No Title';
      console.log(`${(index + 1).toString().padStart(2)}. ${priority} ${title}`);
      console.log(`    📄 ${img.filename}`);
    });
  }

  // Show all categories overview
  showAllCategories() {
    const categories = ['home-offices', 'executive-offices', 'minimalist', 'lobbies', 'private-offices'];
    const categoryNames = {
      'home-offices': 'Home Offices',
      'executive-offices': 'Executive Offices',
      'minimalist': 'Minimalist',
      'lobbies': 'Lobbies',
      'private-offices': 'Private Offices'
    };

    console.log('\n🎯 CATEGORY OVERVIEW');
    console.log('=' .repeat(50));
    
    categories.forEach(slug => {
      const images = this.getImagesByCategory(slug);
      const topImage = images[0];
      console.log(`\n📁 ${categoryNames[slug]} (${images.length} images)`);
      if (topImage) {
        console.log(`   🔝 First image: ${topImage.title || topImage.filename}`);
        console.log(`   📄 File: ${topImage.filename}`);
      } else {
        console.log('   ❌ No images found');
      }
    });
  }

  // Apply new order to a category
  applyNewOrder(categorySlug, orderedFilenames) {
    console.log(`\n🔄 Applying new order to ${categorySlug}...`);
    
    // Reset all sortPriority for this category
    Object.keys(this.metadata).forEach(key => {
      if (this.metadata[key].category === categorySlug) {
        delete this.metadata[key].sortPriority;
      }
    });
    
    // Apply new priorities based on order
    orderedFilenames.forEach((filename, index) => {
      if (this.metadata[filename]) {
        this.metadata[filename].sortPriority = index + 1;
        console.log(`  ${index + 1}. ${this.metadata[filename].title || filename}`);
      } else {
        console.log(`  ⚠️  File not found: ${filename}`);
      }
    });
    
    this.saveMetadata();
    console.log(`✅ Order updated for ${categorySlug}!`);
  }

  // Interactive menu
  showMenu() {
    console.log('\n🎮 IMAGE ORDER MANAGER');
    console.log('========================');
    console.log('1. View all categories overview');
    console.log('2. View specific category order');
    console.log('3. Generate reorder template for category');
    console.log('4. Apply new order from template');
    console.log('5. Quick reorder executive offices (move corner to top)');
    console.log('0. Exit');
    console.log('\nChoose an option:');
  }

  // Generate a template file for easy reordering
  generateTemplate(categorySlug) {
    const images = this.getImagesByCategory(categorySlug);
    const templatePath = `${categorySlug}-order-template.txt`;
    
    let content = `# ${categorySlug.toUpperCase()} IMAGE ORDER TEMPLATE\n`;
    content += `# Instructions:\n`;
    content += `# 1. Rearrange the filenames below in your desired order\n`;
    content += `# 2. Top filename = first image shown on website\n`;
    content += `# 3. Save this file\n`;
    content += `# 4. Run: node image-order-manager.js and choose option 4\n\n`;
    
    images.forEach((img, index) => {
      content += `# ${index + 1}. ${img.title || 'No Title'}\n`;
      content += `${img.filename}\n\n`;
    });
    
    fs.writeFileSync(templatePath, content);
    console.log(`\n📝 Template created: ${templatePath}`);
    console.log('✏️  Edit this file to rearrange the order, then use option 4 to apply changes.');
  }

  // Read template and apply order
  applyFromTemplate(categorySlug) {
    const templatePath = `${categorySlug}-order-template.txt`;
    
    if (!fs.existsSync(templatePath)) {
      console.log(`❌ Template not found: ${templatePath}`);
      console.log('Use option 3 to generate a template first.');
      return;
    }
    
    const content = fs.readFileSync(templatePath, 'utf8');
    const lines = content.split('\n');
    const filenames = lines
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => line.trim());
    
    if (filenames.length === 0) {
      console.log('❌ No filenames found in template');
      return;
    }
    
    this.applyNewOrder(categorySlug, filenames);
  }

  // Quick fix for executive offices - move corner to top
  quickReorderExecutive() {
    const images = this.getImagesByCategory('executive-offices');
    
    // Find corner office images
    const cornerImages = images.filter(img => 
      img.filename.toLowerCase().includes('corner') || 
      img.title.toLowerCase().includes('corner')
    );
    
    // Find non-corner images  
    const nonCornerImages = images.filter(img => 
      !img.filename.toLowerCase().includes('corner') && 
      !img.title.toLowerCase().includes('corner')
    );
    
    // Reorder: corner first, then others
    const newOrder = [
      ...cornerImages.map(img => img.filename),
      ...nonCornerImages.map(img => img.filename)
    ];
    
    console.log('\n🚀 Quick reorder: Moving corner offices to top');
    console.log(`📊 Found ${cornerImages.length} corner images, ${nonCornerImages.length} others`);
    
    this.applyNewOrder('executive-offices', newOrder);
  }
}

// Main execution
function main() {
  const manager = new ImageOrderManager();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Interactive mode
    manager.showMenu();
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Enter your choice: ', (choice) => {
      switch(choice) {
        case '1':
          manager.showAllCategories();
          break;
        case '2':
          rl.question('Enter category slug (home-offices, executive-offices, minimalist, lobbies, private-offices): ', (cat) => {
            manager.showCategoryOrder(cat);
            rl.close();
          });
          return;
        case '3':
          rl.question('Enter category slug: ', (cat) => {
            manager.generateTemplate(cat);
            rl.close();
          });
          return;
        case '4':
          rl.question('Enter category slug: ', (cat) => {
            manager.applyFromTemplate(cat);
            rl.close();
          });
          return;
        case '5':
          manager.quickReorderExecutive();
          break;
        case '0':
          console.log('👋 Goodbye!');
          break;
        default:
          console.log('❌ Invalid choice');
      }
      rl.close();
    });
  } else {
    // Command line mode
    const command = args[0];
    const category = args[1];
    
    switch(command) {
      case 'show':
        if (category) {
          manager.showCategoryOrder(category);
        } else {
          manager.showAllCategories();
        }
        break;
      case 'template':
        if (category) {
          manager.generateTemplate(category);
        } else {
          console.log('Usage: node image-order-manager.js template <category-slug>');
        }
        break;
      case 'apply':
        if (category) {
          manager.applyFromTemplate(category);
        } else {
          console.log('Usage: node image-order-manager.js apply <category-slug>');
        }
        break;
      case 'exec-fix':
        manager.quickReorderExecutive();
        break;
      default:
        console.log('Available commands:');
        console.log('  node image-order-manager.js show [category]');
        console.log('  node image-order-manager.js template <category>');
        console.log('  node image-order-manager.js apply <category>');
        console.log('  node image-order-manager.js exec-fix');
    }
  }
}

main();