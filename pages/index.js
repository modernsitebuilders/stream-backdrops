import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function Home() {
  const categories = [
    {
      name: 'Home Offices',
      slug: 'home-offices',
      description: 'Professional home office backgrounds perfect for remote work',
      image: 'clean-scandinavian-home-office-2.webp', 
      featured: true
    },
    {
      name: 'Executive Offices',
      slug: 'executive-offices', 
      description: 'Luxury executive office backgrounds for leadership calls',
      image: 'executive-office-with-marble-wall-1.webp',
      featured: true,
      premiumAvailable: true
    },
    {
      name: 'Minimalist',
      slug: 'minimalist',
      description: 'Clean, minimalist backgrounds for modern professionals',
      image: 'minimalist-executive-office-1.webp',
      premiumAvailable: true
    }, 
    {
      name: 'Lobbies',
      slug: 'lobbies',
      description: 'Professional lobby backgrounds for client meetings',
      image: 'modern-glass-lobby-3.webp',
      featured: true,
      premiumAvailable: true
    },
    {
      name: 'Private Offices',
      slug: 'private-offices',
      description: 'Specialized private office backgrounds for consultations',
      image: 'professional-consultation-office-1.webp'
    }
  ];

  return (
    <>
      <Head>
        <title>StreamBackdrops - Professional Virtual Backgrounds for Video Calls</title>
        <meta name="description" content="Download high-quality professional virtual backgrounds for Zoom, Teams, and video calls. Perfect for remote work, home offices, executive meetings, and professional presentations." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Resource hints for critical resources */}
        <link rel="preload" href="/images/clean-scandinavian-home-office-2.webp" as="image" fetchPriority="high" />
        <link rel="preload" href="/images/executive-office-with-marble-wall-1.webp" as="image" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Prevent layout shift */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .category-grid { 
              display: grid; 
              grid-template-columns: 1fr; 
              gap: 1rem; 
              contain: layout;
            }
            @media (min-width: 640px) { 
              .category-grid { grid-template-columns: repeat(2, 1fr); } 
            }
            @media (min-width: 1024px) { 
              .category-grid { grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); } 
            }
          `
        }} />
      </Head>

      <div>
        <header>
          <div className="container">
            <h1>Stream<span className="logo-blue">Backdrops</span></h1>
            <p className="subtitle">Professional virtual backgrounds for your video calls</p>
            <p className="description">
              High-quality backgrounds • <span style={{
                background: '#16a34a',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>FREE</span> downloads • Perfect for Zoom, Teams & more
            </p>
            
            {/* Add Category Navigation */}
            <nav style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '1.5rem',
              paddingBottom: '0.5rem'
            }}>
              <Link href="/category/home-offices" style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '1rem',
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600'
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
                fontWeight: '600'
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
                fontWeight: '600'
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
                fontWeight: '600'
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
                fontWeight: '600'
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
                fontWeight: '600'
              }}>
                ✨ Premium 4K
              </Link>
            </nav>
          </div>
        </header>

        <main className="container">
          <div style={{textAlign: 'center', marginBottom: '3rem'}}>
            <h2 style={{fontSize: '2.5rem', marginBottom: '1rem', color: '#111827'}}>Choose Your Professional Setting</h2>
            <p style={{fontSize: '1.2rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto'}}>
              Transform your video calls with high-quality virtual backgrounds designed for working professionals
            </p>
          </div>
          
          <div className="category-grid">
            {categories.map((category, index) => (
              <Link key={category.slug} href={`/category/${category.slug}`} className="category-card">
                <div>
                  <div style={{position: 'relative', height: '250px', overflow: 'hidden', borderRadius: '1rem 1rem 0 0'}}>
                    {/* Premium quality badge */}
                    {category.featured && (
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        zIndex: 10,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}>
                        PREMIUM QUALITY
                      </div>
                    )}
                    
                    {/* Premium available hint */}
                    {category.premiumAvailable && (
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                        color: '#92400e',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.75rem',
                        fontSize: '0.625rem',
                        fontWeight: 'bold',
                        zIndex: 10,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}>
                        4K AVAILABLE
                      </div>
                    )}
                    
                    <Image
                      src={`/images/${category.image}`}
                      alt={category.description}
                      width={800}   
                      height={450}     
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      priority={index < 2}
                      loading={index < 2 ? "eager" : "lazy"}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={85}
                    />
                  </div>
                  
                  <div style={{padding: '1.5rem'}}>
                    <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem'}}>
                      {category.name}
                    </h3>
                    <p style={{color: '#6b7280', marginBottom: '1rem'}}>
                      {category.description}
                    </p>
                    
                    {/* Enhanced call-to-action */}
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <div style={{color: '#2563eb', fontWeight: '600', display: 'flex', alignItems: 'center'}}>
                        <span>Browse collection</span>
                        <span style={{marginLeft: '0.5rem'}}>→</span>
                      </div>
                      
                      {category.premiumAvailable && (
                        <div style={{
                          background: '#fef3c7',
                          color: '#92400e',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.5rem'
                        }}>
                          Premium 4K
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <section style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          borderRadius: '1rem',
          padding: '3rem 2rem',
          margin: '3rem 0',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{maxWidth: '600px', margin: '0 auto'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white'}}>
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
            </h2>
            <p style={{fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9}}>
              Ultra high-quality 4K virtual backgrounds for the most important meetings and presentations
            </p>
            <Link href="/premium" style={{
              background: 'white',
              color: '#f59e0b',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              display: 'inline-block',
              transition: 'transform 0.2s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              View Premium Collection →
            </Link>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <div style={{textAlign: 'center', marginBottom: '3rem'}}>
              <h2 style={{fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>
                Why Choose StreamBackdrops?
              </h2>
            </div>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">
                  <span style={{fontSize: '2rem'}}>🖼️</span>
                </div>
                <h3>High Quality</h3>
                <p>Optimized for all video platforms and calling apps</p>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <span style={{fontSize: '2rem'}}>💼</span>
                </div>
                <h3>Professional</h3>
                <p>Designed for business meetings and professional calls</p>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <span style={{fontSize: '2rem'}}>⬇️</span>
                </div>
                <h3>Free Download</h3>
                <p>All backgrounds are completely free to download and use</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{
          background: '#f8fafc',
          padding: '4rem 0',
          margin: '4rem 0',
          textAlign: 'center'
        }}>
          <div className="container">
            <h2 style={{fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>
              Expert Tips & Guides
            </h2>
            <p style={{fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem'}}>
              Learn professional video call techniques, setup guides, and industry best practices
            </p>
            <Link href="/blog" style={{
              background: '#2563eb',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              display: 'inline-block',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              Read Our Blog →
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}