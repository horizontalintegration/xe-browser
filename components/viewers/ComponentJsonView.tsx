"use client";
import React, { useState } from "react";
import { JsonView } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";

import { ComponentResponse } from "@/lib/graphql/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export type ComponentsJsonViewProps = {
  components: ComponentResponse[];
};

export type SelectedTabValue = "sitecore-context" | "route";

const ComponentsJsonView = ({ components }: ComponentsJsonViewProps) => {
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentResponse>();
  const [
    excludePartialDesignDynamicPlaceholder,
    setExcludePartialDesignDynamicPlaceholder,
  ] = useState<boolean>(true);

  if (!components.length) {
    return <JsonView data={{ error: "Item does not have components" }} />;
  }
  return (
    <div>
      <Label className="px-4 py-2 flex space-x-2">
        <span>Exclude PartialDesignDynamicPlaceholder</span>
        <Checkbox
          checked={excludePartialDesignDynamicPlaceholder}
          onCheckedChange={(x) =>
            setExcludePartialDesignDynamicPlaceholder(x === true)
          }
        />
      </Label>
      <Select
        defaultValue={selectedComponent?.uid}
        onValueChange={(uid) =>
          setSelectedComponent(components.find((x) => x.uid === uid))
        }
      >
        <SelectTrigger
          className={cn(
            "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate"
          )}
          aria-label="Select component"
        >
          <SelectValue placeholder="Select a component">
            <span className={cn("ml-2")}>
              {selectedComponent?.componentName} ({selectedComponent?.uid})
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {components
            .filter(
              (x) =>
                !excludePartialDesignDynamicPlaceholder ||
                x.componentName !== "PartialDesignDynamicPlaceholder"
            )
            .map((component) => (
              <SelectItem key={component.uid} value={component.uid}>
                <div className="flex items-center gap-3">
                  {component?.componentName} ({component?.uid})
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <JsonView data={selectedComponent ?? {}} />
    </div>
  );
};

export default ComponentsJsonView;
