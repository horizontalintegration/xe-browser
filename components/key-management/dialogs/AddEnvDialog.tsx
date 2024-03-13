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
import { CreateEnvInfo } from '@/lib/hooks/use-accounts';
import { EnvThemes } from '@/components/providers/ThemeProvider';
import { SelectTheme } from './fields.tsx/SelectTheme';
import { DefaultGraphQLEndpointUrl } from '@/components/providers/GraphQLConnectionInfoProvider';

export type AddEnvDialogProps = {
  accountId?: string;
  onCancel: () => void;
  onCreateEnv: (env: CreateEnvInfo) => void;
};
const AddEnvDialog = ({ accountId, onCancel, onCreateEnv }: AddEnvDialogProps) => {
  const [envName, setEnvName] = useState('');
  const [envTheme, setEnvTheme] = useState<EnvThemes>('default');
  const [apiKey, setApiKey] = useState('');
  const [graphQLEndpointUrl, setGraphQLEndpointUrl] = useState<string>();

  if (!accountId) {
    return;
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add an environment</DialogTitle>
        <DialogDescription>Add a new environments to the account</DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreateEnv({ accountId, envName, envTheme, graphQLEndpointUrl, apiKey });
        }}
      >
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="env">Envionment name (e.g. Dev, UAT, Prod)</Label>
              <Input id="env" value={envName} onChange={(e) => setEnvName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="graphQLEndpointUrl">
                GraphQL Endpoint Url (Will use Experience Edge if blank)
              </Label>
              <Input
                id="graphQLEndpointUrl"
                placeholder={DefaultGraphQLEndpointUrl}
                value={graphQLEndpointUrl}
                onChange={(e) => setGraphQLEndpointUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apikey">GraphQL API Key</Label>
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
