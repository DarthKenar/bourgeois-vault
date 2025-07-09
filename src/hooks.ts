import { useState, useEffect, useCallback } from 'react';
import { ConfigManager } from './ConfigManager';
import { NestedKeyOf, GetNestedType } from './types';

export function useConfig<T extends Record<string, any>, K extends NestedKeyOf<T>>(
  configManager: ConfigManager<T>,
  path: K
): [GetNestedType<T, K>, (value: GetNestedType<T, K>) => void] {
  const [value, setValue] = useState<GetNestedType<T, K>>(() => configManager.get(path));
  
  useEffect(() => {
    const unsubscribe = configManager.subscribe(() => {
      setValue(configManager.get(path));
    });
    
    return unsubscribe;
  }, [configManager, path]);
  
  const updateValue = useCallback((newValue: GetNestedType<T, K>) => {
    configManager.set(path, newValue);
  }, [configManager, path]);
  
  return [value, updateValue];
}

export function useMultipleConfig<T extends Record<string, any>, K extends NestedKeyOf<T>[]>(
  configManager: ConfigManager<T>,
  paths: K
): { [P in K[number]]: GetNestedType<T, P> } {
  const [values, setValues] = useState(() => configManager.getMultiple(paths));
  
  useEffect(() => {
    const unsubscribe = configManager.subscribe(() => {
      setValues(configManager.getMultiple(paths));
    });
    
    return unsubscribe;
  }, [configManager, paths]);
  
  return values;
}

export function useAllConfig<T extends Record<string, any>>(
  configManager: ConfigManager<T>
): T {
  const [config, setConfig] = useState<T>(() => configManager.getAll());
  
  useEffect(() => {
    const unsubscribe = configManager.subscribe((newConfig) => {
      setConfig(newConfig);
    });
    
    return unsubscribe;
  }, [configManager]);
  
  return config;
} 