// pages/api/robots.js
// Generates robots.txt to guide search engine crawling

export default function handler(req, res) {
  // ✅ Get the base URL (works for both local and production)
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.SITE_URL || 'https://streambackdrops.com';

  // ✅ Generate robots.txt content
  const robotsTxt = `# StreamBackdrops Robots.txt
# This file tells search engines how to crawl our site

# Allow all search engines to crawl everything
User-agent: *
Allow: /

# Specifically encourage image crawling for our virtual backgrounds
User-agent: Googlebot-Image
Allow: /images/
Allow: /category/

# Block access to admin/development areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/static/
Disallow: /_next/image/
Disallow: /public/

# Block any backup or temporary files
Disallow: /*.backup$
Disallow: /*.tmp$
Disallow: /*~$

# ✅ Link to our sitemap
Sitemap: ${baseUrl}/sitemap.xml

# ✅ Crawl delay to be respectful to our server
Crawl-delay: 1

# ✅ Special rules for different search engines
User-agent: Bingbot
Crawl-delay: 2

User-agent: Slurp
Crawl-delay: 2

# ✅ Encourage crawling of our main content
User-agent: *
Allow: /category/well-lit
Allow: /category/ambient-lighting
Allow: /category/office-spaces
Allow: /category/living-room

# ✅ Block any development or testing URLs
Disallow: /test/
Disallow: /dev/
Disallow: /*.json$`;

  // ✅ Set proper headers for text response
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
  res.status(200).send(robotsTxt);
}

// ✅ Export config to handle GET requests only
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}