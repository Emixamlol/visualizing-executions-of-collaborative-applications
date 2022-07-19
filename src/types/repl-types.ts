// REPL

export type ParsedCode = {
  proc: string;
  parameters: Array<string>;
};

export enum Keyword {
  const = 'const',
  delete = 'delete',
  replicate = 'replicate',
}
