import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageMetadata, setImageMetadata] = useState({});
  const [loading, setLoading] = useState(true);

  // Load metadata on client side
  useEffect(() => {
  async function loadMetadata() {
    try {
      // Use the API route we just created
      const response = await fetch('/api/metadata');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Successfully loaded metadata:', Object.keys(data).length, 'images');
      setImageMetadata(data);
    } catch (error) {
      console.error('Failed to load metadata:', error);
      // Set empty metadata to prevent infinite loading
      setImageMetadata({});
    } finally {
      setLoading(false);
    }
  }
  loadMetadata();
}, []);

  const categoryInfo = {
    'home-offices': {
      name: 'Home Offices',
      description: 'Professional home office backgrounds perfect for remote work and video calls'
    },
    'executive-offices': {
      name: 'Executive Offices', 
      description: 'Luxury executive office backgrounds for leadership meetings and professional calls'
    },
    'conference-rooms': {
      name: 'Conference Rooms',
      description: 'Professional meeting room backgrounds for team calls and presentations'
    },
    'open-offices': {
      name: 'Open Offices',
      description: 'Modern open workspace backgrounds for collaborative video calls'
    },
    'lounges': {
      name: 'Lounges',
      description: 'Comfortable lounge backgrounds for casual meetings and calls'
    }
  };

  const categoryImages = useMemo(() => {
    if (!slug || !imageMetadata || loading) return [];
    
    return Object.entries(imageMetadata)
      .filter(([_, data]) => data && data.category === slug)
      .map(([key, data]) => ({ key, ...data }));
  }, [slug, imageMetadata, loading]);

  const filteredImages = useMemo(() => {
    return categoryImages.filter(image => {
      const matchesSearch = searchTerm === '' || 
        image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (image.keywords && image.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())));
      
      return matchesSearch;
    });
  }, [categoryImages, searchTerm]);

  const handleDownload = async (image) => {
    try {
      const response = await fetch(`/images/${image.filename}`);
      const blob = await response.blob();
      
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const loadImage = new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((pngBlob) => {
            if (pngBlob) {
              const url = URL.createObjectURL(pngBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = image.filename.replace('.webp', '.png');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              resolve();
            } else {
              reject(new Error('Failed to convert to PNG'));
            }
          }, 'image/png', 1.0);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
      });
      
      img.src = URL.createObjectURL(blob);
      await loadImage;
      
    } catch (error) {
      console.error('PNG conversion failed:', error);
      const link = document.createElement('a');
      link.href = `/images/${image.filename}`;
      link.download = image.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Show loading while router and data load
  if (!router.isReady || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Show 404 if invalid slug
  if (!categoryInfo[slug]) {
    return (
      <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
        <h1>Category Not Found</h1>
        <p>The category you're looking for doesn't exist.</p>
        <Link href="/" style={{color: '#2563eb', textDecoration: 'none'}}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  const category = categoryInfo[slug];

  return (
    <>
      <Head>
        <title>{category.name} Virtual Backgrounds - StreamBackdrops</title>
        <meta name="description" content={`Download ${category.description.toLowerCase()}. High-quality ${category.name.toLowerCase()} backgrounds for Zoom, Teams, and professional video calls.`} />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        <header style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0'}}>
          <div className="container">
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <Link href="/" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', textDecoration: 'none'}}>
                Stream<span style={{color: '#2563eb'}}>Backdrops</span>
              </Link>
              <nav style={{display: 'flex', gap: '2rem'}}>
                {Object.entries(categoryInfo).map(([key, info]) => (
                  <Link
                    key={key}
                    href={`/category/${key}`}
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: key === slug ? '#2563eb' : '#6b7280',
                      textDecoration: 'none'
                    }}
                  >
                    {info.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>

        <section style={{background: '#2563eb', color: 'white', padding: '4rem 0', textAlign: 'center'}}>
          <div className="container">
            <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white'}}>
              {category.name}
            </h1>
            <p style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>
              {category.description}
            </p>
            <p style={{opacity: 0.9}}>
              {filteredImages.length} professional backgrounds available
            </p>
          </div>
        </section>

        <section style={{padding: '2rem 0', background: 'white', borderBottom: '1px solid #e5e7eb'}}>
          <div className="container">
            <div style={{maxWidth: '400px'}}>
              <input
                type="text"
                placeholder="Search backgrounds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
        </section>

        <section style={{padding: '3rem 0'}}>
          <div className="container">
            {filteredImages.length === 0 ? (
              <div style={{textAlign: 'center', padding: '3rem 0'}}>
                <p style={{color: '#6b7280', fontSize: '1.1rem'}}>No backgrounds found matching your criteria.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredImages.map((image) => (
                  <div key={image.key} style={{
                    background: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}>
                    <div style={{position: 'relative', aspectRatio: '16/9', overflow: 'hidden'}}>
                      <img
                        src={`/images/${image.filename}`}
                        alt={image.alt || 'Virtual background'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedImage(image)}
                      />
                      
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(image);
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.9)',
                            color: '#111827',
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Preview
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image);
                          }}
                          style={{
                            background: '#2563eb',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Download PNG
                        </button>
                      </div>
                    </div>

                    <div style={{padding: '1rem'}}>
                      <h3 style={{fontWeight: '600', color: '#111827', marginBottom: '0.5rem', fontSize: '1rem'}}>
                        {image.title || 'Virtual Background'}
                      </h3>
                      <p style={{color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.75rem'}}>
                        {image.description || 'Professional virtual background'}
                      </p>
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.25rem'}}>
                        {(image.keywords || []).slice(0, 3).map(keyword => (
                          <span key={keyword} style={{
                            background: '#f3f4f6',
                            color: '#374151',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem'
                          }}>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {selectedImage && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '2rem'
          }}
          onClick={() => setSelectedImage(null)}
          >
            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h3 style={{fontSize: '1.1rem', fontWeight: '600', color: '#111827', margin: 0}}>
                  {selectedImage.title || 'Virtual Background'}
                </h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: '#6b7280',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  ✕
                </button>
              </div>
              
              <div style={{padding: '1rem'}}>
                <div style={{marginBottom: '1rem'}}>
                  <img
                    src={`/images/${selectedImage.filename}`}
                    alt={selectedImage.alt || 'Virtual background'}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '60vh',
                      objectFit: 'contain',
                      borderRadius: '0.5rem'
                    }}
                  />
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{flex: 1}}>
                    <p style={{color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
                      {selectedImage.description || 'Professional virtual background'}
                    </p>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.25rem'}}>
                      {(selectedImage.keywords || []).map(keyword => (
                        <span key={keyword} style={{
                          background: '#f3f4f6',
                          color: '#374151',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem'
                        }}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(selectedImage)}
                    style={{
                      background: '#2563eb',
                      color: 'white',
                      padding: '0.75rem 2rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Download PNG
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}