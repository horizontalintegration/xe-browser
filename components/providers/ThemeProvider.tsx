'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

// This exists purely so Tailwind knows that the class is used and doesn't strip out the class
export type DarkMode = 'dark';

export type EnvThemes = 'default' | 'red' | 'blue' | 'green';

type ThemeProviderContextType = {
  setEnvTheme: (envTheme: EnvThemes) => void;
};

const ThemeProviderContext = React.createContext<ThemeProviderContextType>({
  setEnvTheme: () => {},
});

export const useEnvTheme = () => {
  return React.useContext(ThemeProviderContext);
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [envTheme, setEnvTheme] = React.useState<EnvThemes>();
  React.useLayoutEffect(() => {
    if (envTheme) document.body.classList.add(envTheme);
    return () => {
      if (envTheme) document.body.classList.remove(envTheme ?? '');
    };
  }, [envTheme]);
  return (
    <ThemeProviderContext.Provider value={{ setEnvTheme: setEnvTheme }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ThemeProviderContext.Provider>
  );
}
