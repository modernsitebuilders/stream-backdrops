// Update your components/Footer.js file with this:

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
          <Link href="/about" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
            About
          </Link>
          <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
          <Link href="/contact" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
            Contact
          </Link>
          <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
          <Link href="/privacy" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
            Privacy Policy
          </Link>
          <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
          <Link href="/terms" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
            Terms of Service
          </Link>
          <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
          <Link href="/blog" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
            Blog
          </Link>
          <span style={{ color: '#9ca3af', margin: '0 10px' }}>•</span>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', margin: '0 15px' }}>
            Home
          </Link>
        </div>
        <p style={{ color: '#d1d5db' }}>
          &copy; 2025 StreamBackdrops. All rights reserved.
        </p>
      </div>
    </footer>
  );
}