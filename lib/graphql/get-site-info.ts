import { gql } from '@apollo/client';
import { QuerySettings, getDataUtil } from './util';
import { GetAllSiteInfoResult, KeyValue } from './types';
import { ErrorMessage } from '../constants';

/*
 * GraphQL query that returns the basic info for all sites
 */
const basicSiteInfoQuery = /* GraphQL */ gql`
  query SiteInfo($language: String!) {
    site {
      siteInfoCollection {
        name
        hostname
        rootPath
        robots
        sitemap
        attributes {
          key
          value
        }
        errorHandling(language: $language) {
          serverErrorPage {
            url {
              url
              path
            }
            path
            id
          }
          serverErrorPagePath
          notFoundPage {
            url {
              url
              path
            }
            path
            id
          }
          notFoundPagePath
        }
      }
    }
  }
`;

type BasicErrorPageInfo = {
  url: { url: string; path: string };
  path: string;
  id: string;
};
type BasicSiteInfo = {
  name: string;
  hostname: string;
  rootPath: string;
  robots: string;
  sitemap: string;
  attributes: KeyValue[];
  errorHandling: {
    serverErrorPage?: BasicErrorPageInfo;
    serverErrorPagePath: string;
    notFoundPage?: BasicErrorPageInfo;
    notFoundPagePath: string;
  };
};

/**
 * The schema of data returned in response to an app root query request
 */
type SiteInfoQueryResult = {
  site?: {
    siteInfoCollection?: BasicSiteInfo[];
  };
};

/**
 * Gets the ID of the JSS App root item for the specified site and language.
 * @param {GraphQLClient} client that fetches data from a GraphQL endpoint.
 * @param {string} siteName the name of the Sitecore site.
 * @param {string} language the item language version.
 * @param {string} [jssAppTemplateId] optional template ID of the app root item. If not
 * specified, the ID of the "/sitecore/templates/Foundation/JavaScript Services/App"
 * item is used.
 * @returns the root item ID of the JSS App in Sitecore. Returns null if the app root item is not found.
 * @throws {RangeError} if a valid site name value is not provided.
 * @throws {RangeError} if a valid language value is not provided.
 * @summary This function intentionally avoids throwing an error if a root item is not found,
 * leaving that decision up to implementations.
 */
export async function getAllSiteInfo(
  querySettings: QuerySettings,
  itemLocale: string
): Promise<GetAllSiteInfoResult[]> {
  if (!itemLocale) {
    throw new RangeError(ErrorMessage.languageError);
  }

  const data = await getDataUtil<SiteInfoQueryResult>(querySettings, basicSiteInfoQuery, {
    language: itemLocale,
  });

  return (
    data?.site?.siteInfoCollection?.map(
      (x): GetAllSiteInfoResult => ({
        siteName: x.name,
        language: itemLocale,
        hostname: x.hostname,
        rootPath: x.rootPath,
        robots: x.robots,
        sitemap: x.sitemap,
        enableFieldLanguageFallback: !!x.attributes.find(
          (a) => a.key === 'enableFieldLanguageFallback'
        )?.value,
        enableItemLanguageFallback: !!x.attributes.find(
          (a) => a.key === 'enableItemLanguageFallback'
        )?.value,
        targetHostName: (x.attributes.find((a) => a.key === 'targetHostName')?.value ??
          '') as string,
        serverErrorPageItemPath: x.errorHandling.serverErrorPage?.path,
        serverErrorPageId: x.errorHandling.serverErrorPage?.id,
        serverErrorPageRoutePath: x.errorHandling.serverErrorPagePath,
        notFoundPageItemPath: x.errorHandling.notFoundPage?.path,
        notFoundPageId: x.errorHandling.notFoundPage?.id,
        notFoundPageRoutePath: x.errorHandling.notFoundPagePath,
      })
    ) ?? []
  );
}
