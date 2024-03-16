import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import BaseEditDialog from './BaseEditDialog';
import { EditEnvInfo } from '@/lib/hooks/use-accounts';
import { EnvThemes } from '@/components/providers/ThemeProvider';
import { SelectTheme } from './fields.tsx/SelectTheme';
import { Switch } from '@/components/ui/switch';

export type EditEnvDialogProps = {
  envionment?: EditEnvInfo;
  onCancel: () => void;
  onSaveEnv: (env: EditEnvInfo) => void;
  onDeleteEnv: (env: EditEnvInfo) => void;
};

const EditEnvDialog = ({ envionment, onCancel, onSaveEnv, onDeleteEnv }: EditEnvDialogProps) => {
  const [envName, setEnvName] = useState(envionment?.envName ?? '');
  const [envTheme, setEnvTheme] = useState<EnvThemes>(envionment?.envTheme ?? 'default');
  const [apiKey, setApiKey] = useState(envionment?.apiKey ?? '');
  // const [graphQLEndpointUrl, setGraphQLEndpointUrl] = useState(
  //   envionment?.graphQLEndpointUrl ?? ''
  // );
  const [useEdgeContextId, setUseEdgeContextId] = useState(false);
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
          envTheme,
          // graphQLEndpointUrl,
          apiKey,
          useEdgeContextId,
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
          <Label htmlFor="env">Envionment name (e.g. Dev, UAT, Prod)</Label>
          <Input id="env" value={envName} onChange={(e) => setEnvName(e.target.value)} />
        </div>
        {/* <div className="space-y-2">
          <Label htmlFor="graphQLEndpointUrl">
            GraphQL Endpoint Url (Will use Experience Edge if blank)
          </Label>
          <Input
            id="graphQLEndpointUrl"
            placeholder={DefaultGraphQLEndpointUrl}
            value={graphQLEndpointUrl}
            onChange={(e) => setGraphQLEndpointUrl(e.target.value)}
          />
        </div> */}
        <div className="space-y-2">
          <Label htmlFor="useEdgeContextId">Use Edge Context Id </Label>
          <Switch
            id="useEdgeContextId"
            checked={useEdgeContextId}
            onCheckedChange={(newValue) => setUseEdgeContextId(newValue)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apikey">
            {useEdgeContextId ? 'SITECORE_EDGE_CONTEXT_ID' : 'SITECORE_API_KEY'}
          </Label>
          <Input
            id="apikey"
            autoComplete="off"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="envtheme">Background Color</Label>
          <SelectTheme id="envtheme" {...{ envTheme, setEnvTheme }} />
        </div>
      </div>
    </BaseEditDialog>
  );
};

export default EditEnvDialog;
