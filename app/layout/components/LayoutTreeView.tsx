"use client";
import { gql } from "@apollo/client";
import React, { useState } from "react";
import { useGraphQLClientContext } from "../../../components/providers/GraphQLClientProvider";
import { SiteInfo, SiteSwitcher } from "./SiteSwitcher";
import { BaseItemNode, TreeViewer } from "@/components/viewers/TreeViewer";
import { useLanguage } from "@/components/providers/LanguageProvider";

const GetLayout = gql`
  query GetLayout(
    $site: String!
    $routePath: String! = "/"
    $systemLanguage: String!
  ) {
    layout(site: $site, routePath: $routePath, language: $systemLanguage) {
      item {
        id
        name
        url {
          path
        }
        children(hasLayout: true, first: 100) {
          results {
            id
            name
            url {
              path
            }
            rendered
            children(hasLayout: true, first: 1) {
              results {
                id
              }
            }
          }
        }
      }
    }
  }
`;

interface LayoutData {
  layout?: {
    item?: {
      id: string;
      name: string;
      url: {
        path: string;
      };
      children: {
        results: {
          id: string;
          name: string;
          url: {
            path: string;
          };
          children: {
            results: {
              id: string;
            }[];
          };
        }[];
      };
    };
  };
}

export type LayoutTreeViewProps = {
  onItemSelected: (siteName: SiteInfo, itemId: string, routePath: string) => void;
};
const root: ItemNode = {
  id: "root",
  routePath: "/",
  name: "Home",
  hasLayout: true,
  hasChildren: true,
};

interface ItemNode extends BaseItemNode<ItemNode> {
  routePath: string;
}

const LayoutTreeView = ({ onItemSelected }: LayoutTreeViewProps) => {
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<ItemNode>();
  const [site, setSite] = useState<SiteInfo>();
  const item = { ...root };

  const client = useGraphQLClientContext();
  const { systemLanguage } = useLanguage();
  const fetchData = async (item: ItemNode) => {
    if (!client || !site) {
      return;
    }
    if (item.id && loadedIds.has(item.id)) {
      return;
    }
    const { data } = await client.query<LayoutData>({
      query: GetLayout,
      variables: {
        site: site.siteName,
        routePath: item.routePath,
        systemLanguage: systemLanguage,
      },
    });

    const loadedItem = data.layout?.item;
    if (loadedItem) {
      loadedIds.add(loadedItem.id);
      setLoadedIds(loadedIds);
      item.id = loadedItem.id;
      item.children = data.layout?.item?.children.results.map((x) => ({
        id: x.id,
        name: x.name,
        routePath: x.url.path,
        hasLayout: true,
        hasChildren: x.children.results.length > 0,
      }));
      return item.children;
    }
  };
  return (
    <div>
      <SiteSwitcher onSiteSelected={setSite} />
      {site ? (
        <TreeViewer<ItemNode>
          key={site.siteName}
          item={item}
          onItemSelected={(item) => {
            setSelectedItem(item);
            onItemSelected(site, item.id, item.routePath);
          }}
          isSelected={(item) => selectedItem?.routePath === item.routePath}
          fetchData={fetchData}
        />
      ) : (
        <p>Select a site</p>
      )}
    </div>
  );
};

export default LayoutTreeView;
