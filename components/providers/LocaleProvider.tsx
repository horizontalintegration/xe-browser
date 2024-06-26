'use client';
import { useAllLocales } from '@/lib/hooks/use-all-locales';
import useLocalStorage from '@/lib/hooks/use-local-storage';
import { LocaleInfo } from '@/lib/locale/utils';
import { createContext, useContext, useState } from 'react';

type LocaleContextType = {
  systemLocales: string[];
  setSystemLocales: (systemLocales: string[]) => void;
  itemLocale: string;
  setItemLocale: (itemLocale: string) => void;
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

  const validSystemLocales = getValidLocales(allLocaleInfos, systemLocales);

  const [itemLocale, setItemLocale] = useState<string>('en');

  return (
    <LocaleContext.Provider
      value={{
        systemLocales: validSystemLocales,
        setSystemLocales,
        itemLocale,
        setItemLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

function getValidLocales(allLocaleInfos: LocaleInfo[], localeValues: string[]) {
  return allLocaleInfos.length
    ? localeValues.filter((x) => allLocaleInfos.find((l) => l.isoCode === x))
    : localeValues;
}
