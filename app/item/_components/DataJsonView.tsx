'use client';
import React, { useEffect, useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { getLayoutItemData } from '@/lib/graphql/get-layout-data';
import { FieldResponse, getFieldData } from '@/lib/graphql/get-field-data';
import { getItemMetaData } from '@/lib/graphql/get-meta-data';
import { ComponentResponse } from '@/lib/graphql/types';
import FieldDataView from './FieldDataView';
import { deepSearch } from '@/lib/utils/object-utils';
import ComponentsJsonView from '@/components/viewers/ComponentJsonView';
import { useLocale } from '@/components/providers/LocaleProvider';
import { JsonViewWrapper } from '@/components/viewers/JsonViewWrapper';
import { useQuerySettings } from '@/lib/hooks/use-query-settings';

export type DataJsonViewProps = {
  itemId?: string;
};

export type QueryType = 'meta' | 'fields' | 'layout';
export type SelectedTabValue = 'meta' | 'fields' | 'sitecore-context' | 'route' | 'components';

const DataJsonView = ({ itemId }: DataJsonViewProps) => {
  const [metaData, setMetaData] = useState<object | null>();
  const [fieldData, setFieldData] = useState<FieldResponse | null>(null);
  const [sitecoreContextData, setSitecoreContextData] = useState<object | null>();
  const [componentsData, setComponentsData] = useState<ComponentResponse[]>([]);
  const [routeData, setRouteData] = useState<object>();
  const [selectedTab, setSelectedTab] = useState<SelectedTabValue>('meta');

  const { itemLocale } = useLocale();

  const querySettings = useQuerySettings();

  useEffect(() => {
    async function innerFetch() {
      if (!querySettings?.client) {
        return;
      }
      let data;
      switch (selectedTab) {
        case 'meta':
          data = await getItemMetaData(querySettings, itemLocale, itemId);
          setMetaData(data);
          break;
        case 'fields':
          data = await getFieldData(querySettings, itemLocale, itemId);
          setFieldData(data);
          break;
        case 'sitecore-context':
        case 'route':
        case 'components':
          data = await getLayoutItemData(querySettings, itemLocale, itemId);

          const componentData = deepSearch<ComponentResponse>(data, (x) => !!x?.componentName);
          setComponentsData(componentData);
          setSitecoreContextData(data?.context ?? { error: 'Item does not have layout' });
          setRouteData(data?.route ?? { error: 'Item does not have layout' });
          break;
      }
    }
    innerFetch();
  }, [querySettings, itemLocale, itemId, selectedTab]);

  return (
    <Tabs
      key={itemId + itemLocale}
      defaultValue={selectedTab}
      onValueChange={(value) => setSelectedTab(value as SelectedTabValue)}
    >
      <TabsList>
        <TabsTrigger value="meta">Meta Data</TabsTrigger>
        <TabsTrigger value="fields">Fields</TabsTrigger>
        <TabsTrigger value="sitecore-context">Sitecore Context</TabsTrigger>
        <TabsTrigger value="route">Route</TabsTrigger>
        <TabsTrigger value="components">Components</TabsTrigger>
      </TabsList>
      <TabsContent value="meta">
        <JsonViewWrapper data={metaData} />
      </TabsContent>
      <TabsContent value="fields">
        <FieldDataView data={fieldData} />
      </TabsContent>
      <TabsContent value="sitecore-context">
        <JsonViewWrapper data={sitecoreContextData} />
      </TabsContent>
      <TabsContent value="route">
        <JsonViewWrapper data={routeData} collapsed={1} />
      </TabsContent>
      <TabsContent value="components">
        <ComponentsJsonView components={componentsData} />
      </TabsContent>
    </Tabs>
  );
};

export default DataJsonView;
