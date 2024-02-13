import { Inter } from "next/font/google";
import "./globals.css";
import EnvironmentSwitcher from "@/components/key-management/EnvironmentSwitcher";
import { MainNav } from "./components/MainNav";
import GraphQLClientProvider from "@/components/providers/GraphQLClientProvider";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { cn } from "@/lib/utils";
import { ApiKeyProvider } from "./components/ApiKeyProvider";

const inter = Inter({ subsets: ["latin"] });

if (process.env.NODE_ENV !== "production") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.className, "h-full", "m-0")}>
      <body className={cn(inter.className, "h-full", "m-0")}>
        <div className="flex flex-col h-full">
          <ApiKeyProvider>
            <div className="border-b flex-initial">
              <div className="flex h-16 items-center px-4">
                <EnvironmentSwitcher />
                <MainNav className="mx-6" />
              </div>
            </div>
            <div className="space-y-4 p-8 pt-6 flex flex-col flex-auto overflow-y-auto">
              <GraphQLClientProvider>{children}</GraphQLClientProvider>
            </div>
            <footer className=" flex-initial basis-1">Footer</footer>
          </ApiKeyProvider>
        </div>
      </body>
    </html>
  );
}
