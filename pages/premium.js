{/* Premium Images Grid */}
        <section style={{padding: '3rem 0'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#111827',
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              Premium 4K Preview
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2.5rem',
              marginBottom: '3rem'
            }}>
              {premiumImages.map((image, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                  position: 'relative',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                }}
                >
                  {/* 4K Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}>
                    4K ULTRA HD
                  </div>
                  
                  <div style={{
                    position: 'relative',
                    height: '250px',
                    overflow: 'hidden',
                    background: '#f3f4f6'
                  }}>
                    <Image
                      src={`/images/${image.filename}`}
                      alt={image.title}
                      width={800}
                      height={450}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      loading={index === 0 ? "eager" : "lazy"}
                      priority={index === 0}
                      quality={85}
                    />
                  </div>
                  
                  <div style={{padding: '1.5rem'}}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      {image.title}
                    </h3>
                    <p style={{
                      color: '#6b7280',
                      marginBottom: '1rem'
                    }}>
                      {image.description}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center'
                    }}>
                      <button style={{
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'not-allowed',
                        opacity: 0.7,
                        flex: 1
                      }} disabled>
                        Coming Soon
                      </button>
                      <span style={{
                        color: '#f59e0b',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                      }}>
                        $2.99
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>