import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" data-scroll-behavior="smooth">
      <Head>
        {/* Critical CSS for immediate styling */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              margin: 0; 
              line-height: 1.6;
            }
            * { box-sizing: border-box; }
            .hero { min-height: 50vh; }
            .loading { opacity: 0.6; }
          `
        }} />
        
        {/* CRITICAL: Add viewport meta tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* FIXED: Google Tag Manager with proper syntax */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.defer=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TS54MCGR');`
        }} />
        
        {/* Favicon and app icons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* Enhanced SEO meta tags */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="StreamBackdrops" />
        <meta name="publisher" content="StreamBackdrops" />
        
        {/* SIMPLIFIED: Structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "StreamBackdrops",
              "description": "Free HD virtual backgrounds for video calls",
              "url": "https://streambackdrops.com"
            })
          }}
        />
        
        {/* Performance optimizations */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="color-scheme" content="light" />
      </Head>
      <body>
        {/* FIXED: Google Tag Manager noscript with proper syntax */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-TS54MCGR"
            height="0" 
            width="0" 
            style={{display:'none',visibility:'hidden'}}
          />
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}