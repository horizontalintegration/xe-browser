"use client";

import {
  CaretSortIcon,
  CheckIcon,
  MinusCircledIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Account,
  AccountEnvironment,
  useAccounts,
} from "@/lib/hooks/use-accounts";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import AddAccountDialog from "./dialogs/AddAccountDialog";
import AddEnvDialog from "./dialogs/AddEnvDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { useApiKey } from "@/components/providers/ApiKeyProvider";

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;

type DialogType = "create-account" | "create-env" | undefined;

type ErrorMessage = {
  title: string;
  description: string;
};

interface EnvironmentSwitcherProps extends PopoverTriggerProps {}

export default function EnvironmentSwitcher(props: EnvironmentSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>();
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>();

  const { setApiKey } = useApiKey();

  const {
    accounts,
    addAccount,
    addEnvironment,
    removeAccount,
    removeEnvironment,
  } = useAccounts();

  const [selectedAccount, setSelectedAccount] = useLocalStorage<
    Account | undefined
  >("selectedAccount", undefined);
  const [selectedEnv, setSelectedEnv] = useLocalStorage<
    AccountEnvironment | undefined
  >("selectedEnvironment", undefined);

  useEffect(() => {
    if (selectedEnv?.apiKey) {
      setApiKey(selectedEnv?.apiKey);
    }
  }, [selectedEnv?.apiKey, setApiKey]);

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-auto justify-between")}
          >
            {selectedAccount?.accountName ?? "No Account"}:{" "}
            {selectedEnv?.envName ?? "No Environment"}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Command>
            <CommandList>
              {accounts.map((account) => (
                <CommandGroup
                  key={account.accountName}
                  heading={
                    <div className="flex h-16 items-center">
                      <div className="pr-10 font-bold text-lg">
                        {account.accountName}
                      </div>

                      <div className="ml-auto flex items-center space-x-4">
                        <DialogTrigger asChild>
                          <Button
                            variant={"outline"}
                            size={"xs"}
                            onClick={() => {
                              setOpen(false);
                              setSelectedAccount(account);
                              setShowDialog(true);
                              setDialogType("create-env");
                            }}
                          >
                            <PlusCircledIcon className="h-5 w-5" /> Add
                            Environment
                          </Button>
                        </DialogTrigger>
                        <Button
                          variant={"destructive"}
                          size={"xs"}
                          onClick={() => {
                            if (
                              account.accountName ===
                              selectedAccount?.accountName
                            ) {
                              setSelectedAccount(undefined);
                              setSelectedEnv(undefined);
                            }
                            removeAccount(account.accountName);
                          }}
                        >
                          <MinusCircledIcon className={cn("ml-auto h-4 w-4")} />
                          Account
                        </Button>
                      </div>
                    </div>
                  }
                >
                  {account.environments.map((env) => (
                    <CommandItem
                      key={`${account.accountName} ${env.envName}`}
                      onSelect={() => {
                        setSelectedAccount(account);
                        setSelectedEnv(env);
                        setOpen(false);
                        setApiKey(env.apiKey);
                      }}
                      className="text-sm ml-4"
                    >
                      <span className="hidden">{account.accountName}</span>
                      {env.envName}
                      <div className="ml-auto flex items-center space-x-4">
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedEnv?.envName === env.envName
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <Button
                          variant={"destructive"}
                          size={"xs"}
                          onClick={() => {
                            if (
                              account.accountName ===
                                selectedAccount?.accountName &&
                              env.envName === selectedEnv?.envName
                            ) {
                              setSelectedEnv(undefined);
                            }
                            removeEnvironment(account.accountName, env.envName);
                          }}
                        >
                          <MinusCircledIcon className={cn("ml-auto h-4 w-4")} />
                          Env
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
                      setOpen(false);
                      setShowDialog(true);
                      setDialogType("create-account");
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
      {dialogType === "create-account" ? (
        <AddAccountDialog
          onCancel={() => {
            setShowDialog(false);
            setDialogType(undefined);
          }}
          onCreateAccount={(accountName) => {
            const existingAccount = accounts.find(
              (x) => x.accountName === accountName
            );
            if (existingAccount) {
              setErrorMessage({
                title: "Account already exists",
                description: "Cannot add duplicate Account",
              });
              return;
            }
            const account = addAccount(accountName);
            setSelectedAccount(account);
            setSelectedEnv(undefined);
            setShowDialog(false);
            setDialogType(undefined);
          }}
        />
      ) : dialogType === "create-env" ? (
        <AddEnvDialog
          onCancel={() => {
            setShowDialog(false);
            setDialogType(undefined);
          }}
          onCreateEnv={(envName, apiKey) => {
            if (!selectedAccount) {
              throw new Error("No account selected");
            }
            const existingEnv = selectedAccount.environments.find(
              (x) => x.envName === envName
            );
            if (existingEnv) {
              setErrorMessage({
                title: "Environment already exists",
                description: "Cannot add duplicate Environment",
              });
              return;
            }
            const env = addEnvironment(
              selectedAccount.accountName,
              envName,
              apiKey
            );
            setSelectedEnv(env);
            setApiKey(env.apiKey);
            setShowDialog(false);
            setDialogType(undefined);
          }}
        />
      ) : null}
      <AlertDialog
        open={errorMessage !== undefined}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setErrorMessage(undefined);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{errorMessage?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Okay</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
