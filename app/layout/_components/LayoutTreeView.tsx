'use client';
import { gql } from '@apollo/client';
import React, { useState } from 'react';
import { SiteInfo, SiteSwitcher } from '../../../components/switchers/SiteSwitcher';
import { BaseItemNode, TreeViewer } from '@/components/viewers/TreeViewer';
import { useLocale } from '@/components/providers/LocaleProvider';
import { getDataUtil } from '@/lib/graphql/util';
import { useQuerySettings } from '@/lib/hooks/use-query-settings';

const GetLayout = gql`
  query GetLayout($site: String!, $routePath: String! = "/", $systemLocale: String!) {
    layout(site: $site, routePath: $routePath, language: $systemLocale) {
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
  id: 'root',
  routePath: '/',
  name: 'Home',
  hasLayout: true,
  hasChildren: true,
};

interface ItemNode extends BaseItemNode<ItemNode> {
  routePath: string;
}

const LayoutTreeView = ({ onItemSelected }: LayoutTreeViewProps) => {
  const [selectedItem, setSelectedItem] = useState<ItemNode>();
  const [site, setSite] = useState<SiteInfo>();
  const item = { ...root };

  const { systemLocales } = useLocale();

  const querySettings = useQuerySettings();

  const fetchData = async (item: ItemNode) => {
    if (!querySettings?.client || !site) {
      return;
    }
    item.children = [];
    const addedItemIds = new Set<string>();
    for (let index = 0; index < systemLocales.length; index++) {
      const systemLocale = systemLocales[index];
      const data = await getDataUtil<LayoutData>(querySettings, GetLayout, {
        site: site.siteName,
        routePath: item.routePath,
        systemLocale,
      });

      const loadedItem = data?.layout?.item;
      if (loadedItem) {
        item.id = loadedItem.id;

        data.layout?.item?.children.results.forEach((x) => {
          if (addedItemIds.has(x.id)) {
            return;
          }

          addedItemIds.add(x.id);
          item.children?.push({
            id: x.id,
            name: x.name,
            routePath: x.url.path,
            hasLayout: true,
            hasChildren: x.children.results.length > 0,
          });
        });
      }
    }

    return item.children;
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
