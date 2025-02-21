'use client';
import { gql } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { BaseItemNode, TreeViewer } from '@/components/viewers/TreeViewer';
import { useLocale } from '@/components/providers/LocaleProvider';
import { PageInfo, getDataUtil, getPaginatedDataUtil } from '@/lib/graphql/util';
import { useQuerySettings } from '@/lib/hooks/use-query-settings';
import { SiteInfo } from '@/lib/hooks/use-site-list';
import { SiteSwitcher } from '@/components/switchers/SiteSwitcher';
import { WithLoader } from '@/components/helpers/Loader';

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
          children(first: 1) {
            results {
              id
              name
            }
          }
        }
      }
      # Originally we just checked the "rendered" property of each child,
      # but that pulled way too much data, so this will just get the ID.
      childrenWithLayout: children(first: 10, hasLayout: true, after: $nextCursor) {
        results {
          id
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
        children: {
          results: {
            id: string;
            name: string;
          }[];
        };
      }[];
    };

    childrenWithLayout: {
      results: {
        id: string;
      }[];
    };
  };
}

const GetSiteHomeId = gql`
  query GetSiteHomeId($site: String!, $routePath: String = "/", $systemLocale: String!) {
    layout(site: $site, routePath: $routePath, language: $systemLocale) {
      item {
        id
        name
      }
    }
  }
`;

interface LayoutData {
  layout?: {
    item?: {
      id: string;
      name: string;
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
  const [site, setSite] = useState<SiteInfo>();

  const { systemLocales } = useLocale();
  const querySettings = useQuerySettings();

  const fetchData = useCallback(
    async (item: ItemNode) => {
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
              hasLayout: !!data.item?.childrenWithLayout.results.find((y) => x.id === y.id),
              hasChildren: x.children.results.length > 0,
            });
          });
        }
      }

      return item.children;
    },
    [querySettings, systemLocales]
  );
  const rootItem = useRootItem(site, fetchData);

  useEffect(() => {
    if (rootItem) {
      fetchData(rootItem).then((data) => (rootItem.children = data));
    }
  }, [fetchData, rootItem]);
  return (
    <div>
      <SiteSwitcher onSiteSelected={setSite} allowNullSite />
      <WithLoader loading={!rootItem}>
        {!!rootItem ? (
          <TreeViewer<ItemNode>
            item={rootItem}
            onItemSelected={(item) => {
              setSelectedItem(item);
              onElementSelected(item.id);
            }}
            isSelected={(item) => selectedItem?.id === item.id}
            fetchData={fetchData}
          />
        ) : null}
      </WithLoader>
    </div>
  );
};

export default ItemTreeView;

function useRootItem(
  site: SiteInfo | undefined,
  fetchData: (item: ItemNode) => Promise<ItemNode[] | undefined>
) {
  const { systemLocales } = useLocale();
  const querySettings = useQuerySettings();

  const [rootItem, setRootItem] = useState<ItemNode>();

  useEffect(() => {
    const getLayoutData = async () => {
      if (site) {
        setRootItem(undefined);
        for (let index = 0; index < systemLocales.length; index++) {
          const systemLocale = systemLocales[index];
          const data = await getDataUtil<LayoutData>(querySettings, GetSiteHomeId, {
            site: site.siteName,
            routePath: '/',
            systemLocale,
          });
          if (data?.layout?.item) {
            const newRoot: ItemNode = {
              id: data.layout.item.id,
              name: data.layout.item.name,
              hasLayout: true,
              hasChildren: true,
            };
            newRoot.children = await fetchData(newRoot);
            setRootItem(newRoot);
            return;
          }
        }
      } else {
        setRootItem({ ...root });
      }
    };
    getLayoutData();
  }, [fetchData, querySettings, site, systemLocales]);

  return rootItem;
}
