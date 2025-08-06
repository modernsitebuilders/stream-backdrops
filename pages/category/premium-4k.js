import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function PremiumPage() {
  // Sample premium backgrounds data (you can replace with actual data later)
  const premiumSamples = [
    {
      id: 'premium-executive-1',
      title: 'Ultra HD Executive Office',
      description: '4K resolution luxury executive office with city views',
      previewImage: 'executive-office-with-marble-wall-1.webp',
      price: '$4.99'
    },
    {
      id: 'premium-home-1',
      title: 'Premium Home Office 4K',
      description: 'Ultra high-definition home office perfect for important calls',
      previewImage: 'clean-scandinavian-home-office-2.webp',
      price: '$3.99'
    },
    {
      id: 'premium-lobby-1',
      title: '4K Corporate Lobby',
      description: 'Stunning 4K corporate lobby background',
      previewImage: 'modern-glass-lobby-3.webp',
      price: '$4.99'
    }
  ];

  return (
    <>
      <Head>
        <title>Premium 4K Virtual Backgrounds - StreamBackdrops</title>
        <meta name="description" content="Ultra high-quality 4K virtual backgrounds for the most important video calls and professional presentations. Premium collection coming soon." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        {/* Header with Navigation */}
        <header style={{
          background: 'white', 
          borderBottom: '1px solid #e5e7eb', 
          padding: '1rem 0'
        }}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
            <Link href="/" style={{
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#111827', 
              textDecoration: 'none', 
              display: 'block', 
              marginBottom: '1rem'
            }}>
              Stream<span style={{color: '#2563eb'}}>Backdrops</span>
            </Link>
            
            {/* Navigation */}
            <nav style={{
              display: 'flex',
              gap: '0.75rem',
              overflowX: 'auto',
              padding: '0.5rem 0',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              <Link href="/category/home-offices" style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '1.5rem',
                fontWeight: '600',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                fontSize: '0.9rem',
                background: 'white',
                color: '#6b7280',
                border: '1px solid #e5e7eb'
              }}>
                Home Offices
              </Link>
              <Link href="/category/executive-offices" style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '1.5rem',
                fontWeight: '600',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                fontSize: '0.9rem',
                background: 'white',
                color: '#6b7280',
                border: '1px solid #e5e7eb'
              }}>
                Executive Offices
              </Link>
              <Link href="/category/lobbies" style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '1.5rem',
                fontWeight: '600',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                fontSize: '0.9rem',
                background: 'white',
                color: '#6b7280',
                border: '1px solid #e5e7eb'
              }}>
                Lobbies
              </Link>
              <span style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '1.5rem',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
              }}>
                Premium 4K ✨
              </span>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          color: 'white',
          padding: '4rem 0',
          textAlign: 'center'
        }}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
            <h1 style={{fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: 'bold', marginBottom: '1rem'}}>
              Premium 4K Collection
            </h1>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '0.5rem 1.5rem',
              borderRadius: '2rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              display: 'inline-block',
              marginBottom: '1.5rem'
            }}>
              ULTRA HD QUALITY
            </div>
            <p style={{fontSize: 'clamp(1rem, 4vw, 1.25rem)', marginBottom: '2rem', opacity: 0.95}}>
              Ultra high-quality 4K virtual backgrounds for the most important meetings and presentations
            </p>
            <p style={{fontSize: '1rem', opacity: 0.9}}>
              🚀 Coming Soon • 4K Resolution • Premium Quality
            </p>
          </div>
        </section>

        {/* Preview Section */}
        <section style={{padding: '3rem 0'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
            <div style={{textAlign: 'center', marginBottom: '3rem'}}>
              <h2 style={{fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>
                What's Coming
              </h2>
              <p style={{fontSize: '1.1rem', color: '#6b7280'}}>
                Get a preview of our premium 4K collection
              </p>
            </div>
            
            {/* Sample Premium Backgrounds */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {premiumSamples.map((sample) => (
                <div key={sample.id} style={{
                  background: 'white',
                  borderRadius: '1rem',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Premium Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '1.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
                  }}>
                    4K ULTRA HD
                  </div>
                  
                  {/* Price Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}>
                    {sample.price}
                  </div>
                  
                  <div style={{position: 'relative', aspectRatio: '16/9'}}>
                    <Image
                      src={`/images/${sample.previewImage}`}
                      alt={sample.title}
                      width={400}
                      height={225}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      quality={90}
                    />
                    
                    {/* Coming Soon Overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1rem',
                      right: '1rem',
                      background: 'rgba(251, 191, 36, 0.95)',
                      color: 'white',
                      padding: '0.75rem',
                      borderRadius: '0.75rem',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      backdropFilter: 'blur(8px)'
                    }}>
                      🚀 Coming Soon
                    </div>
                  </div>
                  
                  <div style={{padding: '1.5rem'}}>
                    <h3 style={{fontSize: '1.2rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem'}}>
                      {sample.title}
                    </h3>
                    <p style={{color: '#6b7280', fontSize: '0.95rem'}}>
                      {sample.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{background: '#f8fafc', padding: '3rem 0'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem'}}>
              Premium Features
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem'
            }}>
              <div style={{padding: '1.5rem'}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🎯</div>
                <h3 style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem'}}>
                  4K Ultra HD
                </h3>
                <p style={{color: '#6b7280'}}>
                  Crystal clear 4K resolution for the most important presentations
                </p>
              </div>
              
              <div style={{padding: '1.5rem'}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>⚡</div>
                <h3 style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem'}}>
                  Optimized Files
                </h3>
                <p style={{color: '#6b7280'}}>
                  Professionally optimized for all video conferencing platforms
                </p>
              </div>
              
              <div style={{padding: '1.5rem'}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🎨</div>
                <h3 style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem'}}>
                  Exclusive Designs
                </h3>
                <p style={{color: '#6b7280'}}>
                  Unique backgrounds not available in our free collection
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{padding: '3rem 0', textAlign: 'center'}}>
          <div style={{maxWidth: '600px', margin: '0 auto', padding: '0 2rem'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>
              Want Early Access?
            </h2>
            <p style={{fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem'}}>
              Be the first to know when our premium 4K collection launches. In the meantime, explore our free collection.
            </p>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
              <Link href="/" style={{
                background: '#2563eb',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'inline-block',
                transition: 'background-color 0.2s ease'
              }}>
                Browse Free Collection
              </Link>
              <button style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: 'white',
                padding: '1rem 2rem',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Get Notified
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <style jsx>{`
        nav::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}