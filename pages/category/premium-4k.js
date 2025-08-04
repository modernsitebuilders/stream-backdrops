import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PremiumCategoryRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/premium'); }, [router]);
  return <div>Redirecting...</div>;
}