"use client";
import { createContext, useContext, useState } from "react";

type LanguageContextType = {
  systemLanguage: string;
  setSystemLanguage: (systemLanguage: string) => void;
  itemLanguage: string;
  setItemLanguage: (itemLanguage: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  systemLanguage: "en",
  setSystemLanguage: () => {},
  itemLanguage: "en",
  setItemLanguage: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}
export function LanguageProvider({ children }: React.PropsWithChildren) {
  const [systemLanguage, setSystemLanguage] = useState<string>("en");
  const [itemLanguage, setItemLanguage] = useState<string>("en");

  return (
    <LanguageContext.Provider
      value={{
        systemLanguage,
        setSystemLanguage,
        itemLanguage,
        setItemLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
