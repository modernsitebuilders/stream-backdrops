// precise-category-moves.js
// Makes the exact moves you specified + updates titles appropriately
// Run with: node precise-category-moves.js

const fs = require('fs');
const path = require('path');

function preciseCategoryMoves() {
  console.log('🎯 Making precise category moves based on your list...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  let metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  let movedCount = 0;
  
  // Define the exact moves
  const moves = [
    // FROM HOME-OFFICES → TO EXECUTIVE-OFFICES
    { filename: 'contemporary-executive-home-office-1.webp', to: 'executive-offices', newTitle: 'Contemporary Executive Office' },
    { filename: 'contemporary-executive-home-office-2.webp', to: 'executive-offices', newTitle: 'Contemporary Executive Office' },
    { filename: 'contemporary-executive-home-office-3.webp', to: 'executive-offices', newTitle: 'Contemporary Executive Office' },
    { filename: 'contemporary-executive-home-office-4.webp', to: 'executive-offices', newTitle: 'Contemporary Executive Office' },
    { filename: 'contemporary-executive-home-office-6.webp', to: 'executive-offices', newTitle: 'Contemporary Executive Office' },
    
    // FROM HOME-OFFICES → TO MINIMALIST
    { filename: 'home-office-with-wood-accent-wall-1.webp', to: 'minimalist', newTitle: 'Minimalist Home Office With Wood Accent' },
    { filename: 'home-office-with-wood-accent-wall-2.webp', to: 'minimalist', newTitle: 'Minimalist Home Office With Wood Accent' },
    { filename: 'home-office-with-wood-accent-wall-3.webp', to: 'minimalist', newTitle: 'Minimalist Home Office With Wood Accent' },
    { filename: 'cozy-professional-home-office-2.webp', to: 'minimalist', newTitle: 'Minimalist Professional Home Office' },
    { filename: 'cozy-professional-home-office-3.webp', to: 'minimalist', newTitle: 'Minimalist Professional Home Office' },
    { filename: 'home-office-with-plant-accent-1.webp', to: 'minimalist', newTitle: 'Minimalist Home Office With Plant Accent' },
    { filename: 'home-office-with-plant-accent-2.webp', to: 'minimalist', newTitle: 'Minimalist Home Office With Plant Accent' },
    { filename: 'home-office-with-plant-accent-3.webp', to: 'minimalist', newTitle: 'Minimalist Home Office With Plant Accent' },
    { filename: 'scandinavian-home-office-1.webp', to: 'minimalist', newTitle: 'Minimalist Scandinavian Home Office' },
    { filename: 'scandinavian-home-office-3.webp', to: 'minimalist', newTitle: 'Minimalist Scandinavian Home Office' },
    { filename: 'industrial-home-office-with-concrete-1.webp', to: 'minimalist', newTitle: 'Minimalist Industrial Home Office' },
    { filename: 'traditional-home-office-with-wood-1.webp', to: 'minimalist', newTitle: 'Minimalist Traditional Home Office' },
    { filename: 'premium-4k-scandinavian-home-office-with-wood-accent-5.webp', to: 'minimalist', newTitle: 'Minimalist Scandinavian Home Office - Premium 4K' },
    
    // FROM EXECUTIVE-OFFICES → TO PRIVATE-OFFICES
    { filename: 'corner-office-with-city-views-1.webp', to: 'private-offices', newTitle: 'Private Corner Office With City Views' },
    { filename: 'corner-office-with-city-views-2.webp', to: 'private-offices', newTitle: 'Private Corner Office With City Views' },
    { filename: 'executive-office-with-marble-wall-1.webp', to: 'private-offices', newTitle: 'Private Office With Marble Wall' },
    { filename: 'executive-office-with-marble-wall-2.webp', to: 'private-offices', newTitle: 'Private Office With Marble Wall' },
    { filename: 'executive-office-with-marble-wall-3.webp', to: 'private-offices', newTitle: 'Private Office With Marble Wall' },
    { filename: 'executive-office-with-marble-wall-4.webp', to: 'private-offices', newTitle: 'Private Office With Marble Wall' },
    { filename: 'executive-office-with-dark-wood-2.webp', to: 'private-offices', newTitle: 'Private Office With Dark Wood' },
    { filename: 'premium-4k-executive-office-with-city-view-1.webp', to: 'private-offices', newTitle: 'Private Office With City View - Premium 4K' },
    { filename: 'premium-4k-corner-executive-office-with-floor-to-ceiling-windows-2.webp', to: 'private-offices', newTitle: 'Private Corner Office With Floor-to-Ceiling Windows - Premium 4K' },
    
    // FROM EXECUTIVE-OFFICES → TO LOBBIES
    { filename: 'premium-4k-luxury-corporate-lobby-3.webp', to: 'lobbies', newTitle: 'Luxury Corporate Lobby - Premium 4K' },
    
    // FROM EXECUTIVE-OFFICES → TO MINIMALIST
    { filename: 'executive-office-with-dark-wood-1.webp', to: 'minimalist', newTitle: 'Minimalist Executive Office With Dark Wood' }
  ];
  
  console.log('📦 Making moves...\n');
  
  // Process each move
  moves.forEach(move => {
    // Find the image by filename
    const entry = Object.entries(metadata).find(([key, data]) => 
      data.filename === move.filename
    );
    
    if (entry) {
      const [key, data] = entry;
      const oldCategory = data.category;
      
      console.log(`🔄 MOVING: "${data.title}"`);
      console.log(`   File: ${move.filename}`);
      console.log(`   ${oldCategory} → ${move.to}`);
      console.log(`   Title: "${data.title}" → "${move.newTitle}"`);
      console.log('');
      
      // Update category and title
      metadata[key].category = move.to;
      metadata[key].title = move.newTitle;
      movedCount++;
    } else {
      console.log(`❌ NOT FOUND: ${move.filename}`);
    }
  });
  
  // Save changes
  try {
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`✅ Successfully moved and renamed ${movedCount} images\n`);
  } catch (error) {
    console.error('❌ Error saving file:', error);
    return;
  }
  
  // Show new distribution
  const finalCounts = {};
  Object.values(metadata).forEach(data => {
    finalCounts[data.category] = (finalCounts[data.category] || 0) + 1;
  });
  
  console.log('📊 New category distribution:');
  Object.entries(finalCounts).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} images`);
  });
  
  // Show what's in minimalist now
  const minimalistImages = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'minimalist');
  
  console.log(`\n🎨 New MINIMALIST collection (${minimalistImages.length} images):`);
  minimalistImages.forEach(([key, data]) => {
    console.log(`   ✓ "${data.title}" - ${data.filename}`);
  });
  
  if (minimalistImages.length > 0) {
    console.log('\n💡 Homepage image suggestion for minimalist:');
    const firstImage = minimalistImages[0][1];
    console.log(`   image: '${firstImage.filename}'  // ${firstImage.title}`);
  }
  
  console.log('\n🎉 Precise moves complete!');
  console.log('📝 Categories should now be much cleaner and logically organized.');
}

preciseCategoryMoves();