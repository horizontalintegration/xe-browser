import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { Account, useAccounts } from '@/lib/hooks/use-accounts';
import { useSelectedEnv, useSelectedAccount, EnvironmentDialogProps } from '../EnvironmentSwitcher';
import { Textarea } from '@/components/ui/textarea';

const ImportAccountDialog = ({ closeDialog, setErrorMessage }: EnvironmentDialogProps) => {
  const [accountJson, setAccountJson] = useState('');
  const [parsedAccount, setParsedAccount] = useState<Account>();

  const { accounts, importAccount } = useAccounts();

  const [, setSelectedEnv] = useSelectedEnv();
  const [, setSelectedAccount] = useSelectedAccount();

  const existingAccount = parsedAccount?.accountId
    ? accounts.find((x) => x.accountId === parsedAccount?.accountId)
    : undefined;

  useEffect(() => {
    if (!accountJson) {
      return;
    }
    let account;
    try {
      account = JSON.parse(accountJson) as Account | null;
    } catch {
      return;
    }

    if (!account?.accountId || !account.accountName || !account.environments) {
      setErrorMessage({
        title: 'Invalid account JSON',
        description: 'Account data invalid',
      });
      return;
    }
    for (let i = 0; i < account.environments.length; i++) {
      const env = account.environments[i];
      if (!env.envId || !env.envName) {
        return;
      }
    }
    setParsedAccount(account);
  }, [accountJson, setErrorMessage]);

  const onImportAccount = () => {
    if (!parsedAccount) {
      setErrorMessage({
        title: 'Must import a valid account',
        description: '',
      });
      return;
    }

    const createdAccount = importAccount(parsedAccount);
    setSelectedAccount(createdAccount);
    setSelectedEnv(undefined);
    closeDialog();
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Import account</DialogTitle>
        <DialogDescription>Import an account from a JSON export</DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onImportAccount();
        }}
      >
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Account JSON</Label>

              <Textarea
                id="account-json"
                value={accountJson}
                onChange={(e) => setAccountJson(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4 py-2 pb-4">
            {existingAccount ? (
              <div className="space-y-2 text-destructive">
                <Label>This will update an existing account: {existingAccount.accountName}</Label>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label>Account ID: </Label>
              <span>{parsedAccount?.accountId}</span>
            </div>

            <div className="space-y-2">
              <Label>Account name: </Label>
              <span>{parsedAccount?.accountName}</span>
            </div>
            {parsedAccount?.environments.length ? (
              <div className="space-y-2">
                <Label>Environments: </Label>
                <span>{parsedAccount?.environments.map((env) => env.envName).join(' | ')}</span>
              </div>
            ) : null}
          </div>
        </div>
        <DialogFooter>
          <Button type="reset" variant="outline" onClick={() => closeDialog()}>
            Cancel
          </Button>
          <Button type="submit">Import Account</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ImportAccountDialog;
