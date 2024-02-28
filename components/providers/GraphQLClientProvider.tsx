'use client';
import { useApiKey } from '@/components/providers/ApiKeyProvider';
import { getDataUtil } from '@/lib/graphql/util';
import { useQuerySettings } from '@/lib/hooks/use-query-settings';
import { ApolloClient, InMemoryCache, NormalizedCacheObject, gql } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';

import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';

export type GraphQLClientProviderProps = Readonly<{
  children: React.ReactNode;
}>;

type GraphQLClientContextType = {
  client?: ApolloClient<NormalizedCacheObject>;
  apiKey: string;
};

const defaultValue = { apiKey: 'none' };
export const GraphQLClientContext = createContext<GraphQLClientContextType>(defaultValue);

export const useGraphQLClientContext = () => {
  const context = useContext(GraphQLClientContext);

  return context;
};

export function GraphQLClientProvider({ children }: GraphQLClientProviderProps) {
  const [client, setClient] = useState<GraphQLClientContextType>(defaultValue);
  const { apiKey } = useApiKey();

  const querySettings = useQuerySettings();
  useEffect(() => {
    if (!apiKey) {
      return;
    }
    let client: ApolloClient<NormalizedCacheObject>;

    const getClient = async () => {
      client = new ApolloClient({
        link: new BatchHttpLink({
          uri: 'https://edge.sitecorecloud.io/api/graphql/v1/',
          headers: {
            sc_apikey: apiKey,
          },
          batchInterval: 20, // Wait no more than 20ms after first batched operation
        }),
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'no-cache',
          },
          query: {
            fetchPolicy: 'no-cache',
          },
        },
      });

      try {
        // We only care about whether it errors so the language doens't matter, even if it's not found is fine
        await getDataUtil(
          querySettings,
          gql`
            query {
              item(path: "/sitecore", language: "en") {
                path
              }
            }
          `
        );

        setClient({ client, apiKey });
      } catch (err) {
        console.error(err);
        setClient(defaultValue);
      }
    };
    getClient();
    return () => client.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);
  return (
    <GraphQLClientContext.Provider value={client}>
      <React.Fragment key={apiKey}>{children}</React.Fragment>
    </GraphQLClientContext.Provider>
  );
}
