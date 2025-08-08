import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../components/Footer';

// ADD OFFICE-SPACES HERE - This is what was missing!
const categoryInfo = {
  'professional-shelves': {
    name: 'Professional',
    description: 'Professional office shelves with books and plants - perfect for business video calls'
  },
  'home-lifestyle': {
    name: 'Home & Lifestyle', 
    description: 'Stylish home offices and lifestyle spaces - ideal for creative professionals'
  },
  'office-spaces': {
    name: 'Office Spaces',
    description: 'Professional office environments and workspace backgrounds for business video calls'
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

  // Add keyboard navigation
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Escape') {
      closePreview();
    }
  }, []);

  useEffect(() => {
    if (previewImage) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [previewImage, handleKeyPress]);

  const downloadImage = (filename) => {
    const link = document.createElement('a');
    link.href = `/images/${filename}`;
    link.download = filename;
    link.click();
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
        <title>{`${category.name} Virtual Backgrounds - StreamBackdrops`}</title>
        <meta name="description" content={category.description} />
      </Head>

      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        {/* Navigation */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 0',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <nav style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <Link href="/" style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#2563eb',
                textDecoration: 'none'
              }}>
                🎥 StreamBackdrops
              </Link>
              
              <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <Link href="/category/professional-shelves" style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: slug === 'professional-shelves' ? '#2563eb' : '#374151',
                  fontWeight: slug === 'professional-shelves' ? '600' : '500',
                  background: slug === 'professional-shelves' ? '#eff6ff' : '#f9fafb',
                  border: '1px solid #d1d5db'
                }}>
                  Professional
                </Link>
                
                <Link href="/category/home-lifestyle" style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: slug === 'home-lifestyle' ? '#2563eb' : '#374151',
                  fontWeight: slug === 'home-lifestyle' ? '600' : '500',
                  background: slug === 'home-lifestyle' ? '#eff6ff' : '#f9fafb',
                  border: '1px solid #d1d5db'
                }}>
                  Home & Lifestyle
                </Link>
                
                <Link href="/category/office-spaces" style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: slug === 'office-spaces' ? '#2563eb' : '#374151',
                  fontWeight: slug === 'office-spaces' ? '600' : '500',
                  background: slug === 'office-spaces' ? '#eff6ff' : '#f9fafb',
                  border: '1px solid #d1d5db'
                }}>
                  Office Spaces
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* Page Header */}
        <div style={{ 
          background: 'white', 
          padding: '2rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              {category.name}
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              marginBottom: '1rem'
            }}>
              {category.description}
            </p>
            <p style={{
              fontSize: '0.9rem',
              color: '#9ca3af'
            }}>
              {images.length} backgrounds available • Click any image to download
            </p>
          </div>
        </div>

        {/* Image Gallery */}
        <main style={{ padding: '2rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {loading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{
                    background: '#f3f4f6',
                    borderRadius: '1rem',
                    aspectRatio: '16/9'
                  }} />
                ))}
              </div>
            ) : images.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: 'white',
                borderRadius: '1rem'
              }}>
                <h2 style={{ fontSize: '1.5rem', color: '#6b7280', marginBottom: '1rem' }}>
                  No images found in this category yet
                </h2>
                <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
                  We're working on adding more backgrounds. Check back soon!
                </p>
                <Link href="/" style={{
                  background: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                  ← Browse Other Categories
                </Link>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {images.map((image) => (
                  <div
                    key={image.id}
                    style={{
                      background: 'white',
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onClick={() => openPreview(image)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16/9',
                      overflow: 'hidden'
                    }}>
                      <Image
                        src={`/images/${image.filename}`}
                        alt={image.title || 'Virtual background'}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.1))',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '1rem',
                        opacity: 0,
                        transition: 'opacity 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                        <button
                          style={{
                            background: 'white',
                            color: '#2563eb',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            fontWeight: '500',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImage(image.filename);
                          }}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Preview Modal */}
        {previewImage && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '2rem'
            }}
            onClick={closePreview}
          >
            <div style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh'
            }}>
              <Image
                src={`/images/${previewImage.filename}`}
                alt={previewImage.title || 'Virtual background'}
                width={800}
                height={450}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '0.5rem'
                }}
              />
              <button
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '2rem',
                  height: '2rem',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
                onClick={closePreview}
              >
                ×
              </button>
              <button
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  background: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onClick={() => downloadImage(previewImage.filename)}
              >
                Download
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}