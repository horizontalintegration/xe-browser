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
const GetItems = gql`
  query GetItem($path: String! = "/sitecore", $language: String! = "en") {
    item(path: $path, language: $language) {
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

interface ItemNode {
  id: string;
  name: string;
  hasLayout: boolean;
  hasChildren: boolean;
  children?: ItemNode[];
}

const ItemTreeView = ({ onElementSelected }: ItemTreeViewProps) => {
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());

  const item = { ...root };
  return (
    <RenderItem
      item={item}
      onItemSelected={(item) => {
        onElementSelected(item.id);
      }}
      loadedIds={loadedIds}
      setLoadedIds={setLoadedIds}
    />
  );
};

export default ItemTreeView;

type RenderItemProps = {
  item: ItemNode;
  onItemSelected: (item: ItemNode) => void;
  loadedIds: Set<string>;
  setLoadedIds: (value: Set<string>) => void;
};

function RenderItem({
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
    if (loadedIds.has(item.id)) {
      return;
    }
    const { data } = await client.query<ItemData>({
      query: GetItems,
      variables: {
        path: item.id,
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

        <FileTextIcon className={item.hasLayout ? "" : "collapse"} />
        {item.name}
      </Button>

      {isExpanded &&
        children?.map((x) => (
          <RenderItem
            key={x.id}
            item={x}
            onItemSelected={onItemSelected}
            loadedIds={loadedIds}
            setLoadedIds={setLoadedIds}
          />
        ))}
    </div>
  );
}
