import { gql } from "@apollo/client";
import { ApolloClientType, Fields } from "./types";
import { getDataUtil } from "./util";

export const getFieldData = async (
  client: ApolloClientType,
  itemId?: string
) => {
  const data = await getDataUtil<FieldResponse>(client, GetFieldData, {
    path: itemId,
  });

  return data;
};

const GetFieldData = gql`
  query GetItemData($path: String! = "/sitecore", $language: String! = "en") {
    item(path: $path, language: $language) {
      fields {
        name
        jsonValue
      }
    }
  }
`;

interface FieldResponse {
  item?: {
    fields: Fields;
  };
}
