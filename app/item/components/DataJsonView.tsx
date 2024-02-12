"use client";
import { DocumentNode, gql } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useGraphQLClientContext } from "../../../components/providers/GraphQLClientProvider";
import { JsonView, collapseAllNested } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { getLayoutItemData } from "@/lib/graphql/get-layout-data";
import { getFieldData } from "@/lib/graphql/get-field-data";
import { getItemMetaData } from "@/lib/graphql/get-meta-data";

const GetMetaData = gql`
  query GetItemData($path: String! = "/sitecore", $language: String! = "en") {
    item(path: $path, language: $language) {
      id
      name
      path
      template {
        id
        name
      }
    }
  }
`;

const GetFieldData = gql`
  query GetItemData($path: String! = "/sitecore", $language: String! = "en") {
    item(path: $path, language: $language) {
      fields {
        name
        jsonValue
      }
    }
  }
`;

const GetLayoutData = gql`
  query GetItemData($path: String! = "/sitecore", $language: String! = "en") {
    item(path: $path, language: $language) {
      rendered
    }
  }
`;

const queryLookup: {
  [K in QueryType]: DocumentNode;
} = {
  meta: GetMetaData,
  fields: GetFieldData,
  layout: GetLayoutData,
};

export type DataJsonViewProps = {
  itemId?: string;
};

export type QueryType = "meta" | "fields" | "layout";
export type SelectedTabValue = "meta" | "fields" | "sitecore-context" | "route";

const DataJsonView = ({ itemId }: DataJsonViewProps) => {
  const [metaData, setMetaData] = useState<any>();
  const [fieldData, setFieldData] = useState<any>();
  const [sitecoreContextData, setSitecoreContextData] = useState<any>();
  const [routeData, setRouteData] = useState<any>();
  const [selectedTab, setSelectedTab] = useState<SelectedTabValue>("meta");

  const client = useGraphQLClientContext();

  useEffect(() => {
    async function innerFetch() {
      let data;
      switch (selectedTab) {
        case "meta":
          data = await getItemMetaData(client, itemId);
          setMetaData(data);
          break;
        case "fields":
          data = await getFieldData(client, itemId);
          setFieldData(data);
          break;
        case "sitecore-context":
        case "route":
          data = await getLayoutItemData(client, itemId);
          setSitecoreContextData(
            data?.context ?? { error: "Item does not have layout" }
          );
          setRouteData(data?.route ?? { error: "Item does not have layout" });
          break;
      }
    }
    innerFetch();
  }, [client, itemId, selectedTab]);

  return (
    <Tabs
      defaultValue={selectedTab}
      onValueChange={(value) => setSelectedTab(value as SelectedTabValue)}
    >
      <TabsList>
        <TabsTrigger value="meta">Meta Data</TabsTrigger>
        <TabsTrigger value="fields">Fields</TabsTrigger>
        <TabsTrigger value="sitecore-context">Sitecore Context</TabsTrigger>
        <TabsTrigger value="route">Route</TabsTrigger>
      </TabsList>
      <TabsContent value="meta">
        <JsonView data={metaData} />
      </TabsContent>
      <TabsContent value="fields">
        <JsonView data={fieldData} />
      </TabsContent>
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
