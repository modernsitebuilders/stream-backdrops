import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - StreamBackdrops</title>
        <meta name="description" content="Terms of Service for StreamBackdrops - Professional virtual backgrounds for video calls. Learn about usage rights, restrictions, and service terms." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="mb-8">
              <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                ← Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
              <p className="text-gray-600">Last updated: August 2, 2025</p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using StreamBackdrops ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                StreamBackdrops provides high-quality virtual background images for use in video conferencing, online meetings, and related professional communications. Our service includes both free and premium background collections.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Use License</h2>
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Free Backgrounds</h3>
              <p className="text-gray-700 mb-4">
                Free virtual backgrounds provided by StreamBackdrops are licensed for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Personal use in video calls and meetings</li>
                <li>Commercial use in business presentations and professional meetings</li>
                <li>Educational use in online classes and training sessions</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Premium Backgrounds</h3>
              <p className="text-gray-700 mb-4">
                Premium virtual backgrounds are subject to the license terms provided at the time of purchase. Generally, premium backgrounds include expanded usage rights and higher resolution files.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Restrictions</h2>
              <p className="text-gray-700 mb-2">You are specifically restricted from all of the following:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Redistributing or reselling our virtual backgrounds</li>
                <li>Using our backgrounds in a way that is unlawful or prohibited</li>
                <li>Claiming ownership or authorship of our virtual backgrounds</li>
                <li>Removing watermarks or attribution from premium backgrounds</li>
                <li>Using our backgrounds for purposes that could damage our reputation</li>
                <li>Creating derivative works that compete directly with our service</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Intellectual Property Rights</h2>
              <p className="text-gray-700 mb-4">
                All virtual backgrounds, website content, and related materials are the intellectual property of StreamBackdrops and are protected by applicable copyright and trademark law. We retain all rights, title, and interest in our virtual backgrounds.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. User Accounts and Premium Services</h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us or purchase premium services, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding any passwords and for any activities that occur under your account.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                Premium virtual backgrounds are available for purchase through our authorized payment processors. All payments are processed securely, and we do not store your payment information on our servers.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Refund Policy</h2>
              <p className="text-gray-700 mb-4">
                Due to the digital nature of our products, all sales are final. However, if you experience technical issues with your download, please contact our support team within 30 days of purchase, and we will work to resolve the issue.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, StreamBackdrops excludes all representations, warranties, and conditions relating to our website and the use of this website.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall StreamBackdrops, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of our virtual backgrounds, whether such liability is under contract, tort, or otherwise.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be interpreted and governed by the laws of the State of Pennsylvania, United States, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">15. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us through our website contact form or at the address provided on our Contact page.
              </p>

              <div className="bg-blue-50 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Questions About Our Terms?</h3>
                <p className="text-blue-800 mb-4">
                  If you have any questions about these terms or need clarification about usage rights, please don't hesitate to reach out.
                </p>
                <Link href="/contact" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}