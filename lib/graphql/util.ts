import { DocumentNode, OperationVariables } from "@apollo/client";
import { ApolloClientType } from "./types";

export const getDataUtil = async <T>(
  client: ApolloClientType,
  query: DocumentNode,
  variables?: OperationVariables
) => {
  if (!client) {
    return null;
  }
  const { data } = await client.query<T>({
    query: query,
    variables: variables,
  });

  return data;
};
