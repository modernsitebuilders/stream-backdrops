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
      // Use fetch with cache control for faster loading
      const response = await fetch('/api/metadata', {
        cache: 'force-cache',
        headers: {
          'Cache-Control': 'max-age=3600'
        }
      });
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
      // Start loading metadata immediately
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
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p>Loading...</p>
      </div>
    );
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Critical performance optimizations */}
        <link rel="preconnect" href={typeof window !== 'undefined' ? window.location.origin : ''} />
        <link rel="dns-prefetch" href={typeof window !== 'undefined' ? window.location.origin : ''} />
        
        {/* Preload critical resources - FIRST IMAGE ONLY */}
        {categoryImages.length > 0 && (
          <>
            <link 
              rel="preload" 
              href={`/images/${categoryImages[0].filename}`} 
              as="image" 
              fetchPriority="high"
            />
            <link 
              rel="prefetch" 
              href={`/images/${categoryImages[1]?.filename || categoryImages[0].filename}`} 
              as="image"
            />
          </>
        )}
        
        {/* Critical CSS - SMALLER AND MORE FOCUSED */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .mobile-grid { 
              display: grid; 
              grid-template-columns: 1fr;
              gap: 1.5rem;
              contain: layout;
            }
            @media (min-width: 768px) { 
              .mobile-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; } 
            }
            @media (min-width: 1024px) { 
              .mobile-grid { grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2.5rem; } 
            }
            .image-card {
              transform: translateZ(0);
              will-change: transform;
              contain: layout style paint;
              background: white;
              border-radius: 0.75rem;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              overflow: hidden;
              transition: transform 0.2s ease;
            }
            .image-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            }
            .category-nav {
              display: flex;
              gap: 0.5rem;
              overflow-x: auto;
              padding: 1rem 0;
              scrollbar-width: none;
              -ms-overflow-style: none;
              -webkit-overflow-scrolling: touch;
            }
            .category-nav::-webkit-scrollbar { display: none; }
            .nav-tab {
              padding: 0.75rem 1.5rem;
              border-radius: 2rem;
              font-weight: 600;
              text-decoration: none;
              white-space: nowrap;
              flex-shrink: 0;
              transition: all 0.2s ease;
              border: 2px solid transparent;
            }
            .nav-tab.active {
              background: linear-gradient(135deg, #2563eb, #1d4ed8);
              color: white;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
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
            }
          `
        }} />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        {/* IMPROVED HEADER WITH NICE TABS */}
        <header style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 100}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
            <Link href="/" style={{fontSize: '1.75rem', fontWeight: 'bold', color: '#111827', textDecoration: 'none', display: 'block', marginBottom: '1rem'}}>
              Stream<span style={{color: '#2563eb'}}>Backdrops</span>
            </Link>
            
            {/* BEAUTIFUL NAVIGATION TABS */}
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

        {/* COMPRESSED HERO - FASTER LCP */}
        <section style={{background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '2rem 0', textAlign: 'center'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
            <h1 style={{fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: 'bold', marginBottom: '0.75rem', lineHeight: 1.2}}>
              {category.name}
            </h1>
            <p style={{fontSize: 'clamp(0.9rem, 3vw, 1rem)', opacity: 0.95, marginBottom: '0.5rem'}}>
              {category.description}
            </p>
            <p style={{opacity: 0.8, fontSize: '0.85rem'}}>
              {loading ? 'Loading...' : `${categoryImages.length} backgrounds • Free downloads`}
            </p>
          </div>
        </section>

        {/* OPTIMIZED IMAGES SECTION */}
        <section style={{padding: '1.5rem 0'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
            {loading ? (
              <div style={{textAlign: 'center', padding: '2rem 0'}}>
                <div style={{
                  width: '32px',
                  height: '32px',
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
              <div className="mobile-grid">
                {categoryImages.map((image, index) => (
                  <div key={image.key} className="image-card">
                    <div style={{position: 'relative', aspectRatio: '16/9', overflow: 'hidden'}}>
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
                        loading={index === 0 ? "eager" : "lazy"}
                        priority={index === 0}
                        onLoad={handleImageLoad}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={index === 0 ? 85 : 75} // Higher quality for first image
                      />
                      
                      {/* RESTORED BUTTON OVERLAY */}
                      <div style={{
                        position: 'absolute',
                        bottom: '0.75rem',
                        left: '0.75rem',
                        right: '0.75rem',
                        display: 'flex',
                        gap: '0.5rem'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(image);
                          }}
                          style={{
                            background: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            padding: '0.5rem 0.75rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            minHeight: '40px',
                            flex: 1,
                            backdropFilter: 'blur(4px)'
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
                            padding: '0.5rem 0.75rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            minHeight: '40px',
                            flex: 1
                          }}
                        >
                          📥 Download
                        </button>
                      </div>
                    </div>

                    <div style={{padding: '1.25rem'}}>
                      <h3 style={{fontWeight: '600', color: '#111827', fontSize: '1rem', marginBottom: '0.5rem', lineHeight: 1.3}}>
                        {image.title || 'Virtual Background'}
                      </h3>
                      <p style={{color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.4}}>
                        {image.description || 'Professional virtual background for video calls'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
              padding: '1rem'
            }}
            onClick={() => setSelectedImage(null)}
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
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
                  width: '40px',
                  height: '40px',
                  fontSize: '20px',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Close preview"
              >
                ✕
              </button>
              
              <h3 style={{ marginBottom: '1rem', paddingRight: '3rem', fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
                {selectedImage.title || 'Virtual Background Preview'}
              </h3>
              
              <Image
                src={`/images/${selectedImage.filename}`}
                alt={selectedImage.alt || selectedImage.title || 'Virtual background preview'}
                width={800}
                height={450}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '60vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
                priority
                quality={90}
              />
              
              <div style={{display: 'flex', gap: '1rem'}}>
                <button
                  onClick={() => handleDownload(selectedImage)}
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    minHeight: '44px',
                    flex: 1
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
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    minHeight: '44px'
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

// Server-side rendering for better performance
export async function getServerSideProps(context) {
  return {
    props: {}
  };
}