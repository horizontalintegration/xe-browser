import { DocumentNode, OperationVariables } from '@apollo/client';
import { ApolloClientType } from './types';
import { isArray, mergeWith } from 'lodash';

const MAX_PAGINATION_LOOP = 20;

export interface QuerySettings {
  client: ApolloClientType;
  logQueries: boolean;
  abortSignal?: AbortSignal;
}

export interface PageInfo {
  hasNext: boolean;
  endCursor: string;
}

export const getPaginatedDataUtil = async <T>(
  querySettings: QuerySettings | null,
  query: DocumentNode,
  variables?: OperationVariables,
  getPageInfo?: (data: T) => PageInfo | undefined
) => {
  if (getPageInfo) {
    validatePaginatedQuery(query);
  }
  if (!querySettings) {
    return null;
  }
  const { client, logQueries, abortSignal } = querySettings;

  if (!client) {
    return null;
  }
  let pageInfo: PageInfo | undefined;
  let finalData: T | null = null;

  let loopCounter = 0;
  do {
    loopCounter++;
    const { data } = await client.query<T>({
      query: query,
      // Add cursor to query if present
      variables: { ...variables, nextCursor: pageInfo?.endCursor },
      context: {
        fetchOptions: { signal: abortSignal },
      },
    });
    if (getPageInfo) {
      pageInfo = getPageInfo(data);
    }
    if (finalData) {
      finalData = mergeWith(finalData, data, arrayMerger);
    } else {
      finalData = data;
    }
  } while (pageInfo?.hasNext && loopCounter < MAX_PAGINATION_LOOP);

  if (loopCounter >= MAX_PAGINATION_LOOP) {
    throw new Error("Max pagination loop reached.  Ensure that you don't have an infinite loop.");
  }
  if (logQueries) {
    console.log('Logging query:', query.loc?.source.body, {
      variables,
      finalData,
    });
  }
  return finalData;
};

export const getDataUtil = async <T>(
  querySettings: QuerySettings | null,
  query: DocumentNode,
  variables?: OperationVariables
) => {
  return getPaginatedDataUtil<T>(querySettings, query, variables, undefined);
};

function validatePaginatedQuery(query: DocumentNode) {
  const queryBody = query.loc?.source.body ?? '';
  if (queryBody.indexOf('$nextCursor: String') < 0) {
    throw new Error(
      'Cannot paginate without a parameter of "$nextCursor: String".  Query: ' + queryBody
    );
  }
  if (queryBody.indexOf('after: $nextCursor') < 0) {
    throw new Error(
      'Cannot paginate without usage of parameter "after: $nextCursor".  Query: ' + queryBody
    );
  }
  if (
    queryBody.indexOf('pageInfo') < 0 ||
    queryBody.indexOf('hasNext') < 0 ||
    queryBody.indexOf('endCursor') < 0
  ) {
    throw new Error(
      `Cannot paginate without "pageInfo { hasNext, endCursor }".  Query: ` + queryBody
    );
  }
}

function arrayMerger(objValue: unknown, srcValue: unknown) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
