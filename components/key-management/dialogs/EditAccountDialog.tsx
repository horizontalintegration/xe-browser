import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import BaseEditDialog from "./BaseEditDialog";
import { EditAccountInfo } from "@/lib/hooks/use-accounts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountThemes } from "@/components/providers/ThemeProvider";

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
  const [accountTheme, setAccountTheme] = useState<AccountThemes>(
    account?.accountTheme ?? "default"
  );
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
          accountTheme,
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
            placeholder="Acme Inc."
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Select
            value={accountTheme}
            onValueChange={(e) => setAccountTheme(e as AccountThemes)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a color scheme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Color</SelectLabel>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </BaseEditDialog>
  );
};

export default EditAccountDialog;
