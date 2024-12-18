import { BooleanTableCell } from '@/components/helpers/TableHelpers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GetAllSiteInfoResult } from '@/lib/graphql/types';
import React, { useState } from 'react';
import { SiteDetail } from './SiteDetail';

export interface ResultsTableProps {
  results: GetAllSiteInfoResult[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  const [selected, setSelected] = useState<GetAllSiteInfoResult>();
  function onClickRow(result: GetAllSiteInfoResult) {
    if (selected === result) {
      setSelected(undefined);
    } else {
      setSelected(result);
    }
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Site Name</TableHead>
          <TableHead>Language</TableHead>
          <TableHead>Hostname</TableHead>
          <TableHead>robox.txt</TableHead>
          <TableHead>sitemap.xml</TableHead>
          <TableHead>Item Language Fallback</TableHead>
          <TableHead>Field Language Fallback</TableHead>
          <TableHead>404 Path</TableHead>
          <TableHead>500 Path</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((x) => (
          <React.Fragment key={x.siteName + x.language}>
            <TableRow onClick={() => onClickRow(x)} className=" cursor-pointer">
              <TableCell>{x.siteName}</TableCell>
              <TableCell>{x.language}</TableCell>
              <TableCell>{x.hostname}</TableCell>
              <TableCell className=" max-w-80">
                <pre className=" whitespace-pre-wrap">{x.robots}</pre>
              </TableCell>
              <TableCell>
                <a href={x.sitemap} title={x.sitemap} target="_blank">
                  Sitemap Link
                </a>
              </TableCell>
              <BooleanTableCell value={x.enableItemLanguageFallback} style="yes-no" />
              <BooleanTableCell value={x.enableFieldLanguageFallback} style="yes-no" />
              <TableCell>{x.notFoundPageItemPath}</TableCell>
              <TableCell>{x.serverErrorPageItemPath}</TableCell>
            </TableRow>
            {x === selected ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <SiteDetail site={x} />
                </TableCell>
              </TableRow>
            ) : null}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
