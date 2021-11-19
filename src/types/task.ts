export interface Task {
  title: string;
  task<Input, Output>(previousTaskResult?: Input): Promise<Output | void>;
}
