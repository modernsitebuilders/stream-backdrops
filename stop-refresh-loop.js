// stop-refresh-loop.js - Create minimal working version
const fs = require('fs');
const path = require('path');

function createMinimalWorkingIndex() {
  console.log('🛟 Creating minimal working index.js...\n');
  
  const indexPath = path.join(__dirname, 'pages', 'index.js');
  
  // Backup current version
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, indexPath + '.broken-backup');
    console.log('💾 Backed up broken index.js');
  }
  
  // Create minimal working version
  const minimalIndex = `import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const categories = {
    'professional-shelves': {
      name: 'Professional Shelves',
      description: 'Professional office shelves with books and plants',
      count: 42
    },
    'home-lifestyle': {
      name: 'Home & Lifestyle', 
      description: 'Stylish home offices and lifestyle spaces',
      count: 48
    }
  };

  return (
    <>
      <Head>
        <title>Stream Backdrops - Professional Virtual Backgrounds</title>
      </Head>

      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
          Stream Backdrops
        </h1>
        
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {Object.entries(categories).map(([slug, info]) => (
            <div key={slug} style={{ 
              background: 'white', 
              padding: '1.5rem', 
              marginBottom: '1rem', 
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {info.name}
              </h2>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                {info.description}
              </p>
              <p style={{ fontWeight: 'bold' }}>
                {info.count} images available
              </p>
              <Link href={\`/category/\${slug}\`} style={{ color: '#2563eb' }}>
                View Category →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}`;

  fs.writeFileSync(indexPath, minimalIndex);
  console.log('✅ Created minimal working index.js');
  console.log('\n🚀 Now try: npm run dev');
}

createMinimalWorkingIndex();// stop-refresh-loop.js - Create minimal working version to stop refresh loop
// Run with: node stop-refresh-loop.js

const fs = require('fs');
const path = require('path');

function createMinimalWorkingIndex() {
  console.log('🛟 Creating minimal working index.js to stop refresh loop...\n');
  
  const indexPath = path.join(__dirname, 'pages', 'index.js');
  
  // Backup current broken version
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, indexPath + '.broken-backup');
    console.log('💾 Backed up broken index.js');
  }
  
  // Create a minimal working version
  const minimalIndex = `import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [imageMetadata, setImageMetadata] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const response = await fetch('/api/metadata');
        if (response.ok) {
          const data = await response.json();
          setImageMetadata(data || {});
        }
      } catch (error) {
        console.error('Failed to load metadata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, []);

  const categories = {
    'professional-shelves': {
      name: 'Professional Shelves',
      description: 'Professional office shelves with books and plants',
      count: 42
    },
    'home-lifestyle': {
      name: 'Home & Lifestyle', 
      description: 'Stylish home offices and lifestyle spaces',
      count: 48
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Stream Backdrops - Professional Virtual Backgrounds</title>
        <meta name="description" content="Professional virtual backgrounds for video calls" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        {/* Header */}
        <header style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1rem 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
              Stream Backdrops
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Professional Virtual Backgrounds
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
              High-quality backgrounds for your video calls
            </p>
          </div>

          {/* Categories */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {Object.entries(categories).map(([slug, info]) => (
              <Link 
                key={slug}
                href={\\`/category/\\${slug}\\`}
                style={{ 
                  display: 'block',
                  background: 'white',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {info.name}
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  {info.description}
                </p>
                <div style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: '500' }}>
                  {info.count} images →
                </div>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: 'white', borderRadius: '0.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
              Your Curated Collection
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>90</div>
                <div style={{ color: '#6b7280' }}>Total Images</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>2</div>
                <div style={{ color: '#6b7280' }}>Categories</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}`;

  fs.writeFileSync(indexPath, minimalIndex);
  console.log('✅ Created minimal working index.js');
  
  console.log('\n🚀 Try starting your dev server now:');
  console.log('   npm run dev');
  console.log('\nThis minimal version should stop the refresh loop.');
  console.log('Once it\'s working, we can gradually add back features.');
  
  console.log('\n💡 To restore your original (broken) version:');
  console.log('   cp pages/index.js.broken-backup pages/index.js');
}

createMinimalWorkingIndex();