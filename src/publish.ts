import * as path from 'path';
import * as fse from 'fs-extra';
import type { Config, Task } from './types';
import { Proc } from './process';
import { createTasks } from './task';

export async function publish({ config }: { config: Config }): Promise<void> {
  let tasks: Task[] = [
    {
      title: 'Check if node_modules are present',
      async task() {
        if (
          (await fse.pathExists(
            path.join(
              process.cwd(),
              config.tsOutputDir as string,
              'node_modules',
            ),
          )) ||
          (await fse.pathExists(
            path.join(
              process.cwd(),
              config.tsOutputDir as string,
              'package-lock.json',
            ),
          ))
        ) {
          throw new Error(
            `Please remove "${path.join(
              process.cwd(),
              config.tsOutputDir as string,
              'node_modules',
            )}" and "${path.join(
              process.cwd(),
              config.tsOutputDir as string,
              'package-lock.json',
            )}"`,
          );
        }
      },
    },
    {
      title: 'Publish to NPM',
      async task() {
        await Proc.spawn(
          'npm',
          [
            'publish',
            '--access',
            config.publish && config.publish.access
              ? config.publish.access
              : 'public',
          ],
          {
            cwd: path.join(process.cwd(), config.tsOutputDir as string),
            stdio: 'inherit',
          },
        );
      },
    },
  ];
  if (config.publish && config.publish.override) {
    tasks = config.publish.override;
  }
  await createTasks(tasks).run();
}
