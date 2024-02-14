"use client";
import { useApiKey } from "@/components/providers/ApiKeyProvider";
import { createGraphiQLFetcher, Fetcher } from "@graphiql/toolkit";
import { GraphiQL } from "graphiql";
import "graphiql/graphiql.css";
import { useEffect, useState } from "react";

// useState doesn't like functions as direct objects apparently because it calls the function
// when setState is called (with no arguments which fails).
type FetcherWrapper = { fetcher: Fetcher };

export default function GraphQL() {
  const { apiKey } = useApiKey();
  const [fetcherWrapper, setFetcherWrapper] = useState<FetcherWrapper>();

  useEffect(() => {
    if (!apiKey) {
      return;
    }
    const newFetcher = createGraphiQLFetcher({
      url: "https://edge.sitecorecloud.io/api/graphql/v1/",
      headers: {
        sc_apikey: apiKey ?? "",
      },
    });
    setFetcherWrapper({ fetcher: newFetcher });
  }, [apiKey]);

  if (!apiKey) {
    return (
      <p>
        No environment selected, or selected environment has invalid API key.
        Editing environments are not supported currently, delete and recreate
        it.
      </p>
    );
  }
  if (!fetcherWrapper) {
    return <p>Loading GraphQL Fetcher</p>;
  }
  return (
    <div className="h-full">
      <GraphiQL fetcher={fetcherWrapper.fetcher} />
    </div>
  );
}
