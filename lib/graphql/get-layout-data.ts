import { gql } from '@apollo/client';
import { QuerySettings, getDataUtil } from './util';
import { LayoutItemResponse, LayoutResponse } from './types';

export const getLayoutItemData = async (
  querySettings: QuerySettings,
  itemLocale: string,
  itemId?: string
) => {
  const data = await getDataUtil<LayoutItemResponse>(querySettings, GetLayoutItemData, {
    path: itemId,
    itemLocale,
  });

  return data?.item?.rendered?.sitecore;
};
const GetLayoutItemData = gql`
  query GetLayoutItemData($path: String! = "/sitecore", $itemLocale: String!) {
    item(path: $path, language: $itemLocale) {
      rendered
    }
  }
`;

export const getLayoutData = async (
  querySettings: QuerySettings,
  systemLocale: string,
  siteName: string,
  routePath: string
) => {
  const data = await getDataUtil<LayoutResponse>(querySettings, GetLayoutData, {
    routePath,
    systemLocale,
    site: siteName,
  });

  return data?.layout?.item?.rendered?.sitecore;
};

const GetLayoutData = gql`
  query GetLayoutData($site: String!, $routePath: String! = "/", $systemLocale: String!) {
    layout(site: $site, routePath: $routePath, language: $systemLocale) {
      item {
        rendered
      }
    }
  }
`;
