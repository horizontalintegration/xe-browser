"use client";
import DataJsonView from "./components/DataJsonView";
import LayoutTreeView from "./components/LayoutTreeView";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useState } from "react";
import { SiteInfo } from "./components/SiteSwitcher";

export default function Page() {
  const [selectedItem, setSelectedItem] = useState<string>();
  const [selectedSite, setSelectedSite] = useState<SiteInfo>();

  return (
    <main>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <LayoutTreeView
            onItemSelected={(siteInfo, item) => {
              setSelectedSite(siteInfo);
              setSelectedItem(item);
            }}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          {selectedItem && selectedSite?.siteName ? (
            <DataJsonView
              routePath={selectedItem}
              siteName={selectedSite?.siteName}
            />
          ) : null}
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
