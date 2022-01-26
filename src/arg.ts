export interface Args {
  [name: string]: string | boolean | undefined;
}

export function parseArgs(rawArgs: string[]): Args {
  const args: Args = {};
  let i = 2;
  while (i < rawArgs.length) {
    const arg = rawArgs[i];
    let value = '';
    if (rawArgs[i + 1]) {
      value = rawArgs[i + 1].startsWith('--') ? '' : rawArgs[i + 1];
    }
    args[arg] = value;
    if (!args[arg]) {
      args[arg] = true;
    }
    if (value === '') {
      i = i + 1;
    } else {
      i = i + 2;
    }
  }
  return args;
}
