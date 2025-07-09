import { 
  NestedKeyOf, 
  GetNestedType, 
  ConfigListener, 
  UnsubscribeFunction, 
  ConfigOptions 
} from './types';

export class ConfigManager<T extends Record<string, any>> {
  private storageKey: string;
  private config: T;
  private listeners: Map<number, ConfigListener<T>> = new Map();
  private enablePersistence: boolean;

  constructor(
    private defaultConfig: T,
    options: ConfigOptions = {}
  ) {
    this.storageKey = options.storageKey || 'app_config';
    this.enablePersistence = options.enablePersistence ?? true;
    
    this.config = this.loadConfig();
  }

  private loadConfig(): T {
    if (!this.enablePersistence) {
      return { ...this.defaultConfig };
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<T>;
        return this.mergeConfig(this.defaultConfig, parsed);
      }
    } catch (error) {
      console.warn('Error loading config:', error);
    }
    
    return { ...this.defaultConfig };
  }

  private mergeConfig(defaultConfig: T, userConfig: Partial<T>): T {
    const merged = { ...defaultConfig };
    
    for (const [key, value] of Object.entries(userConfig)) {
      const typedKey = key as keyof T;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        merged[typedKey] = { ...defaultConfig[typedKey], ...value } as any;
      } else {
        (merged as any)[typedKey] = value;
      }
    }
    
    return merged;
  }

  private saveConfig(): void {
    if (!this.enablePersistence) {
      this.notifyListeners();
      return;
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.config));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }

  get<K extends NestedKeyOf<T>>(path: K): GetNestedType<T, K> {
    return this.getNestedValue(this.config, path as string) as GetNestedType<T, K>;
  }

  set<K extends NestedKeyOf<T>>(path: K, value: GetNestedType<T, K>): void {
    this.setNestedValue(this.config, path as string, value);
    this.saveConfig();
  }

  getMultiple<K extends NestedKeyOf<T>[]>(paths: K): { [P in K[number]]: GetNestedType<T, P> } {
    const result = {} as { [P in K[number]]: GetNestedType<T, P> };
    paths.forEach(path => {
      (result as any)[path] = this.get(path);
    });
    return result;
  }

  setMultiple(settings: { [K in NestedKeyOf<T>]?: GetNestedType<T, K> }): void {
    Object.entries(settings).forEach(([path, value]) => {
      this.setNestedValue(this.config, path, value);
    });
    this.saveConfig();
  }

  getAll(): T {
    return { ...this.config };
  }

  reset(section?: keyof T): void {
    if (section) {
      this.config[section] = { ...this.defaultConfig[section] };
    } else {
      this.config = { ...this.defaultConfig };
    }
    this.saveConfig();
  }

  subscribe(callback: ConfigListener<T>): UnsubscribeFunction {
    const id = Date.now() + Math.random();
    this.listeners.set(id, callback);
    return () => this.listeners.delete(id);
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      try {
        callback(this.config);
      } catch (error) {
        console.error('Error in config listener:', error);
      }
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  export(): string {
    return JSON.stringify(this.config, null, 2);
  }

  import(configString: string): boolean {
    try {
      const imported = JSON.parse(configString) as Partial<T>;
      this.config = this.mergeConfig(this.defaultConfig, imported);
      this.saveConfig();
      return true;
    } catch (error) {
      console.error('Error importing config:', error);
      return false;
    }
  }
} 