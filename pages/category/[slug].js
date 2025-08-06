import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';
import Image from 'next/image';

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [imageMetadata, setImageMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && slug) {
      loadMetadata();
    }
  }, [slug]);

  const loadMetadata = async () => {
    try {
      const response = await fetch('/api/metadata');
      const data = await response.json();
      setImageMetadata(data || {});
    } catch (error) {
      console.error('Failed to load metadata:', error);
      setImageMetadata({});
    } finally {
      setLoading(false);
    }
  };

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
      description: 'Professional lobby backgrounds for client meetings and business calls'
    },
    'private-offices': {
      name: 'Private Offices',
      description: 'Specialized private office backgrounds for professional consultations and meetings'
    }
  };

  const categoryImages = Object.entries(imageMetadata)
    .filter(([_, data]) => {
      if (!data || !slug) return false;
      return data.category === slug;
    })
    .map(([key, data]) => ({ key, ...data }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const handleDownload = async (image) => {
    if (typeof window === 'undefined') return;
    
    try {
      const response = await fetch(`/images/${image.filename}`);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = image.filename.replace('.webp', '.png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
      const link = document.createElement('a');
      link.href = `/images/${image.filename}`;
      link.download = image.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Don't render anything until router is ready
  if (!router.isReady || typeof window === 'undefined') {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!categoryInfo[slug]) {
    return (
      <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
        <h1>Category Not Found</h1>
        <Link href="/" style={{color: '#2563eb'}}>← Back to Home</Link>
      </div>
    );
  }

  const category = categoryInfo[slug];

  return (
    <>
      <Head>
        <title>{category.name} Virtual Backgrounds - StreamBackdrops</title>
        <meta name="description" content={`Download ${category.description.toLowerCase()}.`} />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        <header style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
            <Link href="/" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', textDecoration: 'none'}}>
              Stream<span style={{color: '#2563eb'}}>Backdrops</span>
            </Link>
            
            <nav style={{marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
              {Object.entries(categoryInfo).map(([key, info]) => (
                <Link
                  key={key}
                  href={`/category/${key}`}
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: key === slug ? '#2563eb' : '#6b7280',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    background: key === slug ? 'rgba(37, 99, 235, 0.1)' : 'transparent'
                  }}
                >
                  {info.name}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <section style={{background: '#2563eb', color: 'white', padding: '4rem 0', textAlign: 'center'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
            <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem'}}>
              {category.name}
            </h1>
            <p style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>
              {category.description}
            </p>
            <p style={{opacity: 0.9}}>
              {loading ? 'Loading...' : `${categoryImages.length} professional backgrounds available`}
            </p>
          </div>
        </section>

        <section style={{padding: '3rem 0'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
            {loading ? (
              <div style={{textAlign: 'center', padding: '3rem 0'}}>
                <p>Loading backgrounds...</p>
              </div>
            ) : categoryImages.length === 0 ? (
              <div style={{textAlign: 'center', padding: '3rem 0'}}>
                <p style={{color: '#6b7280', fontSize: '1.1rem'}}>No backgrounds found in this category.</p>
                <Link href="/" style={{color: '#2563eb', textDecoration: 'none', fontWeight: '600'}}>
                  ← Browse All Categories
                </Link>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem'
              }}>
                {categoryImages.map((image, index) => (
                  <div 
                    key={image.key} 
                    style={{
                      background: 'white',
                      borderRadius: '0.75rem',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <div style={{position: 'relative', aspectRatio: '16/9', overflow: 'hidden'}}>
                      <Image
                        src={`/images/${image.filename}`}
                        alt={image.alt || 'Virtual background'}
                        width={400}
                        height={225}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedImage(image)}
                        loading={index < 4 ? "eager" : "lazy"}
                        priority={index < 2}
                      />
                      
                      <div style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image);
                          }}
                          style={{
                            background: '#2563eb',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Download
                        </button>
                      </div>
                    </div>

                    <div style={{padding: '1.5rem'}}>
                      <h3 style={{fontWeight: '600', color: '#111827', fontSize: '1.1rem', marginBottom: '0.5rem'}}>
                        {image.title || 'Virtual Background'}
                      </h3>
                      <p style={{color: '#6b7280', fontSize: '0.95rem'}}>
                        {image.description || 'Professional virtual background'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {selectedImage && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setSelectedImage(null)}
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                maxWidth: '90vw',
                maxHeight: '95vh',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
              
              <h3 style={{ marginBottom: '15px', paddingRight: '30px' }}>
                {selectedImage.title || 'Virtual Background'}
              </h3>
              
              <Image
                src={`/images/${selectedImage.filename}`}
                alt={selectedImage.alt || 'Virtual background'}
                width={800}
                height={450}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  marginBottom: '15px'
                }}
              />
              
              <button
                onClick={() => handleDownload(selectedImage)}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Download PNG
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}

// This tells Next.js to use server-side rendering instead of static generation
export async function getServerSideProps(context) {
  return {
    props: {}, // Will be passed to the page component as props
  };
}