"use client";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { createContext, useContext, useState } from "react";

type LanguageContextType = {
  systemLanguages: string[];
  setSystemLanguages: (systemLanguages: string[]) => void;
  itemLanguage: string;
  setItemLanguage: (itemLanguage: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  systemLanguages: ["en"],
  setSystemLanguages: () => {},
  itemLanguage: "en",
  setItemLanguage: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}
export function LanguageProvider({ children }: React.PropsWithChildren) {
  const [systemLanguages, setSystemLanguages] = useLocalStorage<string[]>(
    "systemLanguage",
    ["en"]
  );

  const [itemLanguage, setItemLanguage] = useState<string>("en");

  return (
    <LanguageContext.Provider
      value={{
        systemLanguages,
        setSystemLanguages,
        itemLanguage,
        setItemLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
