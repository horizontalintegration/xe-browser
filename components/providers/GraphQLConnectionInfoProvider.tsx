'use client';
import { createContext, useContext, useMemo, useState } from 'react';

const ExperienceEdgeUrl = 'https://edge.sitecorecloud.io/api/graphql/v1/';

const EdgePlatformUrl = 'https://edge-platform.sitecorecloud.io';

export interface GraphQLConnectionInfo {
  graphQLEndpointUrl?: string;
  apiKey: string;
  useEdgeContextId: boolean;
}

export interface ResolvedGraphQLConnectionInfo {
  url: string;
  headers?: Record<string, string>;
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

export function useResolvedGraphQLConnectionInfo() {
  const { connectionInfo } = useGraphQLConnectionInfo();
  return useMemo(() => getGraphQLConnectionInfo(connectionInfo), [connectionInfo]);
}

export function GraphQLConnectionInfoProvider({ children }: React.PropsWithChildren) {
  const [connectionInfo, setConnectionInfo] = useState<GraphQLConnectionInfo>();

  return (
    <GraphQLConnectionInfoContext.Provider value={{ connectionInfo, setConnectionInfo }}>
      {children}
    </GraphQLConnectionInfoContext.Provider>
  );
}

function getGraphQLConnectionInfo(
  connectionInfo?: GraphQLConnectionInfo
): ResolvedGraphQLConnectionInfo | undefined {
  if (!connectionInfo?.apiKey) {
    return undefined;
  }
  if (connectionInfo.useEdgeContextId) {
    return {
      url: `${EdgePlatformUrl}/v1/content/api/graphql/v1?sitecoreContextId=${connectionInfo.apiKey}`,
    };
  }
  return {
    url: connectionInfo.graphQLEndpointUrl || ExperienceEdgeUrl,
    headers: {
      sc_apikey: connectionInfo.apiKey ?? '',
    },
  };
}
