import { useCallback, useEffect, useState } from 'react';
import { useGraphQLClientContext } from '../providers/GraphQLClientProvider';
import { Button } from '../ui/button';
import { ArrowDownRightIcon, ArrowRightIcon, PackageIcon, BookOpenTextIcon } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../ui/context-menu';
import { WithLoader } from '../helpers/Loader';

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

export function TreeViewer<T extends BaseItemNode<T>>({ ...props }: RenderItemAsTreeProps<T>) {
  return (
    <div className="mt-2 -ml-4">
      <TreeViewerNode<T> {...props} />
    </div>
  );
}
function TreeViewerNode<T extends BaseItemNode<T>>({
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

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setChildren([]);
    const children = await fetchData(item);
    setIsLoading(false);
    setChildren(children);
    setHasChildren(!!children?.length);
  }, [fetchData, item]);

  // Reset local state when item changes
  useEffect(() => {
    setChildren(item.children);
    setHasChildren(item.hasChildren);
    setIsExpanded(false);
    setIsLoading(false);
  }, [item]);

  if (!client) {
    return (
      <p>
        No environment selected, or selected environment has invalid API key. Editing environments
        are not supported currently, delete and recreate it.
      </p>
    );
  }
  return (
    <div className="space-y-1 ml-4">
      <ContextMenu>
        <ContextMenuTrigger>
          <Button
            variant={isSelected(item) ? 'default' : 'ghost'}
            className="w-full justify-start space-x-1"
            onClick={async () => {
              onItemSelected(item);
              if (!isExpanded) {
                setIsExpanded(true);
                await loadData();
              }
            }}
          >
            <WithLoader loading={isLoading} noText>
              {isExpanded ? (
                <ArrowDownRightIcon
                  onClick={async (e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className={hasChildren ? '' : 'collapse'}
                />
              ) : (
                <ArrowRightIcon
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!isExpanded) {
                      setIsExpanded(true);
                      await loadData();
                    }
                  }}
                  className={hasChildren ? '' : 'collapse'}
                />
              )}
            </WithLoader>
            {item.hasLayout ? <BookOpenTextIcon /> : <PackageIcon />}

            <span>{item.name}</span>
          </Button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={async (e) => {
              e.stopPropagation();
              setIsExpanded(true);
              await loadData();
            }}
          >
            Refresh Children
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      {isExpanded &&
        children?.map((x) => (
          <TreeViewerNode<T>
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
