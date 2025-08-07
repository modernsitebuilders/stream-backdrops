import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function Premium() {
  return (
    <>
      <Head>
        <title>Premium 4K Virtual Backgrounds - StreamBackdrops</title>
        <meta name="description" content="Premium 4K virtual backgrounds for professionals" />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        <header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '4rem 2rem'
        }}>
          <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem'}}>
            Premium 4K Collection
          </h1>
          <p style={{fontSize: '1.25rem', opacity: 0.9}}>
            Ultra high-resolution backgrounds for professionals
          </p>
        </header>

        <main style={{padding: '2rem'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
            <h2 style={{fontSize: '2rem', marginBottom: '2rem'}}>Coming Soon</h2>
            <p style={{fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem'}}>
              Premium 4K backgrounds are being prepared for launch
            </p>
            <Link href="/" style={{
              background: '#2563eb',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Browse Free Backgrounds
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}