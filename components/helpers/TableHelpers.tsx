import { CheckIcon, XIcon } from 'lucide-react';
import { TableCell } from '../ui/table';
import { ReactNode } from 'react';

export type BooleanStyles = 'pass-fail' | 'yes-no';

const styleMap: Record<BooleanStyles, Record<'true' | 'false', ReactNode>> = {
  'pass-fail': {
    true: <CheckIcon className=" text-success" />,
    false: <XIcon className=" text-destructive " />,
  },
  'yes-no': {
    true: <span className=" text-success">Yes</span>,
    false: <span className=" text-primary ">No</span>,
  },
};
export function BooleanTableCell({ value, style }: { value: boolean; style: BooleanStyles }) {
  return (
    <TableCell>
      <span className=" inline-block ">{value ? styleMap[style].true : styleMap[style].false}</span>
    </TableCell>
  );
}
