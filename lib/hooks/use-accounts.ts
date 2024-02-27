import { useEffect } from 'react';
import useLocalStorage from './use-local-storage';
import { nanoid } from 'nanoid';
import { EnvThemes } from '@/components/providers/ThemeProvider';
import { UseStateReturn } from '../types/state';

export interface AccountEnvironment {
  envId: string;
  envName: string;
  envTheme: EnvThemes;
  apiKey: string;
}

export interface Account {
  accountId: string;
  accountName: string;
  environments: AccountEnvironment[];
}

export interface CreateAccountInfo {
  accountName: string;
}

export interface EditAccountInfo extends CreateAccountInfo {
  accountId: string;
}

export interface CreateEnvInfo {
  accountId: string;
  envName: string;
  envTheme: EnvThemes;
  apiKey: string;
}

export interface EditEnvInfo extends CreateEnvInfo {
  envId: string;
}

export const useAccounts = () => {
  const [accounts, setAccounts] = useAccountState();

  const addAccount = (account: CreateAccountInfo) => {
    const newAccount = {
      accountId: nanoid(),
      accountName: account.accountName,
      environments: [],
    };
    setAccounts([...accounts, newAccount]);
    return newAccount;
  };

  const editAccount = (account: EditAccountInfo) => {
    if (!account.accountId) {
      throw new Error('editAccount missing accountId');
    }
    const found = accounts.find((x) => x.accountId === account.accountId);
    if (found) {
      found.accountName = account.accountName;
      setAccounts(accounts);
      return found;
    }
  };

  const removeAccount = (accountId: string) => {
    setAccounts([...accounts.filter((x) => x.accountId !== accountId)]);
  };

  const addEnvironment = (env: CreateEnvInfo) => {
    if (!env.accountId) {
      throw new Error('addEnvironment missing accountId');
    }

    const account = accounts.find((x) => x.accountId === env.accountId);
    if (!account) {
      throw new Error(`Unable to find account: ${env.accountId}`);
    }
    const newEnv = {
      envId: nanoid(),
      envName: env.envName,
      envTheme: env.envTheme,
      apiKey: env.apiKey,
    };
    account.environments.push(newEnv);
    setAccounts(accounts);
    return newEnv;
  };

  const editEnvironment = (env: EditEnvInfo) => {
    if (!env.accountId) {
      throw new Error('editEnvironment missing accountId');
    }

    if (!env.envId) {
      throw new Error('editEnvironment missing envId');
    }

    const account = accounts.find((x) => x.accountId === env.accountId);
    if (!account) {
      throw new Error(`Unable to find account: ${env.accountId}`);
    }
    const foundEnv = account.environments.find((x) => x.envId === env.envId);
    if (foundEnv) {
      foundEnv.envName = env.envName;
      foundEnv.envTheme = env.envTheme;
      foundEnv.apiKey = env.apiKey;
      setAccounts(accounts);
      return foundEnv;
    }
  };

  const removeEnvironment = (accountId: string, envId: string) => {
    const account = accounts.find((x) => x.accountId === accountId);
    if (!account) {
      throw new Error(`Unable to find account: ${accountId}`);
    }
    account.environments = [...account.environments.filter((x) => x.envId !== envId)];
    setAccounts([...accounts]);
  };

  return {
    accounts,
    addAccount,
    editAccount,
    removeAccount,
    addEnvironment,
    editEnvironment,
    removeEnvironment,
  };
};

function useAccountState(): UseStateReturn<Account[]> {
  const [accounts, setAccounts] = useLocalStorage<Account[]>('accounts', []);

  // For accounts created before accountId field was added, populate the ids.
  useEffect(() => {
    let updated = false;
    accounts.forEach((account) => {
      if (!account.accountId) {
        account.accountId = nanoid();
        updated = true;
      }
      account.environments.forEach((env) => {
        if (!env.envId) {
          env.envId = nanoid();
          updated = true;
        }
      });
    });
    if (updated) {
      setAccounts(accounts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  return [accounts, setAccounts];
}
