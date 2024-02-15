"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

// This exists purely so Tailwind knows that the class is used and doesn't strip out the class
export type DarkMode = "dark";

export type AccountThemes = "default" | "red" | "blue" | "green";

type ThemeProviderContextType = {
  setAccountTheme: (accountTheme: AccountThemes) => void;
};

const ThemeProviderContext = React.createContext<ThemeProviderContextType>({
  setAccountTheme: () => {},
});

export const useAccountTheme = () => {
  return React.useContext(ThemeProviderContext);
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [accountTheme, setAccountTheme] = React.useState<AccountThemes>();
  React.useEffect(() => {
    if (accountTheme) document.body.classList.add(accountTheme);
    return () => {
      if (accountTheme) document.body.classList.remove(accountTheme ?? "");
    };
  }, [accountTheme]);
  return (
    <ThemeProviderContext.Provider value={{ setAccountTheme }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ThemeProviderContext.Provider>
  );
}
