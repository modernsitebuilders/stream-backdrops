import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import Image from 'next/image';

// WORKING IMAGES - Replace your categoryInfo with this
const categoryInfo = {
  'home-offices': {
    name: 'Home Offices',
    description: 'Professional home office backgrounds perfect for remote work and video calls',
    image: 'scandinavian-home-office-1'  // This image exists
  },
  'executive-offices': {
    name: 'Executive Offices',
    description: 'Luxury executive office backgrounds for leadership meetings and professional calls',
    image: 'luxury-ceo-corner-office-4'  // This image exists
  },
  'minimalist': {
    name: 'Minimalist',
    description: 'Clean, minimalist backgrounds for modern professionals',
    image: 'minimalist-consultant-office-1'  // This image exists
  },
  'lobbies': {
    name: 'Lobbies',
    description: 'Professional lobby backgrounds for corporate meetings and client calls',
    image: 'corporate-lobby-with-reception-1'  // This image exists
  },
  'private-offices': {
    name: 'Private Offices',
    description: 'Elegant private office backgrounds for confidential meetings',
    image: 'professional-consultation-office-1'  // This image exists
  }
};

export default function Home() {
  return (
    <>
      <Head>
        <title>StreamBackdrops - Professional Virtual Backgrounds for Video Calls</title>
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
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <span style={{color: '#fbbf24'}}>Stream</span>Backdrops
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
          <nav style={{
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '1rem',
  marginTop: '2rem'
}}>
  <Link href="/category/home-offices" style={{
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: 'white',
    fontWeight: '500',
    fontSize: '0.9rem',
    background: 'rgba(255, 255, 255, 0.2)'
  }}>
    Home Offices
  </Link>
  
  <Link href="/category/executive-offices" style={{
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: 'white',
    fontWeight: '500',
    fontSize: '0.9rem',
    background: 'rgba(255, 255, 255, 0.2)'
  }}>
    Executive Offices
  </Link>
  
  <Link href="/category/minimalist" style={{
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: 'white',
    fontWeight: '500',
    fontSize: '0.9rem',
    background: 'rgba(255, 255, 255, 0.2)'
  }}>
    Minimalist
  </Link>
  
  <Link href="/category/lobbies" style={{
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: 'white',
    fontWeight: '500',
    fontSize: '0.9rem',
    background: 'rgba(255, 255, 255, 0.2)'
  }}>
    Lobbies
  </Link>
  
  <Link href="/category/private-offices" style={{
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: 'white',
    fontWeight: '500',
    fontSize: '0.9rem',
    background: 'rgba(255, 255, 255, 0.2)'
  }}>
    Private Offices
  </Link>
  
  <Link href="/premium" style={{
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.9rem',
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
  }}>
    ✨ Premium 4K
  </Link>
</nav>
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
                      width: '100%',
                      aspectRatio: '16/9',
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
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.9rem'
                      }}>
                        <span style={{color: '#059669', fontWeight: '600'}}>
                          {info.count} Free Backgrounds
                        </span>
                        <span style={{color: '#6b7280'}}>
                          HD • Ready for video calls
                        </span>
                      </div>
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