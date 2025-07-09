export type NestedKeyOf<T> = {
  [K in keyof T]: T[K] extends object
    ? K extends string
      ? `${K}.${NestedKeyOf<T[K]>}` | K
      : never
    : K extends string
    ? K
    : never;
}[keyof T];

export type GetNestedType<T, K extends string> = K extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? GetNestedType<T[Key], Rest>
    : never
  : K extends keyof T
  ? T[K]
  : never;

export type ConfigListener<T> = (config: T) => void;
export type UnsubscribeFunction = () => void;

export interface ConfigOptions {
  storageKey?: string;
  enablePersistence?: boolean;
  validateConfig?: boolean;
} 