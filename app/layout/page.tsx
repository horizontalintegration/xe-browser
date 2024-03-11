'use client';
import DataJsonView from './_components/DataJsonView';
import LayoutTreeView from './_components/LayoutTreeView';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useState } from 'react';
import { SiteInfo } from '../../components/switchers/SiteSwitcher';
import { ItemLocaleSwitcher } from '../../components/switchers/ItemLangageSwitcher';

export default function Page() {
  const [selectedItemId, setSelectedItemId] = useState<string>();

  const [selectedRoutePath, setSelectedRoutePath] = useState<string>();
  const [selectedSite, setSelectedSite] = useState<SiteInfo>();

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full !overflow-y-auto">
      <ResizablePanel className="h-full px-4 !overflow-y-auto">
        <LayoutTreeView
          onItemSelected={(siteInfo, itemId, routePath) => {
            setSelectedSite(siteInfo);
            setSelectedItemId(itemId);
            setSelectedRoutePath(routePath);
          }}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="h-full px-4 !overflow-y-auto">
        <ItemLocaleSwitcher itemId={selectedItemId} />
        {selectedRoutePath && selectedSite?.siteName ? (
          <DataJsonView routePath={selectedRoutePath} siteName={selectedSite?.siteName} />
        ) : null}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
