import { ChildProcess } from '@banez/child_process';
import * as path from 'path';
import { createTasks } from './task';
import type { Config, Task } from './types';

export async function pack({ config }: { config: Config }): Promise<void> {
  let tasks: Task[] = [
    {
      title: 'Package output',
      async task() {
        await ChildProcess.spawn('npm', ['pack'], {
          cwd: path.join(process.cwd(), config.tsOutputDir as string),
          stdio: 'inherit',
        });
      },
    },
  ];
  if (config.pack && config.pack.override) {
    tasks = config.pack.override;
  }
  await createTasks(tasks).run();
}
