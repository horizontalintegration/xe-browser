'use client';

import { CaretSortIcon, CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Account,
  AccountEnvironment,
  EditAccountInfo,
  EditEnvInfo,
  useAccounts,
} from '@/lib/hooks/use-accounts';
import { ComponentPropsWithoutRef, Dispatch, SetStateAction, useEffect, useState } from 'react';
import AddAccountDialog from './dialogs/AddAccountDialog';
import AddEnvDialog from './dialogs/AddEnvDialog';
import useLocalStorage from '@/lib/hooks/use-local-storage';
import { useGraphQLConnectionInfo } from '@/components/providers/GraphQLConnectionInfoProvider';
import { Alert } from '../helpers/Alert';
import EditAccountDialog from './dialogs/EditAccountDialog';
import EditEnvDialog from './dialogs/EditEnvDialog';
import { useEnvTheme } from '../providers/ThemeProvider';
import ExportAccountDialog from './dialogs/ExportAccountDialog';
import ImportAccountDialog from './dialogs/ImportAccountDialog';

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;

type DialogType =
  | 'create-account'
  | 'create-env'
  | 'edit-account'
  | 'edit-env'
  | 'export-account'
  | 'import-account'
  | undefined;

export type ErrorMessage = {
  title: string;
  description: string;
};

interface EnvironmentSwitcherProps extends PopoverTriggerProps {}

export default function EnvironmentSwitcher(props: EnvironmentSwitcherProps) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>();
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>();

  const { accounts } = useAccounts();

  const [selectedAccount, setSelectedAccount] = useSelectedAccount();
  const [selectedEnv, setSelectedEnv] = useSelectedEnv();

  useOnEnvChange(selectedEnv);

  const [exportAccount, setExportAccount] = useState<Account>();
  const [editingAccount, setEditingAccount] = useState<EditAccountInfo>();
  const [editingEnv, setEditingEnv] = useState<EditEnvInfo>();

  const openDialog = (dialogType: DialogType) => {
    setIsDropDownOpen(false);
    setIsDialogVisible(true);
    setDialogType(dialogType);
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
    setDialogType(undefined);
  };

  const onAccountSelect = (account?: Account) => {
    setSelectedAccount(account);
  };

  const onEnvSelect = (env?: AccountEnvironment) => {
    setSelectedEnv(env);
  };

  return (
    <Dialog open={isDialogVisible} onOpenChange={setIsDialogVisible}>
      <Popover open={isDropDownOpen} onOpenChange={setIsDropDownOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isDropDownOpen}
            aria-label="Select a team"
            className={cn('w-auto justify-between')}
          >
            {selectedAccount?.accountName ?? 'No Account'}:{' '}
            {selectedEnv?.envName ?? 'No Environment'}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Command>
            <CommandList>
              {accounts.map((account) => (
                <CommandGroup
                  key={account.accountId}
                  heading={
                    <div className="flex px-2 h-16 items-center">
                      <div className="pr-10 font-bold text-lg">{account.accountName}</div>

                      <div className="ml-auto flex items-center space-x-4">
                        <DialogTrigger asChild>
                          <Button
                            variant={'outline'}
                            size={'xs'}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDropDownOpen(false);
                              onAccountSelect(account);
                              openDialog('create-env');
                            }}
                          >
                            <PlusCircledIcon className="h-5 w-5" /> Add Environment
                          </Button>
                        </DialogTrigger>
                        <Button
                          size={'xs'}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAccount(account);
                            openDialog('edit-account');
                          }}
                        >
                          Edit Account
                        </Button>

                        <Button
                          size={'xs'}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExportAccount(account);
                            openDialog('export-account');
                          }}
                        >
                          Export Account
                        </Button>
                      </div>
                    </div>
                  }
                >
                  {account.environments.map((env) => (
                    <CommandItem
                      key={`${account.accountId} ${env.envId}`}
                      onSelect={() => {
                        onAccountSelect(account);
                        onEnvSelect(env);
                        setIsDropDownOpen(false);
                      }}
                      className="text-sm ml-4"
                    >
                      {/* The command key takes the inner text of the command item, so add accountId as part of the key. */}
                      <span className="hidden">{account.accountId}</span>
                      {env.envName}
                      <div className="ml-auto flex items-center space-x-4">
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedEnv?.envId === env.envId ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <Button
                          size={'xs'}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingEnv({
                              accountId: account.accountId,
                              ...env,
                            });
                            openDialog('edit-env');
                          }}
                        >
                          Edit Environment
                        </Button>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      openDialog('create-account');
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Add Account
                  </CommandItem>
                </DialogTrigger>

                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      openDialog('import-account');
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Import Account
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {dialogType === 'create-account' ? (
        <AddAccountDialog closeDialog={closeDialog} setErrorMessage={setErrorMessage} />
      ) : dialogType === 'create-env' ? (
        <AddEnvDialog closeDialog={closeDialog} setErrorMessage={setErrorMessage} />
      ) : dialogType === 'edit-account' ? (
        <EditAccountDialog
          selectedAccount={editingAccount}
          closeDialog={closeDialog}
          setErrorMessage={setErrorMessage}
        />
      ) : dialogType === 'edit-env' ? (
        <EditEnvDialog
          envionment={editingEnv}
          closeDialog={closeDialog}
          setErrorMessage={setErrorMessage}
        />
      ) : dialogType === 'export-account' ? (
        <ExportAccountDialog
          selectedAccount={exportAccount}
          closeDialog={closeDialog}
          setErrorMessage={setErrorMessage}
        />
      ) : dialogType === 'import-account' ? (
        <ImportAccountDialog closeDialog={closeDialog} setErrorMessage={setErrorMessage} />
      ) : null}
      <Alert
        alertType="alert"
        title={errorMessage?.title}
        description={errorMessage?.description}
        open={!!errorMessage}
        onClose={() => setErrorMessage(undefined)}
      />
    </Dialog>
  );
}

function useOnEnvChange(selectedEnv?: AccountEnvironment) {
  const { setEnvTheme } = useEnvTheme();
  const { setConnectionInfo } = useGraphQLConnectionInfo();
  useEffect(() => {
    if (selectedEnv?.apiKey) {
      setConnectionInfo({
        apiKey: selectedEnv.apiKey,
        graphQLEndpointUrl: selectedEnv.graphQLEndpointUrl,
        useEdgeContextId: selectedEnv.useEdgeContextId,
      });
    }
    if (selectedEnv?.envTheme) {
      setEnvTheme(selectedEnv.envTheme);
    }
  }, [
    selectedEnv?.envTheme,
    selectedEnv?.apiKey,
    selectedEnv?.graphQLEndpointUrl,
    selectedEnv?.useEdgeContextId,
    setEnvTheme,
    setConnectionInfo,
  ]);
}

export function useSelectedAccount() {
  return useLocalStorage<Account | undefined>('selectedAccount', undefined);
}
export function useSelectedEnv() {
  return useLocalStorage<AccountEnvironment | undefined>('selectedEnvironment', undefined);
}

export type EnvironmentDialogProps = {
  closeDialog: () => void;
  setErrorMessage: Dispatch<SetStateAction<ErrorMessage | undefined>>;
};
