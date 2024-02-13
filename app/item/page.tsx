"use client";
import DataJsonView from "./components/DataJsonView";
import ItemTreeView from "./components/ItemTreeView";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useState } from "react";

export default function Home() {
  const [selectedItemId, setSelectedItemId] = useState<string>();

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full !overflow-y-auto">
      <ResizablePanel className="h-full !overflow-y-auto">
        <ItemTreeView
          onElementSelected={(element) => setSelectedItemId(element)}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="h-full !overflow-y-auto">
        <DataJsonView itemId={selectedItemId} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}