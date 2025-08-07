// file-finder-fixer.js
// Finds actual files and fixes metadata to match reality
// Run with: node file-finder-fixer.js

const fs = require('fs');
const path = require('path');

class FileFinderFixer {
  constructor() {
    this.metadataPath = path.join(__dirname, 'public', 'data', 'image-metadata.json');
    this.imagesDir = path.join(__dirname, 'public', 'images');
    this.metadata = {};
    this.actualFiles = [];
    
    this.loadMetadata();
    this.scanActualFiles();
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

  scanActualFiles() {
    if (fs.existsSync(this.imagesDir)) {
      this.actualFiles = fs.readdirSync(this.imagesDir)
        .filter(file => file.toLowerCase().endsWith('.webp'))
        .sort();
      console.log(`📁 Found ${this.actualFiles.length} .webp files in public/images/`);
    } else {
      console.log('❌ Images directory not found!');
      process.exit(1);
    }
  }

  // Find executive office files that actually exist
  findActualExecutiveFiles() {
    const execFiles = this.actualFiles.filter(file => {
      const lower = file.toLowerCase();
      return lower.includes('executive') || 
             lower.includes('corner-office') ||
             lower.includes('u9972584128');
    });

    console.log(`\n🎯 ACTUAL EXECUTIVE OFFICE FILES (${execFiles.length} found):`);
    console.log('=' .repeat(80));
    
    execFiles.forEach((file, index) => {
      // Check if this file exists in metadata
      const metadataEntry = this.metadata[file] || this.metadata[file.replace('.webp', '')];
      const hasMetadata = !!metadataEntry;
      
      console.log(`${(index + 1).toString().padStart(2)}. ${file}`);
      console.log(`    📊 Metadata: ${hasMetadata ? '✅' : '❌'}`);
      if (hasMetadata) {
        console.log(`    📝 Title: ${metadataEntry.title || 'No Title'}`);
      }
    });

    return execFiles;
  }

  // Check metadata vs actual files
  findMetadataMismatches() {
    console.log(`\n🔍 CHECKING METADATA VS ACTUAL FILES:`);
    console.log('=' .repeat(80));

    const issues = [];

    // Check metadata entries that don't have corresponding files
    Object.keys(this.metadata).forEach(metadataKey => {
      const data = this.metadata[metadataKey];
      
      if (data.category === 'executive-offices') {
        // Try different filename variations
        const possibleFiles = [
          metadataKey,
          metadataKey + '.webp',
          data.filename,
          data.filename + '.webp'
        ].filter(f => f && f !== 'undefined');

        const actualFile = possibleFiles.find(filename => 
          this.actualFiles.includes(filename)
        );

        if (!actualFile) {
          issues.push({
            type: 'missing_file',
            metadataKey: metadataKey,
            title: data.title,
            expectedFiles: possibleFiles
          });
        } else if (metadataKey !== actualFile) {
          issues.push({
            type: 'filename_mismatch',
            metadataKey: metadataKey,
            actualFile: actualFile,
            title: data.title
          });
        }
      }
    });

    // Check actual files that don't have metadata
    this.actualFiles.forEach(file => {
      if (file.toLowerCase().includes('executive') || file.toLowerCase().includes('u9972584128')) {
        const hasMetadata = this.metadata[file] || 
                          this.metadata[file.replace('.webp', '')] ||
                          Object.values(this.metadata).some(data => 
                            data.filename === file || data.filename === file.replace('.webp', '')
                          );
        
        if (!hasMetadata) {
          issues.push({
            type: 'missing_metadata',
            actualFile: file
          });
        }
      }
    });

    console.log(`\n📊 ISSUES FOUND: ${issues.length}`);
    
    issues.forEach((issue, index) => {
      console.log(`\n${index + 1}. ${issue.type.toUpperCase().replace('_', ' ')}`);
      
      switch(issue.type) {
        case 'missing_file':
          console.log(`   📝 Title: ${issue.title}`);
          console.log(`   🔑 Metadata Key: ${issue.metadataKey}`);
          console.log(`   🔍 Looking for: ${issue.expectedFiles.join(', ')}`);
          break;
          
        case 'filename_mismatch':
          console.log(`   📝 Title: ${issue.title}`);
          console.log(`   🔑 Metadata Key: ${issue.metadataKey}`);
          console.log(`   📄 Actual File: ${issue.actualFile}`);
          break;
          
        case 'missing_metadata':
          console.log(`   📄 File exists: ${issue.actualFile}`);
          console.log(`   ❌ No metadata found`);
          break;
      }
    });

    return issues;
  }

  // Fix filename mismatches in metadata
  fixMetadata(dryRun = true) {
    console.log(`\n${dryRun ? '🔍 DRY RUN' : '🔧 FIXING'} METADATA ISSUES`);
    console.log('=' .repeat(60));

    const issues = this.findMetadataMismatches();
    const fixableIssues = issues.filter(issue => 
      issue.type === 'filename_mismatch' || issue.type === 'missing_file'
    );

    if (fixableIssues.length === 0) {
      console.log('✅ No fixable issues found!');
      return;
    }

    const newMetadata = { ...this.metadata };
    let fixCount = 0;

    fixableIssues.forEach(issue => {
      if (issue.type === 'filename_mismatch') {
        console.log(`🔧 Fixing filename mismatch:`);
        console.log(`   Title: ${issue.title}`);
        console.log(`   Old key: ${issue.metadataKey}`);
        console.log(`   New key: ${issue.actualFile}`);
        
        if (!dryRun) {
          // Move metadata to correct key
          newMetadata[issue.actualFile] = { 
            ...newMetadata[issue.metadataKey],
            filename: issue.actualFile
          };
          delete newMetadata[issue.metadataKey];
        }
        fixCount++;
        
      } else if (issue.type === 'missing_file') {
        // Try to find a similar file
        const title = issue.title.toLowerCase();
        const possibleMatches = this.actualFiles.filter(file => {
          const fileLower = file.toLowerCase();
          return (title.includes('corner') && fileLower.includes('corner')) ||
                 (title.includes('financial') && fileLower.includes('financial')) ||
                 (title.includes('forest') && fileLower.includes('forest')) ||
                 (title.includes('marble') && fileLower.includes('marble')) ||
                 (title.includes('medical') && fileLower.includes('medical'));
        });

        if (possibleMatches.length > 0) {
          const bestMatch = possibleMatches[0];
          console.log(`🔍 Found potential match for "${issue.title}":`);
          console.log(`   Old key: ${issue.metadataKey}`);
          console.log(`   Potential file: ${bestMatch}`);
          
          if (!dryRun) {
            newMetadata[bestMatch] = { 
              ...newMetadata[issue.metadataKey],
              filename: bestMatch
            };
            delete newMetadata[issue.metadataKey];
          }
          fixCount++;
        } else {
          console.log(`❌ No match found for "${issue.title}"`);
        }
      }
    });

    if (!dryRun && fixCount > 0) {
      fs.writeFileSync(this.metadataPath, JSON.stringify(newMetadata, null, 2));
      console.log(`💾 Metadata updated with ${fixCount} fixes!`);
    }

    console.log(`\n📊 SUMMARY: ${fixCount} issues ${dryRun ? 'would be' : 'were'} fixed`);
    
    if (dryRun && fixCount > 0) {
      console.log(`\n🚀 To apply fixes, run: node file-finder-fixer.js --fix`);
    }
  }

  // Show all executive files with clean potential names
  showCleanupPreview() {
    const execFiles = this.findActualExecutiveFiles();
    
    console.log(`\n🧹 CLEANUP PREVIEW - WHAT THESE FILES COULD BECOME:`);
    console.log('=' .repeat(80));

    execFiles.forEach((file, index) => {
      const metadataEntry = this.metadata[file] || this.metadata[file.replace('.webp', '')];
      
      if (metadataEntry) {
        const cleanName = this.generateCleanFilename(metadataEntry.title, file);
        console.log(`${(index + 1).toString().padStart(2)}. ${metadataEntry.title}`);
        console.log(`    OLD: ${file}`);
        console.log(`    NEW: ${cleanName}`);
        console.log('');
      }
    });
  }

  generateCleanFilename(title, oldFilename) {
    let cleanName = title
      .toLowerCase()
      .replace(/ - premium 4k/gi, '-premium-4k')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const extension = path.extname(oldFilename);
    return `${cleanName}${extension}`;
  }
}

// Main execution
function main() {
  const fixer = new FileFinderFixer();
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');
  
  console.log('🔍 FILE FINDER & METADATA FIXER');
  console.log('================================');
  
  // Show actual executive files
  fixer.findActualExecutiveFiles();
  
  // Check for issues
  fixer.findMetadataMismatches();
  
  // Fix issues
  fixer.fixMetadata(!shouldFix);
  
  // Show cleanup preview
  fixer.showCleanupPreview();
}

if (require.main === module) {
  main();
}