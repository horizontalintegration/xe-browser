'use client';
import useLocalStorage from '@/lib/hooks/use-local-storage';
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

  const [itemLocale, setItemLocale] = useState<string>('en');

  const locale = useMemo(
    () => ({
      systemLocales: systemLocales,
      setSystemLocales,
      itemLocale,
      setItemLocale,
    }),
    [itemLocale, setSystemLocales, systemLocales]
  );
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
