// check-lobby-images.js
// Shows all images in lobbies category to see what's there
// Run with: node check-lobby-images.js

const fs = require('fs');
const path = require('path');

function checkLobbyImages() {
  console.log('🔍 Checking all images in lobbies category...\n');
  
  const metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.log('❌ Metadata file not found!');
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  // Find all lobby images
  const lobbyImages = Object.entries(metadata)
    .filter(([_, data]) => data.category === 'lobbies')
    .sort(([,a], [,b]) => a.title.localeCompare(b.title));
  
  console.log(`📁 LOBBIES category (${lobbyImages.length} images):`);
  console.log('═'.repeat(60));
  
  let premiumCount = 0;
  let nonPremiumCount = 0;
  
  lobbyImages.forEach(([key, data]) => {
    const isPremium = data.isPremium || data.title.includes('Premium 4K');
    const premiumStatus = isPremium ? '💎 PREMIUM' : '🆓 FREE';
    
    if (isPremium) premiumCount++;
    else nonPremiumCount++;
    
    console.log(`${premiumStatus} "${data.title}"`);
    console.log(`   File: ${data.filename}`);
    console.log('');
  });
  
  console.log(`📊 Lobby breakdown:`);
  console.log(`   🆓 Free images: ${nonPremiumCount}`);
  console.log(`   💎 Premium images: ${premiumCount}`);
  console.log(`   📋 Total: ${lobbyImages.length}`);
  
  // Check for "Luxury Corporate Lobby" variants
  console.log('\n🔍 Luxury Corporate Lobby variants:');
  const luxuryLobbyImages = lobbyImages.filter(([_, data]) => 
    data.title.toLowerCase().includes('luxury corporate lobby')
  );
  
  if (luxuryLobbyImages.length > 0) {
    luxuryLobbyImages.forEach(([key, data]) => {
      const isPremium = data.isPremium || data.title.includes('Premium 4K');
      console.log(`   ${isPremium ? '💎' : '🆓'} "${data.title}" - ${data.filename}`);
    });
  } else {
    console.log('   ❌ No Luxury Corporate Lobby images found');
  }
  
  // Suggest what might be missing
  console.log('\n💡 Analysis:');
  if (luxuryLobbyImages.length === 1 && luxuryLobbyImages[0][1].title.includes('Premium 4K')) {
    console.log('   ⚠️  Only premium version of Luxury Corporate Lobby found');
    console.log('   🤔 Non-premium versions might be:');
    console.log('      - Never created');
    console.log('      - Categorized elsewhere');
    console.log('      - Named differently');
  }
}

checkLobbyImages();