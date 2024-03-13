'use client';

import { gql } from '@apollo/client';

import { LocaleInfo } from '@/lib/locale/utils';
import { useEffect, useState } from 'react';
import { getDataUtil } from '../graphql/util';
import { useQuerySettings } from './use-query-settings';

const GetAllLocales = gql`
  query GetAllLocales {
    item(language: "en", path: "/sitecore/system/Languages") {
      children(first: 100) {
        results {
          name
        }
      }
    }
  }
`;

interface SystemLanguagesData {
  item: {
    children: {
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

  const fetchData = async () => {
    if (!querySettings?.client) {
      return;
    }
    const data = await getDataUtil<SystemLanguagesData>(querySettings, GetAllLocales);

    if (data) {
      const foundLocales = data.item.children.results.map<LocaleInfo>((x) => {
        return {
          isoCode: x.name,
          friendlyName: localeDisplayNames?.of(x.name) ?? 'Unknown',
        };
      });

      setAllLocaleInfos(foundLocales);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySettings, localeDisplayNames]);

  return { allLocaleInfos, localeDisplayNames };
}
