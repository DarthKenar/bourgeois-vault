# BourgeoisVault

A TypeScript generic library for managing application configurations with complete type safety.

## Features

- 🔒 **Type-safe**: Complete TypeScript type safety
- 🎯 **Generic**: Users define their own configuration types
- 📦 **Persistent**: Automatically saves to localStorage
- 🔄 **Reactive**: Subscription system for configuration changes
- ⚛️ **React Hooks**: Ready-to-use React hooks
- 🎨 **Dot notation**: Access nested properties with dot notation
- 📝 **Flexible**: Default configuration and customizable options
- 🧪 **Testable**: Well-structured for unit testing

## Installation

```bash
npm install bourgeois-vault
```

## Quick Start

### 1. Define Your Configuration Interface

```typescript
interface MyAppConfig {
  ui: {
    theme: 'light' | 'dark' | 'auto';
    showSidebar: boolean;
    language: 'es' | 'en' | 'fr';
  };
  performance: {
    enableCache: boolean;
    maxCacheSize: number;
  };
  features: {
    betaFeatures: boolean;
    analytics: boolean;
  };
}
```

### 2. Create Default Configuration

```typescript
const defaultConfig: MyAppConfig = {
  ui: {
    theme: 'light',
    showSidebar: true,
    language: 'es'
  },
  performance: {
    enableCache: true,
    maxCacheSize: 100
  },
  features: {
    betaFeatures: false,
    analytics: true
  }
};
```

### 3. Initialize Configuration Manager

```typescript
import { createConfigManager } from 'bourgeois-vault';

const configManager = createConfigManager(defaultConfig, {
  storageKey: 'my-app-config',
  enablePersistence: true
});
```

### 4. Use the Configuration

```typescript
// Get values
const theme = configManager.get('ui.theme');
const cacheEnabled = configManager.get('performance.enableCache');

// Set values
configManager.set('ui.theme', 'dark');
configManager.set('performance.maxCacheSize', 200);

// Set multiple values
configManager.setMultiple({
  'ui.showSidebar': false,
  'features.betaFeatures': true,
  'ui.language': 'en'
});
```

## React Integration

### Basic Hook Usage

```typescript
import { useConfig } from 'bourgeois-vault';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useConfig(configManager, 'ui.theme');
  
  return (
    <select 
      value={theme} 
      onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'auto')}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="auto">Auto</option>
    </select>
  );
};
```

### Multiple Values Hook

```typescript
import { useMultipleConfig } from 'bourgeois-vault';

const SettingsPanel: React.FC = () => {
  const config = useMultipleConfig(configManager, [
    'ui.theme',
    'ui.showSidebar',
    'features.betaFeatures'
  ]);
  
  return (
    <div>
      <p>Theme: {config['ui.theme']}</p>
      <p>Sidebar: {config['ui.showSidebar'] ? 'Visible' : 'Hidden'}</p>
      <p>Beta: {config['features.betaFeatures'] ? 'Enabled' : 'Disabled'}</p>
    </div>
  );
};
```

### Complete Configuration Hook

```typescript
import { useAllConfig } from 'bourgeois-vault';

const ConfigViewer: React.FC = () => {
  const config = useAllConfig(configManager);
  
  return (
    <pre>{JSON.stringify(config, null, 2)}</pre>
  );
};
```

## Advanced Usage

### Subscription to Changes

```typescript
const unsubscribe = configManager.subscribe((config) => {
  console.log('Configuration updated:', config);
});

// Later, unsubscribe
unsubscribe();
```

### Getting Multiple Values

```typescript
const values = configManager.getMultiple([
  'ui.theme',
  'ui.showSidebar',
  'performance.enableCache'
]);
// Returns: { 'ui.theme': 'light', 'ui.showSidebar': true, 'performance.enableCache': true }
```

### Resetting Configuration

```typescript
// Reset entire configuration
configManager.reset();

// Reset specific section
configManager.reset('ui');
```

### Import/Export Configuration

```typescript
// Export configuration as JSON string
const configString = configManager.export();

// Import configuration from JSON string
const success = configManager.import(configString);
```

## Multiple Configuration Managers

You can create multiple configuration managers for different parts of your application:

```typescript
// Game configuration
interface GameConfig {
  player: {
    name: string;
    level: number;
    inventory: string[];
  };
  settings: {
    difficulty: 'easy' | 'medium' | 'hard';
    soundEnabled: boolean;
    volume: number;
  };
}

const gameDefaultConfig: GameConfig = {
  player: {
    name: 'Player1',
    level: 1,
    inventory: []
  },
  settings: {
    difficulty: 'medium',
    soundEnabled: true,
    volume: 0.8
  }
};

const gameConfig = createConfigManager(gameDefaultConfig, {
  storageKey: 'game-config'
});

// Full type safety
gameConfig.set('player.name', 'Hero');
gameConfig.set('player.level', 10);
gameConfig.set('settings.difficulty', 'hard');

// TypeScript will prevent invalid values
// gameConfig.set('settings.difficulty', 'impossible'); // ❌ Error!
// gameConfig.set('player.level', 'high'); // ❌ Error!
```

## API Reference

### ConfigManager

```typescript
class ConfigManager<T extends Record<string, any>>
```

#### Methods

- `get<K>(path: K): GetNestedType<T, K>` - Get a value by its path
- `set<K>(path: K, value: GetNestedType<T, K>): void` - Set a value
- `getMultiple<K>(paths: K[]): {...}` - Get multiple values
- `setMultiple(settings: {...}): void` - Set multiple values
- `getAll(): T` - Get entire configuration
- `reset(section?: keyof T): void` - Reset to default values
- `subscribe(callback: ConfigListener<T>): UnsubscribeFunction` - Subscribe to changes
- `export(): string` - Export configuration as JSON
- `import(configString: string): boolean` - Import configuration from JSON

### React Hooks

```typescript
// Hook for a specific value
useConfig<T, K>(configManager: ConfigManager<T>, path: K): [value, setValue]

// Hook for multiple values
useMultipleConfig<T, K>(configManager: ConfigManager<T>, paths: K[]): {...}

// Hook for entire configuration
useAllConfig<T>(configManager: ConfigManager<T>): T
```

### Configuration Options

```typescript
interface ConfigOptions {
  storageKey?: string;        // localStorage key (default: 'app_config')
  enablePersistence?: boolean; // Enable localStorage persistence (default: true)
  validateConfig?: boolean;    // Validate configuration (default: true)
}
```

### Factory Function

```typescript
function createConfigManager<T extends Record<string, any>>(
  defaultConfig: T,
  options?: ConfigOptions
): ConfigManager<T>
```

## Type Safety

The library provides complete TypeScript type safety:

```typescript
// ✅ Valid operations
configManager.set('ui.theme', 'dark');
configManager.set('performance.maxCacheSize', 200);
configManager.set('features.betaFeatures', true);

// ❌ TypeScript errors
configManager.set('ui.theme', 'purple'); // Invalid theme value
configManager.set('performance.maxCacheSize', 'large'); // Wrong type
configManager.set('nonexistent.path', 'value'); // Path doesn't exist
```

## Examples

### E-commerce Application

```typescript
interface ECommerceConfig {
  checkout: {
    enableGuestCheckout: boolean;
    requirePhoneNumber: boolean;
    defaultShippingMethod: 'standard' | 'express' | 'overnight';
  };
  display: {
    productsPerPage: number;
    showReviews: boolean;
    enableWishlist: boolean;
  };
  payment: {
    enablePayPal: boolean;
    enableStripe: boolean;
    enableApplePay: boolean;
  };
}

const ecommerceConfig = createConfigManager<ECommerceConfig>({
  checkout: {
    enableGuestCheckout: true,
    requirePhoneNumber: false,
    defaultShippingMethod: 'standard'
  },
  display: {
    productsPerPage: 20,
    showReviews: true,
    enableWishlist: true
  },
  payment: {
    enablePayPal: true,
    enableStripe: true,
    enableApplePay: false
  }
}, {
  storageKey: 'ecommerce-settings'
});
```

### Dashboard Application

```typescript
interface DashboardConfig {
  layout: {
    sidebar: 'collapsed' | 'expanded' | 'hidden';
    topbar: boolean;
    footer: boolean;
  };
  widgets: {
    charts: boolean;
    notifications: boolean;
    recentActivity: boolean;
  };
  user: {
    autoSave: boolean;
    defaultView: 'grid' | 'list';
    refreshInterval: number;
  };
}

const dashboardConfig = createConfigManager<DashboardConfig>({
  layout: {
    sidebar: 'expanded',
    topbar: true,
    footer: true
  },
  widgets: {
    charts: true,
    notifications: true,
    recentActivity: false
  },
  user: {
    autoSave: true,
    defaultView: 'grid',
    refreshInterval: 30000
  }
}, {
  storageKey: 'dashboard-config'
});
```

## Benefits

1. **Generic**: No predefined configurations - users define their own
2. **Type-safe**: Complete TypeScript type inference and validation
3. **Flexible**: Customizable options and behavior
4. **Scalable**: Works with any configuration structure
5. **Reusable**: Can be used across multiple projects
6. **Maintainable**: Clean, organized, and modular code structure
7. **Testable**: Easy to unit test and mock

## Development

### Building the Library

```bash
npm run build
```

### Running Tests

```bash
npm test
```

### Publishing

```bash
# Patch version (0.1.0 → 0.1.1)
npm run version:patch

# Minor version (0.1.0 → 0.2.0)
npm run version:minor  

# Major version (0.1.0 → 1.0.0)
npm run version:major

# Publish to npm
npm run publish:latest

# Publish beta version
npm run publish:beta
```

## Browser Support

- Modern browsers with ES2020 support
- localStorage support required for persistence
- React 16.8+ for hooks

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT