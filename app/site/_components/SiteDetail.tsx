import LayoutDataJsonView from '@/app/layout/_components/LayoutDataJsonView';
import { Button } from '@/components/ui/button';
import { GetAllSiteInfoResult } from '@/lib/graphql/types';
import { ReactNode, useState } from 'react';
import { tv } from 'tailwind-variants';
import { SiteDictionary } from './SiteDictionary';
import { cn } from '@/lib/utils';

const tailwindVariants = tv({
  slots: {
    baseStyle: ['flex', 'items-center', 'space-x-4', 'lg:space-x-6'],
  },
});

type SiteDetailSection = '404' | '500' | 'dictionary';
const siteDetailSections: { section: SiteDetailSection; label: ReactNode }[] = [
  { section: 'dictionary', label: 'Dictionary' },
  { section: '404', label: 'Not Found Page' },
  { section: '500', label: 'Server Error Page' },
];

export function SiteDetail({ site }: { site: GetAllSiteInfoResult }) {
  const { baseStyle } = tailwindVariants();
  const [section, setSection] = useState<SiteDetailSection>('dictionary');
  return (
    <div>
      <div>
        <nav className={cn(baseStyle())}>
          {siteDetailSections.map((x) => (
            <Button
              key={x.section}
              variant={section === x.section ? 'default' : 'ghost'}
              onClick={() => {
                if (section !== x.section) setSection(x.section);
              }}
            >
              {x.label}
            </Button>
          ))}
        </nav>
        <div className="block ">
          {section === 'dictionary' ? (
            <SiteDictionary site={site} />
          ) : section === '404' ? (
            site.notFoundPageRoutePath ? (
              <LayoutDataJsonView
                routePath={site.notFoundPageRoutePath}
                siteName={site?.siteName}
              />
            ) : null
          ) : section === '500' ? (
            site.serverErrorPageRoutePath ? (
              <LayoutDataJsonView
                routePath={site.serverErrorPageRoutePath}
                siteName={site?.siteName}
              />
            ) : null
          ) : null}
        </div>
      </div>
    </div>
  );
}
