import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../../components/Footer';
import Image from 'next/image';

const categoryInfo = {
  'home-offices': {
    name: 'Home Offices',
    description: 'Professional home office backgrounds perfect for remote work and video calls'
  },
  'executive-offices': {
    name: 'Executive Offices', 
    description: 'Luxury executive office backgrounds for leadership meetings and professional calls'
  },
  'minimalist': {
    name: 'Minimalist',
    description: 'Clean, minimalist backgrounds for modern professionals'
  },
  'lobbies': {
    name: 'Lobbies',
    description: 'Professional lobby backgrounds for corporate meetings and client calls'
  },
  'private-offices': {
    name: 'Private Offices',
    description: 'Elegant private office backgrounds for confidential meetings'
  }
};

export default function CategoryPage({ slug }) {
  const [imageMetadata, setImageMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const category = categoryInfo[slug];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !slug) return;
    
    const loadMetadata = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/image-metadata.json');
        if (response.ok) {
          const data = await response.json();
          setImageMetadata(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading metadata:', error);
        setLoading(false);
      }
    };

    loadMetadata();
  }, [slug, mounted]);

const categoryImages = Object.entries(imageMetadata)
  .filter(([_, data]) => data.category === slug)
  .map(([filename, data]) => ({
    filename,
    ...data,
    key: filename
  }))
  .sort((a, b) => {
    // First sort by priority (wood accent images first)
    if (a.sortPriority && !b.sortPriority) return -1;
    if (!a.sortPriority && b.sortPriority) return 1;
    if (a.sortPriority && b.sortPriority) return a.sortPriority - b.sortPriority;
    
    // Then by premium status
    if (a.isPremium !== b.isPremium) return a.isPremium ? -1 : 1;
    
    // Finally by filename
    return a.filename.localeCompare(b.filename);
  });
  const handleDownload = (image) => {
    if (!image) return;
    
    const downloadUrl = image.isPremium && image.gumroadPermalink
      ? image.gumroadPermalink
      : `/images/${image.filename}`;
    
    if (image.isPremium && image.gumroadPermalink) {
      window.open(downloadUrl, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = image.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (!category) {
    return (
      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        <Head>
          <title>Category Not Found - Virtual Backgrounds</title>
        </Head>
        <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
          <h1>Category Not Found</h1>
          <p style={{color: '#6b7280', marginBottom: '2rem'}}>
            The category you're looking for doesn't exist.
          </p>
          <Link href="/" style={{color: '#2563eb', textDecoration: 'none', fontWeight: '600'}}>
            ← Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{category.name} Virtual Backgrounds - Free Download</title>
        <meta name="description" content={category.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '2rem 0',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
            <nav style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <Link 
                href="/" 
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: '#6b7280',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                  background: '#f3f4f6'
                }}
              >
                🏠 Home
              </Link>
              
              {Object.entries(categoryInfo).map(([categorySlug, info]) => (
                <Link 
                  key={categorySlug}
                  href={`/category/${categorySlug}`}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    color: categorySlug === slug ? 'white' : '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    background: categorySlug === slug ? '#2563eb' : '#f3f4f6'
                  }}
                >
                  {info.name}
                </Link>
              ))}
            </nav>
            
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#111827'
            }}>
              {category.name}
            </h1>
            
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {category.description}
            </p>
          </div>
        </header>

        <main style={{padding: 'clamp(1rem, 3vw, 2rem)'}}>
          <div style={{maxWidth: '1400px', margin: '0 auto'}}>
            {loading ? (
              <div style={{textAlign: 'center', padding: '2rem 0'}}>
                <p style={{color: '#6b7280'}}>Loading backgrounds...</p>
              </div>
            ) : categoryImages.length === 0 ? (
              <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
                <h2 style={{color: '#111827', marginBottom: '1rem'}}>No images found</h2>
                <p style={{color: '#6b7280', marginBottom: '2rem'}}>
                  No images are available for this category yet.
                </p>
                <Link href="/" style={{color: '#2563eb', textDecoration: 'none', fontWeight: '600'}}>
                  ← Browse Other Categories
                </Link>
              </div>
            ) : (
              <div className="image-grid">
                {categoryImages.map((image, index) => (
                  <div
  key={image.key}
  className="image-card"
  style={{}}
>
                   <div style={{position: 'relative', aspectRatio: '16/9', width: '100%'}}>
                      <Image
                        src={`/images/${image.filename}`}
                        alt={image.title || `${category.name} background ${index + 1}`}
                        fill
                        style={{objectFit: 'cover'}}
                        loading={index < 6 ? 'eager' : 'lazy'}
                        priority={index < 3}
                      />
                      {image.isPremium && (
                        <div style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                          4K Premium
                        </div>
                      )}
                    </div>
                    
                    <div style={{padding: '1rem'}}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '0.5rem'
                      }}>
                        {image.title || `Professional ${category.name.slice(0, -1)} ${index + 1}`}
                      </h3>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '0.75rem'
                      }}>
                        <span style={{
                          color: '#6b7280',
                          fontSize: '0.9rem'
                        }}>
                          {image.isPremium ? '4K Quality' : '2K Quality'}
                        </span>
                        
                        <span style={{
                          fontWeight: 'bold',
                          color: image.isPremium ? '#f59e0b' : '#059669'
                        }}>
                          {image.isPremium ? `$${image.price || '9.99'}` : 'Free'}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleDownload(image)}
                        style={{
                          width: '100%',
                          backgroundColor: '#2563eb',
                          color: 'white',
                          border: 'none',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          marginTop: '1rem'
                        }}
                      >
                        📥 Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

// Use the EXACT same pattern as your working premium page
export async function getServerSideProps(context) {
  const { slug } = context.query;
  
  // Small safety check for valid categories
  const validCategories = [
    'home-offices',
    'executive-offices', 
    'minimalist',
    'lobbies',
    'private-offices'
  ];
  
  if (!validCategories.includes(slug)) {
    return { notFound: true };
  }
  
  return {
    props: {
      slug
    }
  };
}