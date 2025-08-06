import '../styles/globals.css'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import * as gtag from '../lib/gtag'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const handleRouteChange = (url) => {
        gtag.pageview(url)
      }
      
      // Track page views
      router.events.on('routeChangeComplete', handleRouteChange)
      
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange)
      }
    }
  }, [router.events])

  return <Component {...pageProps} />
}