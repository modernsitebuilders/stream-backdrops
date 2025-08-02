import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function BlogBackgroundsByIndustry() {
  return (
    <>
      <Head>
        <title>Virtual Backgrounds by Industry - Coming Soon - StreamBackdrops</title>
        <meta name="description" content="Professional guide to choosing virtual backgrounds by industry - coming soon." />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Home
          </Link>
          
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Virtual Backgrounds by Industry
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              This comprehensive guide is coming soon!
            </p>
            <p className="text-gray-700">
              We're working on a detailed guide about choosing the perfect virtual background for your industry. Check back soon!
            </p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block mt-6">
              Browse Our Backgrounds
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}