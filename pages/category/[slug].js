import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../components/Footer';
import dynamic from 'next/dynamic';

const categoryInfo = {
  'home-offices': {
    name: 'Home Offices',
    description: 'Professional home office backgrounds for remote work and video calls'
  },
  'executive-offices': {
    name: 'Executive Offices',
    description: 'Sophisticated executive office environments for professional presentations'
  },
  'minimalist': {
    name: 'Minimalist',
    description: 'Clean, simple backgrounds that keep the focus on you'
  },
  'lobbies': {
    name: 'Lobbies',
    description: 'Elegant lobby and reception area backgrounds'
  },
  'private-offices': {
    name: 'Private Offices',
    description: 'Professional private office settings for important meetings'
  }
};

// Create a client-side only component for the interactive parts
function CategoryContent({ slug }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    async function loadImages() {
      try {
        const response = await fetch('/api/metadata');
        const metadata = await response.json();
        
        const categoryImages = Object.entries(metadata)
          .filter(([_, data]) => data.category === slug)
          .filter(([_, data]) => !data.isPremium)
          .map(([key, data]) => ({
            id: key,
            ...data
          }))
          .sort((a, b) => {
            if (a.isPremium && !b.isPremium) return -1;
            if (!a.isPremium && b.isPremium) return 1;
            return a.title.localeCompare(b.title);
          });

        setImages(categoryImages);
      } catch (error) {
        console.error('Error loading images:', error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, [slug]);

  const openPreview = (image) => {
    setPreviewImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closePreview = () => {
    setPreviewImage(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closePreview();
      }
    };

    if (previewImage) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [previewImage]);

  return (
    <>
      <div style={{maxWidth: '1400px', margin: '0 auto'}}>
        {loading ? (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '2rem 0'}}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                background: '#f3f4f6',
                borderRadius: '1rem',
                aspectRatio: '16/9'
              }} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
            <p style={{fontSize: '1.2rem', color: '#6b7280', marginBottom: '2rem'}}>
              No images found in this category yet.
            </p>
            <Link href="/" style={{
              color: '#2563eb',
              textDecoration: 'none',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              background: '#eff6ff',
              borderRadius: '0.5rem'
            }}>
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <div className="image-grid">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="image-card"
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                {image.isPremium && (
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    ✨ PREMIUM
                  </div>
                )}

                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/9',
                  background: '#f3f4f6'
                }}>
                  <Image
                    src={`/images/${image.filename}`}
                    alt={image.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    loading={index < 4 ? 'eager' : 'lazy'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#111827',
                    lineHeight: '1.4'
                  }}>
                    {image.title}
                  </h3>

                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    marginBottom: '1.5rem',
                    lineHeight: '1.5'
                  }}>
                    {image.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <button
                      onClick={() => openPreview(image)}
                      style={{
                        flex: '1',
                        minWidth: '120px',
                        background: '#6366f1',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      👁️ Preview
                    </button>

                    <a
                      href={`/images/${image.filename}`}
                      download={image.filename}
                      style={{
                        flex: '1',
                        minWidth: '120px',
                        background: image.isPremium ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : '#10b981',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        textAlign: 'center'
                      }}
                    >
                      {image.isPremium ? '💎 Buy' : '📥 Free'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewImage && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
          onClick={closePreview}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePreview}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.5rem',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              ×
            </button>

            {previewImage.isPremium && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                zIndex: 10,
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
              }}>
                ✨ PREMIUM
              </div>
            )}

            <div style={{
              width: '80vw',
              height: '80vh',
              maxWidth: '1200px',
              maxHeight: '800px',
              position: 'relative'
            }}>
              <Image
                src={`/images/${previewImage.filename}`}
                alt={previewImage.title}
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>

            <div style={{
              padding: '2rem',
              background: 'white',
              borderTop: '1px solid #e5e7eb'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: '#111827'
              }}>
                {previewImage.title}
              </h2>
              
              <p style={{
                color: '#6b7280',
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                {previewImage.description}
              </p>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center'
              }}>
                <a
                  href={`/images/${previewImage.filename}`}
                  download={previewImage.filename}
                  style={{
                    background: previewImage.isPremium ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : '#10b981',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {previewImage.isPremium ? '💎 Purchase & Download' : '📥 Download Free'}
                </a>

                <button
                  onClick={closePreview}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Make the content component client-side only
const DynamicCategoryContent = dynamic(() => Promise.resolve(CategoryContent), {
  ssr: false
});

export default function CategoryPage({ slug }) {
  const router = useRouter();

  // Use slug from props if available, otherwise from router
  const currentSlug = slug || router.query.slug;
  const category = categoryInfo[currentSlug];

  if (!category) {
    return (
      <>
        <Head>
          <title>Category Not Found - StreamBackdrops</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div style={{minHeight: '100vh', background: '#f9fafb', display: 'flex', flexDirection: 'column'}}>
          <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{textAlign: 'center'}}>
              <h1 style={{fontSize: '2rem', marginBottom: '1rem', color: '#374151'}}>Category Not Found</h1>
              <p style={{color: '#6b7280', marginBottom: '2rem'}}>
                The category "{currentSlug}" doesn't exist.
              </p>
              <Link href="/" style={{color: '#2563eb', textDecoration: 'none', fontWeight: '600'}}>
                ← Back to Home
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      </>
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
                    color: categorySlug === currentSlug ? 'white' : '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    background: categorySlug === currentSlug ? '#2563eb' : '#f3f4f6'
                  }}
                >
                  {info.name}
                </Link>
              ))}
              
              <Link 
                href="/premium"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
                }}
              >
                ✨ Premium 4K
              </Link>
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
          <DynamicCategoryContent slug={currentSlug} />
        </main>

        <Footer />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const paths = Object.keys(categoryInfo).map(slug => ({
    params: { slug }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      slug: params.slug
    }
  };
}