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
        
        {/* Preload critical resources */}
        {categoryImages.length > 0 && (
          <link 
            rel="preload" 
            href={`/images/${categoryImages[0].filename}`} 
            as="image" 
            fetchPriority="high"
          />
        )}
        
        {/* Critical CSS for mobile */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .mobile-grid { 
              display: grid; 
              grid-template-columns: 1fr;
              gap: 1.5rem;
              contain: layout;
            }
            @media (min-width: 768px) { 
              .mobile-grid { grid-template-columns: repeat(2, 1fr); } 
            }
            @media (min-width: 1024px) { 
              .mobile-grid { grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); } 
            }
            .image-card {
              transform: translateZ(0);
              will-change: transform;
              contain: layout style paint;
            }
            .image-placeholder {
              background: #f3f4f6;
              aspect-ratio: 16/9;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #9ca3af;
            }
          `
        }} />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        {/* Simplified header for mobile */}
        <header style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
            <Link href="/" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', textDecoration: 'none'}}>
              Stream<span style={{color: '#2563eb'}}>Backdrops</span>
            </Link>
            
            {/* Horizontal scrolling nav for mobile */}
            <nav style={{
              marginTop: '1rem', 
              display: 'flex', 
              gap: '1rem', 
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              paddingBottom: '0.5rem'
            }}>
              {Object.entries(categoryInfo).map(([key, info]) => (
                <Link
                  key={key}
                  href={`/category/${key}`}
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: key === slug ? '#2563eb' : '#6b7280',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '1rem',
                    background: key === slug ? 'rgba(37, 99, 235, 0.1)' : 'white',
                    border: key === slug ? 'none' : '1px solid #e5e7eb',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  {info.name}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* Compressed hero section for mobile */}
        <section style={{background: '#2563eb', color: 'white', padding: '3rem 0', textAlign: 'center'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
            <h1 style={{fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 'bold', marginBottom: '1rem'}}>
              {category.name}
            </h1>
            <p style={{fontSize: 'clamp(1rem, 4vw, 1.2rem)', marginBottom: '0.5rem', opacity: 0.95}}>
              {category.description}
            </p>
            <p style={{opacity: 0.9, fontSize: '0.9rem'}}>
              {loading ? 'Loading...' : `${categoryImages.length} backgrounds available`}
            </p>
          </div>
        </section>

        {/* Optimized images section */}
        <section style={{padding: '2rem 0'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
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
                <p>Loading backgrounds...</p>
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
                  <div 
                    key={image.key} 
                    className="image-card"
                    style={{
                      background: 'white',
                      borderRadius: '0.75rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{position: 'relative', aspectRatio: '16/9', overflow: 'hidden'}}>
                      <Image
                        src={`/images/${image.filename}`}
                        alt={image.alt || 'Virtual background'}
                        width={400}
                        height={225}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedImage(image)}
                        loading={index < 2 ? "eager" : "lazy"}
                        priority={index === 0}
                        onLoad={handleImageLoad}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={75}
                      />
                      
                      <div style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image);
                          }}
                          style={{
                            background: '#2563eb',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            minHeight: '44px', // Better touch target
                            minWidth: '80px'
                          }}
                        >
                          Download
                        </button>
                      </div>
                    </div>

                    <div style={{padding: '1.5rem'}}>
                      <h3 style={{fontWeight: '600', color: '#111827', fontSize: '1.1rem', marginBottom: '0.5rem'}}>
                        {image.title || 'Virtual Background'}
                      </h3>
                      <p style={{color: '#6b7280', fontSize: '0.95rem'}}>
                        {image.description || 'Professional virtual background'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Optimized modal */}
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
                  top: '0.5rem',
                  right: '0.75rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  zIndex: 10,
                  minHeight: '44px',
                  minWidth: '44px'
                }}
                aria-label="Close"
              >
                ×
              </button>
              
              <h3 style={{ marginBottom: '1rem', paddingRight: '2rem', fontSize: '1.1rem' }}>
                {selectedImage.title || 'Virtual Background'}
              </h3>
              
              <Image
                src={`/images/${selectedImage.filename}`}
                alt={selectedImage.alt || 'Virtual background'}
                width={800}
                height={450}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '60vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  marginBottom: '1rem'
                }}
                priority
              />
              
              <button
                onClick={() => handleDownload(selectedImage)}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  minHeight: '44px',
                  width: '100%'
                }}
              >
                Download PNG
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>

      {/* Add loading animation CSS */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        nav::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}

// This tells Next.js to use server-side rendering instead of static generation
export async function getServerSideProps(context) {
  return {
    props: {}, // Will be passed to the page component as props
  };
}