// pages/_app.js - Complete file with CookieYes consent management
import '../styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* CookieYes Consent Management Script */}
        <script 
          id="cookieyes" 
          type="text/javascript" 
          src="https://cdn-cookieyes.com/client_data/8eb30da506758a4631261b2a/script.js"
        ></script>
        
        {/* Meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Component {...pageProps} />
    </>
  );
}