// Replace your pages/blog.js with this corrected version:

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
      title: "Virtual Backgrounds by Industry: A Professional's Guide",
      slug: "blog-backgrounds-by-industry", 
      excerpt: "Choose the perfect virtual background for your industry. Complete guide covering healthcare, finance, education, tech, legal, consulting, and more professional fields.",
      date: "August 2, 2025",
      readTime: "12 min read",
      category: "Industry Guide"
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

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        {/* Header */}
        <header style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '2rem 0'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
            <Link href="/" style={{color: '#2563eb', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block'}}>
              ← Back to Home
            </Link>
            <h1 style={{fontSize: '3rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>
              StreamBackdrops Blog
            </h1>
            <p style={{fontSize: '1.25rem', color: '#6b7280'}}>
              Expert tips, guides, and insights for professional video calls and remote work
            </p>
          </div>
        </header>

        {/* Blog Posts Grid */}
        <main style={{maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem'}}>
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
        </main>
      </div>
      
      <Footer />
    </>
  );
}