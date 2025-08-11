// pages/_app.js - Complete file with CookieYes consent management
import '../styles/globals.css';
import Head from 'next/head';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* CookieYes Consent Management Script - moved outside Head */}
      <Script 
        id="cookieyes"
        src="https://cdn-cookieyes.com/client_data/8eb30da506758a4631261b2a/script.js"
        strategy="afterInteractive"
      />
      
      <Component {...pageProps} />
    </>
  );
}