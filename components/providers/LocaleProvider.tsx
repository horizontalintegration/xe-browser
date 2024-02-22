"use client";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { createContext, useContext, useState } from "react";

type LocaleContextType = {
  systemLocales: string[];
  setSystemLocales: (systemLocales: string[]) => void;
  itemLocale: string;
  setItemLocale: (itemLocale: string) => void;
};

const LocaleContext = createContext<LocaleContextType>({
  systemLocales: ["en"],
  setSystemLocales: () => {},
  itemLocale: "en",
  setItemLocale: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}
export function LocaleProvider({ children }: React.PropsWithChildren) {
  const [systemLocales, setSystemLocales] = useLocalStorage<string[]>(
    "systemLocale",
    ["en"]
  );

  const [itemLocale, setItemLocale] = useState<string>("en");

  return (
    <LocaleContext.Provider
      value={{
        systemLocales,
        setSystemLocales,
        itemLocale,
        setItemLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}
