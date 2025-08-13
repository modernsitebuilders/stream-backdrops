// pages/api/sitemap.js
// Generates XML sitemap for search engines

export default function handler(req, res) {
  // ✅ Get the base URL (works for both local and production)
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.SITE_URL || 'https://streambackdrops.com';

  // ✅ Your site's categories
  const categories = ['well-lit', 'ambient-lighting', 'office-spaces'];
  
  // ✅ Static pages with priority and update frequency
  const staticPages = [
    {
      url: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '1.0'  // Homepage is most important
    },
    {
      url: `${baseUrl}/about`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      url: `${baseUrl}/contact`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      url: `${baseUrl}/license`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: '0.4'
    },
    {
      url: `${baseUrl}/privacy`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: '0.3'
    },
    {
      url: `${baseUrl}/terms`,
      lastmod: new Date().toISOString(),
      changefreq: 'yearly',
      priority: '0.3'
    }
  ];

  // ✅ Category pages (high priority for SEO)
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/category/${category}`,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',  // Categories updated weekly
    priority: '0.8'        // High priority for main content
  }));

  // ✅ Combine all pages
  const allPages = [...staticPages, ...categoryPages];

  // ✅ Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // ✅ Set proper headers for XML response
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
  res.status(200).send(sitemap);
}

// ✅ Export config to handle GET requests only
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}