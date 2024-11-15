export type Dict<T> = {
  [key: string]: T;
}

export type Writable<T> = {
  -readonly [K in keyof T]: T[K];
}
