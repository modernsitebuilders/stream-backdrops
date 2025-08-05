// Update your pages/premium.js file with this version:

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

  const handleComingSoonClick = () => {
    // You can add analytics tracking here if needed
    console.log('User clicked on coming soon - interested in premium!');
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
        <meta name="description" content="Ultra high-quality 4K virtual backgrounds coming soon. Premium professional backgrounds for the most important video calls and presentations." />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        {/* Category Navigation Header */}
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

        {/* Premium Hero Section with Coming Soon */}
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
                COMING SOON
              </span>
            </h1>
            
            <p style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>
              Ultra high-quality 4K virtual backgrounds with premium materials and luxury details
            </p>
            <p style={{opacity: 0.9, fontSize: '1.1rem', marginBottom: '2rem'}}>
              Professional quality • Perfect for important meetings • Launching soon at $7.99
            </p>

            {/* Coming Soon Notice */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '600px',
              margin: '0 auto',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white'}}>
                🚀 Premium Collection Launching Soon!
              </h2>
              <p style={{fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6'}}>
                We're working on setting up secure payment processing for our premium 4K backgrounds. 
                Check back soon for ultra high-definition backgrounds perfect for your most important meetings.
              </p>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                padding: '1rem',
                fontSize: '0.95rem'
              }}>
                <strong>What to expect:</strong>
                <ul style={{textAlign: 'left', marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
                  <li>4K Ultra HD resolution (3840×2160)</li>
                  <li>Premium lighting and materials</li>
                  <li>Instant digital download</li>
                  <li>Commercial use license included</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Preview Images Section */}
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
            <div style={{textAlign: 'center', marginBottom: '3rem'}}>
              <h2 style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>
                Preview: Premium Quality
              </h2>
              <p style={{fontSize: '1.1rem', color: '#6b7280', maxWidth: '600px'}}>
                Get a taste of what's coming with these preview images. The full premium collection will feature 
                even higher quality and more exclusive designs.
              </p>
            </div>

            {premiumImages.length === 0 ? (
              <div style={{textAlign: 'center', padding: '3rem 0'}}>
                <div style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  borderRadius: '1rem',
                  padding: '3rem 2rem',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}>
                  <div style={{fontSize: '4rem', marginBottom: '1rem'}}>⏳</div>
                  <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1', marginBottom: '1rem'}}>
                    Premium Collection Coming Soon
                  </h3>
                  <p style={{color: '#0284c7', fontSize: '1rem', marginBottom: '2rem'}}>
                    We're putting the finishing touches on our premium 4K backgrounds. 
                    Meanwhile, enjoy our free professional collection!
                  </p>
                  <Link href="/" style={{
                    background: '#0369a1',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'inline-block'
                  }}>
                    Browse Free Collection
                  </Link>
                </div>
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
                {premiumImages.slice(0, 3).map((image) => (
                  <div 
                    key={image.key} 
                    style={{
                      background: 'white',
                      borderRadius: '0.75rem',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                      overflow: 'hidden',
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
                      COMING SOON
                    </div>

                    <div style={{position: 'relative', aspectRatio: '16/9', overflow: 'hidden'}}>
                      <img
                        src={`/images/${image.filename}`}
                        alt={image.alt || 'Premium virtual background preview'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          filter: 'brightness(0.7)' // Slightly dimmed to indicate coming soon
                        }}
                        onClick={() => setSelectedImage(image)}
                      />
                      
                      {/* Coming Soon Overlay */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}>
                        <div style={{
                          background: 'rgba(251, 191, 36, 0.95)',
                          color: '#92400e',
                          padding: '1rem 2rem',
                          borderRadius: '1rem',
                          textAlign: 'center',
                          backdropFilter: 'blur(10px)'
                        }}>
                          <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>⏳</div>
                          <div style={{fontWeight: 'bold', fontSize: '1.1rem'}}>Coming Soon</div>
                          <div style={{fontSize: '0.9rem', opacity: 0.8}}>4K Premium Quality</div>
                        </div>
                        
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
                          COMING SOON
                        </span>
                      </div>
                      <p style={{color: '#6b7280', fontSize: '0.95rem', marginBottom: '0.75rem'}}>
                        {image.description || 'Premium professional virtual background'} (Preview quality - final version will be 4K)
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

                {/* Call to Action for Free Backgrounds */}
                <div style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  borderRadius: '1rem',
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'white',
                  maxWidth: '500px',
                  margin: '2rem auto 0'
                }}>
                  <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white'}}>
                    Can't Wait? Start with Our Free Collection
                  </h3>
                  <p style={{marginBottom: '1.5rem', opacity: 0.9}}>
                    While you're waiting for our premium 4K backgrounds, explore our extensive 
                    free collection of professional virtual backgrounds.
                  </p>
                  <Link href="/" style={{
                    background: 'white',
                    color: '#2563eb',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'inline-block'
                  }}>
                    Browse Free Backgrounds →
                  </Link>
                </div>
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
                {selectedImage.title || 'Premium Virtual Background'} (Preview)
              </h3>
              
              <img
                src={`/images/${selectedImage.filename}`}
                alt={selectedImage.alt || 'Premium virtual background preview'}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  marginBottom: '15px'
                }}
              />
              
              <div style={{
                background: '#fef3c7',
                border: '1px solid #fbbf24',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <p style={{ color: '#92400e', margin: 0, fontWeight: '600' }}>
                  🚀 This is a preview! The premium version will be available in 4K Ultra HD quality (3840×2160) very soon.
                </p>
              </div>
              
              <p style={{ color: '#666', marginBottom: '20px' }}>
                {selectedImage.description || 'Premium professional virtual background'} 
                The final premium version will feature enhanced details and 4K resolution.
              </p>
              
              <div style={{display: 'flex', gap: '1rem'}}>
                <button
                  onClick={handleComingSoonClick}
                  style={{
                    backgroundColor: '#fbbf24',
                    color: '#92400e',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    opacity: 0.7
                  }}
                  disabled
                >
                  Coming Soon - $7.99
                </button>
                
                <Link href="/" style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                  Browse Free Collection
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}