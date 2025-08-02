
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

function AdUnit({ slot, style = {} }) {
  return (
    <div style={{textAlign: 'center', margin: '2rem 0', ...style}}>
      <ins 
        className="adsbygoogle"
        style={{display: 'block'}}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

export default function Home() {
  const categories = [
  {
    name: 'Home Offices',
    slug: 'home-offices',
    description: 'Professional home office backgrounds perfect for remote work',
    image: 'scandinavian-minimalist-home-office-1.webp'
  },
  {
    name: 'Executive Offices',
    slug: 'executive-offices', 
    description: 'Luxury executive office backgrounds for leadership calls',
    image: 'luxury-ceo-corner-office-1.webp'
  },
  {
    name: 'Conference Rooms',
    slug: 'conference-rooms',
    description: 'Professional meeting room backgrounds for team calls',
    image: 'modern-glass-conference-room-1.webp'
  },
  {
    name: 'Open Offices',
    slug: 'open-offices',
    description: 'Modern open workspace backgrounds for collaborative calls',
    image: 'modern-open-office-workspace-1.webp'
  },
  {
     name: 'Lobbies', // Change from 'Lounges' to 'Lobbies'
     slug: 'lobbies', // Change from 'lounges' to 'lobbies'
     description: 'Professional lobby backgrounds for client meetings',
     image: 'startup-incubator-lobby-1.webp'
  },
  {
    name: 'Private Offices',
    slug: 'private-offices',
    description: 'Specialized private office backgrounds for consultations',
    image: 'therapist-private-office-1.webp'
  }
];

  return (
    <>
      <Head>
        <title>StreamBackdrops - Professional Virtual Backgrounds for Video Calls</title>
        <meta name="description" content="Download high-quality professional virtual backgrounds for Zoom, Teams, and video calls. Perfect for remote work, home offices, executive meetings, and professional presentations." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`} className="category-card">
                <div>
                  <div style={{position: 'relative', height: '200px', overflow: 'hidden', borderRadius: '1rem 1rem 0 0'}}>
                    <img 
                      src={`/images/${category.image}`}
                      alt={category.description}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  
                  <div style={{padding: '1.5rem'}}>
                    <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem'}}>
                      {category.name}
                    </h3>
                    <p style={{color: '#6b7280', marginBottom: '1rem'}}>
                      {category.description}
                    </p>
                    <div style={{color: '#2563eb', fontWeight: '600', display: 'flex', alignItems: 'center'}}>
                      <span>Browse collection</span>
                      <span style={{marginLeft: '0.5rem'}}>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

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

      <Footer />
      </div>
    </>
  );
}
