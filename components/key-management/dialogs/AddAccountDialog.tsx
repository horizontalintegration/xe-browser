import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { CreateAccountInfo, useAccounts } from '@/lib/hooks/use-accounts';
import { useSelectedEnv, useSelectedAccount, EnvironmentDialogProps } from '../EnvironmentSwitcher';

const AddAccountDialog = ({ closeDialog, setErrorMessage }: EnvironmentDialogProps) => {
  const [accountName, setAccountName] = useState('');
  const { accounts, addAccount } = useAccounts();

  const [, setSelectedEnv] = useSelectedEnv();
  const [, setSelectedAccount] = useSelectedAccount();

  const onCreateAccount = (account: CreateAccountInfo) => {
    const existingAccount = accounts.find(
      (x) =>
        x.accountName?.toLocaleLowerCase().trim() === account.accountName.toLocaleLowerCase().trim()
    );
    if (existingAccount) {
      setErrorMessage({
        title: 'Account already exists',
        description: 'Cannot add duplicate Account',
      });
      return;
    }
    const createdAccount = addAccount(account);
    setSelectedAccount(createdAccount);
    setSelectedEnv(undefined);
    closeDialog();
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add account</DialogTitle>
        <DialogDescription>Add a new account to manage environments</DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreateAccount({ accountName });
        }}
      >
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Account name</Label>
              <Input
                id="name"
                placeholder="Acme Inc."
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="reset" variant="outline" onClick={() => closeDialog()}>
            Cancel
          </Button>
          <Button type="submit">Add Account</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default AddAccountDialog;
