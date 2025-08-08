// minimal-fix.js
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'pages', 'index.js');

// Backup current version
if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, indexPath + '.broken');
  console.log('Backed up broken version');
}

// Create simple working version
const simpleIndex = `import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Stream Backdrops</title>
      </Head>
      <div style={{ padding: '2rem' }}>
        <h1>Stream Backdrops</h1>
        <div style={{ marginTop: '2rem' }}>
          <div style={{ background: 'white', padding: '1rem', marginBottom: '1rem' }}>
            <h2>Professional Shelves</h2>
            <p>42 professional shelf backgrounds</p>
            <Link href="/category/professional-shelves">View Category</Link>
          </div>
          <div style={{ background: 'white', padding: '1rem' }}>
            <h2>Home & Lifestyle</h2>
            <p>48 home and lifestyle backgrounds</p>
            <Link href="/category/home-lifestyle">View Category</Link>
          </div>
        </div>
      </div>
    </>
  );
}`;

fs.writeFileSync(indexPath, simpleIndex);
console.log('Created minimal index.js');
console.log('Now run: npm run dev');