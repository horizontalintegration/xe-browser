import { gql } from "@apollo/client";
import { ApolloClientType } from "./types";
import { getDataUtil } from "./util";

export const getItemMetaData = async (
  client: ApolloClientType,
  itemId?: string
) => {
  const data = await getDataUtil<MetaResponse>(client, GetMetaData, {
    path: itemId,
  });

  return data;
};

const GetMetaData = gql`
  query GetItemData($path: String! = "/sitecore", $language: String! = "en") {
    item(path: $path, language: $language) {
      id
      name
      path
      template {
        id
        name
      }
    }
  }
`;

interface MetaResponse {
  item?: {
    id: string;
    name: string;
    path: string;
    template: {
      id: string;
      name: string;
    };
  };
}
