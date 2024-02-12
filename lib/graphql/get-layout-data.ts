import { gql } from "@apollo/client";
import { getDataUtil } from "./util";
import { ApolloClientType, LayoutItemResponse, LayoutResponse } from "./types";

export const getLayoutItemData = async (
  client: ApolloClientType,
  itemId?: string
) => {
  const data = await getDataUtil<LayoutItemResponse>(
    client,
    GetLayoutItemData,
    { path: itemId }
  );

  return data?.item?.rendered?.sitecore;
};

export const getLayoutData = async (
  client: ApolloClientType,
  siteName: string,
  routePath: string
) => {
  const data = await getDataUtil<LayoutResponse>(client, GetLayoutData, {
    routePath,
    site: siteName,
  });

  return data?.layout?.item?.rendered?.sitecore;
};

const GetLayoutItemData = gql`
  query GetLayoutItemData(
    $path: String! = "/sitecore"
    $language: String! = "en"
  ) {
    item(path: $path, language: $language) {
      rendered
    }
  }
`;

const GetLayoutData = gql`
  query GetLayoutData(
    $site: String!
    $routePath: String! = "/"
    $language: String! = "en"
  ) {
    layout(site: $site, routePath: $routePath, language: $language) {
      item {
        rendered
      }
    }
  }
`;
