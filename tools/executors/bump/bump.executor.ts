import { ExecutorContext } from '@nrwl/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';

export interface BumpExecutorOptions {
  version: string;
}

export default async function bumpExecutor(
  options: BumpExecutorOptions,
  context: ExecutorContext
) {

  console.log(`Bumping to version ${options.version}`);
  return {success: true};
}
