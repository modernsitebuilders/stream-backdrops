// pages/_app.js
import '../styles/globals.css';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Track if we've initialized to prevent duplicate setup
    let isInitialized = false;
    let pollInterval = null; // Initialize as null
    
    const checkConsent = () => {
      if (window.CookieYes && window.CookieYes.accepted) {
        if (typeof window.gtag === 'function') {
          window.gtag('config', 'G-QMD6NEPFWR');
        }
      }
    };
    
    // Setup function that runs when CookieYes is available
    const setupConsentTracking = () => {
      if (isInitialized) return;
      isInitialized = true;
      
      // Initial check
      checkConsent();
      
      // Set up listener for future consent changes
      if (window.CookieYes) {
        window.CookieYes.on("consentUpdate", checkConsent);
      }
    };
    
    // Check immediately if CookieYes is already loaded
    if (window.CookieYes) {
      setupConsentTracking();
    } else {
      // Fallback: Poll for CookieYes availability
      pollInterval = setInterval(() => {
        if (window.CookieYes) {
          clearInterval(pollInterval);
          setupConsentTracking();
        }
      }, 100);
    }
    
    // Cleanup function (now properly handles both cases)
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      if (window.CookieYes) {
        window.CookieYes.off("consentUpdate", checkConsent);
      }
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* CookieYes - Load first */}
      <Script
        id="cookieyes"
        src="https://cdn-cookieyes.com/client_data/8eb30da506758a4631261b2a/script.js"
        strategy="beforeInteractive"
        onError={() => console.error("CookieYes failed to load")}
      />
      
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-QMD6NEPFWR"
        strategy="afterInteractive"
        onError={() => console.error("GA script failed to load")}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
        `}
      </Script>
      
      <Component {...pageProps} />
    </>
  );
}