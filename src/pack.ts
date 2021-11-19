import * as path from 'path';
import { Proc } from './process';
import { createTasks } from './task';
import type { Config, Task } from './types';

export async function pack({ config }: { config: Config }): Promise<void> {
  let tasks: Task[] = [
    {
      title: 'Package output',
      async task() {
        await Proc.spawn('npm', ['pack'], {
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
