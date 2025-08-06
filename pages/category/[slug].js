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
      // Delay metadata loading slightly to prioritize initial render
      const timer = setTimeout(loadMetadata, 100);
      return () => clearTimeout(timer);
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

  const handlePreview = useCallback((image) => {
    setSelectedImage(image);
  }, []);

  // Don't render anything until router is ready
  if (!router.isReady || typeof window === 'undefined') {
    return null;
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
        
        {/* AGGRESSIVE MOBILE PERFORMANCE */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* MOBILE CRITICAL CSS - ULTRA FAST */
            .image-grid { 
              display: grid; 
              grid-template-columns: 1fr;
              gap: 1.5rem;
              contain: layout;
              padding: 0 1rem;
            }
            .image-card {
              background: white;
              border-radius: 0.75rem;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              overflow: hidden;
              contain: layout style paint;
              transform: translateZ(0);
            }
            .nav-tab {
              padding: 0.75rem 1.25rem;
              border-radius: 1.5rem;
              font-weight: 600;
              text-decoration: none;
              white-space: nowrap;
              flex-shrink: 0;
              font-size: 0.9rem;
            }
            .nav-tab.active {
              background: linear-gradient(135deg, #2563eb, #1d4ed8);
              color: white;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            }
            .nav-tab.inactive {
              background: white;
              color: #6b7280;
              border: 1px solid #e5e7eb;
            }
            
            /* TABLET+ BIGGER IMAGES */
            @media (min-width: 768px) { 
              .image-grid { 
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
                padding: 0 2rem;
              }
              .image-card {
                transition: transform 0.3s ease;
              }
              .image-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
              }
              .nav-tab {
                padding: 1rem 2rem;
                font-size: 1rem;
              }
            }
            
            /* DESKTOP EVEN BIGGER */
            @media (min-width: 1200px) { 
              .image-grid { 
                gap: 3rem;
                padding: 0 3rem;
                max-width: 1400px;
                margin: 0 auto;
              }
            }
          `
        }} />
      </Head>

      <div style={{minHeight: '100vh', background: '#f8fafc'}}>
        {/* MINIMAL HEADER FOR MOBILE */}
        <header style={{
          background: 'white', 
          borderBottom: '1px solid #e5e7eb', 
          padding: '1rem 0'
        }}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
            <Link href="/" style={{
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#111827', 
              textDecoration: 'none', 
              display: 'block', 
              marginBottom: '1rem'
            }}>
              Stream<span style={{color: '#2563eb'}}>Backdrops</span>
            </Link>
            
            {/* HORIZONTAL SCROLLING NAV - MOBILE OPTIMIZED */}
            <nav style={{
              display: 'flex',
              gap: '0.75rem',
              overflowX: 'auto',
              padding: '0.5rem 0',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}>
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

        {/* COMPRESSED HERO - FASTEST POSSIBLE LCP */}
        <section style={{
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', 
          color: 'white', 
          padding: '2rem 0', 
          textAlign: 'center'
        }}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', 
              fontWeight: 'bold', 
              marginBottom: '0.75rem'
            }}>
              {category.name}
            </h1>
            <p style={{
              fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', 
              opacity: 0.9
            }}>
              {loading ? 'Loading backgrounds...' : `${categoryImages.length} backgrounds available`}
            </p>
          </div>
        </section>

        {/* IMAGES - MOBILE FIRST SIZING */}
        <section style={{padding: '2rem 0'}}>
          {loading ? (
            <div style={{textAlign: 'center', padding: '2rem 0'}}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '2px solid #e5e7eb',
                borderTop: '2px solid #2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }} />
            </div>
          ) : categoryImages.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem 0'}}>
              <p style={{color: '#6b7280'}}>No backgrounds found.</p>
              <Link href="/" style={{color: '#2563eb'}}>← Back to Home</Link>
            </div>
          ) : (
            <div className="image-grid">
              {categoryImages.map((image, index) => (
                <div key={image.key} className="image-card">
                  <div style={{
                    position: 'relative', 
                    aspectRatio: '16/9', 
                    overflow: 'hidden'
                  }}>
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
                      loading={index < 3 ? "eager" : "lazy"}
                      priority={index === 0}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                      quality={index === 0 ? 85 : 70} // Lower quality for better performance
                    />
                    
                    {/* MOBILE-OPTIMIZED BUTTONS */}
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
                          background: 'rgba(255, 255, 255, 0.95)',
                          color: '#374151',
                          padding: '0.5rem 0.75rem',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          minHeight: '44px',
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
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          minHeight: '44px',
                          flex: 1
                        }}
                      >
                        📥 Download
                      </button>
                    </div>
                  </div>

                  <div style={{padding: window.innerWidth > 768 ? '1.5rem' : '1rem'}}>
                    <h3 style={{
                      fontWeight: '600', 
                      color: '#111827', 
                      fontSize: window.innerWidth > 768 ? '1.1rem' : '1rem',
                      marginBottom: '0.5rem'
                    }}>
                      {image.title || 'Virtual Background'}
                    </h3>
                    <p style={{
                      color: '#6b7280', 
                      fontSize: window.innerWidth > 768 ? '0.95rem' : '0.85rem',
                      lineHeight: 1.4
                    }}>
                      {image.description || 'Professional virtual background for video calls'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* LIGHTWEIGHT MODAL */}
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
                borderRadius: '12px',
                padding: '1.5rem',
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
              
              <h3 style={{ 
                marginBottom: '1rem', 
                paddingRight: '3rem', 
                fontSize: '1.2rem', 
                fontWeight: '600'
              }}>
                {selectedImage.title || 'Preview'}
              </h3>
              
              <Image
                src={`/images/${selectedImage.filename}`}
                alt={selectedImage.alt || 'Preview'}
                width={600}
                height={338}
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
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
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
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
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
        nav::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}

export async function getServerSideProps(context) {
  return { props: {} };
}