import { Html, Head, Main, NextScript } from 'next/document'

function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />

        {/* Google Analytics - deferred */}
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
        <DeferredNextScript />
      </body>
    </Html>
  )
}

// Custom NextScript component that uses defer instead of async
function DeferredNextScript() {
  return (
    <>
      {process.env.NODE_ENV === 'development' ? (
        <NextScript />
      ) : (
        <script
          defer
          src="/_next/static/chunks/webpack.js"
        />
      )}
    </>
  )
}

export default MyDocument