"use client";
import { useApiKey } from "@/components/providers/ApiKeyProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import React from "react";

export function ContentWrapper({ children }: React.PropsWithChildren) {
  const { apiKey } = useApiKey();
  const { systemLanguages } = useLanguage();
  return (
    <React.Fragment key={`${apiKey}-${systemLanguages.join()}`}>{children}</React.Fragment>
  );
}
