// REPLACE your pages/index.js file with this MOBILE-OPTIMIZED version

import { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function Home() {
  const [imageMetadata, setImageMetadata] = useState({});
  const [showImages, setShowImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // Detect mobile for performance optimizations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Category info with mobile-optimized descriptions
  const categoryInfo = useMemo(() => ({
    'home-offices': {
      name: 'Home Offices',
      description: isMobile ? 'Professional home office backgrounds' : 'Professional home office backgrounds perfect for remote work and video calls',
      image: 'clean-scandinavian-home-office-2'
    },
    'executive-offices': {
      name: 'Executive Offices',
      description: isMobile ? 'Luxury executive office backgrounds' : 'Luxury executive office backgrounds for leadership meetings and professional calls',
      image: 'corner-office-with-city-views-1'
    },
    'minimalist': {
      name: 'Minimalist',
      description: isMobile ? 'Clean, minimalist backgrounds' : 'Clean, minimalist backgrounds for modern professionals',
      image: 'minimalist-executive-office-1'
    },
    'lobbies': {
      name: 'Lobbies',
      description: isMobile ? 'Professional lobby backgrounds' : 'Professional lobby backgrounds for client meetings and business calls',
      image: 'modern-glass-lobby-3'
    },
    'private-offices': {
      name: 'Private Offices',
      description: isMobile ? 'Specialized private office backgrounds' : 'Specialized private office backgrounds for professional consultations and meetings',
      image: 'private-office-with-bookshelf-1'
    }
  }), [isMobile]);

  // CRITICAL: Load metadata with mobile optimizations
  const loadMetadata = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    try {
      // Only load essential data on mobile initially
      const response = await fetch('/api/metadata', {
        headers: isMobile ? { 'Accept': 'application/json', 'Cache-Control': 'max-age=300' } : {}
      });
      
      if (response.ok) {
        const data = await response.json();
        setImageMetadata(data || {});
        
        // Delay showing images on mobile to prioritize hero content
        setTimeout(() => setShowImages(true), isMobile ? 1000 : 300);
      }
    } catch (error) {
      console.error('Failed to load metadata:', error);
      // Still show the page even if metadata fails
      setTimeout(() => setShowImages(true), 500);
    }
  }, [isMobile]);

  useEffect(() => {
    // Load metadata after hero content is rendered
    const timer = setTimeout(loadMetadata, isMobile ? 500 : 100);
    return () => clearTimeout(timer);
  }, [loadMetadata, isMobile]);

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

  // Get category images with mobile-specific limits
  const getCategoryImages = useCallback((category) => {
    if (!imageMetadata || !showImages) return [];
    
    const categoryImages = Object.entries(imageMetadata)
      .filter(([_, data]) => data?.category === category)
      .map(([key, data]) => ({ key, ...data }))
      .slice(0, isMobile ? 3 : 6); // Show fewer images on mobile initially
    
    return categoryImages;
  }, [imageMetadata, showImages, isMobile]);

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "StreamBackdrops",
    "description": "Professional virtual backgrounds for video calls",
    "url": "https://streambackdrops.com"
  };

  return (
    <>
      <Head>
        <title>StreamBackdrops - Professional Virtual Backgrounds for Video Calls</title>
        <meta name="description" content="Download premium virtual backgrounds for Zoom, Teams, and Google Meet. Professional home offices, executive spaces, and minimalist designs. Free HD downloads." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* CRITICAL: Mobile performance meta tags */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Preconnect to optimize loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* CRITICAL: Preload hero image for LCP */}
        <link 
          rel="preload" 
          href="/images/clean-scandinavian-home-office-2.webp" 
          as="image" 
          type="image/webp"
          fetchPriority="high"
        />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="critical-above-fold">
        {/* HERO SECTION - OPTIMIZED FOR LCP */}
        <header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          padding: isMobile ? '3rem 1rem' : '4rem 2rem',
          minHeight: isMobile ? 'auto' : '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{
              fontSize: isMobile ? '2.5rem' : '4rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              lineHeight: 1.1
            }}>
              Stream<span style={{ color: '#60a5fa' }}>Backdrops</span>
            </h1>
            
            <p style={{
              fontSize: isMobile ? '1.2rem' : '1.5rem',
              marginBottom: '0.5rem',
              fontWeight: 600,
              opacity: 0.95
            }}>
              Premium virtual backgrounds for professionals
            </p>
            
            <p style={{
              fontSize: isMobile ? '1rem' : '1.25rem',
              marginBottom: '2rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}>
              Transform your video calls with high-quality backgrounds • {' '}
              <span style={{
                background: '#16a34a',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}>
                FREE
              </span>
              {' '} downloads • Perfect for Zoom, Teams & Meet
            </p>
            
            {/* CATEGORY NAVIGATION - MOBILE OPTIMIZED */}
            <nav style={{
              display: 'flex',
              gap: isMobile ? '0.5rem' : '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '2rem',
              paddingBottom: '1rem'
            }}>
              {Object.entries(categoryInfo).map(([key, info]) => (
                <Link 
                  key={key}
                  href={`/category/${key}`}
                  style={{
                    padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '2rem',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: isMobile ? '0.8rem' : '1rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {info.name}
                </Link>
              ))}
              
              <Link 
                href="/premium"
                style={{
                  padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  border: 'none',
                  borderRadius: '2rem',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: isMobile ? '0.8rem' : '1rem',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)',
                  whiteSpace: 'nowrap'
                }}
              >
                ✨ Premium 4K
              </Link>
            </nav>
          </div>
        </header>

        {/* CATEGORIES SECTION - LAZY LOADED */}
        <section style={{
          padding: isMobile ? '2rem 1rem' : '4rem 2rem',
          background: '#f9fafb'
        }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: isMobile ? '2rem' : '3rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '1rem',
              color: '#111827'
            }}>
              Choose Your Professional Setting
            </h2>
            
            <p style={{
              fontSize: isMobile ? '1rem' : '1.25rem',
              textAlign: 'center',
              color: '#6b7280',
              marginBottom: isMobile ? '2rem' : '4rem',
              maxWidth: '800px',
              margin: '0 auto 3rem'
            }}>
              Each category features carefully curated backgrounds optimized for video calls
            </p>

            {/* CATEGORY GRID - PERFORMANCE OPTIMIZED */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: isMobile ? '2rem' : '3rem',
              marginTop: '2rem'
            }}>
              {Object.entries(categoryInfo).map(([key, info], index) => {
                const categoryImages = getCategoryImages(key);
                const previewImage = categoryImages[0];

                return (
                  <Link 
                    key={key}
                    href={`/category/${key}`}
                    style={{
                      background: 'white',
                      borderRadius: '1.5rem',
                      boxShadow: isMobile ? '0 4px 12px rgba(0,0,0,0.1)' : '0 8px 24px rgba(0,0,0,0.12)',
                      overflow: 'hidden',
                      textDecoration: 'none',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      display: 'block',
                      willChange: 'transform'
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                      }
                    }}
                  >
                    {/* HERO IMAGE */}
                    <div style={{
                      position: 'relative',
                      height: isMobile ? '200px' : '280px',
                      overflow: 'hidden',
                      background: '#f3f4f6'
                    }}>
                      {previewImage ? (
                        <Image
                          src={`/images/${previewImage.filename}`}
                          alt={info.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          loading={index === 0 ? "eager" : "lazy"}
                          priority={index === 0}
                          quality={isMobile ? 60 : 75}
                          sizes={isMobile ? "100vw" : "(max-width: 768px) 100vw, 400px"}
                          onLoad={() => setImagesLoaded(prev => prev + 1)}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                          backgroundSize: '200% 100%',
                          animation: 'loading 1.5s infinite'
                        }} />
                      )}
                      
                      {/* OVERLAY */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                        color: 'white',
                        padding: '2rem 1.5rem 1rem',
                        textAlign: 'left'
                      }}>
                        <h3 style={{
                          fontSize: isMobile ? '1.5rem' : '1.75rem',
                          fontWeight: 'bold',
                          marginBottom: '0.5rem',
                          textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                        }}>
                          {info.name}
                        </h3>
                        <p style={{
                          fontSize: isMobile ? '0.9rem' : '1rem',
                          opacity: 0.9,
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                          lineHeight: 1.4
                        }}>
                          {info.description}
                        </p>
                      </div>
                    </div>

                    {/* CARD CONTENT */}
                    <div style={{
                      padding: isMobile ? '1.5rem' : '2rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <p style={{
                            color: '#16a34a',
                            fontWeight: 'bold',
                            fontSize: isMobile ? '1rem' : '1.1rem',
                            marginBottom: '0.5rem'
                          }}>
                            {categoryImages.length || '6+'} Free Backgrounds
                          </p>
                          <p style={{
                            color: '#6b7280',
                            fontSize: isMobile ? '0.85rem' : '0.9rem'
                          }}>
                            HD • Ready for video calls
                          </p>
                        </div>
                        
                        <div style={{
                          background: '#2563eb',
                          color: 'white',
                          padding: '0.75rem',
                          borderRadius: '50%',
                          fontSize: isMobile ? '1.2rem' : '1.5rem'
                        }}>
                          →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION - MOBILE OPTIMIZED */}
        <section style={{
          background: 'white',
          padding: isMobile ? '3rem 1rem' : '5rem 2rem'
        }}>
          <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{
              fontSize: isMobile ? '2rem' : '2.5rem',
              fontWeight: 'bold',
              marginBottom: isMobile ? '1rem' : '2rem',
              color: '#111827'
            }}>
              Why Choose StreamBackdrops?
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: isMobile ? '2rem' : '3rem',
              marginTop: '3rem'
            }}>
              {[
                {
                  icon: '🎯',
                  title: 'Video Call Optimized',
                  description: isMobile ? 'Designed for perfect edge detection' : 'Designed specifically for perfect edge detection and professional appearance'
                },
                {
                  icon: '⚡',
                  title: 'Instant Download',
                  description: isMobile ? 'One-click downloads, ready to use' : 'One-click downloads, ready to use in Zoom, Teams, and Meet'
                },
                {
                  icon: '🏆',
                  title: 'Premium Quality',
                  description: isMobile ? 'Professional photography & design' : 'Professional photography and design for executive presence'
                }
              ].map((feature, index) => (
                <div key={index} style={{
                  textAlign: 'center',
                  padding: isMobile ? '1.5rem' : '2rem'
                }}>
                  <div style={{
                    fontSize: isMobile ? '3rem' : '4rem',
                    marginBottom: '1rem'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{
                    fontSize: isMobile ? '1.25rem' : '1.5rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '1rem'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    lineHeight: 1.6
                  }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* MODAL */}
      {selectedImage && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
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
              padding: '1rem',
              maxWidth: isMobile ? '95vw' : '90vw',
              maxHeight: isMobile ? '85vh' : '90vh',
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
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '18px',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              ✕
            </button>
            
            <h3 style={{
              marginBottom: '1rem',
              paddingRight: '3rem',
              fontSize: isMobile ? '1.1rem' : '1.2rem',
              fontWeight: '600'
            }}>
              {selectedImage.title || 'Preview'}
            </h3>
            
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Image
                src={`/images/${selectedImage.filename}`}
                alt={selectedImage.alt || 'Preview'}
                width={600}
                height={338}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: isMobile ? '50vh' : '60vh',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
                priority
                quality={90}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => handleDownload(selectedImage)}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: isMobile ? '0.9rem' : '1rem',
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
                  fontSize: isMobile ? '0.9rem' : '1rem',
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

      {/* CRITICAL CSS FOR MOBILE PERFORMANCE */}
      <style jsx>{`
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .critical-above-fold {
          contain: layout style paint;
        }
        
        @media (max-width: 768px) {
          * {
            -webkit-tap-highlight-color: transparent;
          }
        }
      `}</style>
    </>
  );
}