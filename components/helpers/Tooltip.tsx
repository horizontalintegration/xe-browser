import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { ReactNode } from 'react';

export type XeTooltipProps = React.PropsWithChildren<{
  trigger?: ReactNode;
}>;
export function XeTooltip({ trigger = <InfoIcon />, children }: XeTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent className="max-w-80">{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
