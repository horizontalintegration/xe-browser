'use client';
import {
  GraphQLConnectionInfo,
  useGraphQLConnectionInfo,
  useResolvedGraphQLConnectionInfo,
} from '@/components/providers/GraphQLConnectionInfoProvider';
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
  connectionInfo: GraphQLConnectionInfo;
};

const defaultValue: GraphQLClientContextType = {
  connectionInfo: { apiKey: '', useEdgeContextId: false },
};

export const GraphQLClientContext = createContext<GraphQLClientContextType>(defaultValue);

export const useGraphQLClientContext = () => {
  const context = useContext(GraphQLClientContext);

  return context;
};

export function GraphQLClientProvider({ children }: GraphQLClientProviderProps) {
  const [client, setClient] = useState<GraphQLClientContextType>(defaultValue);
  const { connectionInfo } = useGraphQLConnectionInfo();
  const resolvedConnectionInfo = useResolvedGraphQLConnectionInfo();
  const querySettings = useQuerySettings();
  useEffect(() => {
    if (!connectionInfo || !resolvedConnectionInfo) {
      return;
    }
    let client: ApolloClient<NormalizedCacheObject>;

    const getClient = async () => {
      client = new ApolloClient({
        link: new BatchHttpLink({
          uri: resolvedConnectionInfo.url,
          headers: resolvedConnectionInfo.headers,
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

        setClient({ client, connectionInfo });
      } catch (err) {
        console.error(err);
        setClient(defaultValue);
      }
    };
    getClient();
    return () => client.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionInfo]);
  return (
    <GraphQLClientContext.Provider value={client}>
      <React.Fragment key={connectionInfo?.apiKey}>{children}</React.Fragment>
    </GraphQLClientContext.Provider>
  );
}
