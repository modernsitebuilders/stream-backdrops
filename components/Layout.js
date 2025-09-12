import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ 
  children, 
  title = 'StreamBackdrops - Free HD Virtual Backgrounds',
  description = 'Download free HD virtual backgrounds for Zoom, Teams, and Google Meet. Professional quality backgrounds for video calls.',
  currentPage = null,
  canonical,
  keywords = 'virtual backgrounds, Zoom backgrounds, Teams backgrounds, professional video calls, free download',
  image = '/og-image.png',
  structuredData,
  noIndex = false
}) {
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "StreamBackdrops",
    "description": "Free professional virtual backgrounds for video calls",
    "url": "https://streambackdrops.com"
  };

  return (
    <>
      <Head>
  <title>{title}</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* ✅ SEO Meta Tags */}
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="StreamBackdrops" />
        
        {/* ✅ Robots directive */}
        <meta name="robots" content={noIndex ? 'noindex' : 'index, follow, max-image-preview:large'} />
        
        {/* ✅ Canonical URL */}
        {canonical && <link rel="canonical" href={canonical} />}
        
        {/* ✅ Open Graph for Social Sharing */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`https://streambackdrops.com${image}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="StreamBackdrops" />
        {canonical && <meta property="og:url" content={canonical} />}
        
        {/* ✅ Twitter Cards */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={`https://streambackdrops.com${image}`} />
        
        {/* ✅ Theme and additional meta */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* ✅ Structured Data */}
       <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(structuredData || defaultStructuredData)
  }}
/>
{/* Add FAQ schema for homepage */}
{currentPage === 'home' && (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I download virtual backgrounds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Simply browse our categories, click on any background image, and download it instantly. No signup required - all backgrounds are completely free."
            }
          },
          {
            "@type": "Question", 
            "name": "What video platforms support virtual backgrounds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our backgrounds work with Zoom, Microsoft Teams, Google Meet, Skype, Discord, and most video calling platforms that support custom virtual backgrounds."
            }
          }
        ]
      })
    }}  
  />
)}
{/* Add prefetching for popular categories on homepage */}
{currentPage === 'home' && (
  <>
    <link rel="prefetch" href="/category/well-lit" />
    <link rel="prefetch" href="/category/office-spaces" />
    <link rel="prefetch" href="/category/living-room" />
    <link rel="prefetch" href="/category/kitchen" />
  </>
)}
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        background: '#f9fafb'
      }}>
        {/* ✅ Consistent Header */}
        <header style={{ 
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 0',
          position: 'sticky',
          top: '0',
          zIndex: '100'
        }}>
          <div style={{ 
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* ✅ Logo */}
            <Link href="/" style={{ 
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#2563eb',
              textDecoration: 'none'
            }}>
              StreamBackdrops
            </Link>
            
            {/* ✅ Navigation */}
           <nav style={{ 
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'center',
  flexWrap: 'wrap'
}}>
  <Link href="/category/well-lit" style={{
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: currentPage === 'well-lit' ? '#2563eb' : '#374151',
    fontWeight: '500',
    fontSize: '0.9rem',
    background: '#f9fafb',
    border: currentPage === 'well-lit' ? '2px solid #2563eb' : '1px solid #d1d5db',
    transition: 'all 0.3s ease'
  }}>
    Well Lit
  </Link>
  
  <Link href="/category/ambient-lighting" style={{
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: currentPage === 'ambient-lighting' ? '#2563eb' : '#374151',
    fontWeight: '500',
    fontSize: '0.9rem',
    background: '#f9fafb',
    border: currentPage === 'ambient-lighting' ? '2px solid #2563eb' : '1px solid #d1d5db',
    transition: 'all 0.3s ease'
  }}>
    Ambient Lighting
  </Link>
  
  <Link href="/category/office-spaces" style={{
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: currentPage === 'office-spaces' ? '#2563eb' : '#374151',
    fontWeight: '500',
    fontSize: '0.9rem',
    background: '#f9fafb',
    border: currentPage === 'office-spaces' ? '2px solid #2563eb' : '1px solid #d1d5db',
    transition: 'all 0.3s ease'
  }}>
    Office Spaces
  </Link>
  
  <Link href="/category/living-room" style={{
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: currentPage === 'living-room' ? '#2563eb' : '#374151',
    fontWeight: '500',
    fontSize: '0.9rem',
    background: '#f9fafb',
    border: currentPage === 'living-room' ? '2px solid #2563eb' : '1px solid #d1d5db',
    transition: 'all 0.3s ease'
  }}>
    Living Room
  </Link>
  
  <Link href="/category/kitchen" style={{
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: currentPage === 'kitchen' ? '#2563eb' : '#374151',
    fontWeight: '500',
    fontSize: '0.9rem',
    background: '#f9fafb',
    border: currentPage === 'kitchen' ? '2px solid #2563eb' : '1px solid #d1d5db',
    transition: 'all 0.3s ease'
  }}>
    Kitchen
  </Link>
</nav>
          </div>
        </header>

        {/* ✅ Main Content */}
        <main style={{ flex: 1 }}>
          {children}
        </main>

        {/* ✅ Consistent Footer */}
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
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginBottom: '1rem', 
              flexWrap: 'wrap' 
            }}>
              <Link href="/about" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                margin: '0 15px' 
              }}>
                About
              </Link>
              <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
              <Link href="/license" style={{ 
                color: '#fbbf24', 
                textDecoration: 'none', 
                margin: '0 15px', 
                fontWeight: '600' 
              }}>
                License & Usage
              </Link>
              <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
              <Link href="/contact" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                margin: '0 15px' 
              }}>
                Contact
              </Link>
              <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
              <Link href="/blog" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                margin: '0 15px' 
              }}>
                Blog
              </Link>
              <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
              <Link href="/privacy" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                margin: '0 15px' 
              }}>
                Privacy Policy
              </Link>
              <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
              <Link href="/terms" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                margin: '0 15px' 
              }}>
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