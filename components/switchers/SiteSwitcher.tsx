'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGraphQLClientContext } from '@/components/providers/GraphQLClientProvider';
import { useSiteList } from '@/lib/hooks/use-site-list';

export interface SiteInfo {
  siteName: string;
}

interface SiteSwitcherProps {
  onSiteSelected: (site?: SiteInfo) => void;
  allowNullSite?: boolean;
}

const NoSiteValue = 'none';
const NoSiteLabel = '[No Site]';

export function SiteSwitcher({ onSiteSelected, allowNullSite }: SiteSwitcherProps) {
  const [selectedSite, setSelectedSite] = useState<string>();

  const sites = useSiteList();

  const client = useGraphQLClientContext();

  const siteSelected = (siteName: string) => {
    const selectedSite = sites.find((x) => x.siteName === siteName);
    if (selectedSite) {
      setSelectedSite(selectedSite?.siteName);
      onSiteSelected(selectedSite);
    } else if (allowNullSite) {
      setSelectedSite(NoSiteValue);
      onSiteSelected(undefined);
    }
  };

  if (!client) {
    return (
      <p>
        No environment selected, or selected environment has invalid API key. Editing environments
        are not supported currently, delete and recreate it.
      </p>
    );
  }
  return (
    <Select defaultValue={selectedSite} onValueChange={siteSelected}>
      <SelectTrigger
        className={cn(
          'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate'
        )}
        aria-label="Select site"
      >
        <SelectValue placeholder="Select site">
          <span className={cn('ml-2')}>
            {sites.find((site) => site.siteName === selectedSite)?.siteName ?? NoSiteLabel}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {allowNullSite ? (
          <SelectItem value={'none'}>
            <div className="flex items-center gap-3">{NoSiteLabel}</div>
          </SelectItem>
        ) : null}

        {sites.map((site) => (
          <SelectItem key={site.siteName} value={site.siteName}>
            <div className="flex items-center gap-3">{site.siteName}</div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
