import * as childProcess from 'child_process';

export class Proc {
  static async spawn(
    cmd: string,
    args: string[],
    options?: childProcess.SpawnOptions,
  ): Promise<void> {
    return await new Promise<void>((resolve, reject) => {
      const proc = childProcess.spawn(
        cmd,
        args,
        options
          ? options
          : {
              stdio: 'inherit',
            },
      );
      proc.on('close', (code) => {
        if (code !== 0) {
          reject('Child process failed with code ' + code);
        } else {
          resolve();
        }
      });
    });
  }
  static async exec(
    cmd: string,
    onChunk?: (type: 'stdout' | 'stderr', chunk: string) => void,
  ): Promise<void> {
    return await new Promise<void>((resolve, reject) => {
      const proc = childProcess.exec(cmd);
      let err = '';
      if (proc.stderr) {
        proc.stderr.on('data', (chunk) => {
          if (onChunk) {
            onChunk('stderr', chunk);
          }
          err += chunk;
        });
      }
      if (proc.stdout && onChunk) {
        proc.stdout.on('data', (chunk) => {
          onChunk('stdout', chunk);
        });
      }
      proc.on('close', (code) => {
        if (code !== 0) {
          reject(Error(err));
        } else {
          resolve();
        }
      });
    });
  }
  static advancedExec(
    cmd: string,
    onChunk?: (type: 'stdout' | 'stderr', chunk: string) => void,
  ): {
    wait: Promise<void>;
    stop(): void;
  } {
    let proc: childProcess.ChildProcess;
    function stop() {
      if (proc) {
        proc.kill();
      }
    }
    const promise = new Promise<void>((resolve, reject) => {
      proc = childProcess.exec(cmd);
      let err = '';
      if (proc.stderr) {
        proc.stderr.on('data', (chunk) => {
          if (onChunk) {
            onChunk('stderr', chunk);
          }
          err += chunk;
        });
      }
      if (proc.stdout && onChunk) {
        proc.stdout.on('data', (chunk) => {
          onChunk('stdout', chunk);
        });
      }
      proc.on('close', (code) => {
        if (code !== 0) {
          reject(Error(err));
        } else {
          resolve();
        }
      });
    });
    return {
      stop,
      wait: promise,
    };
  }
}
