"use client";
import { createContext, useContext, useState } from "react";

type ApiKeyContextType = {
  apiKey?: string;
  setApiKey: (apiKey: string) => void;
};

const ApiKeyContext = createContext<ApiKeyContextType>({
  setApiKey: () => {},
});

export function useApiKey() {
  return useContext(ApiKeyContext);
}
export function ApiKeyProvider({ children }: React.PropsWithChildren) {
  const [apiKey, setApiKey] = useState<string>();

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}
