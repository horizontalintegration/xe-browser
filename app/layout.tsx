import { Inter } from 'next/font/google';
import './globals.css';
import EnvironmentSwitcher from '@/components/key-management/EnvironmentSwitcher';
import { MainNav } from './_components/MainNav';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { cn } from '@/lib/utils';
import { SystemLangageSwitcher } from './_components/SystemLangageSwitcher';
import { ContentWrapper } from './_components/ContentWrapper';
import { DarkModeToggle } from './_components/DarkModeToggle';
import { Metadata } from 'next';
import { ProviderWrapper } from '@/components/helpers/ProviderWrapper';
import { LogQueriesToggle } from './_components/LogQueriesToggle';
import Link from 'next/link';
import { HztlLogo } from '@/components/svg/horizontal-logo';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

if (process.env.NODE_ENV !== 'production') {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

export const metadata: Metadata = {
  title: 'Horizontal Experience Edge Browser',
  icons: '/favicon.png',
  description:
    'An interactive UI for browsing data on Sitecore Experience Edge.  Created by Horizontal Digital.',
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={cn(inter.className, 'h-full', 'm-0')}>
      <body className={cn(inter.className, 'h-full', 'm-0')}>
        <div className="flex flex-col h-full">
          <ProviderWrapper>
            <div className="border-b flex-initial flex items-center px-8">
              <div className="flex h-16 items-center">
                <EnvironmentSwitcher />
                <MainNav className="mx-6" />
              </div>
              <div className="ml-auto flex items-center space-x-4">
                <Link href={'https://horizontaldigital.com'} className="w-16 mr-2">
                  <HztlLogo />
                </Link>
                <span> XE Browser </span>
              </div>

              <div className="ml-auto flex items-center space-x-4">
                <LogQueriesToggle />

                <SystemLangageSwitcher />

                <Button asChild variant={'ghost'}>
                  <Link href={'https://github.com/horizontalintegration/xe-browser'}>
                    <GitHubLogoIcon />
                  </Link>
                </Button>

                <DarkModeToggle />
              </div>
            </div>
            <div className="space-y-4 p-8 pt-6 flex flex-col flex-auto overflow-y-auto">
              <ContentWrapper>{children}</ContentWrapper>
            </div>
            <footer
              className={cn(
                'px-8',
                'py-4',
                'px-gutter-all',
                'text-theme-text',
                'relative',
                'bg-gray-dark',
                'text-white',
                'flex-initial',
                'basis-1'
              )}
            >
              <div className={cn('sm:flex', 'sm:flex-wrap', 'pr-8', 'lg:pr-0')}>
                <div className="w-full">
                  <p className={cn('text-sm', 'my-0')}>
                    <span>
                      Created by{' '}
                      <Link className="underline" href={'https://horizontaldigital.com'}>
                        Horizontal Digital
                      </Link>
                      .
                    </span>
                    <span>
                      Source code is available on{' '}
                      <Link
                        className="underline"
                        href="https://github.com/horizontalintegration/xe-browser"
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                      </Link>
                      .
                    </span>
                  </p>
                </div>
              </div>
            </footer>
          </ProviderWrapper>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
