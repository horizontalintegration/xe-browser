'use client';

import { gql } from '@apollo/client';
import { useGraphQLClientContext } from '@/components/providers/GraphQLClientProvider';

import { LocaleInfo } from '@/components/locale/utils';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useEffect, useState } from 'react';
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
  const client = useGraphQLClientContext();

  const { systemLocales } = useLocale();

  useEffect(() => {
    async function getData() {
      if (!client || !itemId) {
        return;
      }
      for (let index = 0; index < systemLocales.length; index++) {
        const systemLocale = systemLocales[index];
        const { data } = await client.query<ItemLanguageData>({
          query: GetLocales,
          variables: { itemId, systemLocale },
        });

        if (data.item) {
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
  }, [client, itemId, systemLocales]);

  return allLocaleInfos;
}
