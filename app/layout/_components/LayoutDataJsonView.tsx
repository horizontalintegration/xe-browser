'use client';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getLayoutData } from '@/lib/graphql/get-layout-data';
import { deepSearch } from '@/lib/utils/object-utils';
import { ComponentResponse } from '@/lib/graphql/types';
import ComponentsJsonView from '../../../components/viewers/ComponentJsonView';
import { useLocale } from '@/components/providers/LocaleProvider';
import { JsonViewWrapper } from '@/components/viewers/JsonViewWrapper';
import { useQuerySettings } from '@/lib/hooks/use-query-settings';

export type DataJsonViewProps = {
  siteName: string;
  routePath: string;
};

export type SelectedTabValue = 'sitecore-context' | 'route' | 'components';

const LayoutDataJsonView = ({ siteName, routePath }: DataJsonViewProps) => {
  const [sitecoreContextData, setSitecoreContextData] = useState<object>();
  const [routeData, setRouteData] = useState<object>();
  const [componentsData, setComponentsData] = useState<ComponentResponse[]>([]);
  const [selectedTab, setSelectedTab] = useState<SelectedTabValue>('route');

  const { itemLocale } = useLocale();

  const querySettings = useQuerySettings();

  useEffect(() => {
    async function innerFetch() {
      let data;
      if (!querySettings?.client) {
        return;
      }
      switch (selectedTab) {
        case 'sitecore-context':
        case 'components':
        case 'route':
          data = await getLayoutData(querySettings, itemLocale, siteName, routePath);

          const componentData = deepSearch<ComponentResponse>(
            data,
            (x) => typeof x.componentName === 'string' && typeof x.uid === 'string'
          );
          setComponentsData(componentData);
          setSitecoreContextData(data?.context ?? { error: 'Item does not have layout' });
          setRouteData(data?.route ?? { error: 'Item does not have layout' });
          break;
      }
    }
    innerFetch();
  }, [querySettings, itemLocale, siteName, routePath, selectedTab]);

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
        <JsonViewWrapper data={sitecoreContextData} />
      </TabsContent>
      <TabsContent value="route">
        <JsonViewWrapper data={routeData} collapsed={1} />
      </TabsContent>
      <TabsContent value="components">
        <ComponentsJsonView key={routePath} components={componentsData} />
      </TabsContent>
    </Tabs>
  );
};

export default LayoutDataJsonView;
