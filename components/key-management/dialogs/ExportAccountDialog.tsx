import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Account } from '@/lib/hooks/use-accounts';
import { EnvironmentDialogProps } from '../EnvironmentSwitcher';
import JsonView from 'react18-json-view';

export interface ExportAccountDialogProps extends EnvironmentDialogProps {
  selectedAccount?: Account;
}

const ExportAccountDialog = ({ selectedAccount, closeDialog }: ExportAccountDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Export account</DialogTitle>
        <DialogDescription>
          This JSON can be used to quickly import for someone else or a different browser{' '}
        </DialogDescription>
      </DialogHeader>
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label>Account JSON</Label>
            <JsonView src={selectedAccount} />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="reset" variant="outline" onClick={() => closeDialog()}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ExportAccountDialog;
