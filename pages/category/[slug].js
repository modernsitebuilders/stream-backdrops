import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../components/Footer';

const categoryInfo = {
  'professional-shelves': {
    name: 'Professional',
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

 const downloadAsPNG = useCallback(async (image) => {
    try {
      // Fetch the WebP image
      const response = await fetch(`/images/${image.filename}`);
      if (!response.ok) throw new Error('Failed to fetch image');
      
      const blob = await response.blob();
      
      // Create an image element to load the WebP
const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      // Wait for image to load with better error handling
      const imageLoaded = new Promise((resolve, reject) => {
        img.onload = () => {
          console.log('Image loaded successfully', img.naturalWidth, img.naturalHeight);
          resolve();
        };
        img.onerror = (error) => {
          console.error('Image failed to load:', error);
          reject(new Error('Image failed to load'));
        };
        img.src = URL.createObjectURL(blob);
      });
      
      await imageLoaded;
      
      // Create canvas and draw the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Failed to get canvas context');
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      console.log('Canvas dimensions:', canvas.width, canvas.height);
      
      // Draw the WebP image onto canvas
      ctx.drawImage(img, 0, 0);
      
      // Convert canvas to PNG blob with promise wrapper
      const pngBlobPromise = new Promise((resolve, reject) => {
        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            console.log('PNG blob created successfully', pngBlob.size);
            resolve(pngBlob);
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        }, 'image/png', 1.0);
      });
      
      const pngBlob = await pngBlobPromise;
      
      // Create download link
      const url = URL.createObjectURL(pngBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `StreamBackdrops-${image.filename.replace('.webp', '.png')}`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        URL.revokeObjectURL(img.src);
      }, 100);
      
      console.log('Download initiated successfully');
      
    } catch (error) {
      console.error('PNG conversion failed:', error);
      
      // Better fallback - direct blob download instead of opening new tab
      try {
        const response = await fetch(`/images/${image.filename}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = image.filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
        
      } catch (fallbackError) {
        console.error('Fallback download also failed:', fallbackError);
        alert('Download failed. Please try again or contact support.');
      }
    }
  }, []);

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
        <title>{`${category.name} Virtual Backgrounds - StreamBackdrops`}</title>
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
                  href={`/category/${categorySlug}`}
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
            {loading ? 'Loading...' : `${images.length} backgrounds available`}
          </p>
        </div>

        {/* Images Grid */}
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
                    src={`/images/${image.filename}`}
                    alt={`Background ${index + 1}`}
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

      {/* Preview Modal */}
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
              src={`/images/${previewImage.filename}`}
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
             <button
              onClick={() => downloadAsPNG(previewImage)}
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '2rem',
                fontWeight: '600',
                fontSize: '1.1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              📥 Download
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}