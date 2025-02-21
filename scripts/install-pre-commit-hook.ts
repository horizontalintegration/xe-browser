import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import chalk from 'chalk';

const installHooks = async () => {
  try {
    const appPath = path.join(__dirname, '..').replace(/\\/g, '/');
    const { stdout } = await promisify(exec)('git rev-parse --show-toplevel');
    const gitRootPath = stdout.trim();
    console.log(chalk.green(`Writing data to local .git folder ${gitRootPath}...`));

    const data = `#!/bin/sh
#
# pre-commit hook runs our linter before we commit our changes
#
# To skip this hook, use the --no-verify flag
# when committing.
#
cd ${appPath}
echo "Checking Typescript Compile..."
npx tsc
echo "Running lint check..."
npm run lint`;

    await promisify(fs.writeFile)(`${gitRootPath}/.git/hooks/pre-commit`, data, 'utf8');
    console.log(chalk.green('Success'));
  } catch (error) {
    console.log(chalk.red(`Error installing hook: ${error}`));
  }
};

installHooks();
