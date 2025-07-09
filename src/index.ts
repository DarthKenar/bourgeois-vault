import { ConfigManager } from './ConfigManager';
import { ConfigOptions } from './types';

export { ConfigManager } from './ConfigManager';
export { useConfig, useMultipleConfig, useAllConfig } from './hooks';
export type { 
  NestedKeyOf, 
  GetNestedType, 
  ConfigListener, 
  UnsubscribeFunction, 
  ConfigOptions 
} from './types';

export function createConfigManager<T extends Record<string, any>>(
  defaultConfig: T,
  options?: ConfigOptions
) {
  return new ConfigManager(defaultConfig, options);
} 