import { ChildProcess } from '@banez/child_process';
import * as path from 'path';
import type { Args } from './arg';
import { createTasks } from './task';
import type { Config, Task } from './types';

export async function unlink({
  config,
  args,
}: {
  config: Config;
  args: Args;
}): Promise<void> {
  let tasks: Task[] = [
    {
      title: 'Unlink package',
      async task() {
        if (args['--sudo']) {
          await ChildProcess.spawn('sudo', ['npm', 'unlink'], {
            cwd: path.join(process.cwd(), config.tsOutputDir as string),
            stdio: 'inherit',
          });
        } else {
          await ChildProcess.spawn('npm', ['unlink'], {
            cwd: path.join(process.cwd(), config.tsOutputDir as string),
            stdio: 'inherit',
          });
        }
      },
    },
  ];
  if (config.link && config.link.override) {
    tasks = config.link.override;
  }
  await createTasks(tasks).run();
}
