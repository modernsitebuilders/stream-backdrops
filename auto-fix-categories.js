// auto-fix-categories.js - Automatically fix old category references
const fs = require('fs');

const fixes = [
  'C:\Users\Dave\Desktop\stream-backdrops\nextjs-site\pages\blog-background-mistakes.js',
  'C:\Users\Dave\Desktop\stream-backdrops\nextjs-site\pages\category\[slug].js',
  'C:\Users\Dave\Desktop\stream-backdrops\nextjs-site\pages\index.js',
  'C:\Users\Dave\Desktop\stream-backdrops\nextjs-site\pages\premium.js',
  'C:\Users\Dave\Desktop\stream-backdrops\nextjs-site\pages\sitemap.xml.js',
  'C:\Users\Dave\Desktop\stream-backdrops\nextjs-site\components\CategoryCards.js',
  'C:\Users\Dave\Desktop\stream-backdrops\nextjs-site\components\ImageGallery.js'
];

const replacements = {
  'home-offices': 'home-lifestyle',
  'executive-offices': 'home-lifestyle',
  'minimalist': 'professional-shelves',
  'lobbies': 'professional-shelves', 
  'conference-rooms': 'professional-shelves',
  'private-offices': 'professional-shelves',
  'open-offices': 'professional-shelves'
};

fixes.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  Object.entries(replacements).forEach(([oldCat, newCat]) => {
    const oldPatterns = [
      new RegExp(`'${oldCat}'`, 'g'),
      new RegExp(`"${oldCat}"`, 'g'),
      new RegExp(`${oldCat}:`, 'g')
    ];
    
    oldPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, (match) => match.replace(oldCat, newCat));
        changed = true;
      }
    });
  });
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`✅ Fixed: ${file}`);
  }
});

console.log('🎉 All files fixed!');
