import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (you can add real email service later)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

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
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
              <Link href="/" className="text-blue-100 hover:text-white mb-4 inline-block">
                ← Back to Home
              </Link>
              <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl text-blue-100">We'd love to hear from you</p>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  
                  {submitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                      <div className="text-green-600 text-4xl mb-4">✓</div>
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
                      <p className="text-green-700">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Question</option>
                          <option value="technical">Technical Support</option>
                          <option value="premium">Premium Downloads</option>
                          <option value="business">Business Inquiry</option>
                          <option value="feedback">Feedback & Suggestions</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Tell us how we can help you..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Time</h3>
                      <p className="text-gray-700">We typically respond to all inquiries within 24 hours during business days.</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
                      <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Common Questions</h3>
                      <div className="space-y-3">
                        <details className="group">
                          <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                            How do I use virtual backgrounds in Zoom?
                          </summary>
                          <p className="mt-2 text-gray-600 pl-4">
                            Download the PNG file, then in Zoom go to Settings → Virtual Background → Add Image and select your downloaded file.
                          </p>
                        </details>
                        
                        <details className="group">
                          <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                            What's the difference between free and premium backgrounds?
                          </summary>
                          <p className="mt-2 text-gray-600 pl-4">
                            Free backgrounds are 2K resolution, while premium are ultra-high 4K resolution for the best possible quality.
                          </p>
                        </details>
                        
                        <details className="group">
                          <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                            Can I use these backgrounds commercially?
                          </summary>
                          <p className="mt-2 text-gray-600 pl-4">
                            Yes! All our backgrounds can be used for business meetings, presentations, and commercial video calls.
                          </p>
                        </details>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Immediate Help?</h3>
                      <p className="text-blue-800 mb-4">Check out our most popular backgrounds or browse by category:</p>
                      <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block">
                        Browse Backgrounds
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}