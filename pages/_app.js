// pages/_app.js - Complete file with CookieYes consent management AND Google Analytics
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
      
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-QMD6NEPFWR"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QMD6NEPFWR');
        `}
      </Script>
      
      {/* CookieYes Consent Management Script */}
      <Script 
        id="cookieyes"
        src="https://cdn-cookieyes.com/client_data/8eb30da506758a4631261b2a/script.js"
        strategy="afterInteractive"
      />
      
      <Component {...pageProps} />
    </>
  );
}