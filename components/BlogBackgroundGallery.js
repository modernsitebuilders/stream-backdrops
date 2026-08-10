import Link from 'next/link';

const CDN = 'https://assets.streambackdrops.com/webp';

// Renders a curated gallery of downloadable backgrounds inside a blog post.
// Driven by data (blogPost.gallery in data/blogPosts.js) so posts get real,
// topical images — with intent-matched alt text + captions — on the page that
// ranks for their queries. Each figure links to the image's page (a convertible
// surface carrying the HD upsell). Note: `folder` is the R2 path (differs from
// `category` for merged categories); `category` is the on-site page URL.
export default function BlogBackgroundGallery({ heading, intro, picks }) {
  if (!picks || picks.length === 0) return null;
  return (
    <section
      aria-labelledby="blog-bg-gallery-heading"
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 clamp(1rem, 3vw, 2rem) 3rem',
      }}
    >
      {heading && (
        <h2
          id="blog-bg-gallery-heading"
          style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.75rem' }}
        >
          {heading}
        </h2>
      )}
      {intro && (
        <p style={{ margin: '0 0 1.5rem', color: '#374151', lineHeight: 1.7 }}>{intro}</p>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {picks.map((p) => (
          <figure key={p.slug} style={{ margin: 0 }}>
            <Link href={`/category/${p.category}/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img
                src={`${CDN}/${p.folder}/${p.slug}.webp`}
                alt={p.alt}
                loading="lazy"
                width={1456}
                height={816}
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  objectFit: 'cover',
                  borderRadius: '0.5rem',
                  display: 'block',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
                }}
              />
              <figcaption style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.4rem', lineHeight: 1.4 }}>
                {p.caption}
              </figcaption>
            </Link>
          </figure>
        ))}
      </div>
    </section>
  );
}
