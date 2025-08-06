import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function PremiumPage() {
  return (
    <>
      <Head>
        <title>Premium 4K Virtual Backgrounds - StreamBackdrops</title>
        <meta name="description" content="Ultra high-quality 4K virtual backgrounds coming soon. Premium professional backgrounds for the most important video calls and presentations." />
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
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          color: 'white',
          padding: '4rem 0',
          textAlign: 'center'
        }}>
          <div style={{maxWidth: '600px', margin: '0 auto', padding: '0 2rem'}}>
            <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white'}}>
              Premium 4K Collection
            </h1>
            <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>
              Ultra high-quality 4K virtual backgrounds coming soon
            </p>
            <Link href="/" style={{
              background: 'white',
              color: '#f59e0b',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              display: 'inline-block'
            }}>
              Browse Free Collection
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}