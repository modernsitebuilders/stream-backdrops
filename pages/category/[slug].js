// REPLACE your pages/category/[slug].js file completely

import { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';
import Image from 'next/image';

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [imageMetadata, setImageMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImages, setShowImages] = useState(false);
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only mount on client to prevent SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const categoryInfo = useMemo(() => ({
    'home-offices': {
      name: 'Home Offices',
      description: 'Professional home office backgrounds perfect for remote work and video calls'
    },
    'executive-offices': {
      name: 'Executive Offices', 
      description: 'Luxury executive office backgrounds for leadership meetings and professional calls'
    },
    'minimalist': {
      name: 'Minimalist',
      description: 'Clean, minimalist backgrounds for modern professionals'
    },
    'lobbies': {
      name: 'Lobbies',
      description: 'Professional lobby backgrounds for client meetings and business calls'
    },
    'private-offices': {
      name: 'Private Offices',
      description: 'Specialized private office backgrounds for professional consultations and meetings'
    }
  }), []);

  // FIXED: Priority images with correct executive office order
  const priorityImages = useMemo(() => ({
    'home-offices': [
      'clean-scandinavian-home-office-2',
      'biophilic-home-office-with-plants-2',
      'clean-modern-home-office-1',
      'scandinavian-home-office-1',
      'home-office-with-wood-accent-wall-1',
      'cozy-professional-home-office-1'
    ],
    'executive-offices': [
      'corner-office-with-city-views-1',        // FIRST as requested
      'executive-office-with-dark-wood-1',      // SECOND as requested  
      'executive-office-with-marble-wall-1',
      'contemporary-executive-home-office-1',
      'minimalist-executive-office-1'
    ],
    'private-offices': [
      'private-office-with-bookshelf-1',
      'professional-consultation-office-1',
      'warm-therapy-office-1',
      'contemporary-physicians-office-1',
      'upscale-real-estate-office-1'
    ],
    'lobbies': [
      'modern-glass-lobby-3',
      'corporate-lobby-with-reception-1',
      'modern-glass-lobby-1',
      'modern-office-lobby-1'
    ],
    'minimalist': [
      'minimalist-executive-office-1',
      'minimalist-consultant-office-1',
      'minimalist-medical-lobby-1',
      'japandi-minimalist-home-office-1'
    ]
  }), []);

  const categoryImages = useMemo(() => {
    if (!imageMetadata || !slug) return [];
    
    try {
      const filtered = Object.entries(imageMetadata)
        .filter(([_, data]) => {
          if (!data || typeof data !== 'object') return false;
          return data.category === slug;
        })
        .map(([key, data]) => ({ key, ...data }));

      const priorities = priorityImages[slug] || [];
      
      return filtered.sort((a, b) => {
        const aPriority = priorities.indexOf(a.key);
        const bPriority = priorities.indexOf(b.key);
        
        if (aPriority !== -1 && bPriority !== -1) {
          return aPriority - bPriority;
        }
        
        if (aPriority !== -1) return -1;
        if (bPriority !== -1) return 1;
        
        const titleA = a.title || '';
        const titleB = b.title || '';
        return titleA.localeCompare(titleB);
      });
    } catch (error) {
      console.error('Error filtering images:', error);
      return [];
    }
  }, [imageMetadata, slug, priorityImages]);

  const loadMetadata = useCallback(async () => {
    if (!slug || !mounted) return;
    
    try {
      setError(false);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('/api/metadata', {
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (typeof data === 'object' && data !== null) {
        setImageMetadata(data);
      } else {
        console.warn('Invalid metadata format received');
        setImageMetadata({});
      }
    } catch (error) {
      console.error('Failed to load metadata:', error);
      setImageMetadata({});
      setError(true);
    } finally {
      setLoading(false);
      setShowImages(true);
    }
  }, [slug, mounted]);

  useEffect(() => {
    if (slug && mounted) {
      loadMetadata();
    }
  }, [slug, mounted, loadMetadata]);

  const handleDownload = useCallback(async (image) => {
    try {
      const response = await fetch(`/images/${image.filename}`);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = image.filename.replace('.webp', '.png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
      const link = document.createElement('a');
      link.href = `/images/${image.filename}`;
      link.download = image.filename;
      link.click();
    }
  }, []);

  const handlePreview = useCallback((image) => {
    setSelectedImage(image);
  }, []);

  // Early return for invalid categories
  if (mounted && slug && !categoryInfo[slug]) {
    return (
      <>
        <Head>
          <title>Category Not Found - StreamBackdrops</title>
        </Head>
        <div style={{textAlign: 'center', padding: '4rem 2rem', minHeight: '50vh'}}>
          <h1 style={{color: '#111827', marginBottom: '1rem'}}>Category Not Found</h1>
          <p style={{color: '#6b7280', marginBottom: '2rem'}}>The category you're looking for doesn't exist.</p>
          <Link href="/" style={{color: '#2563eb', textDecoration: 'none', fontWeight: '600'}}>← Back to Home</Link>
        </div>
      </>
    );
  }

  // Loading state while router initializes
  if (!mounted || !router.isReady || !slug) {
    return (
      <>
        <Head>
          <title>Loading... - StreamBackdrops</title>
        </Head>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      </>
    );
  }

  const category = categoryInfo[slug];

  return (
    <>
      <Head>
        <title>{category.name} Virtual Backgrounds - StreamBackdrops</title>
        <meta name="description" content={`Download ${category.description.toLowerCase()}.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div>
        {/* HEADER WITH CLICKABLE LOGO */}
        <header>
          <div className="container">
            {/* CLICKABLE LOGO - FIXED */}
            <Link 
              href="/" 
              style={{
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: '1rem'
              }}
            >
              <h1 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 'bold',
                color: '#111827',
                cursor: 'pointer'
              }}>
                Stream<span className="logo-blue">Backdrops</span>
              </h1>
            </Link>
            
            <p className="subtitle">{category.name}</p>
            <p className="description">
              {category.description} • <span style={{
                background: '#16a34a',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>FREE</span> downloads • Perfect for Zoom, Teams & more
            </p>
            
            {/* Category Navigation */}
            <nav style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '1.5rem',
              paddingBottom: '0.5rem'
            }}>
              {Object.entries(categoryInfo).map(([key, info]) => (
                <Link 
                  key={key} 
                  href={`/category/${key}`}
                  style={{
                    padding: '0.5rem 1rem',
                    background: key === slug ? '#2563eb' : 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '1rem',
                    color: key === slug ? 'white' : '#6b7280',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  {info.name}
                </Link>
              ))}
              
              <Link 
                href="/premium"
                style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '1rem',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                ✨ Premium 4K
              </Link>
            </nav>
          </div>
        </header>

        {/* IMAGES SECTION */}
        <section style={{padding: '1.5rem 0'}}>
          <div className="container">
            {error ? (
              <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
                <h1 style={{color: '#111827', marginBottom: '1rem'}}>Unable to load backgrounds</h1>
                <button 
                  onClick={() => {
                    setError(false);
                    setLoading(true);
                    loadMetadata();
                  }}
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginRight: '1rem'
                  }}
                >
                  Try Again
                </button>
                <Link href="/" style={{color: '#2563eb'}}>← Back to Home</Link>
              </div>
            ) : !showImages || loading ? (
              <div style={{textAlign: 'center', padding: '2rem 0'}}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid #e5e7eb',
                  borderTop: '2px solid #2563eb',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }} />
              </div>
            ) : categoryImages.length === 0 ? (
              <div style={{textAlign: 'center', padding: '3rem 0'}}>
                <p style={{color: '#6b7280', marginBottom: '1rem'}}>No backgrounds available yet.</p>
                <p style={{color: '#6b7280', marginBottom: '2rem'}}>Check back soon or browse other categories.</p>
                <Link href="/" style={{color: '#2563eb', textDecoration: 'none', fontWeight: '600'}}>← Back to Home</Link>
              </div>
            ) : (
              <div className="category-grid">
                {categoryImages.map((image, index) => (
                  <div key={image.key} style={{
                    background: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    minHeight: '350px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                  }}
                  >
                    <div style={{position: 'relative', height: '250px', overflow: 'hidden', borderRadius: '1rem 1rem 0 0'}}>
                      <Image
                        src={`/images/${image.filename}`}
                        alt={image.alt || image.title || 'Virtual background'}
                        width={400}
                        height={225}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        loading="lazy"
                        quality={60}
                      />
                      
                      <div style={{
                        position: 'absolute',
                        bottom: '0.5rem',
                        left: '0.5rem',
                        right: '0.5rem',
                        display: 'flex',
                        gap: '0.5rem'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(image);
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            color: '#374151',
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            minHeight: '36px',
                            flex: 1
                          }}
                        >
                          👁️ Preview
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image);
                          }}
                          style={{
                            background: '#2563eb',
                            color: 'white',
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            minHeight: '36px',
                            flex: 1
                          }}
                        >
                          📥 Download
                        </button>
                      </div>
                    </div>

                    <div style={{padding: '1.5rem'}}>
                      <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem'}}>
                        {image.title || 'Virtual Background'}
                      </h3>
                      <p style={{color: '#6b7280', marginBottom: '1rem'}}>
                        {image.description || 'Professional virtual background'}
                      </p>
                      
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div style={{color: '#2563eb', fontWeight: '600', display: 'flex', alignItems: 'center'}}>
                          <span>Free Download</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* MODAL */}
        {selectedImage && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
            onClick={() => setSelectedImage(null)}
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1rem',
                maxWidth: '95vw',
                maxHeight: '90vh',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px'
                }}
              >
                ✕
              </button>
              
              <h3 style={{marginBottom: '0.75rem', paddingRight: '2rem', fontSize: '1rem', fontWeight: '600'}}>
                {selectedImage.title || 'Preview'}
              </h3>
              
              <Image
                src={`/images/${selectedImage.filename}`}
                alt={selectedImage.alt || 'Preview'}
                width={500}
                height={281}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '50vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  marginBottom: '0.75rem'
                }}
                priority
                quality={85}
              />
              
              <div style={{display: 'flex', gap: '0.75rem'}}>
                <button
                  onClick={() => handleDownload(selectedImage)}
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    flex: 1
                  }}
                >
                  📥 Download
                </button>
                
                <button
                  onClick={() => setSelectedImage(null)}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.query;
  
  const validCategories = [
    'home-offices',
    'executive-offices', 
    'minimalist',
    'lobbies',
    'private-offices'
  ];
  
  if (!slug || !validCategories.includes(slug)) {
    return { notFound: true };
  }
  
  return { props: { slug } };
}