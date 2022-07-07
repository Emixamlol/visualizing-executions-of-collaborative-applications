// REPL

export type ParsedCode = {
  proc: string;
  parameters: string[];
};

export enum Keyword {
  const = 'const',
  delete = 'delete',
  replicate = 'replicate',
}
