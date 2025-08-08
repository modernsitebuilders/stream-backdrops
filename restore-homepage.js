// restore-homepage.js - Restore the full styled homepage
const fs = require('fs');
const path = require('path');

const fullHomepage = `import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import Image from 'next/image';

// Updated category info for your new structure
const categoryInfo = {
  'professional-shelves': {
    name: 'Professional Shelves',
    description: 'Professional office shelves with books and plants - perfect for business video calls',
    image: 'professional-shelves-professional-shelves-2',
    count: 42
  },
  'home-lifestyle': {
    name: 'Home & Lifestyle',
    description: 'Stylish home offices and lifestyle spaces - ideal for creative professionals',
    image: 'home-lifestyle-minimalist-home-office-10',
    count: 48
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
            <Link href="/category/professional-shelves" style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              color: 'white',
              fontWeight: '500',
              fontSize: '0.9rem',
              background: 'rgba(255, 255, 255, 0.2)'
            }}>
              Professional Shelves
            </Link>
            
            <Link href="/category/home-lifestyle" style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              color: 'white',
              fontWeight: '500',
              fontSize: '0.9rem',
              background: 'rgba(255, 255, 255, 0.2)'
            }}>
              Home & Lifestyle
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
                  href={\`/category/\${slug}\`}
                  className="category-card"
                  style={{textDecoration: 'none'}}
                >
                  <div>
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16/9',
                      overflow: 'hidden',
                      background: '#f3f4f6',
                      borderRadius: '1rem 1rem 0 0'
                    }}>
                      <Image
                        src={\`/images/\${info.image}.webp\`}
                        alt={info.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        loading={index < 2 ? 'eager' : 'lazy'}
                      />
                    </div>
                    <div style={{
                      padding: '1.5rem',
                      background: 'white',
                      borderRadius: '0 0 1rem 1rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem',
                        color: '#111827'
                      }}>
                        {info.name}
                      </h2>
                      <p style={{
                        color: '#6b7280',
                        marginBottom: '1rem'
                      }}>
                        {info.description}
                      </p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          fontWeight: '600',
                          color: '#2563eb'
                        }}>
                          {info.count} backgrounds
                        </span>
                        <span style={{
                          background: '#2563eb',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          fontWeight: '600'
                        }}>
                          View Category →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <style jsx>{\`
        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .category-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 768px) {
          .category-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      \`}</style>
    </>
  );
}`;

// Backup current and restore
const indexPath = path.join(__dirname, 'pages', 'index.js');
if (fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath + '.simple-backup', fs.readFileSync(indexPath));
}

fs.writeFileSync(indexPath, fullHomepage);
console.log('✅ Restored full homepage with styling and proper category structure');
console.log('🎨 Added gradient header, category cards, and responsive design');
console.log('🖼️ Updated to use your actual image filenames');