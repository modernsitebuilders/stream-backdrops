import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';
import Image from 'next/image';

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageMetadata, setImageMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  useEffect(() => {
    async function loadMetadata() {
      try {
        const response = await fetch('/api/metadata');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Successfully loaded metadata:', Object.keys(data).length, 'images');
        setImageMetadata(data);
      } catch (error) {
        console.error('Failed to load metadata:', error);
        setImageMetadata({});
      } finally {
        setLoading(false);
      }
    }
    
    if (typeof window !== 'undefined') {
      loadMetadata();
    }
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
    },
    'premium-4k': {
      name: 'Premium 4K',
      description: 'Ultra high-quality 4K virtual backgrounds with premium materials and luxury details',
      isPremium: true
    }
  };

  // Custom sorting function for different categories
  const sortImages = (images, categorySlug) => {
    const sorted = [...images];
    
    if (categorySlug === 'home-offices') {
      return sorted.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        
        if (aTitle.includes('scandinavian') && !bTitle.includes('scandinavian')) return -1;
        if (!aTitle.includes('scandinavian') && bTitle.includes('scandinavian')) return 1;
        
        if (aTitle.includes('farmhouse') && !bTitle.includes('farmhouse')) return 1;
        if (!aTitle.includes('farmhouse') && bTitle.includes('farmhouse')) return -1;
        
        return aTitle.localeCompare(bTitle);
      });
    } else if (categorySlug === 'executive-offices') {
      return sorted.sort((a, b) => {
        if (!a.isPremium && b.isPremium) return -1;
        if (a.isPremium && !b.isPremium) return 1;
        return a.title.localeCompare(b.title);
      });
    } else {
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
  };

  const categoryImages = useMemo(() => {
    if (!slug || !imageMetadata || Object.keys(imageMetadata).length === 0 || loading) return [];
    
    const categoryMap = {
      'home-offices': 'home-offices',
      'executive-offices': 'executive-offices', 
      'minimalist': 'minimalist',
      'lobbies': 'lobbies',
      'private-offices': 'private-offices',
      'premium-4k': 'premium-4k'
    };
    
    const targetCategory = categoryMap[slug] || slug;
    
    let filteredImages = Object.entries(imageMetadata)
      .filter(([_, data]) => {
        if (!data) return false;
        if (data.category !== targetCategory) return false;
        
        if (slug === 'minimalist') {
          const title = data.title?.toLowerCase() || '';
          const isMinimalist = title.includes('minimalist') || 
                             title.includes('clean') || 
                             title.includes('simple') ||
                             title.includes('modern');
          if (!isMinimalist) return false;
        }
        
        if (slug !== 'premium-4k' && data.isPremium) return false;
        if (slug === 'premium-4k' && !data.isPremium) return false;
        
        return true;
      })
      .map(([key, data]) => ({ key, ...data }));
    
    return sortImages(filteredImages, slug);
  }, [slug, imageMetadata, loading]);

  const handlePremiumPurchase = (image) => {
    const downloadUrl = `/api/premium-download?imageId=${image.key}&purchaseToken=temp123`;
    if (typeof window !== 'undefined') {
      window.open(downloadUrl, '_blank');
    }
  };

  const handleDownload = async (image) => {
    if (typeof window === 'undefined') return;
    
    if (image.isPremium) {
      handlePremiumPurchase(image);
      return;
    }

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
  
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '0 1rem' : '0 2rem'
  };

  return (
    <>
      <Head>
        <title>{category.name} Virtual Backgrounds - StreamBackdrops</title>
        <meta name="description" content={`Download ${category.description.toLowerCase()}. High-quality ${category.name.toLowerCase()} backgrounds for Zoom, Teams, and professional video calls.`} />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        <header style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0'}}>
          <div style={containerStyle}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem'}}>
              <Link href="/" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', textDecoration: 'none'}}>
                Stream<span style={{color: '#2563eb'}}>Backdrops</span>
              </Link>
            </div>
            
            <nav style={{
              display: 'flex',
              overflowX: 'auto',
              padding: '0.5rem 0',
              gap: '0.5rem'
            }}>
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
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    whiteSpace: 'nowrap',
                    ...(key === slug && {
                      background: 'rgba(37, 99, 235, 0.1)'
                    })
                  }}
                >
                  {info.name}
                  {info.isPremium && (
                    <span style={{
                      background: '#fbbf24',
                      color: '#92400e',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '0.75rem',
                      marginLeft: '0.5rem'
                    }}>
                      PREMIUM
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <section style={{
          background: category.isPremium ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : '#2563eb', 
          color: 'white', 
          padding: '4rem 0', 
          textAlign: 'center'
        }}>
          <div style={containerStyle}>
            <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white'}}>
              {category.name}
              {category.isPremium && (
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.5rem 1rem',
                  borderRadius: '1rem',
                  fontSize: '1rem',
                  marginLeft: '1rem',
                  display: 'inline-block'
                }}>
                  4K QUALITY
                </span>
              )}
            </h1>
            
            <p style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>
              {category.description}
            </p>
            {category.isPremium ? (
              <p style={{opacity: 0.9, fontSize: '1.1rem'}}>
                Ultra high-definition backgrounds • Professional quality • Starting at $5.99
              </p>
            ) : (
              <p style={{opacity: 0.9}}>
                {categoryImages.length} professional backgrounds available
              </p>
            )}
          </div>
        </section>

        <section style={{ padding: '3rem 0' }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: isMobile ? '0 1rem' : '20px'
          }}>
            {categoryImages.length === 0 ? (
              <div style={{textAlign: 'center', padding: '3rem 0'}}>
                <p style={{color: '#6b7280', fontSize: '1.1rem'}}>No backgrounds found in this category.</p>
                <Link href="/" style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  ← Browse All Categories
                </Link>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile 
                  ? '1fr' 
                  : 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem',
                width: '100%'
              }}>
                {categoryImages.map((image, index) => (
                  <div 
                    key={image.key} 
                    style={{
                      background: 'white',
                      borderRadius: '0.75rem',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      position: 'relative',
                      cursor: 'pointer',
                      marginTop: slug === 'executive-offices' && image.isPremium && index > 0 && !categoryImages[index-1].isPremium ? '3rem' : '0'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.18)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                    }}
                  >
                    {image.isPremium && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                        color: '#92400e',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        zIndex: 10
                      }}>
                        PREMIUM 4K
                      </div>
                    )}

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
                        onContextMenu={(e) => e.preventDefault()}
                        loading={index === 0 ? "eager" : "lazy"}
                        priority={index === 0}
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
                            background: image.isPremium ? '#fbbf24' : '#2563eb',
                            color: image.isPremium ? '#92400e' : 'white',
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {image.isPremium ? `Buy $${image.price || '5.99'}` : 'Download'}
                        </button>
                      </div>
                    </div>

                    <div style={{padding: '1.5rem'}}>
                      <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                        <h3 style={{fontWeight: '600', color: '#111827', fontSize: '1.1rem', flex: 1}}>
                          {image.title || 'Virtual Background'}
                        </h3>
                      </div>
                      <p style={{color: '#6b7280', fontSize: '0.95rem', marginBottom: '0.75rem'}}>
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
        
        {slug === 'executive-offices' && categoryImages.some(img => img.isPremium) && (
          <section style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            padding: '2rem 0',
            margin: '2rem 0',
            textAlign: 'center'
          }}>
            <div style={containerStyle}>
              <h2 style={{color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
                Premium 4K Executive Offices
              </h2>
              <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '1rem'}}>
                Ultra high-definition backgrounds for the most important meetings
              </p>
            </div>
          </section>
        )}

        {selectedImage && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 99999,
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
                overflow: 'auto',
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
                  cursor: 'pointer',
                  color: '#666'
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
                loading="eager"
              />
              
              <p style={{ color: '#666', marginBottom: '20px' }}>
                {selectedImage.description || 'Professional virtual background'}
              </p>
              
              <button
                onClick={() => handleDownload(selectedImage)}
                style={{
                  backgroundColor: selectedImage.isPremium ? '#fbbf24' : '#2563eb',
                  color: selectedImage.isPremium ? '#92400e' : 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {selectedImage.isPremium ? `Buy $${selectedImage.price || '5.99'}` : 'Download'}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}