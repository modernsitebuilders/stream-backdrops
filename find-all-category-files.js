// find-all-category-files.js - Find ALL files with old category references
// Run with: node find-all-category-files.js

const fs = require('fs');
const path = require('path');

function searchInFile(filePath, searchTerms) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const foundTerms = [];
    
    searchTerms.forEach(term => {
      if (content.includes(term)) {
        foundTerms.push(term);
      }
    });
    
    return foundTerms.length > 0 ? { file: filePath, terms: foundTerms, content } : null;
  } catch (error) {
    return null;
  }
}

function findAllCategoryFiles() {
  console.log('🔍 Searching ALL files for old category references...\n');
  
  // Old categories to search for
  const oldCategories = [
    'home-offices',
    'executive-offices',
    'minimalist', 
    'lobbies',
    'conference-rooms',
    'private-offices',
    'open-offices'
  ];
  
  // Directories to search
  const searchDirs = [
    'pages',
    'components', 
    'lib',
    'utils',
    'hooks',
    'context',
    'styles'
  ];
  
  const problematicFiles = [];
  
  function searchDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively search subdirectories
        searchDirectory(fullPath);
      } else if (item.endsWith('.js') || item.endsWith('.jsx') || item.endsWith('.ts') || item.endsWith('.tsx')) {
        // Search JavaScript/TypeScript files
        const result = searchInFile(fullPath, oldCategories);
        if (result) {
          problematicFiles.push(result);
        }
      }
    });
  }
  
  // Search all directories
  searchDirs.forEach(dir => {
    console.log(`🔍 Searching ${dir}/...`);
    searchDirectory(path.join(__dirname, dir));
  });
  
  console.log(`\n📊 Found ${problematicFiles.length} files with old categories:\n`);
  
  // Show each problematic file
  problematicFiles.forEach(({ file, terms }) => {
    console.log(`🚨 ${file}:`);
    terms.forEach(term => console.log(`   - Contains: "${term}"`));
    console.log('');
  });
  
  // Create fix suggestions for each file
  if (problematicFiles.length > 0) {
    console.log('🛠️  FIXES NEEDED:\n');
    
    problematicFiles.forEach(({ file, terms, content }) => {
      console.log(`📝 ${file}:`);
      
      // Show specific lines that need changing
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        const foundTerm = terms.find(term => line.includes(term));
        if (foundTerm) {
          console.log(`   Line ${index + 1}: ${line.trim()}`);
          
          // Suggest replacement
          const newCategory = foundTerm.includes('home') || foundTerm.includes('executive') ? 
            'home-lifestyle' : 'professional-shelves';
          const newLine = line.replace(foundTerm, newCategory);
          console.log(`   Replace with: ${newLine.trim()}`);
          console.log('');
        }
      });
      console.log('─'.repeat(50) + '\n');
    });
    
    // Create an auto-fix script
    console.log('🤖 Creating auto-fix script...');
    
    const autoFixScript = `// auto-fix-categories.js - Automatically fix old category references
const fs = require('fs');

const fixes = [
${problematicFiles.map(({ file }) => `  '${file}'`).join(',\n')}
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
      new RegExp(\`'\${oldCat}'\`, 'g'),
      new RegExp(\`"\${oldCat}"\`, 'g'),
      new RegExp(\`\${oldCat}:\`, 'g')
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
    console.log(\`✅ Fixed: \${file}\`);
  }
});

console.log('🎉 All files fixed!');
`;
    
    fs.writeFileSync('auto-fix-categories.js', autoFixScript);
    console.log('✅ Created auto-fix-categories.js');
    
    console.log('\n🚀 To automatically fix all files:');
    console.log('   node auto-fix-categories.js');
    
  } else {
    console.log('✅ No files found with old category references!');
  }
}

findAllCategoryFiles();