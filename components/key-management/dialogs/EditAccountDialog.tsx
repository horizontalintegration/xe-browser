import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import BaseEditDialog from './BaseEditDialog';
import { EditAccountInfo, useAccounts } from '@/lib/hooks/use-accounts';
import { EnvironmentDialogProps, useSelectedAccount, useSelectedEnv } from '../EnvironmentSwitcher';

export interface EditAccountDialogProps extends EnvironmentDialogProps {
  selectedAccount?: EditAccountInfo;
}

const EditAccountDialog = ({ selectedAccount, closeDialog }: EditAccountDialogProps) => {
  const [accountName, setAccountName] = useState(selectedAccount?.accountName ?? '');
  const { editAccount, removeAccount } = useAccounts();

  const [, setSelectedAccount] = useSelectedAccount();
  const [, setSelectedEnv] = useSelectedEnv();

  const onSaveAccount = (account: EditAccountInfo) => {
    const result = editAccount(account);
    setSelectedAccount(result);
    closeDialog();
  };

  const onDeleteAccount = (account: EditAccountInfo) => {
    if (account.accountId === selectedAccount?.accountId) {
      setSelectedAccount(undefined);
      setSelectedEnv(undefined);
    }
    removeAccount(account.accountId);
    closeDialog();
  };

  if (!selectedAccount) {
    return <></>;
  }
  return (
    <BaseEditDialog
      title="Edit account"
      description="Edit account details"
      onCancel={closeDialog}
      onSave={() =>
        onSaveAccount({
          accountId: selectedAccount.accountId,
          accountName,
        })
      }
      saveButtonText="Save Account"
      onDelete={() => onDeleteAccount(selectedAccount)}
      deleteButtonText="Delete Account"
      deleteConfirmTitle={`Delete ${accountName}`}
      deleteConfirmDescription={`Are you sure you want to delete ${accountName}?`}
    >
      <div className="space-y-4 py-2 pb-4">
        <div className="space-y-2">
          <Label htmlFor="name">Account name</Label>
          <Input id="name" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
        </div>
      </div>
    </BaseEditDialog>
  );
};

export default EditAccountDialog;
