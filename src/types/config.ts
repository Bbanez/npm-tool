import type { Args } from '../arg';
import type { Task } from './task';

export interface Config {
  tsOutputDir?: string;
  bundle?: {
    extend?: Task[];
    override?: Task[];
  };
  publish?: {
    access?: 'public' | 'private',
    override?: Task[];
  };
  link?: {
    override?: Task[];
  };
  unlink?: {
    override?: Task[];
  };
  pack?: {
    override?: Task[];
  };
  custom?: {
    [argName: string]: ({
      config,
      args,
    }: {
      config: Config;
      args: Args;
    }) => Promise<void>;
  };
}
