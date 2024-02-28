'use client';

import { useEffect, useState } from 'react';

import { gql } from '@apollo/client';
import { useLocale } from '@/components/providers/LocaleProvider';
import { getDataUtil } from '@/lib/graphql/util';
import { useQuerySettings } from './use-query-settings';

const GetSites = gql`
  query GetSites {
    site {
      siteInfoCollection {
        name
      }
    }
  }
`;

interface SiteCollectionData {
  site: {
    siteInfoCollection: {
      name: string;
    }[];
  };
}

const GetSitesLegacy = gql`
  # Write your query or mutation here
  query getSites($systemLocale: String!) {
    search(
      where: {
        AND: [
          # /sitecore/content
          { name: "_path", value: "{0DE95AE4-41AB-4D01-9EB0-67441B7C2450}" }
          {
            name: "_templates"
            # /sitecore/templates/Foundation/JSS Experience Accelerator/Multisite/Site
            value: "{E46F3AF2-39FA-4866-A157-7017C4B2A40C}"
          }
          { name: "_language", value: $systemLocale }
        ]
      }
      first: 100
    ) {
      results {
        siteName: field(name: "SiteName") {
          value
        }
      }
    }
  }
`;

interface LegacySiteData {
  search: {
    results: {
      siteName: {
        value: string;
      };
    }[];
  };
}

export interface SiteInfo {
  siteName: string;
}

export function useSiteList(): SiteInfo[] {
  const [sites, setSites] = useState<SiteInfo[]>([]);

  const querySettings = useQuerySettings();

  const { systemLocales } = useLocale();

  useEffect(() => {
    const fetchData = async () => {
      if (!querySettings?.client) {
        return;
      }

      try {
        const data = await getDataUtil<SiteCollectionData>(querySettings, GetSites);

        if (data) {
          const foundSites = data.site.siteInfoCollection.map((x) => ({
            siteName: x.name,
          }));

          setSites(foundSites);
        }
      } catch {
        const uniqueSiteNames = new Set<string>();
        for (let index = 0; index < systemLocales.length; index++) {
          const systemLocale = systemLocales[index];
          const data = await getDataUtil<LegacySiteData>(querySettings, GetSitesLegacy, {
            systemLocale,
          });

          if (data) {
            data.search.results.forEach((x) => uniqueSiteNames.add(x.siteName.value));
          }
        }

        const foundSites = Array.from(uniqueSiteNames).map((x) => ({ siteName: x }));

        setSites(foundSites);
      }
    };
    fetchData();

    return () => {
      setSites([]);
    };
  }, [querySettings, systemLocales]);

  return sites;
}
