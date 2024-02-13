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
import { ItemLangageSwitcher } from "../../components/language/ItemLangageSwitcher";

export default function Page() {
  const [selectedItemId, setSelectedItemId] = useState<string>();

  const [selectedRoutePath, setSelectedRoutePath] = useState<string>();
  const [selectedSite, setSelectedSite] = useState<SiteInfo>();

  return (
    <main>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <LayoutTreeView
            onItemSelected={(siteInfo, itemId, routePath) => {
              setSelectedSite(siteInfo);
              setSelectedItemId(itemId);
              setSelectedRoutePath(routePath);
            }}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ItemLangageSwitcher itemId={selectedItemId} />
          {selectedRoutePath && selectedSite?.siteName ? (
            <DataJsonView
              routePath={selectedRoutePath}
              siteName={selectedSite?.siteName}
            />
          ) : null}
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
