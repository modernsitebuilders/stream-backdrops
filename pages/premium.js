import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function PremiumPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageMetadata, setImageMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function loadMetadata() {
      try {
        const response = await fetch('/api/metadata');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Successfully loaded metadata:', Object.keys(data).length, 'images');
        setImageMetadata(data);
      } catch (error) {
        console.error('Failed to load metadata:', error);
        setImageMetadata({});
      } finally {
        setLoading(false);
      }
    }
    loadMetadata();
  }, []);

  // Filter for premium images across ALL categories
  const premiumImages = useMemo(() => {
    if (!imageMetadata || loading) return [];
    
    return Object.entries(imageMetadata)
      .filter(([_, data]) => data && data.isPremium)
      .map(([key, data]) => ({ key, ...data }));
  }, [imageMetadata, loading]);

  const handlePremiumPurchase = (image) => {
    // Redirect to Gumroad product
    const gumroadUrl = `https://gumroad.com/l/${image.gumroadPermalink || 'premium-backgrounds'}`;
    window.open(gumroadUrl, '_blank');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading premium collection...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Premium 4K Virtual Backgrounds - StreamBackdrops</title>
        <meta name="description" content="Download ultra high-quality 4K virtual backgrounds. Premium professional backgrounds for the most important video calls and presentations." />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        {/* Add Category Navigation Header */}
        <header style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0'}}>
          <div className="container">
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem'}}>
              <Link href="/" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', textDecoration: 'none'}}>
                Stream<span style={{color: '#2563eb'}}>Backdrops</span>
              </Link>
            </div>
            
            <nav className="category-nav">
              {[
                { key: 'home-offices', name: 'Home Offices' },
                { key: 'executive-offices', name: 'Executive Offices' },
                { key: 'lobbies', name: 'Lobbies' },
                { key: 'private-offices', name: 'Private Offices' },
                { key: 'premium-4k', name: 'Premium 4K', isPremium: true }
              ].map(({ key, name, isPremium }) => (
                <Link
                  key={key}
                  href={`/category/${key}`}
                  className={key === 'premium-4k' ? 'active' : ''}
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: key === 'premium-4k' ? '#2563eb' : '#6b7280',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {name}
                  {isPremium && (
                    <span style={{
                      background: '#fbbf24',
                      color: '#92400e',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '0.75rem',
                      marginLeft: '0.5rem'
                    }}>
                      PREMIUM
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* Premium Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          color: 'white',
          padding: '4rem 0',
          textAlign: 'center'
        }}>
          <div className="container">
            <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white'}}>
              Premium 4K Collection
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                fontSize: '1rem',
                marginLeft: '1rem',
                display: 'inline-block'
              }}>
                ULTRA HD
              </span>
            </h1>
            
            <p style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>
              Ultra high-quality 4K virtual backgrounds with premium materials and luxury details
            </p>
            <p style={{opacity: 0.9, fontSize: '1.1rem'}}>
              Professional quality • Perfect for important meetings • Starting at $5.99
            </p>
          </div>
        </section>

        {/* Premium Images */}
        <section style={{padding: '3rem 0'}}>
          <div className="container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: isMobile ? '0 1rem' : '20px'
          }}>
            {premiumImages.length === 0 ? (
              <div style={{textAlign: 'center', padding: '3rem 0'}}>
                <p style={{color: '#6b7280', fontSize: '1.1rem', marginBottom: '1rem'}}>
                  Premium collection coming soon!
                </p>
                <Link href="/" style={{
                  background: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}>
                  Browse Free Collection
                </Link>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
                width: '100%',
                maxWidth: isMobile ? '350px' : '100%',
                margin: '0 auto'
              }}>
                {premiumImages.map((image) => (
                  <div 
                    key={image.key} 
                    style={{
                      background: 'white',
                      borderRadius: '0.75rem',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      position: 'relative',
                      width: '100%',
                      maxWidth: isMobile ? '320px' : '400px',
                      margin: '0 auto',
                      border: '2px solid #fbbf24'
                    }}
                  >
                    {/* Premium Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                      color: '#92400e',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      zIndex: 10
                    }}>
                      PREMIUM 4K
                    </div>

                    <div style={{position: 'relative', aspectRatio: '16/9', overflow: 'hidden'}}>
                      <img
                        src={`/images/${image.filename}`}
                        alt={image.alt || 'Premium virtual background'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedImage(image)}
                      />
                      
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(image);
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.9)',
                            color: '#111827',
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Preview
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePremiumPurchase(image);
                          }}
                          style={{
                            background: '#fbbf24',
                            color: '#92400e',
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Buy ${image.price || '5.99'}
                        </button>
                      </div>
                    </div>

                    <div style={{padding: '1.5rem'}}>
                      <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                        <h3 style={{fontWeight: '600', color: '#111827', fontSize: '1.1rem', flex: 1}}>
                          {image.title || 'Premium Virtual Background'}
                        </h3>
                        <span style={{
                          background: '#fbbf24',
                          color: '#92400e',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          4K ULTRA HD
                        </span>
                      </div>
                      <p style={{color: '#6b7280', fontSize: '0.95rem', marginBottom: '0.75rem'}}>
                        {image.description || 'Premium professional virtual background'}
                      </p>
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.25rem'}}>
                        {(image.keywords || []).slice(0, 3).map(keyword => (
                          <span key={keyword} style={{
                            background: '#fef3c7',
                            color: '#92400e',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem'
                          }}>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Preview Modal */}
        {selectedImage && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setSelectedImage(null)}
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                maxWidth: '90vw',
                maxHeight: '95vh',
                overflow: 'auto',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
              
              <h3 style={{ marginBottom: '15px', paddingRight: '30px' }}>
                {selectedImage.title || 'Premium Virtual Background'}
              </h3>
              
              <img
                src={`/images/${selectedImage.filename}`}
                alt={selectedImage.alt || 'Premium virtual background'}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  marginBottom: '15px'
                }}
              />
              
              <p style={{ color: '#666', marginBottom: '20px' }}>
                {selectedImage.description || 'Premium professional virtual background'}
              </p>
              
              <button
                onClick={() => handlePremiumPurchase(selectedImage)}
                style={{
                  backgroundColor: '#fbbf24',
                  color: '#92400e',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Buy ${selectedImage.price || '5.99'}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}