import type { Task } from './types';

export function createTasks(tasks: Task[]): {
  run(): Promise<void>;
} {
  return {
    async run() {
      let rez: unknown = undefined;
      for (let i = 0; i < tasks.length; i = i + 1) {
        const t = tasks[i];
        // eslint-disable-next-line no-console
        console.log(`${i + 1}. ${t.title}`);
        try {
          rez = await t.task(rez);
          // eslint-disable-next-line no-console
          console.log(`${i + 1}. ✓ ${t.title}`);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(`${i + 1}. ⨉ ${t.title}`);
          throw error;
        }
      }
    },
  };
}
