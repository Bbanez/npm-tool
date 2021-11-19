import * as path from 'path';
import * as fse from 'fs-extra';
import { parseArgs } from './arg';
import type { Config } from './types';
import { bundle } from './bundle';
import { link } from './link';
import { unlink } from './unlink';
import { publish } from './publish';
import { pack } from './pack';

async function getConfig(): Promise<Config> {
  if (await fse.pathExists(path.join(process.cwd(), 'npm-tool.js'))) {
    return await import(path.join(process.cwd(), 'npm-tool.js'));
  } else {
    return {};
  }
}

export async function startNpmTool(): Promise<void> {
  const args = parseArgs(process.argv);
  const config = await getConfig();
  if (!config.tsOutputDir) {
    config.tsOutputDir = 'dist';
  }
  if (typeof args['--bundle'] === 'string') {
    await bundle({ config });
  } else if (typeof args['--link'] === 'string') {
    await link({ config, args });
  } else if (typeof args['--unlink'] === 'string') {
    await unlink({ config, args });
  } else if (typeof args['--publish'] === 'string') {
    await publish({ config });
  } else if (typeof args['--pack'] === 'string') {
    await pack({ config });
  } else if (config.custom) {
    for (const key in args) {
      if (config.custom[key]) {
        await config.custom[key]({ config, args });
      }
    }
  }
}
