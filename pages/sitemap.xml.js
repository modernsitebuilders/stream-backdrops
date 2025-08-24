export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the base URL (works for both local and production)
    const baseUrl = 'https://streambackdrops.com';

    // Your site's current categories
    const categories = ['well-lit', 'ambient-lighting', 'office-spaces', 'living-room'];
    
    // Blog post slugs
    const blogPosts = [
      'blog-professional-video-calls',
      'blog-backgrounds-by-industry',
      'blog-background-mistakes',
      'blog-lighting-tips',
      'blog-virtual-background-guide',
      'blog-zoom-teams-google',
      'blog-remote-work-productivity'
    ];
    
    // Static pages with priority and update frequency
    const staticPages = [
      {
        url: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '1.0'  // Homepage is most important
      },
      {
        url: `${baseUrl}/blog`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
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

    // Category pages (high priority for SEO)
    const categoryPages = categories.map(category => ({
      url: `${baseUrl}/category/${category}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',  // Categories updated weekly
      priority: '0.8'        // High priority for main content
    }));

    // Blog post pages
    const blogPages = blogPosts.map(slug => ({
      url: `${baseUrl}/${slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7'
    }));

    // Combine all pages
    const allPages = [...staticPages, ...categoryPages, ...blogPages];

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Set proper headers for XML response
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
}