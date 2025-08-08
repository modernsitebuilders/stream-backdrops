// create-clean-image-gallery.js - Remove titles, focus on images
const fs = require('fs');
const path = require('path');

const categoryPagePath = path.join(__dirname, 'pages', 'category', '[slug].js');

const cleanGalleryPage = `import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../components/Footer';

const categoryInfo = {
  'professional-shelves': {
    name: 'Professional Shelves',
    description: 'Professional office shelves with books and plants - perfect for business video calls'
  },
  'home-lifestyle': {
    name: 'Home & Lifestyle', 
    description: 'Stylish home offices and lifestyle spaces - ideal for creative professionals'
  }
};

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    async function loadImages() {
      if (!slug) return;
      
      try {
        const response = await fetch('/api/metadata');
        const metadata = await response.json();
        
        const categoryImages = Object.entries(metadata)
          .filter(([_, data]) => data.category === slug)
          .map(([key, data]) => ({
            id: key,
            ...data
          }));

        setImages(categoryImages);
      } catch (error) {
        console.error('Error loading images:', error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, [slug]);

  const openPreview = (image) => {
    setPreviewImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closePreview = () => {
    setPreviewImage(null);
    document.body.style.overflow = 'unset';
  };

  const category = categoryInfo[slug];

  if (!category) {
    return (
      <>
        <Head>
          <title>Category Not Found - StreamBackdrops</title>
        </Head>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Category Not Found</h1>
          <Link href="/">← Back to Home</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{\`\${category.name} Virtual Backgrounds - StreamBackdrops\`}</title>
        <meta name="description" content={category.description} />
      </Head>

      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        {/* Navigation */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 0',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <nav style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link href="/" style={{
                padding: '0.5rem 1rem',
                background: '#f3f4f6',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                🏠 Home
              </Link>
              
              {Object.entries(categoryInfo).map(([categorySlug, info]) => (
                <Link 
                  key={categorySlug}
                  href={\`/category/\${categorySlug}\`}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    color: categorySlug === slug ? 'white' : '#6b7280',
                    background: categorySlug === slug ? '#2563eb' : '#f3f4f6',
                    fontWeight: '500'
                  }}
                >
                  {info.name}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* Category Header */}
        <div style={{ 
          background: 'white', 
          textAlign: 'center', 
          padding: '2rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '0.5rem',
            color: '#111827'
          }}>
            {category.name}
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1.1rem',
            marginBottom: '0.5rem'
          }}>
            {category.description}
          </p>
          <p style={{ 
            fontWeight: '600',
            color: '#2563eb'
          }}>
            {loading ? 'Loading...' : \`\${images.length} backgrounds available\`}
          </p>
        </div>

        {/* Images Grid - No titles, just images */}
        <main style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '2rem 1rem'
        }}>
          {loading ? (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {[...Array(12)].map((_, i) => (
                <div key={i} style={{
                  aspectRatio: '16/9',
                  background: '#f3f4f6',
                  borderRadius: '0.5rem',
                  animation: 'pulse 2s infinite'
                }} />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                No images found in this category.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {images.map((image, index) => (
                <div 
                  key={image.id} 
                  style={{
                    position: 'relative',
                    aspectRatio: '16/9',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => openPreview(image)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <Image
                    src={\`/images/\${image.filename}\`}
                    alt={\`Background \${index + 1}\`}
                    fill
                    style={{ objectFit: 'cover' }}
                    loading={index < 8 ? 'eager' : 'lazy'}
                  />
                  
                  {/* Hover overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                  >
                    <div style={{
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      textAlign: 'center'
                    }}>
                      👁️ Click to Preview
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Clean Preview Modal */}
      {previewImage && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
          onClick={closePreview}
        >
          <div 
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1000px',
              aspectRatio: '16/9',
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={\`/images/\${previewImage.filename}\`}
              alt="Background Preview"
              fill
              style={{ objectFit: 'contain' }}
            />
            
            {/* Close button */}
            <button
              onClick={closePreview}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '3rem',
                height: '3rem',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
            
            {/* Download button */}
            <a 
              href={\`/images/\${previewImage.filename}\`}
              download={previewImage.filename}
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#2563eb',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '2rem',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              📥 Download Background
            </a>
          </div>
        </div>
      )}

      <style jsx>{\`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      \`}</style>
    </>
  );
}`;

if (fs.existsSync(categoryPagePath)) {
  fs.writeFileSync(categoryPagePath + '.with-titles-backup', fs.readFileSync(categoryPagePath));
  fs.writeFileSync(categoryPagePath, cleanGalleryPage);
  console.log('✅ Created clean image gallery:');
  console.log('   🖼️  Images only - no cluttering titles');
  console.log('   👁️  Click any image to preview');
  console.log('   ✨  Hover effects for better UX');
  console.log('   📱  Responsive grid layout');
  console.log('   🚀  Faster loading with lazy loading');
  console.log('   🎯  Sticky navigation');
} else {
  console.log('❌ Category page not found');
}