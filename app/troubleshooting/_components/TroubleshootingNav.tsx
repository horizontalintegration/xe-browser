'use client';

import { NavLink, Navigation } from '@/components/helpers/Navigation';

export function TroubleshootingNav(props: React.HTMLAttributes<HTMLElement>) {
  const links: NavLink[] = [
    {
      href: '/troubleshooting/app-root',
      content: 'Missing App Root',
    },
  ];
  return <Navigation links={links} {...props} />;
}
