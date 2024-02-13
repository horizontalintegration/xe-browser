"use client";
import { useApiKey } from "@/components/providers/ApiKeyProvider";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { GraphiQL } from "graphiql";
import "graphiql/graphiql.css";

export default function GraphQL() {
  const { apiKey } = useApiKey();
  const fetcher = createGraphiQLFetcher({
    url: "https://edge.sitecorecloud.io/api/graphql/v1/",
    headers: {
      sc_apikey: apiKey ?? "",
    },
  });
  if (!apiKey) {
    return (
      <p>
        No environment selected, or selected environment has invalid API key.
        Editing environments are not supported currently, delete and recreate
        it.
      </p>
    );
  }
  return (
    <div className="h-full">
      <GraphiQL fetcher={fetcher} />
    </div>
  );
}
