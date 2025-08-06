import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function PremiumPage() {
  // Premium 4K images showcase
  const premiumImages = [
    {
      title: 'Executive Corner Office 4K',
      filename: 'corner-office-with-city-views-1.webp',
      description: 'Ultra-high resolution corner office with panoramic city views'
    },
    {
      title: 'Luxury Marble Executive Suite 4K',
      filename: 'executive-office-with-marble-wall-1.webp',
      description: 'Premium executive office with marble accents'
    },
    {
      title: 'Modern Glass Lobby 4K',
      filename: 'modern-glass-lobby-3.webp',
      description: 'Contemporary glass lobby with premium finishes'
    },
    {
      title: 'Minimalist Executive Office 4K',
      filename: 'minimalist-executive-office-1.webp',
      description: 'Clean, minimal executive workspace in 4K'
    },
    {
      title: 'Corporate Reception 4K',
      filename: 'corporate-lobby-with-reception-1.webp',
      description: 'Professional corporate lobby in ultra-high definition'
    },
    {
      title: 'Scandinavian Home Office 4K',
      filename: 'clean-scandinavian-home-office-2.webp',
      description: 'Premium Scandinavian-style home office'
    }
  ];

  return (
    <>
      <Head>
        <title>Premium 4K Virtual Backgrounds - StreamBackdrops</title>
        <meta name="description" content="Ultra high-quality 4K virtual backgrounds coming soon. Premium professional backgrounds for the most important video calls and presentations." />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        <header style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
            <Link href="/" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', textDecoration: 'none'}}>
              Stream<span style={{color: '#2563eb'}}>Backdrops</span>
            </Link>
            
            {/* Category Navigation */}
            <nav style={{display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '1rem 0'}}>
              <Link href="/category/home-offices" style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '1rem',
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                Home Offices
              </Link>
              <Link href="/category/executive-offices" style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '1rem',
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                Executive
              </Link>
              <Link href="/category/minimalist" style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '1rem',
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                Minimalist
              </Link>
              <Link href="/category/lobbies" style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '1rem',
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                Lobbies
              </Link>
              <Link href="/category/private-offices" style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '1rem',
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                Private Offices
              </Link>
              <Link href="/premium" style={{
                padding: '0.5rem 1rem',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                borderRadius: '1rem',
                color: 'white',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                ✨ Premium 4K
              </Link>
            </nav>
          </div>
        </header>

        <section style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          color: 'white',
          padding: '4rem 0',
          textAlign: 'center'
        }}>
          <div style={{maxWidth: '600px', margin: '0 auto', padding: '0 2rem'}}>
            <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white'}}>
              Premium 4K Collection
            </h1>
            <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>
              Ultra high-quality 4K virtual backgrounds for the most important meetings
            </p>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '1rem',
              borderRadius: '1rem',
              marginBottom: '2rem'
            }}>
              <p style={{fontSize: '1.1rem', fontWeight: 'bold'}}>
                🎉 Coming Soon: Full 4K Collection
              </p>
              <p style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
                Preview our premium quality below
              </p>
            </div>
          </div>
        </section>

        {/* Premium Images Grid */}
        <section style={{padding: '3rem 0'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#111827',
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              Premium 4K Preview
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              {premiumImages.map((image, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}>
                  {/* 4K Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}>
                    4K ULTRA HD
                  </div>
                  
                  <div style={{
                    position: 'relative',
                    aspectRatio: '16/9',
                    background: '#f3f4f6'
                  }}>
                    <Image
                      src={`/images/${image.filename}`}
                      alt={image.title}
                      width={800}
                      height={450}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      quality={90}
                    />
                  </div>
                  
                  <div style={{padding: '1.5rem'}}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      {image.title}
                    </h3>
                    <p style={{
                      color: '#6b7280',
                      marginBottom: '1rem'
                    }}>
                      {image.description}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center'
                    }}>
                      <button style={{
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'not-allowed',
                        opacity: 0.7,
                        flex: 1
                      }} disabled>
                        Coming Soon
                      </button>
                      <span style={{
                        color: '#f59e0b',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                      }}>
                        $2.99
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              borderRadius: '1rem',
              padding: '3rem',
              textAlign: 'center',
              color: 'white'
            }}>
              <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>
                Get Notified When Premium Launches
              </h2>
              <p style={{fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9}}>
                Be the first to access our complete 4K collection
              </p>
              <Link href="/" style={{
                background: 'white',
                color: '#2563eb',
                padding: '1rem 2rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                Browse Free Collection Now
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}