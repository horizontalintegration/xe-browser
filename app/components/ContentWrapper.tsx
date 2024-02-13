"use client";
import { useApiKey } from "@/components/providers/ApiKeyProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import React from "react";

export function ContentWrapper({ children }: React.PropsWithChildren) {
  const { apiKey } = useApiKey();
  const { systemLanguage } = useLanguage();
  return (
    <React.Fragment key={`${apiKey}-${systemLanguage}`}>{children}</React.Fragment>
  );
}
