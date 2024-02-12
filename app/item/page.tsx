"use client";
import DataJsonView from "@/app/item/components/DataJsonView";
import ItemTreeView from "@/app/item/components/ItemTreeView";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useState } from "react";

export default function Home() {
  const [selectedItemId, setSelectedItemId] = useState<string>();

  return (
    <main>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <ItemTreeView
            onElementSelected={(element) => setSelectedItemId(element)}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <DataJsonView itemId={selectedItemId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
