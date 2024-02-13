import { useState } from "react";
import { useGraphQLClientContext } from "../providers/GraphQLClientProvider";
import { Button } from "../ui/button";
import {
  LoaderIcon,
  ArrowDownRightIcon,
  ArrowRightIcon,
  PackageIcon,
  BookOpenTextIcon,
} from "lucide-react";

export interface BaseItemNode<T extends BaseItemNode<T>> {
  id: string;
  name: string;
  hasChildren: boolean;
  hasLayout: boolean;
  children?: T[];
}

export type RenderItemAsTreeProps<T extends BaseItemNode<T>> = {
  item: T;
  onItemSelected: (item: T) => void;
  fetchData: (item: T) => Promise<T[] | undefined>;
  isSelected: (item: T) => boolean;
};

export function TreeViewer<T extends BaseItemNode<T>>({
  item,
  onItemSelected,
  fetchData,
  isSelected,
}: RenderItemAsTreeProps<T>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState<T[] | undefined>(item.children);
  const [hasChildren, setHasChildren] = useState(item.hasChildren);

  const client = useGraphQLClientContext();

  const loadData = async () => {
    if (!children) {
      setIsLoading(true);
      const children = await fetchData(item);
      setIsLoading(false);
      setChildren(children);
      setHasChildren(!!children?.length);
    }
  };

  if (!client) {
    return (
      <p>
        No environment selected, or selected environment has invalid API key.
        Editing environments are not supported currently, delete and recreate
        it.
      </p>
    );
  }
  return (
    <div className="space-y-1 ml-4">
      <Button
        variant={isSelected(item) ? "default" : "ghost"}
        className="w-full justify-start space-x-1"
        onClick={async () => {
          onItemSelected(item);
          setIsExpanded(true);
          await loadData();
        }}
      >
        {isLoading ? (
          <LoaderIcon />
        ) : isExpanded ? (
          <ArrowDownRightIcon
            onClick={async (e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
            className={hasChildren ? "" : "collapse"}
          />
        ) : (
          <ArrowRightIcon
            onClick={async (e) => {
              e.stopPropagation();
              setIsExpanded(true);
              await loadData();
            }}
            className={hasChildren ? "" : "collapse"}
          />
        )}

        {item.hasLayout ? <BookOpenTextIcon /> : <PackageIcon />}
        <span>{item.name}</span>
      </Button>

      {isExpanded &&
        children?.map((x) => (
          <TreeViewer<T>
            key={x.name}
            item={x}
            onItemSelected={onItemSelected}
            isSelected={isSelected}
            fetchData={fetchData}
          />
        ))}
    </div>
  );
}
