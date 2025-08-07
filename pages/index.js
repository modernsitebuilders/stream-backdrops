import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// FIXED categoryInfo with actual working images
const categoryInfo = {
  'home-offices': {
    name: 'Home Offices',
    description: 'Professional home office backgrounds perfect for remote work and video calls',
    image: 'contemporary-executive-home-office-5'
  },
  'executive-offices': {
    name: 'Executive Offices',
    description: 'Luxury executive office backgrounds for leadership meetings and professional calls',
    image: 'contemporary-executive-home-office-1'
  },
  'lobbies': {
    name: 'Lobbies',
    description: 'Professional lobby backgrounds for client meetings and business calls',
    image: 'corporate-lobby-with-reception-1'
  },
  'private-offices': {
    name: 'Private Offices',
    description: 'Specialized private office backgrounds for professional consultations and meetings',
    image: 'professional-consultation-office-1'
  },
  'minimalist': {
    name: 'Minimalist',
    description: 'Clean, minimalist backgrounds for modern professionals',
    image: 'minimalist-consultant-office-1'
  }
};

export default function Home() {
  const [imageCounts, setImageCounts] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load image counts
    const loadCounts = async () => {
      try {
        const response = await fetch('/data/image-metadata.json');
        if (response.ok) {
          const metadata = await response.json();
          const counts = {};
          
          Object.values(metadata).forEach(item => {
            counts[item.category] = (counts[item.category] || 0) + 1;
          });
          
          setImageCounts(counts);
        }
      } catch (error) {
        console.error('Error loading counts:', error);
      }
    };

    loadCounts();
  }, []);

  return (
    <>
      <Head>
        <title>Professional Virtual Backgrounds - Free HD Backgrounds for Video Calls</title>
        <meta name="description" content="Download free professional virtual backgrounds for Zoom, Teams, and video calls. HD quality backgrounds for home offices, executive offices, and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        {/* Header */}
        <header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '4rem 2rem'
        }}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Professional <span style={{color: '#fbbf24'}}>Virtual Backgrounds</span>
            </h1>
            
            <p style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              marginBottom: '0.5rem',
              opacity: '0.95'
            }}>
              Choose Your Professional Setting
            </p>
            
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.1rem)',
              opacity: '0.8',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Each category features carefully curated backgrounds optimized for video calls
            </p>
          </div>
        </header>

        {/* Categories Grid */}
        <main style={{padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)'}}>
          <div style={{maxWidth: '1400px', margin: '0 auto'}}>
            <div className="category-grid">
              {Object.entries(categoryInfo).map(([slug, info], index) => (
                <Link 
                  key={slug}
                  href={`/category/${slug}`}
                  className="category-card"
                  style={{textDecoration: 'none'}}
                >
                  <div>
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
                        loading={index < 2 ? 'eager' : 'lazy'}
                        priority={index < 2}
                      />
                    </div>
                    
                    <div style={{padding: '1.5rem'}}>
                      <h2 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '0.5rem'
                      }}>
                        {info.name}
                      </h2>
                      
                      <p style={{
                        color: '#6b7280',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        lineHeight: '1.5',
                        marginBottom: '1rem'
                      }}>
                        {info.description}
                      </p>
                      
                      {mounted && imageCounts[slug] && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.9rem'
                        }}>
                          <span style={{color: '#059669', fontWeight: '600'}}>
                            {imageCounts[slug]} Free Backgrounds
                          </span>
                          <span style={{color: '#6b7280'}}>
                            HD • Ready for video calls
                          </span>
                        </div>
                      )}
                      
                      {!mounted && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.9rem'
                        }}>
                          <span style={{color: '#059669', fontWeight: '600'}}>
                            Free Backgrounds
                          </span>
                          <span style={{color: '#6b7280'}}>
                            HD • Ready for video calls
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="features">
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
            <h2 style={{
              textAlign: 'center',
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '3rem'
            }}>
              Why Choose Our Backgrounds?
            </h2>
            
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">
                  <span style={{fontSize: '1.5rem'}}>🎯</span>
                </div>
                <h3>Perfectly Optimized</h3>
                <p>Each background is optimized for video calls with the right lighting and composition.</p>
              </div>
              
              <div className="feature">
                <div className="feature-icon">
                  <span style={{fontSize: '1.5rem'}}>📱</span>
                </div>
                <h3>Universal Compatibility</h3>
                <p>Works seamlessly with Zoom, Microsoft Teams, Google Meet, and all major platforms.</p>
              </div>
              
              <div className="feature">
                <div className="feature-icon">
                  <span style={{fontSize: '1.5rem'}}>⚡</span>
                </div>
                <h3>Instant Download</h3>
                <p>Download immediately and start using professional backgrounds in your next meeting.</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}