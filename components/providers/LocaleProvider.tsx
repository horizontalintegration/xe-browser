'use client';
import { useAllLocales } from '@/lib/hooks/use-all-locales';
import useLocalStorage from '@/lib/hooks/use-local-storage';
import { LocaleInfo } from '@/lib/locale/utils';
import { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';

type LocaleContextType = {
  systemLocales: string[];
  setSystemLocales: Dispatch<SetStateAction<string[]>>;
  itemLocale: string;
  setItemLocale: Dispatch<SetStateAction<string>>;
};

const LocaleContext = createContext<LocaleContextType>({
  systemLocales: ['en'],
  setSystemLocales: () => {},
  itemLocale: 'en',
  setItemLocale: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}
export function LocaleProvider({ children }: React.PropsWithChildren) {
  const [systemLocales, setSystemLocales] = useLocalStorage<string[]>('systemLocale', ['en']);

  const { allLocaleInfos } = useAllLocales();

  const validSystemLocales = useMemo(
    () => getValidLocales(allLocaleInfos, systemLocales),
    [allLocaleInfos, systemLocales]
  );

  const [itemLocale, setItemLocale] = useState<string>('en');

  const locale = useMemo(
    () => ({
      systemLocales: validSystemLocales,
      setSystemLocales,
      itemLocale,
      setItemLocale,
    }),
    [itemLocale, setSystemLocales, validSystemLocales]
  );
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

function getValidLocales(allLocaleInfos: LocaleInfo[], localeValues: string[]) {
  return allLocaleInfos.length
    ? localeValues.filter((x) => allLocaleInfos.find((l) => l.isoCode === x))
    : localeValues;
}
