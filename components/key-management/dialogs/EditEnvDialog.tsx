import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import BaseEditDialog from "./BaseEditDialog";
import { EditEnvInfo } from "@/lib/hooks/use-accounts";


export type EditEnvDialogProps = {
  envionment?: EditEnvInfo;
  onCancel: () => void;
  onSaveEnv: (env: EditEnvInfo) => void;
  onDeleteEnv: (env: EditEnvInfo) => void;
};

const EditEnvDialog = ({
  envionment,
  onCancel,
  onSaveEnv,
  onDeleteEnv,
}: EditEnvDialogProps) => {
  const [envName, setEnvName] = useState(envionment?.envName ?? "");
  const [apiKey, setApiKey] = useState(envionment?.apiKey ?? "");
  if (!envionment) {
    return <></>;
  }
  return (
    <BaseEditDialog
      title="Edit environment"
      description="Edit environment details"
      onCancel={onCancel}
      onSave={() =>
        onSaveEnv({
          accountId: envionment.accountId,
          envId: envionment.envId,
          envName,
          apiKey,
        })
      }
      saveButtonText="Save Environment"
      onDelete={() => onDeleteEnv(envionment)}
      deleteButtonText="Delete Environment"
      deleteConfirmTitle={`Delete ${envName}`}
      deleteConfirmDescription={`Are you sure you want to delete ${envName}?`}
    >
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
    </BaseEditDialog>
  );
};

export default EditEnvDialog;
