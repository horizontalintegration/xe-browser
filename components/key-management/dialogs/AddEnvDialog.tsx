import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CreateEnvInfo } from "@/lib/hooks/use-accounts";

export type AddEnvDialogProps = {
  accountId?: string;
  onCancel: () => void;
  onCreateEnv: (env: CreateEnvInfo) => void;
};
const AddEnvDialog = ({
  accountId,
  onCancel,
  onCreateEnv,
}: AddEnvDialogProps) => {
  const [envName, setEnvName] = useState("");
  const [apiKey, setApiKey] = useState("");
  if (!accountId) {
    return;
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add an environment</DialogTitle>
        <DialogDescription>
          Add a new environments to the account
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreateEnv({ accountId, envName, apiKey });
        }}
      >
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="env">Envionment name</Label>
              <Input
                id="env"
                placeholder="Development"
                value={envName}
                onChange={(e) => setEnvName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apikey">Experience Edge API Key</Label>
              <Input
                id="apikey"
                autoComplete="off"
                placeholder="api-key-here"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="reset" variant="outline" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button type="submit">Add Environment</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default AddEnvDialog;
