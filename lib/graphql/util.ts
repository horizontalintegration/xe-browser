import { DocumentNode, OperationVariables } from '@apollo/client';
import { ApolloClientType } from './types';

export interface QuerySettings {
  client: ApolloClientType;
  logQueries: boolean;
  abortSignal?: AbortSignal;
}

export const getDataUtil = async <T>(
  querySettings: QuerySettings | null,
  query: DocumentNode,
  variables?: OperationVariables
) => {
  if (!querySettings) {
    return null;
  }
  const { client, logQueries, abortSignal } = querySettings;

  if (!client) {
    return null;
  }

  const { data } = await client.query<T>({
    query: query,
    variables: variables,
    context: {
      fetchOptions: { signal: abortSignal },
    },
  });

  if (logQueries) {
    console.log('Logging query:', query.loc?.source.body, {
      variables,
      data,
    });
  }
  return data;
};
