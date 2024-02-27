'use client';
import { gql } from '@apollo/client';
import React, { useState } from 'react';
import { useGraphQLClientContext } from '../../../components/providers/GraphQLClientProvider';
import { BaseItemNode, TreeViewer } from '@/components/viewers/TreeViewer';
import { useLocale } from '@/components/providers/LocaleProvider';
const GetItems = gql`
  query GetItem($path: String! = "/sitecore", $systemLocale: String!) {
    item(path: $path, language: $systemLocale) {
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
  item?: {
    id: string;
    name: string;
    rendered?: object;
    children: {
      results: {
        id: string;
        name: string;
        rendered?: object;
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
  id: '/sitecore',
  name: 'sitecore',
  hasLayout: false,
  hasChildren: true,
};

interface ItemNode extends BaseItemNode<ItemNode> {}

const ItemTreeView = ({ onElementSelected }: ItemTreeViewProps) => {
  const [selectedItem, setSelectedItem] = useState<ItemNode>();
  const item = { ...root };
  const client = useGraphQLClientContext();
  const { systemLocales } = useLocale();
  const fetchData = async (item: ItemNode) => {
    if (!client) {
      return;
    }

    item.children = [];
    const addedItemIds = new Set<string>();
    for (let index = 0; index < systemLocales.length; index++) {
      const systemLocale = systemLocales[index];
      const { data } = await client.query<ItemData>({
        query: GetItems,
        variables: {
          path: item.id,
          systemLocale,
        },
      });

      if (data) {
        data.item?.children.results.forEach((x) => {
          if (addedItemIds.has(x.id)) {
            return;
          }
          addedItemIds.add(x.id);
          item.children?.push({
            id: x.id,
            name: x.name,
            hasLayout: !!x.rendered,
            hasChildren: x.children.results.length > 0,
          });
        });
      }
    }

    return item.children;
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
