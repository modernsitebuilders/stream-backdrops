// fix-real-project.js - Fix the actual project with curated collection
const fs = require('fs');
const path = require('path');

// Copy the working metadata from the new project to the real project
const newMetadataPath = path.join('..', '..', 'stream-backdrops-new', 'public', 'data', 'image-metadata.json');
const realMetadataPath = path.join('public', 'data', 'image-metadata.json');

if (fs.existsSync(newMetadataPath)) {
  const cleanMetadata = fs.readFileSync(newMetadataPath, 'utf8');
  fs.writeFileSync(realMetadataPath, cleanMetadata);
  console.log('✅ Copied clean metadata to real project');
} else {
  console.log('❌ Clean metadata not found');
}

console.log('✅ Real project should now work with your curated collection!');