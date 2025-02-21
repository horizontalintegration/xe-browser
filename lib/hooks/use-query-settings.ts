import { useGraphQLClientContext } from '@/components/providers/GraphQLClientProvider';
import { useLogQueries } from '@/components/providers/LogQueriesProvider';
import { QuerySettings } from '../graphql/util';
import { RefObject, useMemo } from 'react';
import { useGraphQLConnectionInfo } from '@/components/providers/GraphQLConnectionInfoProvider';

export function useQuerySettings(
  abortControllerRef?: RefObject<AbortController>
): QuerySettings | null {
  const {
    client,
    connectionInfo: { apiKey: clientApiKey },
  } = useGraphQLClientContext();

  const { connectionInfo } = useGraphQLConnectionInfo();
  const currentApiKey = connectionInfo?.apiKey;

  const { logQueries } = useLogQueries();

  return useMemo(() => {
    // The currentApiKey gets updated before clientApiKey.
    // If they are not in sync that means we're a not-ready state.
    if (clientApiKey !== currentApiKey) {
      return null;
    }
    return {
      client,
      apiKey: clientApiKey,
      logQueries,
      abortSignal: abortControllerRef?.current?.signal,
    };
    // We can't add abortSignal as a dependency because it changes every time.
  }, [clientApiKey, currentApiKey, client, logQueries, abortControllerRef]);
}
