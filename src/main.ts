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
  } else if (await fse.pathExists(path.join(process.cwd(), 'npm-tool.cjs'))) {
    return await import(path.join(process.cwd(), 'npm-tool.cjs'));
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
  if (args['--bundle']) {
    await bundle({ config });
  } else if (args['--link']) {
    await link({ config, args });
  } else if (args['--unlink']) {
    await unlink({ config, args });
  } else if (args['--publish']) {
    await publish({ config });
  } else if (args['--pack']) {
    await pack({ config });
  } else if (config.custom) {
    for (const key in args) {
      if (config.custom[key]) {
        await config.custom[key]({ config, args });
      }
    }
  }
}
