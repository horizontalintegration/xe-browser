import { gql } from "@apollo/client";
import { getDataUtil } from "./util";
import { ApolloClientType, LayoutItemResponse, LayoutResponse } from "./types";

export const getLayoutItemData = async (
  client: ApolloClientType,
  itemLanguage: string,
  itemId?: string
) => {
  const data = await getDataUtil<LayoutItemResponse>(
    client,
    GetLayoutItemData,
    { path: itemId, itemLanguage }
  );

  return data?.item?.rendered?.sitecore;
};
const GetLayoutItemData = gql`
  query GetLayoutItemData(
    $path: String! = "/sitecore"
    $itemLanguage: String!
  ) {
    item(path: $path, language: $itemLanguage) {
      rendered
    }
  }
`;

export const getLayoutData = async (
  client: ApolloClientType,
  systemLanguage: string,
  siteName: string,
  routePath: string
) => {
  const data = await getDataUtil<LayoutResponse>(client, GetLayoutData, {
    routePath,
    systemLanguage,
    site: siteName,
  });

  return data?.layout?.item?.rendered?.sitecore;
};

const GetLayoutData = gql`
  query GetLayoutData(
    $site: String!
    $routePath: String! = "/"
    $systemLanguage: String!
  ) {
    layout(site: $site, routePath: $routePath, language: $systemLanguage) {
      item {
        rendered
      }
    }
  }
`;
