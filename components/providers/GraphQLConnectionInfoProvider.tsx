'use client';
import { createContext, useContext, useState } from 'react';

export const DefaultGraphQLEndpointUrl = 'https://edge.sitecorecloud.io/api/graphql/v1/';

export interface GraphQLConnectionInfo {
  graphQLEndpointUrl?: string;
  apiKey: string;
}

interface GraphQLConnectionInfoContextType {
  connectionInfo?: GraphQLConnectionInfo;
  setConnectionInfo: (connectionInfo: GraphQLConnectionInfo) => void;
}

const GraphQLConnectionInfoContext = createContext<GraphQLConnectionInfoContextType>({
  setConnectionInfo: () => {},
});

export function useGraphQLConnectionInfo() {
  return useContext(GraphQLConnectionInfoContext);
}

export function GraphQLConnectionInfoProvider({ children }: React.PropsWithChildren) {
  const [connectionInfo, setConnectionInfo] = useState<GraphQLConnectionInfo>();

  return (
    <GraphQLConnectionInfoContext.Provider value={{ connectionInfo, setConnectionInfo }}>
      {children}
    </GraphQLConnectionInfoContext.Provider>
  );
}
