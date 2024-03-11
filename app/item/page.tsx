'use client';
import { ItemLocaleSwitcher } from '../../components/switchers/ItemLangageSwitcher';
import DataJsonView from './_components/DataJsonView';
import ItemTreeView from './_components/ItemTreeView';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useState } from 'react';

export default function Home() {
  const [selectedItemId, setSelectedItemId] = useState<string>();

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full !overflow-y-auto">
      <ResizablePanel className="h-full px-4 !overflow-y-auto">
        <ItemTreeView onElementSelected={(element) => setSelectedItemId(element)} />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="h-full px-4 !overflow-y-auto">
        <ItemLocaleSwitcher itemId={selectedItemId} />
        <DataJsonView itemId={selectedItemId} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
