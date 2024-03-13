'use client';
import {
  DefaultGraphQLEndpointUrl,
  useGraphQLConnectionInfo,
} from '@/components/providers/GraphQLConnectionInfoProvider';
import { createGraphiQLFetcher, Fetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import 'graphiql/graphiql.css';
import { useEffect, useState } from 'react';

// useState doesn't like functions as direct objects apparently because it calls the function
// when setState is called (with no arguments which fails).
type FetcherWrapper = { fetcher: Fetcher };

export default function GraphQL() {
  const { connectionInfo } = useGraphQLConnectionInfo();
  const [fetcherWrapper, setFetcherWrapper] = useState<FetcherWrapper>();
  const apiKey = connectionInfo?.apiKey;
  const graphQLEndpointUrl = connectionInfo?.graphQLEndpointUrl;
  useEffect(() => {
    if (!apiKey || !graphQLEndpointUrl) {
      return;
    }
    const newFetcher = createGraphiQLFetcher({
      url: graphQLEndpointUrl || DefaultGraphQLEndpointUrl,
      headers: {
        sc_apikey: apiKey ?? '',
      },
    });
    setFetcherWrapper({ fetcher: newFetcher });
  }, [apiKey, graphQLEndpointUrl]);

  if (!apiKey || !graphQLEndpointUrl) {
    return <p>No environment selected, or selected environment has invalid API key or endpoint.</p>;
  }
  if (!fetcherWrapper) {
    return <p>Loading GraphQL Fetcher</p>;
  }
  return (
    <div className="h-full">
      <GraphiQL fetcher={fetcherWrapper.fetcher} />
    </div>
  );
}
