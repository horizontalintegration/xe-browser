'use client';
import { useLogQueries } from '@/components/providers/LogQueriesProvider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function LogQueriesToggle() {
  const { logQueries, setLogQueries } = useLogQueries();
  return (
    <Label className="px-4 py-2 flex space-x-2">
      <span>Log queries</span>
      <Switch checked={logQueries} onCheckedChange={(x) => setLogQueries(x === true)} />
    </Label>
  );
}
