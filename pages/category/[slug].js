import Head from 'next/head';
import Link from 'next/link';
import Footer from '../../components/Footer';
import Image from 'next/image';

const categoryInfo = {
  'home-offices': {
    name: 'Home Offices',
    description: 'Professional home office backgrounds perfect for remote work and video calls'
  },
  'executive-offices': {
    name: 'Executive Offices', 
    description: 'Luxury executive office backgrounds for leadership meetings and professional calls'
  },
  'minimalist': {
    name: 'Minimalist',
    description: 'Clean, minimalist backgrounds for modern professionals'
  },
  'lobbies': {
    name: 'Lobbies',
    description: 'Professional lobby backgrounds for corporate meetings and client calls'
  },
  'private-offices': {
    name: 'Private Offices',
    description: 'Elegant private office backgrounds for confidential meetings'
  }
};

export default function CategoryPage({ slug }) {
  const category = categoryInfo[slug];

  if (!category) {
    return (
      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        <Head>
          <title>Category Not Found - Virtual Backgrounds</title>
        </Head>
        <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
          <h1>Category Not Found</h1>
          <p style={{color: '#6b7280', marginBottom: '2rem'}}>
            The category you're looking for doesn't exist.
          </p>
          <Link href="/" style={{color: '#2563eb', textDecoration: 'none', fontWeight: '600'}}>
            ← Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{category.name} Virtual Backgrounds - Free Download</title>
        <meta name="description" content={category.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '2rem 0',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 2rem'}}>
            <nav style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <Link 
                href="/" 
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: '#6b7280',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                  background: '#f3f4f6'
                }}
              >
                🏠 Home
              </Link>
              
              {Object.entries(categoryInfo).map(([categorySlug, info]) => (
                <Link 
                  key={categorySlug}
                  href={`/category/${categorySlug}`}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    color: categorySlug === slug ? 'white' : '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    background: categorySlug === slug ? '#2563eb' : '#f3f4f6'
                  }}
                >
                  {info.name}
                </Link>
              ))}
            </nav>
            
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#111827'
            }}>
              {category.name}
            </h1>
            
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {category.description}
            </p>
          </div>
        </header>

        <main style={{padding: 'clamp(1rem, 3vw, 2rem)'}}>
          <div style={{maxWidth: '1400px', margin: '0 auto'}}>
            <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
              <h2 style={{color: '#111827', marginBottom: '1rem'}}>Loading backgrounds...</h2>
              <p style={{color: '#6b7280', marginBottom: '2rem'}}>
                Images are being loaded dynamically.
              </p>
              <Link href="/" style={{color: '#2563eb', textDecoration: 'none', fontWeight: '600'}}>
                ← Back to Home
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const paths = Object.keys(categoryInfo).map((slug) => ({
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