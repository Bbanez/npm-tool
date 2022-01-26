import * as path from 'path';
import * as fse from 'fs-extra';
import * as fs from 'fs/promises';
import { createTasks } from './task';
import type { Config, Task } from './types';
import { ChildProcess } from '@banez/child_process';

export async function bundle({ config }: { config: Config }): Promise<void> {
  let tasks: Task[] = [
    {
      title: 'Remove TypeScript output',
      async task() {
        await fse.remove(
          path.join(process.cwd(), config.tsOutputDir as string),
        );
      },
    },
    {
      title: 'Compile TypeScript',
      async task() {
        await ChildProcess.spawn('npm', ['run', 'build:ts']);
      },
    },
    {
      title: 'Copy package.json',
      async task() {
        const data = JSON.parse(
          (
            await fs.readFile(path.join(process.cwd(), 'package.json'))
          ).toString(),
        );
        data.devDependencies = undefined;
        data.nodemonConfig = undefined;
        data.scripts = undefined;
        await fs.writeFile(
          path.join(
            process.cwd(),
            config.tsOutputDir as string,
            'package.json',
          ),
          JSON.stringify(data, null, '  '),
        );
      },
    },
    {
      title: 'Copy license if exists',
      async task() {
        if (await fse.pathExists(path.join(process.cwd(), 'LICENSE'))) {
          await fse.copy(
            path.join(process.cwd(), 'LICENSE'),
            path.join(process.cwd(), config.tsOutputDir as string, 'LICENSE'),
          );
        }
      },
    },
    {
      title: 'Copy readme if exists',
      async task() {
        if (await fse.pathExists(path.join(process.cwd(), 'README.md'))) {
          await fse.copy(
            path.join(process.cwd(), 'README.md'),
            path.join(process.cwd(), config.tsOutputDir as string, 'README.md'),
          );
        }
      },
    },
  ];
  if (config.bundle) {
    if (config.bundle.override) {
      tasks = config.bundle.override;
    } else if (config.bundle.extend) {
      tasks = [...tasks, ...config.bundle.extend];
    }
  }
  await createTasks(tasks).run();
}
