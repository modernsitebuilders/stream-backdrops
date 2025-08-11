// Complete pages/index.js - RESTORED to original good design
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>StreamBackdrops - Professional Virtual Backgrounds for Video Calls</title>
        <meta name="description" content="Download free professional virtual backgrounds for Zoom, Teams, and video calls. HD quality backgrounds for home offices, executive offices, and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        {/* Clean White Header - ORIGINAL STYLING */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 0'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <nav style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {/* Logo */}
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#2563eb'
              }}>
                🎥 StreamBackdrops
              </div>
              
              {/* Navigation Tabs - ORIGINAL STYLING */}
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'center'
              }}>
                <Link href="/category/well-lit" style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  background: '#f9fafb',
                  border: '1px solid #d1d5db',
                  transition: 'all 0.3s ease'
                }}>
                  Well Lit
                </Link>
                
                <Link href="/category/ambiant" style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  background: '#f9fafb',
                  border: '1px solid #d1d5db',
                  transition: 'all 0.3s ease'
                }}>
                  Ambient
                </Link>
                
                <Link href="/category/office-spaces" style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  background: '#f9fafb',
                  border: '1px solid #d1d5db',
                  transition: 'all 0.3s ease'
                }}>
                  Office Spaces
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section - VIDEO ONLY */}
        <section style={{
          position: 'relative',
          height: '80vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <video 
            autoPlay 
            muted 
            playsInline 
            preload="auto"
            onTimeUpdate={(e) => {
              if (e.target.currentTime >= e.target.duration - 0.1) {
                e.target.pause();
                e.target.currentTime = e.target.duration - 0.1;
              }
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '55%',
              height: 'auto',
              aspectRatio: '16/9',
              transform: 'translate(-50%, -50%)',
              objectFit: 'cover',
              zIndex: 1
            }}
          >
            <source src="https://stream-backdrops-videos.s3.amazonaws.com/u9972584128_Subtle_floating_light_particles_drifting_through__b01c2a5c-5dc6-410a-bbdb-704fa53bf572_0.mp4" type="video/mp4" />
          </video>
        </section>

        {/* Text Section - SEPARATE */}
        <section style={{
          padding: '2rem 2rem',
          textAlign: 'center',
          background: 'white',
          marginTop: '-10vh'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: '#111827'
          }}>
            Professional Virtual Backgrounds
          </h2>
          
          <p style={{ 
            fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6',
            color: '#6b7280'
          }}>
            Free high-quality backgrounds • No signup • No watermarks • Instant download
          </p>
        </section>

        {/* 3-Column Grid with REAL IMAGES like Image 2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem',
          maxWidth: '1200px',
          margin: '0 auto 4rem auto',
          padding: '0 2rem'
        }}>
          
          {/* Well Lit - with REAL IMAGE */}
          <Link href="/category/well-lit" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              {/* Real Background Image */}
              <div style={{
                position: 'relative',
                height: '200px',
                overflow: 'hidden'
              }}>
                <Image
                  src="/images/light/home-lifestyle-minimalist-home-office-10.webp"
                  alt="Well Lit"
                  fill
                  style={{ objectFit: 'cover' }}
                  quality={75}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#111827'
                }}>
                  Well Lit
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  Well-lit, bright backgrounds perfect for professional video calls
                </p>
              </div>
            </div>
          </Link>

          {/* Ambient - with REAL IMAGE */}
          <Link href="/category/ambiant" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              {/* Real Background Image */}
              <div style={{
                position: 'relative',
                height: '200px',
                overflow: 'hidden'
              }}>
                <Image
                  src="/images/dark/professional-shelves-industrial-professional-shelves-21.webp"
                  alt="Ambient"
                  fill
                  style={{ objectFit: 'cover' }}
                  quality={75}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#111827'
                }}>
                  Ambient
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  Atmospheric backgrounds with ambient lighting for sophisticated video calls
                </p>
              </div>
            </div>
          </Link>

          {/* Office Spaces - with REAL IMAGE */}
          <Link href="/category/office-spaces" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              {/* Real Background Image */}
              <div style={{
                position: 'relative',
                height: '200px',
                overflow: 'hidden'
              }}>
                <Image
                  src="/images/office-spaces/minimalist-executive-office-1.webp"
                  alt="Office Spaces"
                  fill
                  style={{ objectFit: 'cover' }}
                  quality={75}
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#111827'
                }}>
                  Office Spaces
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  Professional office environments and workspace backgrounds for business video calls
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Setup Guide Section - like in Image 2 */}
        <section style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'white',
          margin: '0 2rem',
          borderRadius: '1rem',
          marginBottom: '4rem'
        }}>
          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#111827'
          }}>
            Need help setting up virtual backgrounds?
          </h3>
          <p style={{
            color: '#6b7280',
            fontSize: '1.1rem',
            marginBottom: '2rem'
          }}>
            Check out our comprehensive setup guides for perfect results every time.
          </p>
          <Link 
            href="/blog-virtual-background-guide"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '2rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'inline-block'
            }}
          >
            📘 View Complete Setup Guide
          </Link>
        </section>

        {/* Footer */}
        <footer style={{
          background: '#1f2937',
          color: 'white',
          padding: '2rem 0',
          marginTop: '3rem'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <Link href="/about" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
                About
              </Link>
              <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
              <Link href="/license" style={{ color: '#fbbf24', textDecoration: 'none', margin: '0 15px', fontWeight: '600' }}>
                📋 License & Usage
              </Link>
              <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
              <Link href="/contact" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
                Contact
              </Link>
              <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
              <Link href="/blog" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
                Blog
              </Link>
              <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
              <Link href="/privacy" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
                Privacy Policy
              </Link>
              <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
              <Link href="/terms" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
                Terms of Service
              </Link>
            </div>
            <p style={{ color: '#d1d5db', margin: 0 }}>
              © 2025 StreamBackdrops. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}