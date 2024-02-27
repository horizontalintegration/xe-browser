'use client';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { tailwindVariants } from './Navigation.styles';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export interface NavLink {
  href: string;
  content: ReactNode;
}

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  links: NavLink[];
}

export function Navigation({ className, links, ...props }: NavigationProps) {
  const pathName = usePathname();

  const { baseStyle } = tailwindVariants();

  return (
    <nav className={cn(baseStyle(), className)} {...props}>
      {links.map((x) => {
        return (
          <Button key={x.href} asChild variant={pathName.startsWith(x.href) ? 'default' : 'ghost'}>
            <Link href={x.href}>{x.content}</Link>
          </Button>
        );
      })}
    </nav>
  );
}
