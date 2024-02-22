"use client";
import { useApiKey } from "@/components/providers/ApiKeyProvider";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
  defaultDataIdFromObject,
} from "@apollo/client";

import React from "react";
import { useState, useEffect, createContext, useContext } from "react";
import { useLanguage } from "./LanguageProvider";

export type GraphQLClientProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export const GraphQLClientContext = createContext<
  ApolloClient<NormalizedCacheObject> | undefined
>(undefined);

export const useGraphQLClientContext = () => {
  const context = useContext(GraphQLClientContext);

  return context;
};

export default function GraphQLClientProvider({
  children,
}: GraphQLClientProviderProps) {
  const [client, setClient] = useState<
    ApolloClient<NormalizedCacheObject> | undefined
  >(undefined);
  const { apiKey } = useApiKey();

  useEffect(() => {
    if (!apiKey) {
      return;
    }
    let client: ApolloClient<NormalizedCacheObject>;
    const cache = new InMemoryCache({
      dataIdFromObject(responseObject) {
        switch (responseObject.__typename) {
          default:
            return (
              defaultDataIdFromObject(responseObject) +
              // Add language to the cache key.  The was cahsing an issue
              // where the wrong language version would get returned
              (responseObject?.language as any)?.name
            );
        }
      },
    });
    const getClient = async () => {
      client = new ApolloClient({
        uri: "https://edge.sitecorecloud.io/api/graphql/v1/",
        headers: {
          sc_apikey: apiKey,
        },
        cache: cache,
      });

      try {
        // We only care about whether it errors so the language doens't matter, even if it's not found is fine
        await client.query({
          query: gql`
            query {
              item(path: "/sitecore", language: "en") {
                path
              }
            }
          `,
        });

        setClient(client);
      } catch (err) {
        console.error(err);
        setClient(undefined);
      }
    };
    getClient();
    return () => client.stop();
  }, [apiKey]);
  return (
    <GraphQLClientContext.Provider value={client}>
      <React.Fragment key={apiKey}>{children}</React.Fragment>
    </GraphQLClientContext.Provider>
  );
}
