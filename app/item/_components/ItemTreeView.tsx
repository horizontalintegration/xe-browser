'use client';
import { gql } from '@apollo/client';
import React, { useState } from 'react';
import { BaseItemNode, TreeViewer } from '@/components/viewers/TreeViewer';
import { useLocale } from '@/components/providers/LocaleProvider';
import { PageInfo, getPaginatedDataUtil } from '@/lib/graphql/util';
import { useQuerySettings } from '@/lib/hooks/use-query-settings';

const GetItems = gql`
  query GetItem($path: String = "/sitecore", $systemLocale: String!, $nextCursor: String) {
    item(path: $path, language: $systemLocale) {
      id
      name
      rendered
      children(first: 10, after: $nextCursor) {
        pageInfo {
          hasNext
          endCursor
        }
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
      pageInfo: PageInfo;
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
  const { systemLocales } = useLocale();
  const querySettings = useQuerySettings();
  const fetchData = async (item: ItemNode) => {
    if (!querySettings?.client) {
      return;
    }

    item.children = [];
    const addedItemIds = new Set<string>();
    for (let index = 0; index < systemLocales.length; index++) {
      const systemLocale = systemLocales[index];
      const data = await getPaginatedDataUtil<ItemData>(
        querySettings,
        GetItems,
        {
          path: item.id,
          systemLocale,
        },
        (x) => x.item?.children.pageInfo
      );

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
