import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function CategoryPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const { slug } = router.query;
  
  const categoryInfo = {
    'home-offices': { name: 'Home Offices', description: 'Professional home office backgrounds' },
    'executive-offices': { name: 'Executive Offices', description: 'Luxury executive backgrounds' },
    'conference-rooms': { name: 'Conference Rooms', description: 'Professional meeting backgrounds' },
    'open-offices': { name: 'Open Offices', description: 'Modern workspace backgrounds' },
    'lounges': { name: 'Lounges', description: 'Comfortable lounge backgrounds' }
  };

  if (!slug || !categoryInfo[slug]) {
    return <div>Category not found</div>;
  }

  const category = categoryInfo[slug];

  return (
    <>
      <Head>
        <title>{category.name} - StreamBackdrops</title>
      </Head>
      <div style={{padding: '2rem'}}>
        <Link href="/">← Back to Home</Link>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
        <p>Images will be loaded here...</p>
      </div>
    </>
  );
}
