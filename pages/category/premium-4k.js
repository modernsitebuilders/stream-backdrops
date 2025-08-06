import Head from 'next/head';
import Link from 'next/link';

export default function PremiumCategoryRedirect() {
  return (
    <>
      <Head>
        <title>Premium 4K Backgrounds - StreamBackdrops</title>
        <meta httpEquiv="refresh" content="0; url=/premium" />
      </Head>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div>
          <p>Redirecting to Premium Collection...</p>
          <Link href="/premium" style={{color: '#2563eb'}}>
            Click here if you're not redirected automatically
          </Link>
        </div>
      </div>
    </>
  );
}