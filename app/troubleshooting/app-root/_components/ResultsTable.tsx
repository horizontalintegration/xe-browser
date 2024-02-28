import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckAppRootResult } from '@/lib/graphql/check-app-root';
import { CheckIcon, XIcon } from 'lucide-react';

export interface ResultsTableProps {
  results: CheckAppRootResult[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Site Name</TableHead>
          <TableHead>Language</TableHead>
          <TableHead>Error Message</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((x) => (
          <TableRow key={x.siteName + x.language}>
            <TableCell>
              <span className=" inline-block ">
                {x.success ? (
                  <CheckIcon className=" text-success" />
                ) : (
                  <XIcon className=" text-destructive " />
                )}
              </span>
            </TableCell>
            <TableCell>{x.siteName}</TableCell>
            <TableCell>{x.language}</TableCell>
            <TableCell>{x.errorMessage}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
