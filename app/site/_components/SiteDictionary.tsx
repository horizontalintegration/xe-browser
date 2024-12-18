import { WithLoader } from '@/components/helpers/Loader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table';
import { getDictionary } from '@/lib/graphql/get-dictionary';
import { GetAllSiteInfoResult } from '@/lib/graphql/types';
import { QuerySettings } from '@/lib/graphql/util';
import { useFetchData } from '@/lib/hooks/use-fetch-data';
import { useState, useCallback } from 'react';

export function SiteDictionary({ site }: { site: GetAllSiteInfoResult }) {
  const [keySearch, setKeySearch] = useState<string>();
  const [valueSearch, setValueSearch] = useState<string>();

  const fetchData = useCallback(
    async (querySettings: QuerySettings) => {
      return await getDictionary(querySettings, site.siteName, site.language);
    },
    [site.siteName, site.language]
  );

  const { loading, data } = useFetchData(fetchData);

  const dictionary = data ?? [];

  const filteredDictionary = dictionary.filter(
    (x) =>
      (!keySearch || x.key.toLowerCase().indexOf(keySearch) > -1) &&
      (!valueSearch || (x.value ?? '')?.toString().toLowerCase().indexOf(valueSearch) > -1)
  );
  return (
    <WithLoader loading={loading}>
      <Table className="relative block h-80 overflow-auto">
        <TableHeader className="sticky top-0 bg-muted">
          <TableRow>
            <TableHead>
              <Label>
                Key
                <Input type="text" onChange={(e) => setKeySearch(e.target.value)} />
              </Label>
            </TableHead>
            <TableHead>
              <Label>
                Value
                <Input type="text" onChange={(e) => setValueSearch(e.target.value)} />
              </Label>
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead colSpan={2}>
              {filteredDictionary.length} Results
              {filteredDictionary.length < dictionary.length ? (
                <span className=" text-muted-foreground">
                  {' '}
                  (Total: {filteredDictionary.length})
                </span>
              ) : null}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDictionary?.map((x) => (
            <TableRow key={x.key}>
              <TableCell>{x.key}</TableCell>
              <TableCell>{x.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </WithLoader>
  );
}
