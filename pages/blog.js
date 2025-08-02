// Create this new file: pages/blog.js

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

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">StreamBackdrops Blog</h1>
            <p className="text-xl text-gray-600">Expert tips, guides, and insights for professional video calls and remote work</p>
          </div>
        </header>

        {/* Blog Posts Grid */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">{post.date}</span>
                    <span className="text-gray-500 text-sm">•</span>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    <Link href={`/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <Link 
                    href={`/${post.slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Read more
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-blue-100 mb-6">Get the latest tips and guides for professional video calls delivered to your inbox.</p>
            <div className="max-w-md mx-auto flex gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {['Video Call Tips', 'Technical Setup', 'Remote Work', 'Industry Guide', 'Technical Guide'].map((category) => (
                <span key={category} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
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