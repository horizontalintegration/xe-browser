'use client';
import { useResolvedGraphQLConnectionInfo } from '@/components/providers/GraphQLConnectionInfoProvider';
import { createGraphiQLFetcher, Fetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import 'graphiql/graphiql.css';
import { useEffect, useState } from 'react';

// useState doesn't like functions as direct objects apparently because it calls the function
// when setState is called (with no arguments which fails).
type FetcherWrapper = { fetcher: Fetcher };

export default function GraphQL() {
  const resolvedConnectionInfo = useResolvedGraphQLConnectionInfo();
  const [fetcherWrapper, setFetcherWrapper] = useState<FetcherWrapper>();
  useEffect(() => {
    if (!resolvedConnectionInfo) {
      return;
    }
    const newFetcher = createGraphiQLFetcher({
      url: resolvedConnectionInfo?.url ?? '',
      headers: resolvedConnectionInfo?.headers,
    });
    setFetcherWrapper({ fetcher: newFetcher });
  }, [resolvedConnectionInfo?.url]);

  if (!resolvedConnectionInfo) {
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
