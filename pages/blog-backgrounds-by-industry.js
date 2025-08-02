import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function BlogBackgroundsByIndustry() {
  return (
    <>
      <Head>
        <title>Choosing Virtual Backgrounds by Industry - StreamBackdrops</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/">← Back to Home</Link>
          <h1>Blog post coming soon!</h1>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
