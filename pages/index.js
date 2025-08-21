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
  <title>Free Professional Virtual Backgrounds - StreamBackdrops</title>
  <meta name="description" content="Download 90+ free professional virtual backgrounds for Zoom, Teams & Google Meet. HD home offices, executive offices, lobbies & more. Instant download, no signup required." />
  <meta name="keywords" content="virtual backgrounds, Zoom backgrounds, Teams backgrounds, professional video calls, home office backgrounds, free download" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="author" content="StreamBackdrops" />
  <meta name="theme-color" content="#2563eb" />
  {/* Open Graph for social sharing */}
  <meta property="og:title" content="Free Professional Virtual Backgrounds - StreamBackdrops" />
  <meta property="og:description" content="Download 90+ free professional virtual backgrounds for video calls. HD quality, instant download." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://streambackdrops.com" />
  <meta property="og:image" content="https://streambackdrops.com/og-image.png" />
  
  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Free Professional Virtual Backgrounds" />
  <meta name="twitter:description" content="90+ free HD virtual backgrounds for Zoom, Teams & Google Meet" />
  
  {/* Canonical URL */}
  <link rel="canonical" href="https://streambackdrops.com" />
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "StreamBackdrops",
        "description": "Free professional virtual backgrounds for video calls",
        "url": "https://streambackdrops.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://streambackdrops.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      })
    }}
  />
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
                
                <Link href="/category/ambient-lighting" style={{
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
                  Ambient Lighting
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
                <Link href="/category/living-room" style={{
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
                  Living Room
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
        <section style={{
  padding: '3rem 2rem',
  background: '#f8fafc',
  maxWidth: '1200px',
  margin: '0 auto'
}}>
  <h2 style={{
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#1e293b'
  }}>
    📚 Expert Tips for Video Call Success
  </h2>
  
  <p style={{
    textAlign: 'center',
    color: '#64748b',
    marginBottom: '3rem'
  }}>
    Avoid common mistakes and look professional on every call
  </p>

  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  }}>
    {/* Card 1 - 10 Background Mistakes */}
{/*<Link href="/blog-background-mistakes" style={{ textDecoration: 'none' }}>
  <div style={{
    background: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  }}>
    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚫</div>
    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
      10 Background Mistakes
    </h3>
    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
      Common errors that kill your professional image
    </p>
  </div>
</Link>
/}
{/* Card 2 - Perfect Lighting Setup */}
<Link href="/blog-lighting-tips" style={{ textDecoration: 'none' }}>
  <div style={{
    background: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer'
  }}>
    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💡</div>
    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
      Perfect Lighting Setup
    </h3>
    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
      Look professional with proper lighting
    </p>
  </div>
</Link>

{/* Card 3 - 5-Minute Setup Guide */}
<Link href="/blog-virtual-background-guide" style={{ textDecoration: 'none' }}>
  <div style={{
    background: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer'
  }}>
    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
      5-Minute Setup Guide
    </h3>
    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
      Quick steps for perfect video calls
    </p>
  </div>
</Link>

{/* Card 4 - Choose the Right Style */}
<Link href="/blog-backgrounds-by-industry" style={{ textDecoration: 'none' }}>
  <div style={{
    background: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer'
  }}>
    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
      Choose the Right Style
    </h3>
    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
      Match your background to your industry
    </p>
  </div>
</Link>
</div>
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
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}>
              {/* Real Background Image */}
              <div style={{
                position: 'relative',
                height: '200px',
                overflow: 'hidden'
              }}>
                <Image
                 src="/images/well-lit/well-lit-minimalist-office-1.webp"
                  alt="Well-lit professional office background for video calls"
                  fill
                  style={{ objectFit: 'cover' }}
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 300px"
                  priority={true}
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

          {/* Ambient Lighting - with REAL IMAGE */}
          <Link href="/category/ambient-lighting" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}>
              {/* Real Background Image */}
              <div style={{
                position: 'relative',
                height: '200px',
                overflow: 'hidden'
              }}>
                <Image
                 src="/images/ambient-lighting/ambient-industrial-shelves-1.webp"
                 alt="Ambient lighting office background for video meetings"
                  fill
                  style={{ objectFit: 'cover' }}
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#111827'
                }}>
                  Ambient Lighting
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
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}>
              {/* Real Background Image */}
              <div style={{
                position: 'relative',
                height: '200px',
                overflow: 'hidden'
              }}>
                <Image
                 src="/images/office-spaces/office-spaces-minimalist-executive-1.webp"
                  alt="Professional office space background for business calls"
                  fill
                  style={{ objectFit: 'cover' }}
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 300px"
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

          {/* Living Room - with REAL IMAGE */}
          <Link href="/category/living-room" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}>
              {/* Real Background Image */}
              <div style={{
                position: 'relative',
                height: '200px',
                overflow: 'hidden'
              }}>
                <Image
                 src="/images/living-room/living-room-29.webp"
                  alt="Comfortable living room backgrounds for casual meetings and personal video calls"
                  fill
                  style={{ objectFit: 'cover' }}
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#111827'
                }}>
                  Living Room
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  Comfortable living room virtual backgrounds for casual video calls and personal meetings. Cozy home settings for relaxed conversations.
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