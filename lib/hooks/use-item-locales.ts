'use client';

import { gql } from '@apollo/client';

import { LocaleInfo } from '@/components/locale/utils';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useEffect, useState } from 'react';
import { getDataUtil } from '../graphql/util';
import { useQuerySettings } from './use-query-settings';
const GetLocales = gql`
  query GetLocales($itemId: String!, $systemLocale: String!) {
    item(language: $systemLocale, path: $itemId) {
      languages {
        language {
          name
          englishName
        }
      }
    }
  }
`;

interface ItemLanguageData {
  item?: {
    languages: {
      language: {
        name: string;
        englishName: string;
      };
    }[];
  };
}

export function useItemLocales(itemId?: string): LocaleInfo[] {
  const [allLocaleInfos, setAllLocaleInfos] = useState<LocaleInfo[]>([]);

  const { systemLocales } = useLocale();
  const querySettings = useQuerySettings();

  useEffect(() => {
    async function getData() {
      if (!querySettings?.client || !itemId) {
        return;
      }
      for (let index = 0; index < systemLocales.length; index++) {
        const systemLocale = systemLocales[index];
        const data = await getDataUtil<ItemLanguageData>(querySettings, GetLocales, {
          itemId,
          systemLocale,
        });

        if (data?.item) {
          const foundLocales = data.item.languages.map<LocaleInfo>((x) => {
            return {
              isoCode: x.language.name,
              friendlyName: x.language.englishName,
            };
          });

          // Since we're fetching other language versions, we only need the first one that's found
          // Once we found one, we're good.
          setAllLocaleInfos(foundLocales);
        }
      }
    }
    getData();
  }, [querySettings, itemId, systemLocales]);

  return allLocaleInfos;
}
