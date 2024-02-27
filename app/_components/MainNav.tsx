'use client';

import { NavLink, Navigation } from '@/components/helpers/Navigation';

export function MainNav(props: React.HTMLAttributes<HTMLElement>) {
  const links: NavLink[] = [
    {
      href: '/item',
      content: 'Item Query',
    },
    {
      href: '/layout',
      content: 'Layout Query',
    },
    {
      href: '/graphql',
      content: 'GraphQL Browser',
    },
    {
      href: '/troubleshooting',
      content: 'Troubleshooting',
    },
  ];
  return <Navigation links={links} {...props} />;
}
