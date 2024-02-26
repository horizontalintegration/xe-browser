import { gql } from "@apollo/client";
import { getDataUtil } from "./util";
import { ApolloClientType, LayoutItemResponse, LayoutResponse } from "./types";

export const getLayoutItemData = async (
  client: ApolloClientType,
  itemLocale: string,
  itemId?: string
) => {
  const data = await getDataUtil<LayoutItemResponse>(
    client,
    GetLayoutItemData,
    { path: itemId, itemLocale }
  );

  return data?.item?.rendered?.sitecore;
};
const GetLayoutItemData = gql`
  query GetLayoutItemData(
    $path: String! = "/sitecore"
    $itemLocale: String!
  ) {
    item(path: $path, language: $itemLocale) {
      rendered
    }
  }
`;

export const getLayoutData = async (
  client: ApolloClientType,
  systemLocale: string,
  siteName: string,
  routePath: string
) => {
  const data = await getDataUtil<LayoutResponse>(client, GetLayoutData, {
    routePath,
    systemLocale,
    site: siteName,
  });

  return data?.layout?.item?.rendered?.sitecore;
};

const GetLayoutData = gql`
  query GetLayoutData(
    $site: String!
    $routePath: String! = "/"
    $systemLocale: String!
  ) {
    layout(site: $site, routePath: $routePath, language: $systemLocale) {
      item {
        rendered
      }
    }
  }
`;
