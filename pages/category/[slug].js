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
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // Memoize category info to prevent recreating on each render
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

  // Memoize filtered images to prevent recalculation
  const categoryImages = useMemo(() => {
    return Object.entries(imageMetadata)
      .filter(([_, data]) => {
        if (!data || !slug) return false;
        return data.category === slug;
      })
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [imageMetadata, slug]);

  const loadMetadata = useCallback(async () => {
    try {
      const response = await fetch('/api/metadata');
      const data = await response.json();
      setImageMetadata(data || {});
    } catch (error) {
      console.error('Failed to load metadata:', error);
      setImageMetadata({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && slug) {
      loadMetadata();
    }
  }, [slug, loadMetadata]);

  const handleDownload = useCallback(async (image) => {
    if (typeof window === 'undefined') return;
    
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
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  const handleImageLoad = useCallback(() => {
    setImagesLoaded(prev => prev + 1);
  }, []);

  const handlePreview = useCallback((image) => {
    setSelectedImage(image);
  }, []);

  // Don't render anything until router is ready
  if (!router.isReady || typeof window === 'undefined') {
    return null; // Return null instead of loading div for faster initial render
  }

  if (!categoryInfo[slug]) {
    return (
      <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
        <h1>Category Not Found</h1>
        <Link href="/" style={{color: '#2563eb'}}>← Back to Home</Link>
      </div>
    );
  }

  const category = categoryInfo[slug];

  return (
    <>
      <Head>
        <title>{category.name} Virtual Backgrounds - StreamBackdrops</title>
        <meta name="description" content={`Download ${category.description.toLowerCase()}.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* CRITICAL PERFORMANCE FIXES */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Preload ONLY the hero section - not images */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* MOBILE-FIRST CRITICAL CSS */
            .image-grid { 
              display: grid; 
              grid-template-columns: 1fr;
              gap: 2rem;
              contain: layout;
              max-width: 1400px;
              margin: 0 auto;
              padding: 0 1rem;
            }
            /* BIGGER IMAGES ON TABLET+ */
            @media (min-width: 768px) { 
              .image-grid { 
                grid-template-columns: repeat(2, 1fr);
                gap: 3rem;
                padding: 0 2rem;
              } 
            }
            /* EVEN BIGGER ON DESKTOP */
            @media (min-width: 1200px) { 
              .image-grid { 
                grid-template-columns: repeat(2, 1fr);
                gap: 4rem;
                padding: 0 3rem;
              } 
            }
            .image-card {
              background: white;
              border-radius: 1rem;
              box-shadow: 0 8px 25px rgba(0,0,0,0.1);
              overflow: hidden;
              transition: all 0.3s ease;
              contain: layout style paint;
              transform: translateZ(0);
            }
            .image-card:hover {
              transform: translateY(-8px);
              box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            }
            .category-nav {
              display: flex;
              gap: 0.75rem;
              overflow-x: auto;
              padding: 1.5rem 0;
              scrollbar-width: none;
              -ms-overflow-style: none;
              -webkit-overflow-scrolling: touch;
            }
            .category-nav::-webkit-scrollbar { display: none; }
            .nav-tab {
              padding: 1rem 2rem;
              border-radius: 2rem;
              font-weight: 600;
              text-decoration: none;
              white-space: nowrap;
              flex-shrink: 0;
              transition: all 0.3s ease;
              border: 2px solid transparent;
              font-size: 1rem;
            }
            .nav-tab.active {
              background: linear-gradient(135deg, #2563eb, #1d4ed8);
              color: white;
              box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
              transform: translateY(-2px);
            }
            .nav-tab.inactive {
              background: white;
              color: #6b7280;
              border: 2px solid #e5e7eb;
            }
            .nav-tab.inactive:hover {
              border-color: #2563eb;
              color: #2563eb;
              background: rgba(37, 99, 235, 0.05);
              transform: translateY(-1px);
            }
            /* PERFORMANCE: Contain expensive operations */
            .hero { contain: layout style paint; }
            .image-container { contain: layout; }
          `
        }} />
      </Head>

      <div style={{minHeight: '100vh', background: '#f8fafc'}}>
        {/* STREAMLINED HEADER - FASTER RENDER */}
        <header style={{
          background: 'white', 
          borderBottom: '1px solid #e5e7eb', 
          padding: '1.5rem 0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}>
          <div style={{maxWidth: '1400px', margin: '0 auto', padding: '0 2rem'}}>
            <Link href="/" style={{
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#111827', 
              textDecoration: 'none', 
              display: 'block', 
              marginBottom: '1rem'
            }}>
              Stream<span style={{color: '#2563eb'}}>Backdrops</span>
            </Link>
            
            {/* ENHANCED NAVIGATION TABS */}
            <nav className="category-nav">
              {Object.entries(categoryInfo).map(([key, info]) => (
                <Link
                  key={key}
                  href={`/category/${key}`}
                  className={`nav-tab ${key === slug ? 'active' : 'inactive'}`}
                >
                  {info.name}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* MINIMAL HERO - FASTEST LCP */}
        <section className="hero" style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', 
          color: 'white', 
          padding: '3rem 0', 
          textAlign: 'center'
        }}>
          <div style={{maxWidth: '1400px', margin: '0 auto', padding: '0 2rem'}}>
            <h1 style={{
              fontSize: 'clamp(2rem, 8vw, 3.5rem)', 
              fontWeight: 'bold', 
              marginBottom: '1rem', 
              lineHeight: 1.2
            }}>
              {category.name}
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 4vw, 1.25rem)', 
              opacity: 0.9, 
              marginBottom: '0.5rem'
            }}>
              {category.description}
            </p>
            <p style={{opacity: 0.8, fontSize: '1rem'}}>
              {loading ? 'Loading...' : `${categoryImages.length} backgrounds • Free downloads`}
            </p>
          </div>
        </section>

        {/* BIGGER IMAGES SECTION */}
        <section style={{padding: '3rem 0'}}>
          {loading ? (
            <div style={{textAlign: 'center', padding: '3rem 0'}}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }} />
              <p style={{color: '#6b7280'}}>Loading backgrounds...</p>
            </div>
          ) : categoryImages.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem 0'}}>
              <p style={{color: '#6b7280', fontSize: '1.1rem'}}>No backgrounds found in this category.</p>
              <Link href="/" style={{color: '#2563eb', textDecoration: 'none', fontWeight: '600'}}>
                ← Browse All Categories
              </Link>
            </div>
          ) : (
            <div className="image-grid">
              {categoryImages.map((image, index) => (
                <div key={image.key} className="image-card">
                  <div className="image-container" style={{
                    position: 'relative', 
                    aspectRatio: '16/9', 
                    overflow: 'hidden',
                    minHeight: '250px' // Ensure minimum size
                  }}>
                    <Image
                      src={`/images/${image.filename}`}
                      alt={image.alt || image.title || 'Virtual background'}
                      fill
                      style={{
                        objectFit: 'cover'
                      }}
                      loading={index < 4 ? "eager" : "lazy"}
                      priority={index < 2}
                      onLoad={handleImageLoad}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                      quality={index < 2 ? 90 : 80}
                    />
                    
                    {/* IMPROVED BUTTON OVERLAY */}
                    <div style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1rem',
                      right: '1rem',
                      display: 'flex',
                      gap: '0.75rem'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(image);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          color: '#374151',
                          padding: '0.75rem 1.25rem',
                          border: 'none',
                          borderRadius: '0.75rem',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          minHeight: '48px',
                          flex: 1,
                          backdropFilter: 'blur(8px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
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
                          padding: '0.75rem 1.25rem',
                          border: 'none',
                          borderRadius: '0.75rem',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          minHeight: '48px',
                          flex: 1,
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.backgroundColor = '#1d4ed8';
                          e.target.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.backgroundColor = '#2563eb';
                          e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                        }}
                      >
                        📥 Download
                      </button>
                    </div>
                  </div>

                  <div style={{padding: '2rem'}}>
                    <h3 style={{
                      fontWeight: '600', 
                      color: '#111827', 
                      fontSize: '1.25rem', 
                      marginBottom: '0.75rem', 
                      lineHeight: 1.3
                    }}>
                      {image.title || 'Virtual Background'}
                    </h3>
                    <p style={{
                      color: '#6b7280', 
                      fontSize: '1rem', 
                      lineHeight: 1.5
                    }}>
                      {image.description || 'Professional virtual background for video calls'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* OPTIMIZED MODAL */}
        {selectedImage && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
            onClick={() => setSelectedImage(null)}
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '95vw',
                maxHeight: '95vh',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0, 0, 0, 0.1)',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  fontSize: '24px',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.1)';
                }}
                aria-label="Close preview"
              >
                ✕
              </button>
              
              <h3 style={{ 
                marginBottom: '1.5rem', 
                paddingRight: '4rem', 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: '#111827' 
              }}>
                {selectedImage.title || 'Virtual Background Preview'}
              </h3>
              
              <div style={{position: 'relative', marginBottom: '1.5rem'}}>
                <Image
                  src={`/images/${selectedImage.filename}`}
                  alt={selectedImage.alt || selectedImage.title || 'Virtual background preview'}
                  width={900}
                  height={506}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '65vh',
                    objectFit: 'contain',
                    borderRadius: '12px'
                  }}
                  priority
                  quality={95}
                />
              </div>
              
              <div style={{display: 'flex', gap: '1rem'}}>
                <button
                  onClick={() => handleDownload(selectedImage)}
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    minHeight: '52px',
                    flex: 1,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1d4ed8';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#2563eb';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  📥 Download PNG
                </button>
                
                <button
                  onClick={() => setSelectedImage(null)}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    minHeight: '52px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.transform = 'translateY(0)';
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

      {/* MINIMAL CSS ANIMATIONS */}
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
  return {
    props: {}
  };
}