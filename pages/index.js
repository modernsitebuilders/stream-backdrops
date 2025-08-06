// REPLACE your pages/index.js with this fixed version

import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Static category info
const categoryInfo = {
  'home-offices': {
    name: 'Home Offices',
    description: 'Professional home office backgrounds perfect for remote work and video calls',
    image: 'clean-scandinavian-home-office-2'
  },
  'executive-offices': {
    name: 'Executive Offices',
    description: 'Luxury executive office backgrounds for leadership meetings and professional calls',
    image: 'corner-office-with-city-views-1'
  },
  'minimalist': {
    name: 'Minimalist',
    description: 'Clean, minimalist backgrounds for modern professionals',
    image: 'minimalist-executive-office-1'
  },
  'lobbies': {
    name: 'Lobbies',
    description: 'Professional lobby backgrounds for client meetings and business calls',
    image: 'modern-glass-lobby-3'
  },
  'private-offices': {
    name: 'Private Offices',
    description: 'Specialized private office backgrounds for professional consultations and meetings',
    image: 'private-office-with-bookshelf-1'
  }
};

// Dynamic component for image counts
const DynamicCategoryCards = dynamic(() => import('../components/CategoryCards'), {
  ssr: false,
  loading: () => (
    <div className="category-grid">
      {Object.entries(categoryInfo).map(([key, info], index) => (
        <Link 
          key={key}
          href={`/category/${key}`}
          className="category-card"
        >
          <div style={{
            position: 'relative',
            height: 'clamp(200px, 25vw, 280px)',
            overflow: 'hidden',
            background: '#f3f4f6'
          }}>
            <Image
              src={`/images/${info.image}.webp`}
              alt={info.name}
              fill
              style={{ objectFit: 'cover' }}
              loading={index === 0 ? "eager" : "lazy"}
              priority={index === 0}
              quality={75}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
            />
            
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
              color: 'white',
              padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 2vw, 1.5rem) clamp(0.5rem, 2vw, 1rem)',
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)'
              }}>
                {info.name}
              </h3>
              <p style={{
                fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                opacity: 0.9,
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {info.description}
              </p>
            </div>
          </div>

          <div style={{
            padding: 'clamp(1.5rem, 3vw, 2rem)'
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
                  fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                  marginBottom: '0.5rem'
                }}>
                  Loading...
                </p>
                <p style={{
                  color: '#6b7280',
                  fontSize: 'clamp(0.85rem, 1.5vw, 0.9rem)'
                }}>
                  HD • Ready for video calls
                </p>
              </div>
              
              <div style={{
                background: '#2563eb',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '50%',
                fontSize: 'clamp(1.2rem, 2vw, 1.5rem)'
              }}>
                →
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
});

const DynamicImageGallery = dynamic(() => import('../components/ImageGallery'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      background: '#f9fafb'
    }}>
      <div style={{
        width: '24px',
        height: '24px',
        border: '2px solid #e5e7eb',
        borderTop: '2px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
    </div>
  )
});

export default function Home() {
  return (
    <>
      <Head>
        <title>StreamBackdrops - Professional Virtual Backgrounds for Video Calls</title>
        <meta name="description" content="Download premium virtual backgrounds for Zoom, Teams, and Google Meet. Professional home offices, executive spaces, and minimalist designs. Free HD downloads." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* CRITICAL: Preload LCP image */}
        <link 
          rel="preload" 
          href="/images/clean-scandinavian-home-office-2.webp" 
          as="image" 
          type="image/webp"
          fetchPriority="high"
        />
        
        {/* Preload other hero images */}
        <link 
          rel="preload" 
          href="/images/corner-office-with-city-views-1.webp" 
          as="image" 
          type="image/webp"
        />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "StreamBackdrops",
              "description": "Professional virtual backgrounds for video calls",
              "url": "https://streambackdrops.com"
            })
          }}
        />
      </Head>

      <div className="critical-above-fold">
        {/* HERO SECTION */}
        <header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          padding: 'clamp(3rem, 6vw, 4rem) clamp(1rem, 3vw, 2rem)',
          minHeight: 'clamp(auto, 50vh, 60vh)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div className="container">
            {/* CLICKABLE LOGO */}
            <Link 
              href="/" 
              style={{ textDecoration: 'none' }}
            >
              <h1 style={{
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                lineHeight: 1.1,
                color: 'white',
                cursor: 'pointer'
              }}>
                Stream<span style={{ color: '#60a5fa' }}>Backdrops</span>
              </h1>
            </Link>
            
            <p style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              marginBottom: '0.5rem',
              fontWeight: 600,
              opacity: 0.95
            }}>
              Premium virtual backgrounds for professionals
            </p>
            
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
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
                fontWeight: 'bold'
              }}>
                FREE
              </span>
              {' '} downloads • Perfect for Zoom, Teams & Meet
            </p>
            
            {/* CATEGORY NAVIGATION */}
            <nav style={{
              display: 'flex',
              gap: 'clamp(0.5rem, 2vw, 1rem)',
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
                    padding: 'clamp(0.5rem 0.75rem, 2vw, 0.75rem 1.5rem)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '2rem',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {info.name}
                </Link>
              ))}
              
              <Link 
                href="/premium"
                style={{
                  padding: 'clamp(0.5rem 0.75rem, 2vw, 0.75rem 1.5rem)',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  borderRadius: '2rem',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
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

        {/* CATEGORIES SECTION */}
        <section style={{
          padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)',
          background: '#f9fafb'
        }}>
          <div className="container">
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '1rem',
              color: '#111827'
            }}>
              Choose Your Professional Setting
            </h2>
            
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              textAlign: 'center',
              color: '#6b7280',
              marginBottom: 'clamp(2rem, 4vw, 4rem)',
              maxWidth: '800px',
              margin: '0 auto clamp(2rem, 4vw, 3rem)'
            }}>
              Each category features carefully curated backgrounds optimized for video calls
            </p>

            {/* DYNAMIC CATEGORY GRID WITH REAL COUNTS */}
            <DynamicCategoryCards />
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section style={{
          background: 'white',
          padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem)'
        }}>
          <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: 'bold',
              marginBottom: 'clamp(1rem, 3vw, 2rem)',
              color: '#111827'
            }}>
              Why Choose StreamBackdrops?
            </h2>
            
            <div className="features-grid">
              {[
                {
                  icon: '🎯',
                  title: 'Video Call Optimized',
                  description: 'Designed specifically for perfect edge detection and professional appearance'
                },
                {
                  icon: '⚡',
                  title: 'Instant Download',
                  description: 'One-click downloads, ready to use in Zoom, Teams, and Meet'
                },
                {
                  icon: '🏆',
                  title: 'Premium Quality',
                  description: 'Professional photography and design for executive presence'
                }
              ].map((feature, index) => (
                <div key={index} className="feature">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DYNAMIC IMAGE GALLERY */}
        <DynamicImageGallery />
      </div>

      <Footer />

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 3600
  };
}