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
import { ComponentPropsWithoutRef, useEffect, useState } from 'react';
import AddAccountDialog from './dialogs/AddAccountDialog';
import AddEnvDialog from './dialogs/AddEnvDialog';
import useLocalStorage from '@/lib/hooks/use-local-storage';
import { useGraphQLConnectionInfo } from '@/components/providers/GraphQLConnectionInfoProvider';
import { Alert } from '../helpers/Alert';
import EditAccountDialog from './dialogs/EditAccountDialog';
import EditEnvDialog from './dialogs/EditEnvDialog';
import { useEnvTheme } from '../providers/ThemeProvider';

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;

type DialogType = 'create-account' | 'create-env' | 'edit-account' | 'edit-env' | undefined;

type ErrorMessage = {
  title: string;
  description: string;
};

interface EnvironmentSwitcherProps extends PopoverTriggerProps {}

export default function EnvironmentSwitcher(props: EnvironmentSwitcherProps) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>();
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>();

  const { setConnectionInfo } = useGraphQLConnectionInfo();
  const { setEnvTheme } = useEnvTheme();

  const {
    accounts,
    addAccount,
    editAccount,
    removeAccount,
    addEnvironment,
    editEnvironment,
    removeEnvironment,
  } = useAccounts();

  const [selectedAccount, setSelectedAccount] = useLocalStorage<Account | undefined>(
    'selectedAccount',
    undefined
  );

  const [selectedEnv, setSelectedEnv] = useLocalStorage<AccountEnvironment | undefined>(
    'selectedEnvironment',
    undefined
  );

  const [editingAccount, setEditingAccount] = useState<EditAccountInfo>();
  const [editingEnv, setEditingEnv] = useState<EditEnvInfo>();

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
    setEnvTheme(env?.envTheme ?? 'default');

    setConnectionInfo({
      apiKey: env?.apiKey ?? '',
      graphQLEndpointUrl: env?.graphQLEndpointUrl,
      useEdgeContextId: env?.useEdgeContextId === true,
    });
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
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {dialogType === 'create-account' ? (
        <AddAccountDialog
          onCancel={closeDialog}
          onCreateAccount={(account) => {
            const existingAccount = accounts.find(
              (x) =>
                x.accountName?.toLocaleLowerCase().trim() ===
                account.accountName.toLocaleLowerCase().trim()
            );
            if (existingAccount) {
              setErrorMessage({
                title: 'Account already exists',
                description: 'Cannot add duplicate Account',
              });
              return;
            }
            const createdAccount = addAccount(account);
            onAccountSelect(createdAccount);
            onEnvSelect(undefined);
            closeDialog();
          }}
        />
      ) : dialogType === 'create-env' ? (
        <AddEnvDialog
          accountId={selectedAccount?.accountId}
          onCancel={closeDialog}
          onCreateEnv={(env) => {
            if (!selectedAccount) {
              throw new Error('No account selected');
            }
            const existingEnv = selectedAccount.environments.find(
              (x) =>
                x.envName?.toLocaleLowerCase().trim() === env.envName.toLocaleLowerCase().trim()
            );
            if (existingEnv) {
              setErrorMessage({
                title: 'Environment already exists',
                description: 'Cannot add duplicate Environment',
              });
              return;
            }
            const createdEnv = addEnvironment(env);
            onEnvSelect(createdEnv);
            closeDialog();
          }}
        />
      ) : dialogType === 'edit-account' ? (
        <EditAccountDialog
          account={editingAccount}
          onCancel={closeDialog}
          onSaveAccount={(account) => {
            const result = editAccount(account);
            onAccountSelect(result);
            closeDialog();
          }}
          onDeleteAccount={(account) => {
            if (account.accountId === selectedAccount?.accountId) {
              onAccountSelect(undefined);
              onEnvSelect(undefined);
            }
            removeAccount(account.accountId);
            closeDialog();
          }}
        />
      ) : dialogType === 'edit-env' ? (
        <EditEnvDialog
          envionment={editingEnv}
          onCancel={closeDialog}
          onSaveEnv={(env) => {
            const result = editEnvironment(env);
            onEnvSelect(result);
            closeDialog();
          }}
          onDeleteEnv={(env) => {
            if (env.accountId === selectedAccount?.accountId) {
              onAccountSelect(undefined);
              onEnvSelect(undefined);
            }
            removeEnvironment(env.accountId, env.envId);
            closeDialog();
          }}
        />
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
