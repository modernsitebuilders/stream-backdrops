// REPLACE your entire pages/blog.js with this clean version:

import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function Blog() {
  const blogPosts = [
    {
      title: "10 Essential Tips for Professional Video Calls",
      slug: "blog-professional-video-calls",
      excerpt: "Master professional video calls with these 10 essential tips covering lighting, backgrounds, camera positioning, and video call etiquette for remote work success.",
      date: "August 2, 2025",
      readTime: "8 min read",
      category: "Video Call Tips"
    },
    {
      title: "Best Virtual Backgrounds by Industry",
      slug: "blog-backgrounds-by-industry", 
      excerpt: "Choose the perfect virtual background for your industry. Complete guide covering healthcare, finance, education, tech, legal, and consulting professionals.",
      date: "August 6, 2025",
      readTime: "12 min read",
      category: "Industry Guide"
    },
    {
      title: "15 Virtual Background Mistakes That Ruin Your Professional Image",
      slug: "blog-background-mistakes",
      excerpt: "Avoid these common virtual background mistakes that make you look unprofessional. Expert tips to fix technical issues and choose the right backgrounds.",
      date: "August 6, 2025",
      readTime: "10 min read",
      category: "Common Mistakes"
    },
    {
      title: "Perfect Lighting Setup for Virtual Backgrounds",
      slug: "blog-lighting-tips",
      excerpt: "Master video call lighting with our complete guide. Learn how to set up professional lighting for virtual backgrounds, avoid common mistakes, and look great on camera.",
      date: "August 2, 2025", 
      readTime: "10 min read",
      category: "Technical Setup"
    },
    {
      title: "The Complete Technical Guide to Virtual Backgrounds",
      slug: "blog-virtual-background-guide",
      excerpt: "Master virtual background technology with our complete technical guide covering setup, troubleshooting, optimization, and platform-specific instructions for Zoom, Teams, and more.",
      date: "August 2, 2025",
      readTime: "15 min read", 
      category: "Technical Guide"
    },
    {
      title: "Zoom vs Teams vs Google Meet: Virtual Background Setup & Best Practices",
      slug: "blog-zoom-teams-google",
      excerpt: "Complete comparison of virtual backgrounds on Zoom, Microsoft Teams, and Google Meet. Setup guides, troubleshooting tips, and platform-specific best practices.",
      date: "August 6, 2025",
      readTime: "12 min read",
      category: "Platform Comparison"
    },
    {
      title: "Remote Work Productivity: Creating Your Perfect Home Office Environment",
      slug: "blog-remote-work-productivity",
      excerpt: "Boost your remote work productivity with expert tips for creating the perfect home office environment, managing distractions, and maintaining work-life balance.",
      date: "August 2, 2025",
      readTime: "12 min read",
      category: "Remote Work"
    }
  ];

  return (
    <>
      <Head>
        <title>Blog - StreamBackdrops | Professional Virtual Background Tips & Guides</title>
        <meta name="description" content="Expert guides, tips, and insights about virtual backgrounds, remote work, video calls, and professional online presence. Learn from the StreamBackdrops blog." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Clean Blog Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {/* StreamBackdrops Brand */}
            <Link href="/" style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#2563eb',
              textDecoration: 'none'
            }}>
              🎥 StreamBackdrops
            </Link>
            
            {/* Navigation Links */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <Link href="/" style={{
                color: '#374151',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                background: '#f3f4f6',
                transition: 'all 0.2s'
              }}>
                🏠 Home
              </Link>
              
              <Link href="/blog" style={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                background: '#2563eb'
              }}>
                📚 All Guides
              </Link>
              
              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '1.5rem',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                ✨ 100% FREE
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Blog Content - NO EXTRA SPACING */}
      <div style={{ 
        background: '#f8fafc', 
        minHeight: '100vh'
      }}>
        <div style={{ 
          maxWidth: '1000px', 
          margin: '0 auto', 
          padding: '2rem'
        }}>
          {/* Blog Title */}
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Setup Guides & Tips
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280'
            }}>
              Expert guides for professional video calls and virtual backgrounds
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div style={{display: 'grid', gap: '2rem'}}>
            {blogPosts.map((post) => (
              <article 
                key={post.slug} 
                style={{
                  background: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}
              >
                <div style={{padding: '2rem'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                    <span style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px'
                    }}>
                      {post.category}
                    </span>
                    <span style={{color: '#6b7280', fontSize: '0.875rem'}}>{post.date}</span>
                    <span style={{color: '#6b7280', fontSize: '0.875rem'}}>•</span>
                    <span style={{color: '#6b7280', fontSize: '0.875rem'}}>{post.readTime}</span>
                  </div>
                  
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '0.75rem',
                    lineHeight: '1.3'
                  }}>
                    <Link 
                      href={`/${post.slug}`}
                      style={{
                        color: '#111827',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#111827'}
                    >
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p style={{
                    color: '#6b7280',
                    marginBottom: '1rem',
                    lineHeight: '1.6',
                    fontSize: '1rem'
                  }}>
                    {post.excerpt}
                  </p>
                  
                  <Link 
                    href={`/${post.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: '#2563eb',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#2563eb'}
                  >
                    Read more
                    <svg style={{marginLeft: '0.5rem', width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div style={{
            marginTop: '4rem',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            borderRadius: '0.5rem',
            padding: '2rem',
            color: 'white',
            textAlign: 'center'
          }}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>
              Stay Updated
            </h2>
            <p style={{color: '#dbeafe', marginBottom: '1.5rem'}}>
              Get the latest tips and guides for professional video calls delivered to your inbox.
            </p>
            <div style={{maxWidth: '400px', margin: '0 auto', display: 'flex', gap: '1rem'}}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                style={{
                  flex: 1,
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  color: '#111827',
                  outline: 'none'
                }}
              />
              <button style={{
                background: 'white',
                color: '#2563eb',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}>
                Subscribe
              </button>
            </div>
          </div>

          {/* Categories */}
          <div style={{marginTop: '3rem', textAlign: 'center'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem'}}>
              Browse by Category
            </h2>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem'}}>
              {['Video Call Tips', 'Technical Setup', 'Remote Work', 'Industry Guide', 'Technical Guide'].map((category) => (
                <span 
                  key={category} 
                  style={{
                    background: '#e5e7eb',
                    color: '#374151',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}