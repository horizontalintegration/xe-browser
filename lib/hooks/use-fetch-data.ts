import { ApolloError } from '@apollo/client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { QuerySettings } from '../graphql/util';
import { useQuerySettings } from './use-query-settings';

/**
 * Performs data fetching with loading and abort.  Ensure `fetchData` function is wrapped in `useCallback`.
 * @param fetchData ensure this dependency is either static or wrapped in `useCallback`.
 * @returns
 */
export function useFetchData<TResult>(
  fetchData: (querySettings: QuerySettings) => Promise<TResult>
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<TResult>();

  const abortController = useRef(new AbortController());

  const querySettings = useQuerySettings(abortController);

  const getData = useCallback(async () => {
    if (!querySettings?.client) {
      return;
    }
    abortController.current = new AbortController();
    querySettings.abortSignal = abortController.current.signal;

    setLoading(true);
    setData(undefined);
    try {
      const results = await fetchData(querySettings);

      setData(results);
    } catch (error) {
      if (error instanceof ApolloError) {
        if (error.networkError?.name === 'AbortError') {
          console.warn('Request aborted', error);
        } else {
          console.error(error);
        }
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchData, querySettings]);

  useEffect(() => {
    getData();
  }, [getData]);

  return {
    loading,
    data,
  };
}
