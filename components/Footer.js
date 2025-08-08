import Link from 'next/link';

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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Link href="/about" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
            About
          </Link>
          <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
          <Link href="/license" style={{ color: '#fbbf24', textDecoration: 'none', margin: '0 15px', fontWeight: '600' }}>
            📋 License & Usage
          </Link>
          <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
          <Link href="/contact" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
            Contact
          </Link>
          <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
          <Link href="/blog" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
            Blog
          </Link>
          <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
          <Link href="/privacy" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
            Privacy Policy
          </Link>
          <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
          <Link href="/terms" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
            Terms of Service
          </Link>
        </div>
        <p style={{ color: '#d1d5db', margin: 0 }}>
          © 2025 StreamBackdrops. All rights reserved.
        </p>
      </div>
    </footer>
  );
}