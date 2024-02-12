import useLocalStorage from "./use-local-storage";

export type AccountEnvironment = {
  envName: string;
  apiKey: string;
};

export type Account = {
  accountName: string;
  environments: AccountEnvironment[];
};

export const useAccounts = () => {
  const [accounts, setAccounts] = useLocalStorage<Account[]>("accounts", []);

  const addAccount = (name: string) => {
    const newAccount = { accountName: name, environments: [] };
    setAccounts([...accounts, newAccount]);
    return newAccount;
  };
  const removeAccount = (name: string) => {
    setAccounts([...accounts.filter((x) => x.accountName !== name)]);
  };

  const addEnvironment = (
    accountName: string,
    envName: string,
    apiKey: string
  ) => {
    const account = accounts.find((x) => x.accountName === accountName);
    if (!account) {
      throw new Error(`Unable to find account: ${accountName}`);
    }
    const newEnv = { envName: envName, apiKey };
    account.environments.push(newEnv);
    setAccounts([...accounts]);
    return newEnv;
  };
  const removeEnvironment = (accountName: string, envName: string) => {
    const account = accounts.find((x) => x.accountName === accountName);
    if (!account) {
      throw new Error(`Unable to find account: ${accountName}`);
    }
    account.environments = [
      ...account.environments.filter((x) => x.envName !== envName),
    ];
    setAccounts([...accounts]);
  };

  return {
    accounts,
    addAccount,
    removeAccount,
    addEnvironment,
    removeEnvironment,
  };
};
