// pages/index.js - CORRECTED COMPLETE VERSION

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
  'professional': {
    name: 'Professional', 
    description: 'Executive backgrounds for business meetings and presentations',
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
      </Head>

      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        {/* Clean Navigation Header */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 0',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
                color: '#2563eb'
              }}>
                🎥 StreamBackdrops
              </div>
              
              {/* Category Navigation */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                {Object.entries(categoryInfo).map(([categorySlug, info]) => (
                  <Link 
                    key={categorySlug}
                    href={`/category/${categorySlug}`}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      color: '#374151',
                      fontWeight: '500',
                      background: '#f3f4f6',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#2563eb';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#f3f4f6';
                      e.target.style.color = '#374151';
                    }}
                  >
                    {info.name}
                  </Link>
                ))}
                
                <Link href="/blog" style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}>
                  📚 Setup Guides
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
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            fontWeight: 'bold',
            color: '#2563eb',
            marginBottom: '1rem'
          }}>
            StreamBackdrops
          </h1>
          
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
            Professional Virtual Backgrounds
          </h2>
          
          <p style={{ 
            color: '#6b7280', 
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            <span style={{color: '#059669', fontWeight: '600'}}>Free</span> high-quality backgrounds for Zoom, Teams, Google Meet & more.
            <br />
            <strong style={{color: '#059669'}}> No signup • No watermarks • Instant download</strong>
          </p>
        </div>

        {/* Category Cards - Just Two Categories */}
        <main style={{ 
          maxWidth: '1000px', 
          margin: '0 auto', 
          padding: '3rem 2rem'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            Browse Categories
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '3rem',
            marginBottom: '4rem',
            maxWidth: '800px',
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
                {/* Image placeholder */}
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    color: 'white',
                    textAlign: 'center'
                  }}>
                    🏠
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Home Lifestyle
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem'
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
                {/* Image placeholder */}
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    color: 'white',
                    textAlign: 'center'
                  }}>
                    💼
                  </div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Professional
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem'
                  }}>
                    Executive backgrounds for business meetings and professional presentations
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Call to Action */}
          <div style={{
            textAlign: 'center',
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Need help setting up virtual backgrounds?
            </h3>
            <p style={{
              color: '#6b7280',
              marginBottom: '1.5rem'
            }}>
              Check out our comprehensive setup guides for perfect results every time.
            </p>
            <Link href="/blog-virtual-background-guide" style={{
              background: '#2563eb',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '2rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#1d4ed8';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#2563eb';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
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