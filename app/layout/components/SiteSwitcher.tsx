"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gql } from "@apollo/client";
import { useGraphQLClientContext } from "@/components/providers/GraphQLClientProvider";

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
  query getSites {
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
          { name: "_language", value: "en" }
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

interface SiteSwitcherProps {
  onSiteSelected: (site: SiteInfo) => void;
}

export function SiteSwitcher({ onSiteSelected }: SiteSwitcherProps) {
  const [selectedSite, setSelectedSite] = useState<string>();

  const [sites, setSites] = useState<SiteInfo[]>([]);

  const client = useGraphQLClientContext();

  const siteSelected = (siteName: string) => {
    const selectedSite = sites.find((x) => x.siteName === siteName);
    if (selectedSite) {
      setSelectedSite(selectedSite?.siteName);
      onSiteSelected(selectedSite);
    }
  };

  const fetchData = async () => {
    if (!client) {
      return;
    }
    try {
      const { data } = await client.query<SiteCollectionData>({
        query: GetSites,
      });

      if (data) {
        const foundSites = data.site.siteInfoCollection.map((x) => ({
          siteName: x.name,
        }));
        setSites(foundSites);
      }
    } catch {
      const { data } = await client.query<LegacySiteData>({
        query: GetSitesLegacy,
      });

      if (data) {
        const foundSites = data.search.results.map((x) => ({
          siteName: x.siteName.value,
        }));
        const uniqueSiteNames = new Set(foundSites.map((x) => x.siteName));
        setSites(Array.from(uniqueSiteNames).map((x) => ({ siteName: x })));
      }
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  if (!client) {
    return (
      <p>
        No environment selected, or selected environment has invalid API key.
        Editing environments are not supported currently, delete and recreate
        it.
      </p>
    );
  }
  return (
    <Select defaultValue={selectedSite} onValueChange={siteSelected}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate"
        )}
        aria-label="Select site"
      >
        <SelectValue placeholder="Select site">
          <span className={cn("ml-2")}>
            {sites.find((site) => site.siteName === selectedSite)?.siteName}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {sites.map((site) => (
          <SelectItem key={site.siteName} value={site.siteName}>
            <div className="flex items-center gap-3">{site.siteName}</div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
