import { gql } from "@apollo/client";
import { ApolloClientType } from "./types";
import { getDataUtil } from "./util";

export const getItemMetaData = async (
  client: ApolloClientType,
  itemLanguage: string,
  itemId?: string
) => {
  const data = await getDataUtil<MetaResponse>(client, GetMetaData, {
    path: itemId,
    itemLanguage,
  });

  return data;
};

const GetMetaData = gql`
  query GetItemData($path: String! = "/sitecore", $itemLanguage: String!) {
    item(path: $path, language: $itemLanguage) {
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
