// lib/gtag.js
// Google Analytics 4 (GA4) configuration

export const GA_TRACKING_ID = 'G-QMD6NEPFWR'

// Track page views
export const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    })
  }
}

// Track events (GA4 format)
export const event = (action, parameters) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, parameters)
  }
}