"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import EnvironmentSwitcher from "@/components/key-management/EnvironmentSwitcher";
import { MainNav } from "./components/MainNav";
import { useState } from "react";
import GraphQLClientProvider from "@/components/providers/GraphQLClientProvider";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

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
  const [apiKey, setApiKey] = useState<string>("");
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <EnvironmentSwitcher setApiKey={setApiKey} />
              <MainNav className="mx-6" />
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <GraphQLClientProvider apiKey={apiKey}>
              {children}
            </GraphQLClientProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
