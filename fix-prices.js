const fs = require('fs');
const metadata = JSON.parse(fs.readFileSync('./public/data/image-metadata.json', 'utf8'));

Object.keys(metadata).forEach(key => {
  if (metadata[key].isPremium) {
    metadata[key].price = '7.99';
  }
});

fs.writeFileSync('./public/data/image-metadata.json', JSON.stringify(metadata, null, 2));
console.log('Fixed all prices to $7.99');