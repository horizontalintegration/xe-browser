"use client";
import React, { useEffect, useState } from "react";
import { useGraphQLClientContext } from "@/components/providers/GraphQLClientProvider";
import { JsonView, collapseAllNested } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getLayoutData } from "@/lib/graphql/get-layout-data";
import { deepSearch } from "@/lib/utils/object-utils";
import { ComponentResponse } from "@/lib/graphql/types";
import ComponentsJsonView from "../../../components/viewers/ComponentJsonView";
import { useLocale } from "@/components/providers/LocaleProvider";

export type DataJsonViewProps = {
  siteName: string;
  routePath: string;
};

export type SelectedTabValue = "sitecore-context" | "route" | "components";

const DataJsonView = ({ siteName, routePath }: DataJsonViewProps) => {
  const [sitecoreContextData, setSitecoreContextData] = useState<any>();
  const [routeData, setRouteData] = useState<any>();
  const [componentsData, setComponentsData] = useState<ComponentResponse[]>([]);
  const [selectedTab, setSelectedTab] = useState<SelectedTabValue>("route");

  const client = useGraphQLClientContext();

  const { itemLocale } = useLocale();
  useEffect(() => {
    async function innerFetch() {
      let data;
      switch (selectedTab) {
        case "sitecore-context":
        case "components":
        case "route":
          data = await getLayoutData(client, itemLocale, siteName, routePath);

          const componentData = deepSearch<ComponentResponse>(
            data,
            (x) => !!x.componentName
          );
          setComponentsData(componentData);
          setSitecoreContextData(
            data?.context ?? { error: "Item does not have layout" }
          );
          setRouteData(data?.route ?? { error: "Item does not have layout" });
          break;
      }
    }
    innerFetch();
  }, [client, itemLocale, siteName, routePath, selectedTab]);

  return (
    <Tabs
      defaultValue={selectedTab}
      onValueChange={(value) => setSelectedTab(value as SelectedTabValue)}
    >
      <TabsList>
        <TabsTrigger value="sitecore-context">Sitecore Context</TabsTrigger>
        <TabsTrigger value="route">Route</TabsTrigger>
        <TabsTrigger value="components">Components</TabsTrigger>
      </TabsList>
      <TabsContent value="sitecore-context">
        <JsonView data={sitecoreContextData} />
      </TabsContent>
      <TabsContent value="route">
        <JsonView data={routeData} shouldExpandNode={collapseAllNested} />
      </TabsContent>
      <TabsContent value="components">
        <ComponentsJsonView key={routePath} components={componentsData} />
      </TabsContent>
    </Tabs>
  );
};

export default DataJsonView;
