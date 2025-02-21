'use client';

import { gql } from '@apollo/client';

import { LocaleInfo } from '@/lib/locale/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageInfo, getPaginatedDataUtil } from '../graphql/util';
import { useQuerySettings } from './use-query-settings';

const GetAllLocales = gql`
  query GetAllLocales($nextCursor: String) {
    item(language: "en", path: "/sitecore/system/Languages") {
      children(first: 50, after: $nextCursor) {
        pageInfo {
          hasNext
          endCursor
        }
        results {
          name
        }
      }
    }
  }
`;

interface SystemLanguagesData {
  item?: {
    children: {
      pageInfo: PageInfo;
      results: {
        name: string;
      }[];
    };
  };
}

export function useAllLocales(): {
  allLocaleInfos: LocaleInfo[];
  localeDisplayNames?: Intl.DisplayNames;
} {
  const [allLocaleInfos, setAllLocaleInfos] = useState<LocaleInfo[]>([]);
  const [localeDisplayNames, setLocaleDisplayNames] = useState<Intl.DisplayNames>();

  const querySettings = useQuerySettings();

  useEffect(() => {
    const userLang = window.navigator.language;
    const displayNames = new Intl.DisplayNames([userLang], {
      type: 'language',
    });

    setLocaleDisplayNames(displayNames);
  }, []);

  const fetchData = useCallback(async () => {
    if (!querySettings?.client) {
      return;
    }
    const data = await getPaginatedDataUtil<SystemLanguagesData>(
      querySettings,
      GetAllLocales,
      undefined,
      (x) => x.item?.children.pageInfo
    );

    if (data) {
      const foundLocales =
        data.item?.children.results.map<LocaleInfo>((x) => {
          return {
            isoCode: x.name,
            friendlyName: localeDisplayNames?.of(x.name) ?? 'Unknown',
          };
        }) ?? [];

      setAllLocaleInfos(foundLocales);
    }
  }, [localeDisplayNames, querySettings]);

  useEffect(() => {
    fetchData();
  }, [querySettings, localeDisplayNames, fetchData]);

  const result = useMemo(
    () => ({ allLocaleInfos, localeDisplayNames }),
    [allLocaleInfos, localeDisplayNames]
  );
  return result;
}
