'use client';
import { useApiKey } from '@/components/providers/ApiKeyProvider';
import { useLocale } from '@/components/providers/LocaleProvider';
import React from 'react';

export function ContentWrapper({ children }: React.PropsWithChildren) {
  const { apiKey } = useApiKey();
  const { systemLocales } = useLocale();
  return <React.Fragment key={`${apiKey}-${systemLocales.join()}`}>{children}</React.Fragment>;
}
