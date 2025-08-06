import Head from 'next/head';
import Link from 'next/link';
import Footer from '../../components/Footer';

export default function CategoryPage() {
  return (
    <>
      <Head>
        <title>Virtual Backgrounds - StreamBackdrops</title>
        <meta name="description" content="Professional virtual backgrounds for video calls" />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        <header style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0'}}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
            <Link href="/" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', textDecoration: 'none'}}>
              Stream<span style={{color: '#2563eb'}}>Backdrops</span>
            </Link>
          </div>
        </header>

        <section style={{
          background: '#2563eb', 
          color: 'white', 
          padding: '4rem 0', 
          textAlign: 'center'
        }}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
            <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white'}}>
              Professional Virtual Backgrounds
            </h1>
            <p style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>
              High-quality backgrounds for your video calls
            </p>
          </div>
        </section>

        <section style={{ padding: '3rem 0' }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            textAlign: 'center'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              padding: '3rem',
              margin: '2rem 0'
            }}>
              <h2 style={{fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>
                Loading Virtual Backgrounds...
              </h2>
              <p style={{color: '#6b7280', fontSize: '1.1rem', marginBottom: '2rem'}}>
                Our virtual background collection is loading. Please wait a moment.
              </p>
              <Link href="/" style={{
                background: '#2563eb',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                ← Back to Home
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}