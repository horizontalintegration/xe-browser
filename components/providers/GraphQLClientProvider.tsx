"use client";
import { useApiKey } from "@/app/components/ApiKeyProvider";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
} from "@apollo/client";
import React from "react";
import { useState, useEffect, createContext, useContext } from "react";

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
    const getClient = async () => {
      client = new ApolloClient({
        uri: "https://edge.sitecorecloud.io/api/graphql/v1/",
        headers: {
          sc_apikey: apiKey,
        },
        cache: new InMemoryCache(),
      });
      try {
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
