import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export type AddAccountDialogProps = {
  onCancel: () => void;
  onCreateAccount: (accountName: string) => void;
};
const AddAccountDialog = ({
  onCancel,
  onCreateAccount,
}: AddAccountDialogProps) => {
  const [accountName, setAccountName] = useState("");
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add account</DialogTitle>
        <DialogDescription>
          Add a new account to manage environments
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreateAccount(accountName);
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
          <Button type="reset" variant="outline" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button type="submit" onClick={() => onCreateAccount(accountName)}>
            Add Account
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default AddAccountDialog;
