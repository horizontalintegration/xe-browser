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

export type AddEnvDialogProps = {
  onCancel: () => void;
  onCreateEnv: (envName: string, apiKey: string) => void;
};
const AddEnvDialog = ({
  onCancel,
  onCreateEnv,
}: AddEnvDialogProps) => {
  const [envName, setEnvName] = useState("");
  const [apiKey, setApiKey] = useState("");
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add an environment</DialogTitle>
        <DialogDescription>
          Add a new environments to the account
        </DialogDescription>
      </DialogHeader>
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
              placeholder="api-key-here"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button type="submit" onClick={() => onCreateEnv(envName, apiKey)}>
          Add Environment
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddEnvDialog;
