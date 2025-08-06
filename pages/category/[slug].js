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
    },
    'premium': {
      name: 'Premium 4K',
      description: 'Ultra high-quality 4K virtual backgrounds for professional meetings'
    }
  }), []);

  // Define priority images for each category (your best 10/10 images)
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
      'executive-office-with-marble-wall-1',
      'executive-office-with-dark-wood-1',
      'corner-office-with-city-views-1',
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

  // Memoize filtered and sorted images to prevent recalculation
  const categoryImages = useMemo(() => {
    const filtered = Object.entries(imageMetadata)
      .filter(([_, data]) => {
        if (!data || !slug) return false;
        return data.category === slug;
      })
      .map(([key, data]) => ({ key, ...data }));

    // Get priority list for current category
    const priorities = priorityImages[slug] || [];
    
    // Sort by priority first, then alphabetically
    return filtered.sort((a, b) => {
      const aPriority = priorities.indexOf(a.key);
      const bPriority = priorities.indexOf(b.key);
      
      // If both are priority images, sort by priority order
      if (aPriority !== -1 && bPriority !== -1) {
        return aPriority - bPriority;
      }
      
      // If only one is priority, it goes first
      if (aPriority !== -1) return -1;
      if (bPriority !== -1) return 1;
      
      // If neither is priority, sort alphabetically by title
      return a.title.localeCompare(b.title);
    });
  }, [imageMetadata, slug, priorityImages]);

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
      // Delay showing images to improve LCP
      setTimeout(() => setShowImages(true), 500);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && slug) {
      // Delay metadata loading to prioritize hero rendering
      const timer = setTimeout(loadMetadata, 300);
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

  // Handle premium redirect
  if (slug === 'premium') {
    if (typeof window !== 'undefined') {
      window.location.href = '/premium';
    }
    return null;
  }

  const category = categoryInfo[slug];

  return (
    <>
      <Head>
        <title>{category.name} Virtual Backgrounds - StreamBackdrops</title>
        <meta name="description" content={`Download ${category.description.toLowerCase()}.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* CRITICAL PERFORMANCE - MINIMAL CSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* MOBILE CRITICAL CSS - ABSOLUTE MINIMUM */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, sans-serif; background: #f8fafc; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
            .hero { background: #2563eb; color: white; padding: 1.5rem 0; text-align: center; }
            .image-grid { 
              display: grid; 
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }
            .image-card {
              background: white;
              border-radius: 0.75rem;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .nav-tab {
              padding: 0.5rem 1rem;
              border-radius: 1rem;
              font-weight: 600;
              text-decoration: none;
              font-size: 0.8rem;
              white-space: nowrap;
              flex-shrink: 0;
            }
            .nav-tab.active {
              background: #2563eb;
              color: white;
            }
            .nav-tab.inactive {
              background: white;
              color: #6b7280;
              border: 1px solid #e5e7eb;
            }
            /* TABLET+ ONLY */
            @media (min-width: 768px) { 
              .image-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
              .hero { padding: 2.5rem 0; }
              .nav-tab { padding: 0.75rem 1.5rem; font-size: 0.9rem; }
              .image-card:hover { transform: translateY(-4px); }
            }
          `
        }} />
      </Head>

      <div>
        {/* ULTRA MINIMAL HEADER */}
        <header style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0.75rem 0'}}>
          <div className="container">
            <Link href="/" style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', textDecoration: 'none', display: 'block', marginBottom: '0.75rem'}}>
              Stream<span style={{color: '#2563eb'}}>Backdrops</span>
            </Link>
            
            {/* MINIMAL NAV */}
            <nav style={{display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.25rem 0'}}>
              {Object.entries(categoryInfo).map(([key, info]) => (
                <Link
                  key={key}
                  href={key === 'premium' ? '/premium' : `/category/${key}`}
                  className={`nav-tab ${key === slug ? 'active' : 'inactive'}`}
                  style={key === 'premium' ? {
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: 'white',
                    border: 'none'
                  } : {}}
                >
                  {key === 'premium' ? '✨ 4K' : info.name}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* MINIMAL HERO - FASTEST LCP */}
        <section className="hero">
          <div className="container">
            <h1 style={{fontSize: 'clamp(1.5rem, 6vw, 2rem)', fontWeight: 'bold', marginBottom: '0.5rem'}}>
              {category.name}
            </h1>
            <p style={{fontSize: 'clamp(0.8rem, 3vw, 0.9rem)', opacity: 0.9}}>
              {loading ? 'Loading...' : `${categoryImages.length} backgrounds`}
            </p>
          </div>
        </section>

        {/* DELAYED IMAGES SECTION */}
        <section style={{padding: '1.5rem 0'}}>
          <div className="container">
            {!showImages ? (
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
            ) : loading ? (
              <div style={{textAlign: 'center', padding: '2rem 0'}}>
                <p style={{color: '#6b7280'}}>Loading backgrounds...</p>
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
                        loading={index < 2 ? "eager" : "lazy"} // First 2 images eager (your best ones)
                        priority={index === 0} // Only first image gets priority
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={65} // Lower quality for faster loading
                      />
                      
                      {/* SIMPLIFIED BUTTONS */}
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

                    <div style={{padding: '0.75rem'}}>
                      <h3 style={{fontWeight: '600', color: '#111827', fontSize: '0.9rem', marginBottom: '0.25rem'}}>
                        {image.title || 'Virtual Background'}
                      </h3>
                      <p style={{color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.3}}>
                        {image.description || 'Professional virtual background'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* MINIMAL MODAL */}
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
        nav::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}

export async function getServerSideProps(context) {
  return { props: {} };
}