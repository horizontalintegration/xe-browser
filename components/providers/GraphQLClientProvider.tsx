import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
} from "@apollo/client";
import { useState, useEffect, createContext, useContext } from "react";

export type GraphQLClientProviderProps = Readonly<{
  apiKey: string;
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
  apiKey,
  children,
}: GraphQLClientProviderProps) {
  const [client, setClient] = useState<
    ApolloClient<NormalizedCacheObject> | undefined
  >(undefined);

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
    <div>
      <GraphQLClientContext.Provider value={client}>
        <div key={apiKey}>{children}</div>
      </GraphQLClientContext.Provider>
    </div>
  );
}
