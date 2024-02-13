"use client";
import { gql } from "@apollo/client";
import React, { useState } from "react";
import { useGraphQLClientContext } from "../../../components/providers/GraphQLClientProvider";
import { BaseItemNode, TreeViewer } from "@/components/viewers/TreeViewer";
import { useLanguage } from "@/components/providers/LanguageProvider";
const GetItems = gql`
  query GetItem($path: String! = "/sitecore", $systemLanguage: String!) {
    item(path: $path, language: $systemLanguage) {
      id
      name
      rendered
      children(first: 100) {
        results {
          id
          name
          rendered
          children(first: 1) {
            results {
              id
              name
            }
          }
        }
      }
    }
  }
`;

interface ItemData {
  item: {
    id: string;
    name: string;
    rendered: any;
    children: {
      results: {
        id: string;
        name: string;
        rendered: any;
        children: {
          results: {
            id: string;
            name: string;
          }[];
        };
      }[];
    };
  };
}

export type ItemTreeViewProps = {
  onElementSelected: (id: string) => void;
};

const root: ItemNode = {
  id: "/sitecore",
  name: "sitecore",
  hasLayout: false,
  hasChildren: true,
};

interface ItemNode extends BaseItemNode<ItemNode> {}

const ItemTreeView = ({ onElementSelected }: ItemTreeViewProps) => {
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<ItemNode>();
  const item = { ...root };
  const client = useGraphQLClientContext();
  const { systemLanguage } = useLanguage();
  const fetchData = async (item: ItemNode) => {
    if (!client) {
      return;
    }
    if (loadedIds.has(item.id)) {
      return;
    }
    const { data } = await client.query<ItemData>({
      query: GetItems,
      variables: {
        path: item.id,
        systemLanguage: systemLanguage,
      },
    });

    if (data) {
      loadedIds.add(item.id);
      setLoadedIds(loadedIds);
      item.children = data.item.children.results.map((x) => ({
        id: x.id,
        name: x.name,
        hasLayout: x.rendered,
        hasChildren: x.children.results.length > 0,
      }));
      return item.children;
    }
  };
  return (
    <TreeViewer<ItemNode>
      item={item}
      onItemSelected={(item) => {
        setSelectedItem(item);
        onElementSelected(item.id);
      }}
      isSelected={(item) => selectedItem?.id === item.id}
      fetchData={fetchData}
    />
  );
};

export default ItemTreeView;
