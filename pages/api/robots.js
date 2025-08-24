export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const baseUrl = 'https://streambackdrops.com';
    
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${baseUrl}/sitemap.xml
Crawl-delay: 1`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(robotsTxt);
  } catch (error) {
    console.error('Robots.txt error:', error);
    res.status(500).send('User-agent: *\nAllow: /');
  }
}