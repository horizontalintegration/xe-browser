'use client';
import { createContext, useContext, useState } from 'react';

type LogQueriesContextType = {
  logQueries: boolean;
  setLogQueries: (logQueries: boolean) => void;
};

export const LogQueriesContext = createContext<LogQueriesContextType>({
  logQueries: false,
  setLogQueries: () => {},
});

export function useLogQueries() {
  return useContext(LogQueriesContext);
}

export function LogQueriesProvider({ children }: React.PropsWithChildren) {
  const [logQueries, setLogQueries] = useState<boolean>(false);

  return (
    <LogQueriesContext.Provider value={{ logQueries, setLogQueries }}>
      {children}
    </LogQueriesContext.Provider>
  );
}
