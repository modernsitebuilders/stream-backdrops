import Head from 'next/head';
import Link from 'next/link';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us - StreamBackdrops</title>
        <meta name="description" content="Get in touch with StreamBackdrops. We're here to help with questions about virtual backgrounds, technical support, and business inquiries." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
              <Link href="/" className="text-blue-100 hover:text-white mb-4 inline-block">
                ← Back to Home
              </Link>
              <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl text-blue-100">We'd love to hear from you</p>
            </div>

            <div className="p-8">
              <div style={{textAlign: 'center', padding: '3rem 0'}}>
                <h2 style={{fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>
                  Get In Touch
                </h2>
                <p style={{color: '#6b7280', fontSize: '1.1rem', marginBottom: '2rem'}}>
                  Contact form will be available soon. For now, please visit our homepage for virtual backgrounds.
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
                  Browse Backgrounds
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}