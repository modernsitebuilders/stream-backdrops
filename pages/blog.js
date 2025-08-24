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
        <meta name="description" content="Expert guides, tips, and insights about virtual backgrounds, remote work, video calls, and professional online presence." />
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
                  transition: 'box-shadow 0.3s ease',
                  padding: '2rem'
                }}
              >
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
                  {post.title}
                </h2>
                
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem'
                }}>
                  {post.excerpt}
                </p>
                
                <div style={{color: '#2563eb', fontWeight: '500', fontSize: '0.9rem'}}>
                  Coming Soon →
                </div>
              </article>
            ))}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}