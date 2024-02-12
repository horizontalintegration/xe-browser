"use client";
import React, { useEffect, useState } from "react";
import { useGraphQLClientContext } from "@/components/providers/GraphQLClientProvider";
import { JsonView, collapseAllNested } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getLayoutData } from "@/lib/graphql/get-layout-data";

export type DataJsonViewProps = {
  siteName: string;
  routePath: string;
};

export type SelectedTabValue = "sitecore-context" | "route";

const DataJsonView = ({ siteName, routePath }: DataJsonViewProps) => {
  const [sitecoreContextData, setSitecoreContextData] = useState<any>();
  const [routeData, setRouteData] = useState<any>();
  const [selectedTab, setSelectedTab] = useState<SelectedTabValue>("route");

  const client = useGraphQLClientContext();

  useEffect(() => {
    async function innerFetch() {
      let data;
      switch (selectedTab) {
        case "sitecore-context":
        case "route":
          data = await getLayoutData(client, siteName, routePath);
          setSitecoreContextData(
            data?.context ?? { error: "Item does not have layout" }
          );
          setRouteData(data?.route ?? { error: "Item does not have layout" });
          break;
      }
    }
    innerFetch();
  }, [client, siteName, routePath, selectedTab]);

  return (
    <Tabs
      defaultValue={selectedTab}
      onValueChange={(value) => setSelectedTab(value as SelectedTabValue)}
    >
      <TabsList>
        <TabsTrigger value="sitecore-context">Sitecore Context</TabsTrigger>
        <TabsTrigger value="route">Route</TabsTrigger>
      </TabsList>
      <TabsContent value="sitecore-context">
        <JsonView data={sitecoreContextData} />
      </TabsContent>
      <TabsContent value="route">
        <JsonView data={routeData} shouldExpandNode={collapseAllNested} />
      </TabsContent>
    </Tabs>
  );
};

export default DataJsonView;
