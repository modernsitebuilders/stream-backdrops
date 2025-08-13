// pages/_app.js - Debug version
import '../styles/globals.css';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    console.log('🔍 App useEffect running...');
    
    // Track if we've initialized to prevent duplicate setup
    let isInitialized = false;
    let pollInterval = null;
    
    const checkConsent = () => {
      console.log('🔍 Checking consent...', {
        hasCookieYes: !!window.CookieYes,
        hasAccepted: window.CookieYes?.accepted,
        hasGtag: typeof window.gtag === 'function'
      });
      
      if (window.CookieYes && window.CookieYes.accepted) {
        if (typeof window.gtag === 'function') {
          window.gtag('config', 'G-QMD6NEPFWR');
          console.log('✅ Google Analytics configured!');
        } else {
          console.log('❌ gtag function not available');
        }
      } else {
        console.log('❌ No consent or CookieYes not ready');
      }
    };
    
    // Setup function that runs when CookieYes is available
    const setupConsentTracking = () => {
      if (isInitialized) {
        console.log('⚠️ Already initialized, skipping...');
        return;
      }
      isInitialized = true;
      console.log('🚀 Setting up consent tracking...');
      
      // Initial check
      checkConsent();
      
      // Set up listener for future consent changes
      if (window.CookieYes) {
        window.CookieYes.on("consentUpdate", () => {
          console.log('🔔 Consent updated!');
          checkConsent();
        });
      }
    };
    
    // Check immediately if CookieYes is already loaded
    if (window.CookieYes) {
      console.log('✅ CookieYes already available');
      setupConsentTracking();
    } else {
      console.log('⏳ Waiting for CookieYes...');
      // Fallback: Poll for CookieYes availability
      pollInterval = setInterval(() => {
        if (window.CookieYes) {
          console.log('✅ CookieYes now available');
          clearInterval(pollInterval);
          setupConsentTracking();
        }
      }, 100);
    }
    
    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up...');
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
        onLoad={() => console.log('✅ CookieYes script loaded')}
        onError={(e) => console.error('❌ CookieYes failed to load:', e)}
      />
      
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-QMD6NEPFWR"
        strategy="afterInteractive"
        onLoad={() => console.log('✅ Google Analytics script loaded')}
        onError={(e) => console.error('❌ GA script failed to load:', e)}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          console.log('✅ Google Analytics gtag function ready');
        `}
      </Script>
      
      <Component {...pageProps} />
    </>
  );
}