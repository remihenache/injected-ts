# Injected-ts: Simplifying Dependency Injection in TypeScript

Injected-ts is a lightweight dependency injection library for TypeScript that simplifies managing dependencies and enables efficient dependency injection in your applications. With Injected-ts, you can effortlessly handle dependency registration, resolution, and lifecycle management, resulting in cleaner and more modular code. This readme provides an overview of Injected-ts and demonstrates how to use it effectively in your projects.

## Features

- **Dependency Registration**: Injected-ts allows you to register dependencies using a fluent and intuitive API.
- **Flexible Lifecycle Management**: Choose from a variety of lifecycle options, including scoped, transient, and singleton.
- **Constructor Parameter Injection**: Easily configure dependencies with constructor parameter injection.
- **Interface Injection**: Register implementations for interfaces and resolve them by the interface identifier.
- **Scopes and Lifecycles**: Create and manage scopes to control the lifetime of your dependencies.
- **Type Safety and IntelliSense**: Benefit from TypeScript's static typing and receive accurate IntelliSense support.

## Installation

You can install Injected-ts using npm or yarn:

```shell
npm install injected-ts
```

## Usage
Creating a Service Collection
The ServiceCollection class is the starting point for configuring and registering your services. Create an instance of ServiceCollection to begin the process:

```typescript
import { ServiceCollection } from 'injected-ts';

const services = new ServiceCollection();
```

## Registering Dependencies
Use the various addScoped, addTransient, and addSingleton methods to register your dependencies. These methods allow you to specify the dependency type and the registration configuration:

```typescript
services.addScoped<MyService>((builder) =>
  builder.fromType(MyService).withDependencies(Dependency1, Dependency2)
);

services.addTransient<AnotherService>((builder) =>
  builder.fromType(AnotherService)
);

services.addSingleton<SharedService>((builder) =>
  builder.fromType(SharedService)
);
```

## Resolving Dependencies
To resolve a dependency, create an instance of ServiceProvider using the build method of ServiceCollection:

```typescript
const serviceProvider = services.build();

const myService = serviceProvider.get<MyService>(MyService.name);
const anotherService = serviceProvider.get<AnotherService>(AnotherService.name);
const sharedService = serviceProvider.get<SharedService>(SharedService.name);
```

## Scopes and Lifecycles
You can create scopes using the startScope method of ServiceProvider and manage the lifetime of dependencies within those scopes:

```typescript
const scopeId = serviceProvider.startScope();
// Resolve scoped dependencies within the scope

serviceProvider.endScope(scopeId);
```

## Constructor Parameter Injection
Injected-ts supports constructor parameter injection. When registering a dependency, use the withDependencies method to specify the constructor dependencies:

```typescript
services.addScoped<MyService>((builder) =>
  builder.fromType(MyService).withDependencies(Dependency1, Dependency2)
);
```
## Interface Injection
You can register interface implementations and resolve them using the interface identifier:

```typescript
services.addScoped<ILogger>((builder) =>
  builder.fromName('ILogger').useType(ConsoleLogger).withDependencies()
);

const logger = serviceProvider.get<ILogger>('ILogger');
```

## Lifecycle Options
Injected-ts provides the following lifecycle options for managing the lifetime of dependencies:

- **Scoped**: Dependencies are instantiated once per scope.
- **Transient**: Dependencies are instantiated each time they are resolved.
- **Singleton**: Dependencies are instantiated only once and reused for subsequent resolutions.
You can specify the lifecycle using the addScoped, addTransient, and addSingleton methods:

```typescript
services.addScoped<MyService>((builder) =>
  builder.fromType(MyService).withDependencies(Dependency1, Dependency2)
);
```

## Custom Lifecycle Options
Injected-ts provides the possibility to create our own lifecycle:

Override the Lifecycle class and implement the lifecycle methods.
Then add your service using the add() methods, and provide your own lifecycle.

```typescript
class CustomLifecycle implements Lifecycle {
  // Implement the lifecycle methods
}

services.add<MyService>(new CustomLifecycle(), (builder) =>
  builder.fromType(MyService).withDependencies(Dependency1, Dependency2)
);
```

## Use the ServiceProvider inside a class or a factory
Injected-ts provides the possibility to access the service provider instance by injecting it inside a class or a factory:

- Injection
```typescript
class MyService {
  constructor(serviceProvider: ServiceProvider) {}

  public doSomething() {
    const anotherService = this.serviceProvider.get<AnotherService>(AnotherService.name);
    // Do something with the service
  }
}
```
- Factory
```typescript
services.addSingleton<ServiceDependency>((builder) =>
    builder.fromType(ServiceDependency.name).withDependencies(TypeDependency)
);
services.addSingleton<MyService>((builder) =>
    builder.fromName('MyService').useFactory((serviceProvider) => new MyService("Some value", serviceProvider.get<ServiceDependency>(ServiceDependency.name)))
);
```

## Conclusion
Injected-ts simplifies dependency injection in TypeScript by providing a lightweight and intuitive solution for managing dependencies and controlling their lifecycles. By following the usage guidelines in this readme, you can leverage the power of dependency injection to build modular, maintainable, and scalable applications.

For more details and advanced usage options, refer to the API Documentation.

## License
Injected-ts is licensed under the MIT License. See the LICENSE file for details.