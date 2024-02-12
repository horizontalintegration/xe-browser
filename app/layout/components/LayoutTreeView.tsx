"use client";
import { gql } from "@apollo/client";
import React, { useState } from "react";
import { useGraphQLClientContext } from "../../../components/providers/GraphQLClientProvider";
import { Button } from "../../../components/ui/button";
import {
  ArrowBottomRightIcon,
  ArrowRightIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";
import { SiteInfo, SiteSwitcher } from "./SiteSwitcher";

const GetLayout = gql`
  query GetLayout(
    $site: String!
    $routePath: String! = "/"
    $language: String! = "en"
  ) {
    layout(site: $site, routePath: $routePath, language: $language) {
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
  layout: {
    item: {
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
  onItemSelected: (siteName: SiteInfo, routePath: string) => void;
};
const root: ItemNode = {
  routePath: "/",
  name: "sitecore",
  hasChildren: true,
};

interface ItemNode {
  routePath: string;
  name: string;
  hasChildren: boolean;
  children?: ItemNode[];
}

const LayoutTreeView = ({
  onItemSelected: onElementSelected,
}: LayoutTreeViewProps) => {
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());

  const [site, setSite] = useState<SiteInfo>();
  const item = { ...root };

  return (
    <div>
      <SiteSwitcher onSiteSelected={setSite} />
      {site ? (
        <RenderItem
          site={site}
          item={item}
          onItemSelected={(item) => {
            onElementSelected(site, item.routePath);
          }}
          loadedIds={loadedIds}
          setLoadedIds={setLoadedIds}
        />
      ) : (
        <p>Select a site</p>
      )}
    </div>
  );
};

export default LayoutTreeView;

type RenderItemProps = {
  site: SiteInfo;
  item: ItemNode;
  onItemSelected: (item: ItemNode) => void;
  loadedIds: Set<string>;
  setLoadedIds: (value: Set<string>) => void;
};

function RenderItem({
  site,
  item,
  onItemSelected,
  loadedIds,
  setLoadedIds,
}: RenderItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [children, setChildren] = useState<ItemNode[] | undefined>(
    item.children
  );

  const client = useGraphQLClientContext();
  const fetchData = async (item: ItemNode) => {
    if (!client) {
      return;
    }
    if (loadedIds.has(item.routePath)) {
      return;
    }
    const { data } = await client.query<LayoutData>({
      query: GetLayout,
      variables: {
        site: site.siteName,
        routePath: item.routePath,
      },
    });

    if (data) {
      loadedIds.add(item.routePath);
      setLoadedIds(loadedIds);
      item.children = data.layout.item.children.results.map((x) => ({
        id: x.id,
        name: x.name,
        routePath: x.url.path,
        hasChildren: x.children.results.length > 0,
      }));
      setChildren(item.children);
    }
  };
  if (!client) {
    return (
      <p>
        No environment selected, or selected environment has invalid API key.
        Editing environments are not supported currently, delete and recreate
        it.
      </p>
    );
  }
  return (
    <div className="space-y-1 ml-4">
      <Button
        variant="secondary"
        className="w-full justify-start"
        onClick={() => {
          setIsExpanded(!isExpanded);
          onItemSelected(item);
          fetchData(item);
        }}
      >
        {isExpanded ? (
          <ArrowBottomRightIcon
            className={item.hasChildren ? "" : "collapse"}
          />
        ) : (
          <ArrowRightIcon className={item.hasChildren ? "" : "collapse"} />
        )}

        <FileTextIcon />
        {item.name}
      </Button>

      {isExpanded &&
        children?.map((x) => (
          <RenderItem
            key={x.routePath}
            site={site}
            item={x}
            onItemSelected={onItemSelected}
            loadedIds={loadedIds}
            setLoadedIds={setLoadedIds}
          />
        ))}
    </div>
  );
}
