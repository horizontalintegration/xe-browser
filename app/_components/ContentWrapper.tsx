'use client';
import { useGraphQLConnectionInfo } from '@/components/providers/GraphQLConnectionInfoProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import React from 'react';

/**
 * Wraps content so that it rerenders when API key changes
 */
export function ContentWrapper({ children }: React.PropsWithChildren) {
  const { connectionInfo } = useGraphQLConnectionInfo();
  const { systemLocales } = useLocale();
  return (
    <React.Fragment key={`${connectionInfo?.apiKey}-${systemLocales.join()}`}>
      {children}
    </React.Fragment>
  );
}
