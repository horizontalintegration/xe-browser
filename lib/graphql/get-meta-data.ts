import { gql } from "@apollo/client";
import { ApolloClientType } from "./types";
import { getDataUtil } from "./util";

export const getItemMetaData = async (
  client: ApolloClientType,
  itemLocale: string,
  itemId?: string
) => {
  const data = await getDataUtil<MetaResponse>(client, GetMetaData, {
    path: itemId,
    itemLocale,
  });

  return data;
};

const GetMetaData = gql`
  query GetItemData($path: String! = "/sitecore", $itemLocale: String!) {
    item(path: $path, language: $itemLocale) {
      id
      name
      path
      url {
        url
        path
      }
      version
      template {
        id
        name
      }
      language {
        name
        englishName
      }
    }
  }
`;

interface MetaResponse {
  item?: {
    id: string;
    name: string;
    path: string;
    url: {
      url: string;
      path: string;
    };
    version: number;
    template: {
      id: string;
      name: string;
    };
    language: {
      name: string;
      englishName: string;
    };
  };
}
