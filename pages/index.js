// pages/index.js - FIXED VERSION with Office Spaces

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

const categoryInfo = {
  'home-lifestyle': {
    name: 'Home Lifestyle',
    description: 'Comfortable backgrounds for remote work and personal calls',
    count: 0
  },
  'professional-shelves': {
    name: 'Professional', 
    description: 'Executive backgrounds for business meetings and presentations',
    count: 0
  },
  'office-spaces': {
    name: 'Office Spaces',
    description: 'Professional office environments and workspace backgrounds for business video calls',
    image: 'minimalist-executive-office-1',
    count: 0
  }
};

export default function Home() {
  const [totalImages, setTotalImages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImageCounts() {
      try {
        const response = await fetch('/api/metadata');
        const metadata = await response.json();
        
        // Count images by category
        const counts = {};
        Object.values(metadata).forEach(data => {
          if (data.category && !data.isPremium) {
            counts[data.category] = (counts[data.category] || 0) + 1;
          }
        });

        // Update category info with counts
        Object.keys(categoryInfo).forEach(cat => {
          categoryInfo[cat].count = counts[cat] || 0;
        });

        setTotalImages(Object.values(counts).reduce((sum, count) => sum + count, 0));
      } catch (error) {
        console.error('Error loading image counts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadImageCounts();
  }, []);

  return (
    <>
      <Head>
        <title>StreamBackdrops - Professional Virtual Backgrounds</title>
        <meta name="description" content="Professional virtual backgrounds for Zoom, Teams, Google Meet and more. High-quality backgrounds for video calls and remote work." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        background: '#f8fafc',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        {/* Clean Navigation Header */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 0',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          fontFamily: "'Inter', sans-serif"
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <nav style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {/* Brand */}
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#2563eb',
                fontFamily: "'Inter', sans-serif"
              }}>
                🎥 StreamBackdrops
              </div>
              
              {/* Navigation Links */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <Link href="/category/professional-shelves" style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  background: '#f9fafb',
                  border: '1px solid #d1d5db'
                }}>
                  Professional Shelves
                </Link>
                
                <Link href="/category/home-lifestyle" style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  background: '#f9fafb',
                  border: '1px solid #d1d5db'
                }}>
                  Home & Lifestyle
                </Link>
                
                <Link href="/category/office-spaces" style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  background: '#f9fafb',
                  border: '1px solid #d1d5db'
                }}>
                  Office Spaces
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <div style={{ 
          background: 'white', 
          textAlign: 'center', 
          padding: '3rem 2rem',
          borderBottom: '1px solid #e5e7eb',
          fontFamily: "'Inter', sans-serif"
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            fontWeight: 'bold',
            color: '#2563eb',
            marginBottom: '1rem',
            fontFamily: "'Inter', sans-serif"
          }}>
            StreamBackdrops
          </h1>
          
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1.5rem',
            fontFamily: "'Inter', sans-serif"
          }}>
            Professional Virtual Backgrounds
          </h2>
          
          <p style={{ 
            color: '#6b7280', 
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6',
            fontFamily: "'Inter', sans-serif"
          }}>
            <span style={{color: '#059669', fontWeight: '600'}}>Free</span> high-quality backgrounds for Zoom, Teams, Google Meet & more. <strong style={{color: '#059669'}}>No signup • No watermarks • Instant download</strong>
          </p>
        </div>

     {/* 3-Column Grid for All Categories */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
            maxWidth: '1000px',
            margin: '0 auto 4rem auto'
          }}>
            {/* Home Lifestyle */}
            <Link href="/category/home-lifestyle" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{
                  height: '200px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img
                    src="/images/home-lifestyle-minimalist-home-office-25.webp"
                    alt="Home Lifestyle minimalist office background"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    loading="eager"
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.75rem'
                  }}>
                    Home Lifestyle
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}>
                    Comfortable backgrounds perfect for remote work and personal video calls
                  </p>
                </div>
              </div>
            </Link>

            {/* Professional */}
            <Link href="/category/professional-shelves" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{
                  height: '200px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img
                    src="/images/professional-shelves-glass-professional-shelves-16.webp"
                    alt="Professional glass shelves office background"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    loading="eager"
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.75rem'
                  }}>
                    Professional
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}>
                    Executive backgrounds for business meetings and professional presentations
                  </p>
                </div>
              </div>
            </Link>

            {/* Office Spaces - NEW THIRD CATEGORY */}
            <Link href="/category/office-spaces" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{
                  height: '200px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img
                    src="/images/minimalist-executive-office-1.webp"
                    alt="Office Spaces minimalist executive office background"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    loading="eager"
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.75rem'
                  }}>
                    Office Spaces
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}>
                    Professional office environments and workspace backgrounds for business video calls
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Call to Action with Purple Button */}
          <div style={{
            textAlign: 'center',
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            border: '1px solid #e5e7eb',
            fontFamily: "'Inter', sans-serif"
          }}>

          {/* Call to Action with Purple Button */}
          <div style={{
            textAlign: 'center',
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            border: '1px solid #e5e7eb',
            fontFamily: "'Inter', sans-serif"
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem',
              fontFamily: "'Inter', sans-serif"
            }}>
              Need help setting up virtual backgrounds?
            </h3>
            <p style={{
              color: '#6b7280',
              marginBottom: '1.5rem',
              fontFamily: "'Inter', sans-serif"
            }}>
              Check out our comprehensive setup guides for perfect results every time.
            </p>
            <Link href="/blog-virtual-background-guide" style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '2rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
              fontFamily: "'Inter', sans-serif"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #6d28d9 0%, #9333ea 50%, #a855f7 100%)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(124, 58, 237, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.3)';
            }}>
              📖 View Complete Setup Guide
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}