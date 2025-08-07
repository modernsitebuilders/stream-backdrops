import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import dynamic from 'next/dynamic';

// Dynamic component that loads only on client side
const DynamicPremiumGallery = dynamic(() => import('../components/PremiumGallery'), {
  ssr: false,
  loading: () => (
    <section style={{padding: '2rem'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{textAlign: 'center', padding: '4rem 0'}}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{color: '#6b7280', marginTop: '1rem'}}>Loading premium collection...</p>
        </div>
      </div>
    </section>
  )
});

// Main component - NO HOOKS HERE
export default function Premium() {
  return (
    <>
      <Head>
        <title>Premium 4K Virtual Backgrounds - StreamBackdrops</title>
        <meta name="description" content="Premium professional backgrounds for the most important video calls and presentations." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#2563eb" />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        {/* HEADER WITH CENTERED NAVIGATION */}
        <header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          padding: 'clamp(3rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)'
        }}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            {/* CLICKABLE LOGO */}
            <Link 
              href="/" 
              style={{
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: '1rem'
              }}
            >
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 'bold',
                color: 'white',
                cursor: 'pointer',
                lineHeight: 1.1
              }}>
                Stream<span style={{ color: '#60a5fa' }}>Backdrops</span>
              </h1>
            </Link>
            
            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 'bold',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              ✨ Premium 4K Collection
            </h2>
            
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              opacity: 0.9,
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}>
              Ultra high-resolution backgrounds for the most important meetings and presentations
            </p>
            
            {/* CENTERED NAVIGATION */}
            <nav style={{
              display: 'flex',
              gap: 'clamp(0.5rem, 2vw, 1rem)',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '2rem'
            }}>
              <Link href="/category/home-offices" style={{
                padding: 'clamp(0.5rem 0.75rem, 2vw, 0.75rem 1rem)',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '1rem',
                color: 'white',
                textDecoration: 'none',
                fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                Home Offices
              </Link>
              <Link href="/category/executive-offices" style={{
                padding: 'clamp(0.5rem 0.75rem, 2vw, 0.75rem 1rem)',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '1rem',
                color: 'white',
                textDecoration: 'none',
                fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                Executive Offices
              </Link>
              <Link href="/category/minimalist" style={{
                padding: 'clamp(0.5rem 0.75rem, 2vw, 0.75rem 1rem)',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '1rem',
                color: 'white',
                textDecoration: 'none',
                fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                Minimalist
              </Link>
              <Link href="/category/lobbies" style={{
                padding: 'clamp(0.5rem 0.75rem, 2vw, 0.75rem 1rem)',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '1rem',
                color: 'white',
                textDecoration: 'none',
                fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                Lobbies
              </Link>
              <Link href="/category/private-offices" style={{
                padding: 'clamp(0.5rem 0.75rem, 2vw, 0.75rem 1rem)',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '1rem',
                color: 'white',
                textDecoration: 'none',
                fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                Private Offices
              </Link>
              <Link href="/premium" style={{
                padding: 'clamp(0.5rem 0.75rem, 2vw, 0.75rem 1rem)',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                border: 'none',
                borderRadius: '1rem',
                color: 'white',
                textDecoration: 'none',
                fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
              }}>
                ✨ Premium 4K
              </Link>
            </nav>
          </div>
        </header>

        {/* PRICING SECTION - UPDATED TO $7.99 */}
        <section style={{
          padding: 'clamp(3rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)', 
          background: 'white'
        }}>
          <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
              fontWeight: 'bold', 
              marginBottom: '1rem', 
              color: '#111827'
            }}>
              Premium 4K Quality
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
              color: '#6b7280', 
              marginBottom: '3rem'
            }}>
              Ultra high-resolution backgrounds for executives and professionals who demand the best
            </p>
            
            <div style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '1.5rem',
              padding: 'clamp(2rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem)',
              color: 'white',
              marginBottom: '3rem'
            }}>
              <div style={{fontSize: 'clamp(2.5rem, 4vw, 3rem)', marginBottom: '1rem'}}>💎</div>
              <h3 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem'
              }}>
                $7.99 per image
              </h3>
              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.1rem)', 
                opacity: 0.9, 
                marginBottom: '2rem'
              }}>
                4K resolution (3840×2160) • Perfect for large displays • Commercial license included
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                lineHeight: 2
              }}>
                <li>✓ Ultra-high 4K resolution</li>
                <li>✓ Perfect for 4K monitors and projectors</li>
                <li>✓ Commercial use license included</li>
                <li>✓ Instant download after purchase</li>
                <li>✓ No watermarks or branding</li>
              </ul>
            </div>
          </div>
        </section>

        {/* DYNAMIC PREMIUM GALLERY - Only loads on client */}
        <DynamicPremiumGallery />
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

// Tell Next.js this can be statically generated
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 3600 // Revalidate every hour
  };
}