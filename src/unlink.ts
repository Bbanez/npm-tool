import * as path from 'path';
import type { Args } from './arg';
import { Proc } from './process';
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
          await Proc.spawn('sudo', ['npm', 'unlink'], {
            cwd: path.join(process.cwd(), config.tsOutputDir as string),
            stdio: 'inherit',
          });
        } else {
          await Proc.spawn('npm', ['unlink'], {
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
