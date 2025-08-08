// pages/sitemap.xml.js
function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Homepage -->
     <url>
       <loc>https://streambackdrops.com</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>1.0</priority>
     </url>
     
     <!-- Static Pages -->
     <url>
       <loc>https://streambackdrops.com/about</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>https://streambackdrops.com/contact</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>https://streambackdrops.com/premium</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>https://streambackdrops.com/privacy</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>yearly</changefreq>
       <priority>0.6</priority>
     </url>
     <url>
       <loc>https://streambackdrops.com/terms</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>yearly</changefreq>
       <priority>0.6</priority>
     </url>
     
     <!-- Category Pages -->
     <url>
       <loc>https://streambackdrops.com/category/home-offices</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>https://streambackdrops.com/category/executive-offices</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>https://streambackdrops.com/category/minimalist</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>https://streambackdrops.com/category/lobbies</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>https://streambackdrops.com/category/private-offices</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.9</priority>
     </url>
   </urlset>`;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // Generate the XML sitemap with the posts data
  const sitemap = generateSiteMap();

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate'
  )
  res.setHeader('Content-Type', 'text/xml')
  // Send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap