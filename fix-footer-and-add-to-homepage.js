// fix-footer-and-add-to-homepage.js
const fs = require('fs');
const path = require('path');

// Fix the Footer component first
const cleanFooter = `import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: '#1f2937',
      color: 'white',
      padding: '2rem 0',
      marginTop: '3rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <Link href="/about" style={{ color: 'white', textDecoration: 'none' }}>
            About
          </Link>
          <span style={{ color: '#9ca3af' }}>•</span>
          <Link href="/contact" style={{ color: 'white', textDecoration: 'none' }}>
            Contact
          </Link>
          <span style={{ color: '#9ca3af' }}>•</span>
          <Link href="/privacy" style={{ color: 'white', textDecoration: 'none' }}>
            Privacy Policy
          </Link>
          <span style={{ color: '#9ca3af' }}>•</span>
          <Link href="/terms" style={{ color: 'white', textDecoration: 'none' }}>
            Terms of Service
          </Link>
          <span style={{ color: '#9ca3af' }}>•</span>
          <Link href="/blog" style={{ color: 'white', textDecoration: 'none' }}>
            Blog
          </Link>
        </div>
        <p style={{ color: '#d1d5db', margin: 0 }}>
          © 2025 StreamBackdrops. All rights reserved.
        </p>
      </div>
    </footer>
  );
}`;

// Fix Footer component
const footerPath = path.join(__dirname, 'components', 'Footer.js');
fs.writeFileSync(footerPath, cleanFooter);
console.log('✅ Fixed Footer component with clean encoding');

// Update homepage to include Footer
const indexPath = path.join(__dirname, 'pages', 'index.js');
const updatedHomepage = `import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Stream Backdrops</title>
      </Head>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '2rem' }}>
          <h1>Stream Backdrops</h1>
          <div style={{ marginTop: '2rem' }}>
            <div style={{ background: 'white', padding: '1rem', marginBottom: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
              <h2>Professional Shelves</h2>
              <p>42 professional shelf backgrounds</p>
              <Link href="/category/professional-shelves" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>
                View Category →
              </Link>
            </div>
            <div style={{ background: 'white', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
              <h2>Home & Lifestyle</h2>
              <p>48 home and lifestyle backgrounds</p>
              <Link href="/category/home-lifestyle" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>
                View Category →
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}`;

fs.writeFileSync(indexPath, updatedHomepage);
console.log('✅ Updated homepage to include Footer');
console.log('🎨 Added better styling and layout');