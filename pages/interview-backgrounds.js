// pages/interview-backgrounds.js
//
// SEO landing page targeting the highest-impression under-served query cluster
// in Search Console: "teams/zoom background for interview", "professional
// background for video interview", etc. (see image-content-priorities memo).
// It curates interview-appropriate images we already have — the fix here is
// POSITIONING (a keyword-optimized page pointing at existing catalog), not new
// generation. Copy follows the corporate/executive brand voice (CLAUDE.md):
// Zoom / Microsoft Teams / Google Meet, never gamer/streamer framing.
import Layout from '../components/Layout';
import manifest from '../image-pipeline/final_manifest.json';
import scoresData from '../public/data/image-scores-static.json';

const CDN = 'https://assets.streambackdrops.com';
const COPPER = '#9a6a3a';
const INK = '#111827';

// Interview-appropriate settings: professional, non-distracting, camera-safe.
const PRO_CATEGORIES = [
  'office-spaces',
  'home-office',
  'neutral-backgrounds',
  'bookshelves',
  'libraries',
];
// Keep seasonal / decorative noise out even if it slipped into a pro category.
const BUSY = /halloween|christmas|easter|valentine|pumpkin|festive|holiday|spooky|autumn|snow/i;

export async function getStaticProps() {
  const scores = scoresData.scores || {};
  const perCatCap = 9; // spread across settings instead of an all-office wall

  const ranked = manifest
    .filter((e) => PRO_CATEGORIES.includes(e.category))
    .filter((e) => !BUSY.test(((e.tags || []).join(' ') + ' ' + (e.title || ''))))
    .map((e) => ({
      slug: e.slug,
      category: e.category,
      folder: e.folder || e.category,
      webp: e.image_webp,
      alt: e.alt || e.title || 'Professional interview background',
      score: (scores[e.image_webp] && scores[e.image_webp].score) || 0,
    }))
    .sort((a, b) => b.score - a.score);

  const perCat = {};
  const images = [];
  for (const img of ranked) {
    perCat[img.category] = (perCat[img.category] || 0) + 1;
    if (perCat[img.category] > perCatCap) continue;
    images.push(img);
    if (images.length >= 36) break;
  }

  return { props: { images } };
}

const FAQ = [
  {
    q: 'What is the best virtual background for a job interview?',
    a: 'A clean, neutral setting reads best on camera — a tidy office, a plain wall in a warm neutral tone, or a lightly styled bookshelf. Avoid busy or brightly colored scenes that pull attention away from you. Every background on this page is composed to sit quietly behind you so the interviewer focuses on what you are saying.',
  },
  {
    q: 'Should I use a virtual background for a video interview?',
    a: 'Yes — if your real space is cluttered or distracting, a professional virtual background is a strong choice and is widely accepted for interviews. Pick something understated and office-appropriate rather than a novelty scene, and your setup will look deliberate and polished.',
  },
  {
    q: 'Which background works best for a Microsoft Teams interview?',
    a: 'Microsoft Teams supports replacing your background under video effects. For an interview, choose a neutral office, a home-office study, or a simple bookshelf. All of these images are sized for Teams, Zoom, and Google Meet and download free.',
  },
  {
    q: 'How do I set a virtual background on Zoom, Teams, or Google Meet?',
    a: 'Download the image, then add it under your video settings: Zoom (Settings → Background & Effects), Microsoft Teams (video effects before or during a call), or Google Meet (the effects panel in the call). Our step-by-step setup guide walks through each platform.',
  },
  {
    q: 'Are these interview backgrounds free?',
    a: 'Yes. Every sample here downloads free for personal and professional use. Higher-resolution HD Editions are also available if you want the sharpest possible image on a large display.',
  },
];

export default function InterviewBackgroundsPage({ images }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://meetbackdrops.com' },
          { '@type': 'ListItem', position: 2, name: 'Interview Backgrounds', item: 'https://meetbackdrops.com/interview-backgrounds' },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'Virtual Backgrounds for Video Interviews',
        description: 'Curated professional virtual backgrounds for job interviews on Zoom, Microsoft Teams, and Google Meet.',
        url: 'https://meetbackdrops.com/interview-backgrounds',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <Layout
      title="Interview Backgrounds for Zoom, Teams & Meet | MeetBackdrops"
      description="Professional virtual backgrounds for video interviews on Zoom, Microsoft Teams, and Google Meet. Studio-composed, distraction-free, and free to download."
      canonical="https://meetbackdrops.com/interview-backgrounds"
      currentPage="interview-backgrounds"
      keywords="interview backgrounds, zoom background for interview, teams background for interview, professional video interview background, virtual background for job interview"
      structuredData={structuredData}
    >
      <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: '#6b7280', marginBottom: '1.5rem' }}>
            <a href="/" style={{ color: COPPER, fontWeight: 600, textDecoration: 'none' }}>Home</a>
            <span>›</span>
            <span style={{ color: INK, fontWeight: 500 }}>Interview Backgrounds</span>
          </nav>

          {/* Hero */}
          <header style={{ marginBottom: '2.5rem', maxWidth: '820px' }}>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: INK, lineHeight: 1.15, marginBottom: '1rem' }}>
              Virtual Backgrounds for Video Interviews
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#374151', lineHeight: 1.6, marginBottom: '1rem' }}>
              Make a confident first impression on camera. These studio-designed virtual
              backgrounds are composed to sit quietly behind you on <strong>Zoom</strong>,{' '}
              <strong>Microsoft Teams</strong>, and <strong>Google Meet</strong> — clean, neutral,
              and distraction-free, so the interviewer stays focused on you.
            </p>
            <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.6 }}>
              Every image below downloads free and is sized for all three platforms. Hand-picked
              from our office, study, and bookshelf collections for exactly this moment.
            </p>
          </header>

          {/* Tips */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: INK, marginBottom: '1rem' }}>
              What makes a strong interview background
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {[
                ['Keep it neutral', 'Warm neutral walls, tidy offices, and simple bookshelves read as professional. Skip bold colors and busy scenes.'],
                ['Mind the depth', 'A background with a little depth behind you looks natural on camera — an office that recedes, not a flat poster.'],
                ['Match the role', 'A polished executive office suits a corporate interview; a warm home study fits a relaxed or creative role.'],
              ].map(([h, p]) => (
                <div key={h} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.6rem', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: INK, marginBottom: '0.4rem' }}>{h}</h3>
                  <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.55, margin: 0 }}>{p}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Image grid */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: INK, marginBottom: '1rem' }}>
              Interview-ready backgrounds
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {images.map((img) => (
                <a
                  key={img.slug}
                  href={`/category/${img.category}/${img.slug}`}
                  style={{ display: 'block', borderRadius: '0.6rem', overflow: 'hidden', border: '1px solid #e5e7eb', background: '#fff', textDecoration: 'none' }}
                >
                  <img
                    src={`${CDN}/webp/${img.folder}/${img.webp}`}
                    alt={img.alt}
                    loading="lazy"
                    width={260}
                    height={146}
                    style={{ width: '100%', height: 'auto', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' }}
                  />
                </a>
              ))}
            </div>
          </section>

          {/* Platform + related, internal links */}
          <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.75rem', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: INK, marginBottom: '0.75rem' }}>
              Set it up on your platform
            </h2>
            <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '1rem' }}>
              Adding a background takes under a minute on any major platform. Our guides walk through
              each one, plus the mistakes that make a good background look unprofessional:
            </p>
            <ul style={{ color: COPPER, lineHeight: 2, paddingLeft: '1.25rem', margin: 0 }}>
              <li><a href="/blog/job-interview-backgrounds" style={{ color: COPPER }}>How to choose a background for a job interview</a></li>
              <li><a href="/blog/virtual-background-setup-by-platform" style={{ color: COPPER }}>Virtual background setup by platform (Zoom, Teams, Meet)</a></li>
              <li><a href="/blog/zoom-teams-google" style={{ color: COPPER }}>Zoom vs. Teams vs. Google Meet backgrounds</a></li>
              <li><a href="/blog/background-mistakes" style={{ color: COPPER }}>Common virtual background mistakes to avoid</a></li>
            </ul>
            <p style={{ color: '#4b5563', lineHeight: 1.6, margin: '1.25rem 0 0.5rem' }}>Browse more professional settings:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {[
                ['Office Spaces', '/category/office-spaces'],
                ['Home Office', '/category/home-office'],
                ['Neutral Backgrounds', '/category/neutral-backgrounds'],
                ['Bookshelves', '/category/bookshelves'],
                ['Libraries', '/category/libraries'],
                ['HD Editions', '/hd'],
              ].map(([label, href]) => (
                <a key={href} href={href} style={{ display: 'inline-block', padding: '0.45rem 0.9rem', border: `1px solid ${COPPER}`, borderRadius: '999px', color: COPPER, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                  {label}
                </a>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: INK, marginBottom: '1.25rem' }}>
              Interview background FAQ
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {FAQ.map((f) => (
                <div key={f.q} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.6rem', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: INK, marginBottom: '0.5rem' }}>{f.q}</h3>
                  <p style={{ fontSize: '0.97rem', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
