// Complete pages/category/[slug].js file - Replace your entire file with this
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { event } from '../../lib/gtag';
import Layout from '../../components/Layout';

// Simple SocialShare component
function SocialShare({ image, title, size = "large", showLabels = false, vertical = true }) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: '𝕏',
      hoverColor: '#1DA1F2'
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: '📘',
      hoverColor: '#4267B2'
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: '💼',
      hoverColor: '#0077B5'
    },
    {
      name: 'Pinterest',
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      icon: '📌',
      hoverColor: '#BD081C'
    },
    {
      name: 'Copy Link',
      url: '#',
      icon: '🔗',
      hoverColor: '#10B981',
      action: 'copy'
    }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: vertical ? 'column' : 'row',
      gap: '0.5rem'
    }}>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={link.action === 'copy' ? (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
          } : undefined}
          style={{
            padding: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            color: 'white',
            textDecoration: 'none',
            fontSize: size === 'large' ? '1.5rem' : '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '3rem',
            minHeight: '3rem',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = link.hoverColor;
            e.target.style.transform = 'scale(1.1)';
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.textContent = `Share on ${link.name}`;
            tooltip.style.cssText = `
              position: absolute;
              bottom: 120%;
              left: 50%;
              transform: translateX(-50%);
              background: #333;
              color: white;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 14px;
              white-space: nowrap;
              z-index: 1000;
              pointer-events: none;
            `;
            e.target.appendChild(tooltip);
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'scale(1)';
            
            // Remove tooltip
            const tooltip = e.target.querySelector('div');
            if (tooltip) tooltip.remove();
          }}
        >
          {link.icon}
          {showLabels && <span style={{ marginLeft: '0.5rem' }}>{link.name}</span>}
        </a>
      ))}
    </div>
  );
}
// Categories with all your actual images
const categoryInfo = {
  'well-lit': {
    name: 'Well Lit',
    description: 'Bright, well-lit backgrounds perfect for professional video calls',
    seoDescription: 'Download free well-lit virtual backgrounds for video calls. Bright, professional backgrounds.',
    images: [
      { filename: 'well-lit-cozy-home-office-1.webp', title: 'Cozy Home Office' },
      { filename: 'well-lit-glass-shelves-1.webp', title: 'Glass Shelves' },
      { filename: 'well-lit-glass-shelves-2.webp', title: 'Glass Shelves' },
      { filename: 'well-lit-metal-shelves-1.webp', title: 'Metal Shelves' },
      { filename: 'well-lit-metal-shelves-2.webp', title: 'Metal Shelves' },
      { filename: 'well-lit-minimalist-office-1.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-10.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-11.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-12.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-13.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-14.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-15.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-16.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-17.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-18.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-19.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-2.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-20.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-21.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-22.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-23.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-24.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-25.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-26.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-27.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-28.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-3.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-4.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-5.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-6.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-7.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-8.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-minimalist-office-9.webp', title: 'Minimalist Office' },
      { filename: 'well-lit-stone-shelves-1.webp', title: 'Stone Shelves' },
      { filename: 'well-lit-stone-shelves-2.webp', title: 'Stone Shelves' },
      { filename: 'well-lit-stone-shelves-3.webp', title: 'Stone Shelves' },
      { filename: 'well-lit-wood-shelves-1.webp', title: 'Wood Shelves' },
      { filename: 'well-lit-wood-shelves-10.webp', title: 'Wood Shelves' },
      { filename: 'well-lit-wood-shelves-11.webp', title: 'Wood Shelves' },
      { filename: 'well-lit-wood-shelves-12.webp', title: 'Wood Shelves' },
      { filename: 'well-lit-wood-shelves-2.webp', title: 'Wood Shelves' },
      { filename: 'well-lit-wood-shelves-3.webp', title: 'Wood Shelves' },
      { filename: 'well-lit-wood-shelves-4.webp', title: 'Wood Shelves' },
      { filename: 'well-lit-wood-shelves-5.webp', title: 'Wood Shelves' },
      { filename: 'well-lit-wood-shelves-6.webp', title: 'Wood Shelves' },
      { filename: 'well-lit-wood-shelves-7.webp', title: 'Wood Shelves' },
      { filename: 'well-lit-wood-shelves-8.webp', title: 'Wood Shelves' },
      { filename: 'well-lit-wood-shelves-9.webp', title: 'Wood Shelves' }
    ]
  },
  
  'ambient-lighting': {
    name: 'Ambient Lighting',
    description: 'Atmospheric backgrounds with ambient lighting for sophisticated video calls',
    seoDescription: 'Download free ambient virtual backgrounds for video calls. Atmospheric, sophisticated backgrounds.',
    images: [
      { filename: 'ambient-basement-office-1.webp', title: 'Basement Office' },
      { filename: 'ambient-concrete-shelves-1.webp', title: 'Concrete Shelves' },
      { filename: 'ambient-concrete-shelves-2.webp', title: 'Concrete Shelves' },
      { filename: 'ambient-concrete-shelves-3.webp', title: 'Concrete Shelves' },
      { filename: 'ambient-concrete-shelves-4.webp', title: 'Concrete Shelves' },
      { filename: 'ambient-cozy-student-workspace-1.webp', title: 'Cozy Student Workspace' },
      { filename: 'ambient-garden-shed-office-1.webp', title: 'Garden Shed Office' },
      { filename: 'ambient-glass-shelves-1.webp', title: 'Glass Shelves' },
      { filename: 'ambient-glass-shelves-2.webp', title: 'Glass Shelves' },
      { filename: 'ambient-glass-shelves-3.webp', title: 'Glass Shelves' },
      { filename: 'ambient-glass-shelves-4.webp', title: 'Glass Shelves' },
      { filename: 'ambient-industrial-shelves-1.webp', title: 'Industrial Shelves' },
      { filename: 'ambient-industrial-shelves-2.webp', title: 'Industrial Shelves' },
      { filename: 'ambient-industrial-shelves-3.webp', title: 'Industrial Shelves' },
      { filename: 'ambient-industrial-shelves-4.webp', title: 'Industrial Shelves' },
      { filename: 'ambient-kitchen-workspace-1.webp', title: 'Kitchen Workspace' },
      { filename: 'ambient-metal-shelves-1.webp', title: 'Metal Shelves' },
      { filename: 'ambient-minimalist-office-1.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-10.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-11.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-12.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-13.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-14.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-15.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-16.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-17.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-18.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-19.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-2.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-20.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-3.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-4.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-5.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-6.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-7.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-8.webp', title: 'Minimalist Office' },
      { filename: 'ambient-minimalist-office-9.webp', title: 'Minimalist Office' },
      { filename: 'ambient-spare-room-office-1.webp', title: 'Spare Room Office' },
      { filename: 'ambient-stone-shelves-1.webp', title: 'Stone Shelves' },
      { filename: 'ambient-stone-shelves-2.webp', title: 'Stone Shelves' },
      { filename: 'ambient-stone-shelves-3.webp', title: 'Stone Shelves' },
      { filename: 'ambient-student-bedroom-office-1.webp', title: 'Student Bedroom Office' },
      { filename: 'ambient-wood-shelves-1.webp', title: 'Wood Shelves' },
      { filename: 'ambient-wood-shelves-2.webp', title: 'Wood Shelves' },
      { filename: 'ambient-wood-shelves-3.webp', title: 'Wood Shelves' },
      { filename: 'ambient-wood-shelves-4.webp', title: 'Wood Shelves' },
      { filename: 'ambient-wood-shelves-5.webp', title: 'Wood Shelves' },
      { filename: 'ambient-wood-shelves-6.webp', title: 'Wood Shelves' },
      { filename: 'ambient-wood-shelves-7.webp', title: 'Wood Shelves' }
    ]
  },
  
  'office-spaces': {
    name: 'Office Spaces',
    description: 'Professional office backgrounds for business video calls',
    seoDescription: 'Download free professional office virtual backgrounds for video calls. Executive office backgrounds.',
    images: [
      { filename: 'office-spaces-concrete-wall-1.webp', title: 'Concrete Wall Office' },
      { filename: 'office-spaces-consultation-office-1.webp', title: 'Consultation Office' },
      { filename: 'office-spaces-consultation-office-2.webp', title: 'Consultation Office' },
      { filename: 'office-spaces-corner-office-windows-1.webp', title: 'Corner Office with Windows' },
      { filename: 'office-spaces-dark-wood-accent-1.webp', title: 'Dark Wood Accent Office' },
      { filename: 'office-spaces-dark-wood-accent-2.webp', title: 'Dark Wood Accent Office' },
      { filename: 'office-spaces-light-wood-accent-1.webp', title: 'Light Wood Accent Office' },
      { filename: 'office-spaces-marble-accent-1.webp', title: 'Marble Accent Office' },
      { filename: 'office-spaces-marble-accent-2.webp', title: 'Marble Accent Office' },
      { filename: 'office-spaces-marble-accent-3.webp', title: 'Marble Accent Office' },
      { filename: 'office-spaces-minimalist-executive-1.webp', title: 'Minimalist Executive Office' },
      { filename: 'office-spaces-office-interior-1.webp', title: 'Professional Office Interior' },
      { filename: 'office-spaces-office-interior-2.webp', title: 'Professional Office Interior' },
      { filename: 'office-spaces-wood-accent-wall-1.webp', title: 'Wood Accent Wall Office' },
      { filename: 'office-spaces-wood-accent-wall-2.webp', title: 'Wood Accent Wall Office' }
    ]
  },
  
    'living-room': {
    name: 'Living Room (more coming soon!!)',
    description: 'Comfortable living room backgrounds for casual meetings and personal video calls',
    seoDescription: 'Download free living room virtual backgrounds for video calls. Comfortable home settings for casual meetings.',
    images: [
      { filename: 'living-room-1.webp', title: 'Living Room 1' },
      { filename: 'living-room-2.webp', title: 'Living Room 2' },
      { filename: 'living-room-3.webp', title: 'Living Room 3' },
      { filename: 'living-room-4.webp', title: 'Living Room 4' },
      { filename: 'living-room-5.webp', title: 'Living Room 5' },
      { filename: 'living-room-6.webp', title: 'Living Room 6' },
      { filename: 'living-room-7.webp', title: 'Living Room 7' },
      { filename: 'living-room-8.webp', title: 'Living Room 8' },
      { filename: 'living-room-9.webp', title: 'Living Room 9' },
      { filename: 'living-room-10.webp', title: 'Living Room 10' },
      { filename: 'living-room-11.webp', title: 'Living Room 11' },
      { filename: 'living-room-12.webp', title: 'Living Room 12' },
      { filename: 'living-room-13.webp', title: 'Living Room 13' },
      { filename: 'living-room-14.webp', title: 'Living Room 14' },
      { filename: 'living-room-15.webp', title: 'Living Room 15' },
      { filename: 'living-room-16.webp', title: 'Living Room 16' },
      { filename: 'living-room-17.webp', title: 'Living Room 17' }
    ]
  }
};

function CategoryContent({ slug }) {
  const [previewImage, setPreviewImage] = useState(null);
  const folderMap = {
    'well-lit': 'well-lit',
    'ambient-lighting': 'ambient-lighting', 
    'office-spaces': 'office-spaces',
    'living-room': 'living-room'
  };
  const category = categoryInfo[slug];

  const handleDownload = async (image) => {
    try {
      // Track the download event in Google Analytics
      event('download', {
  item_name: image.filename,           // GA4 recognizes this automatically
  item_category: 'Virtual Background',  // GA4 recognizes this automatically  
  content_name: image.filename,        // Alternative that GA4 recognizes
  value: 1
});
        if (typeof window !== 'undefined' && window.pintrk) {
      window.pintrk('track', 'custom', {
        event_id: 'download',
        value: 1,
        currency: 'USD',
        content_name: image.filename,
        content_category: 'Virtual Background'
      });
    }
      const response = await fetch(`/images/${folderMap[slug]}/${image.filename}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const blob = await response.blob();
      
      const img = new window.Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((pngBlob) => {
          const url = window.URL.createObjectURL(pngBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `StreamBackdrops-${image.title.replace(/\s+/g, '-')}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
      };
      
      const imageUrl = window.URL.createObjectURL(blob);
      img.src = imageUrl;
      
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <>
      <Head>
        {/* ✅ NEW: Conditional title that works for both found/not found */}
        <title>
          {category 
            ? `${category.name} Virtual Backgrounds - Free HD Downloads | StreamBackdrops`
            : 'Category Not Found - StreamBackdrops'
          }
        </title>
        
        {/* ✅ NEW: Conditional description */}
        <meta name="description" content={
          category 
            ? `Download free ${category.name.toLowerCase()} virtual backgrounds in HD quality. Perfect for Zoom, Teams & Google Meet video calls. ${category.description}`
            : 'The requested category was not found. Browse our collection of free HD virtual backgrounds.'
        } />
        
        {/* ✅ KEEPING: Basic viewport (you already had this) */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* ✅ NEW: Only add SEO meta tags if category exists */}
        {category ? (
          <>
            {/* ✅ NEW: Enhanced SEO keywords */}
            <meta name="keywords" content={`${category.name.toLowerCase()}, virtual backgrounds, video calls, ${slug}, professional backgrounds, HD download, Zoom backgrounds, Teams backgrounds`} />
            
            {/* ✅ NEW: Better robots directive */}
            <meta name="robots" content="index, follow, max-image-preview:large" />
            
            {/* ✅ NEW: Author meta tag */}
            <meta name="author" content="StreamBackdrops" />
            
            {/* ✅ NEW: Canonical URL for SEO */}
            <link rel="canonical" href={`https://streambackdrops.com/category/${slug}`} />
            
            {/* ✅ NEW: Enhanced Open Graph tags */}
            <meta property="og:title" content={`${category.name} Virtual Backgrounds - StreamBackdrops`} />
            <meta property="og:description" content={`Download free ${category.name.toLowerCase()} virtual backgrounds in HD quality. Perfect for professional video calls.`} />
            <meta property="og:url" content={`https://streambackdrops.com/category/${slug}`} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="StreamBackdrops" />
            
            {/* ✅ NEW: Twitter Card tags */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={`${category.name} Virtual Backgrounds`} />
            <meta property="twitter:description" content={`Free HD ${category.name.toLowerCase()} backgrounds for video calls`} />
            
            {/* ✅ NEW: Structured Data for better Google results */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "ImageGallery",
                  "name": `${category.name} Virtual Backgrounds`,
                  "description": category.description,
                  "url": `https://streambackdrops.com/category/${slug}`,
                  "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                      {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://streambackdrops.com"
                      },
                      {
                        "@type": "ListItem", 
                        "position": 2,
                        "name": category.name,
                        "item": `https://streambackdrops.com/category/${slug}`
                      }
                    ]
                  }
                })
              }}
            />
          </>
        ) : (
          /* ✅ NEW: For not-found pages, tell search engines not to index */
          <meta name="robots" content="noindex" />
        )}
      </Head>

      {/* ✅ NEW: Single conditional content section (replaces early return) */}
      {!category ? (
        /* ✅ NEW: Not found content (replaces the early return block) */
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Category Not Found</h1>
          <Link href="/">Back to Home</Link>
        </div>
      ) : (
        /* ✅ KEEPING: All your existing content stays exactly the same */
        <>
      {/* Page Content */}
      <div style={{
        padding: '2rem',
        background: '#f9fafb',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          
          {/* Page Title */}
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            {category.name}
          </h1>
          
          <p style={{
            color: '#6b7280',
            fontSize: '1.1rem',
            marginBottom: '2rem'
          }}>
            {category.description}
          </p>
          
          {/* Clean Instructions */}
          <p style={{
            color: '#6b7280',
            marginBottom: '2rem'
          }}>
            Click on any image to preview
          </p>

          {/* Clean Image Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {category.images.map((image, index) => (
              <div
                key={image.filename}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onClick={() => setPreviewImage(image)}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/9',
                  overflow: 'hidden'
                }}>
                  <Image
                    src={`/images/${folderMap[slug]}/${image.filename}`}
                    alt={image.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    loading={index < 8 ? 'eager' : 'lazy'}
                    quality={75}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px"
                  />
                  
                  {/* Hover Overlay - Clean Download Button + Social Icons */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                  className="image-overlay">
                    
                    {/* Clean Download Button */}
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
                      Download
                    </button>

                    {/* Social Share on Hover */}
                    <SocialShare 
                      image={{...image, category: slug}}
                      title={`${image.title} - Free Virtual Background`}
                      size="small"
                      showLabels={false}
                      vertical={false}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Preview Modal */}
      {previewImage && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '4rem'
        }}
        onClick={() => setPreviewImage(null)}>
          
          {/* Close Button */}
          <button
            style={{
              position: 'fixed',
              top: '2rem',
              right: '2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              cursor: 'pointer',
              fontSize: '1.5rem',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setPreviewImage(null);
            }}
          >
            ×
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3rem',
            maxWidth: '95vw',
            maxHeight: '90vh'
          }}
          onClick={(e) => e.stopPropagation()}>
            
            {/* Vertical Social Share */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <SocialShare 
                image={{...previewImage, category: slug}}
                title={`${previewImage.title} - Free Virtual Background`}
                size="large"
                showLabels={false}
                vertical={true}
              />
            </div>
            
            {/* Image Container */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem'
            }}>
              {/* Pure Image */}
              <div style={{
                position: 'relative',
                maxWidth: '70vw',
                maxHeight: '70vh'
              }}>
                <Image
                  src={`/images/${folderMap[slug]}/${previewImage.filename}`}
                  alt={previewImage.title}
                  width={800}
                  height={450}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                  }}
                  quality={90}
                />
              </div>
              
              {/* Download Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(previewImage);
                }}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#2563eb';
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for hover effects */}
      <style jsx>{`
        .image-overlay:hover {
          opacity: 1 !important;
        }
        
        div:hover .image-overlay {
          opacity: 1;
        }
      `}</style>
    </>
  )}
</>
);
}

const DynamicCategoryContent = dynamic(() => Promise.resolve(CategoryContent), {
  ssr: false
});

export default function CategoryPage({ slug }) {
  const router = useRouter();
  const currentSlug = slug || router.query.slug;
  const category = categoryInfo[currentSlug];

  return (
  <Layout
    title={category ? `${category.name} Virtual Backgrounds - StreamBackdrops` : 'Category Not Found'}
    description={category ? category.seoDescription : 'Category not found'}
    canonical={`https://streambackdrops.com/category/${currentSlug}`}
    currentPage={currentSlug} // Add this line
  >
    <DynamicCategoryContent slug={currentSlug} />
  </Layout>
);
}

export async function getStaticPaths() {
  const paths = ['well-lit', 'ambient-lighting', 'office-spaces', 'living-room'].map((slug) => ({
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