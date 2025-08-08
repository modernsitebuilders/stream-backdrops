// fix-next-config.js - Remove the deprecated reactRefresh option
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'next.config.js');

if (fs.existsSync(configPath)) {
  let content = fs.readFileSync(configPath, 'utf8');
  
  // Remove any reactRefresh references
  content = content.replace(/,?\s*reactRefresh:\s*[^,}]+,?/g, '');
  content = content.replace(/reactRefresh:\s*[^,}]+,?\s*/g, '');
  
  // Clean up any empty experimental objects or trailing commas
  content = content.replace(/experimental:\s*\{\s*\},?/g, '');
  content = content.replace(/,(\s*\})/g, '$1'); // Remove trailing commas
  
  fs.writeFileSync(configPath, content);
  console.log('✅ Removed deprecated reactRefresh from next.config.js');
} else {
  console.log('❌ next.config.js not found');
}