import { Inter } from "next/font/google";
import "./globals.css";
import EnvironmentSwitcher from "@/components/key-management/EnvironmentSwitcher";
import { MainNav } from "./components/MainNav";
import GraphQLClientProvider from "@/components/providers/GraphQLClientProvider";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { cn } from "@/lib/utils";
import { ApiKeyProvider } from "@/components/providers/ApiKeyProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { SystemLangageSwitcher } from "../components/language/SystemLangageSwitcher";
import { ContentWrapper } from "./components/ContentWrapper";
import { InfoTooltip } from "@/components/helpers/Info";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

if (process.env.NODE_ENV !== "production") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={cn(inter.className, "h-full", "m-0")}>
      <body className={cn(inter.className, "h-full", "m-0")}>
        <div className="flex flex-col h-full">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ApiKeyProvider>
              <GraphQLClientProvider>
                <LanguageProvider>
                  <div className="border-b flex-initial flex items-center">
                    <div className="flex h-16 items-center px-4">
                      <EnvironmentSwitcher />
                      <MainNav className="mx-6" />
                    </div>
                    <div className="ml-auto flex items-center space-x-4">
                      <span>System language</span>
                      <InfoTooltip>
                        <p>
                          Note: This is the default language for your Sitecore
                          instance.
                        </p>
                        <p>
                          It is assumed that every item exists in this language.
                          It should be rare to need to change this
                        </p>
                      </InfoTooltip>

                      <SystemLangageSwitcher />
                    </div>
                  </div>
                  <div className="space-y-4 p-8 pt-6 flex flex-col flex-auto overflow-y-auto">
                    <ContentWrapper>{children}</ContentWrapper>
                  </div>
                  <footer className=" flex-initial basis-1">Footer</footer>
                </LanguageProvider>
              </GraphQLClientProvider>
            </ApiKeyProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
