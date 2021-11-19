import * as path from 'path';
import * as fse from 'fs-extra';
import * as fs from 'fs/promises';
import { Proc } from './process';
import { createTasks } from './task';
import type { Config, Task } from './types';

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
        await Proc.spawn('npm', ['run', 'build:ts']);
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
