import { gql } from '@apollo/client';
import { PageInfo, QuerySettings, getPaginatedDataUtil } from './util';
import { KeyValue } from './types';
import { ErrorMessage } from '../constants';

type DictionaryInfo = {
  name: string;
  dictionary: {
    pageInfo: PageInfo;
    results: KeyValue[];
  };
};

type DictionaryQueryResult = {
  site?: {
    siteInfo?: DictionaryInfo;
  };
};

const dictionaryQuery = /* GraphQL */ gql`
  query Dictionary($siteName: String!, $language: String!, $nextCursor: String) {
    site {
      siteInfo(site: $siteName) {
        name
        dictionary(language: $language, after: $nextCursor) {
          pageInfo {
            hasNext
            endCursor
          }
          results {
            key
            value
          }
        }
      }
    }
  }
`;

/**
 * Gets the ID of the JSS App root item for the specified site and language.
 * @param {QuerySettings} querySettings GraphQL Query settings.
 * @param {string} siteName the name of the Sitecore site.
 * @param {string} itemLocale the item language version.
 * @returns an array of dictionary entries for this site.
 * @throws {RangeError} if a valid site name value is not provided.
 * @throws {RangeError} if a valid language value is not provided.
 */
export async function getDictionary(
  querySettings: QuerySettings,
  siteName: string,
  itemLocale: string
): Promise<KeyValue[]> {
  if (!siteName) {
    throw new RangeError(ErrorMessage.siteNameError);
  }

  if (!itemLocale) {
    throw new RangeError(ErrorMessage.languageError);
  }

  const data = await getPaginatedDataUtil<DictionaryQueryResult>(
    querySettings,
    dictionaryQuery,
    {
      siteName: siteName,
      language: itemLocale,
    },
    (x) => x.site?.siteInfo?.dictionary.pageInfo
  );

  return data?.site?.siteInfo?.dictionary.results ?? [];
}
