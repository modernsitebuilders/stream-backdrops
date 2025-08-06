import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Note: Removed preload tags from here - they cause warnings on non-homepage */}
        {/* We'll add dynamic preloading in individual pages instead */}

        {/* Google Analytics - optimized */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-QMD6NEPFWR"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QMD6NEPFWR', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
          }}
        />
        
        {/* Google AdSense - deferred */}
        <script 
          async 
          defer
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2391004325385163"
          crossOrigin="anonymous"
        />
        
        {/* Favicon and meta */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2563eb" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}