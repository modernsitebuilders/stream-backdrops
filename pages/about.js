import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About StreamBackdrops - Professional Virtual Backgrounds</title>
        <meta name="description" content="Learn about StreamBackdrops - your source for professional virtual backgrounds designed specifically for video calls, remote work, and online meetings." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
              <Link href="/" className="text-blue-100 hover:text-white mb-4 inline-block">
                ← Back to Home
              </Link>
              <h1 className="text-4xl font-bold mb-4">About StreamBackdrops</h1>
              <p className="text-xl text-blue-100">Creating professional virtual backgrounds for the modern remote workforce</p>
            </div>

            <div className="p-8">
              {/* Mission Section */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-4">
                  In today's remote-first world, your virtual presence matters more than ever. StreamBackdrops was created to help professionals, freelancers, and remote workers present their best selves during video calls, regardless of their physical environment.
                </p>
                <p className="text-lg text-gray-700">
                  We believe that everyone deserves access to high-quality, professional virtual backgrounds that enhance their online presence without breaking the budget.
                </p>
              </section>

              {/* What We Offer */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Free Collection</h3>
                    <p className="text-gray-700">
                      Over 88 professional virtual backgrounds across 6 categories - from home offices to conference rooms - all completely free to download and use.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium 4K Collection</h3>
                    <p className="text-gray-700">
                      Ultra-high-definition backgrounds for professionals who demand the highest quality for important meetings and presentations.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Optimized for Video Calls</h3>
                    <p className="text-gray-700">
                      Every background is specifically designed with video calls in mind, ensuring proper aspect ratios and safe areas for optimal appearance.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Multiple Categories</h3>
                    <p className="text-gray-700">
                      Choose from Home Offices, Executive Offices, Conference Rooms, Open Offices, Lobbies, and Private Offices to match your professional needs.
                    </p>
                  </div>
                </div>
              </section>

              {/* Quality Standards */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Quality Standards</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-500 font-bold mr-3">✓</span>
                      <span className="text-gray-700">16:9 aspect ratio optimized for Zoom, Teams, and other video platforms</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 font-bold mr-3">✓</span>
                      <span className="text-gray-700">Professional lighting and composition designed by experts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 font-bold mr-3">✓</span>
                      <span className="text-gray-700">Clear center areas that don't compete with your presence</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 font-bold mr-3">✓</span>
                      <span className="text-gray-700">High-resolution images that look crisp on all devices</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 font-bold mr-3">✓</span>
                      <span className="text-gray-700">Instant PNG downloads ready for immediate use</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Who We Serve */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Serve</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💼</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Remote Workers</h3>
                    <p className="text-gray-600">Professionals working from home who need to maintain a professional appearance</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🏢</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Business Leaders</h3>
                    <p className="text-gray-600">Executives and managers conducting important video conferences and presentations</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Educators & Students</h3>
                    <p className="text-gray-600">Teachers and students participating in online classes and virtual learning</p>
                  </div>
                </div>
              </section>

              {/* Contact CTA */}
              <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Upgrade Your Video Calls?</h2>
                <p className="text-gray-700 mb-6">Join thousands of professionals who trust StreamBackdrops for their virtual meeting needs.</p>
                <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block">
                  Browse Our Collection
                </Link>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}