'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    // Redirect for now since we only have the one page, but will remove when we have more troubleshooting pages.
    router.replace('/troubleshooting/app-root');
  }, [router]);
  return <></>;
}
