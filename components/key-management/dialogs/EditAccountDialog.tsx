import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import BaseEditDialog from "./BaseEditDialog";
import { EditAccountInfo } from "@/lib/hooks/use-accounts";

export type EditAccountDialogProps = {
  account?: EditAccountInfo;
  onCancel: () => void;
  onSaveAccount: (account: EditAccountInfo) => void;
  onDeleteAccount: (account: EditAccountInfo) => void;
};

const EditAccountDialog = ({
  account,
  onCancel,
  onSaveAccount,
  onDeleteAccount,
}: EditAccountDialogProps) => {
  const [accountName, setAccountName] = useState(account?.accountName ?? "");

  if (!account) {
    return <></>;
  }
  return (
    <BaseEditDialog
      title="Edit account"
      description="Edit account details"
      onCancel={onCancel}
      onSave={() =>
        onSaveAccount({
          accountId: account.accountId,
          accountName,
        })
      }
      saveButtonText="Save Account"
      onDelete={() => onDeleteAccount(account)}
      deleteButtonText="Delete Account"
      deleteConfirmTitle={`Delete ${accountName}`}
      deleteConfirmDescription={`Are you sure you want to delete ${accountName}?`}
    >
      <div className="space-y-4 py-2 pb-4">
        <div className="space-y-2">
          <Label htmlFor="name">Account name</Label>
          <Input
            id="name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </div>
      </div>
    </BaseEditDialog>
  );
};

export default EditAccountDialog;
