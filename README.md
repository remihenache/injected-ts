# Injected-ts

Injected-ts is a lightweight dependency injection library for TypeScript. It provides a container for managing and resolving dependencies within your application.

Why Injected-ts?
Injected-ts aims to provide a simple yet powerful solution for managing dependencies in TypeScript applications. Here are some reasons why you should consider using Injected-ts in your projects:

Simplified Dependency Management: Injected-ts simplifies the process of registering and resolving dependencies within your application. It provides a container that acts as a central hub for managing dependencies.

Flexible Dependency Resolution: Injected-ts supports constructor injection, interface injection, and factory injection. You can easily configure how dependencies are resolved and specify their lifecycles.

Scopes and Lifecycles: Injected-ts allows you to define scoped instances and control the lifecycles of dependencies. You can create scoped instances for request-level dependencies or configure singletons for globally shared instances.

Type Safety and IntelliSense: TypeScript's static typing ensures that dependencies are resolved with type safety. Injected-ts leverages TypeScript's features to provide accurate IntelliSense support during development.

# Getting Started with Injected-ts
To get started with Injected-ts, follow these steps:

## 1- Installation:
Install Injected-ts using npm or yarn by running the following command:

```shell
npm install injected-ts
```

or

```shell
yarn add injected-ts
```
## 2- Creating a Container:
Create an instance of the Container class to manage your dependencies. The container acts as a registry for dependency registration and resolution.


```typescript
import { Container } from 'injected-ts';

const container = new Container();
```

## 3- Registering Dependencies: 
Use the register method on the container to register your dependencies. You can register dependencies by providing a constructor function or a string representing the type name.

```typescript
container.register(FakeType).asSingleton();
container.register('FakeInterface').use(FakeType).asSingleton();
container.register(FakeTypeWithOneDependency).withConstructor(FakeType).asSingleton();
container.register(FakeTypeWithTwoDependency).withConstructor(FakeType).withConstructor(FakeTypeWithOneDependency).asSingleton();
// Register other dependencies
```
>> ***Use the 'withConstructor' once by constructor argument to register dependencies with constructor injection. It should be called in same order as the constructor arguments.***

## 4- Resolving Dependencies: 
Use the get method on the container to resolve your dependencies. The get method retrieves an instance of the registered type.

```typescript
const fakeTypeInstance = container.get<FakeType>(FakeType.name);
const fakeInterfaceInstance = container.get<FakeInterface>('FakeInterface');
// Resolve other dependencies
```
## 5- Scopes and Lifecycles: 
Utilize the container's scope and lifecycle options to control how dependencies are instantiated. You can create scopes, start and end them using startScope and endScope methods, and configure dependencies as singletons or transients.

```typescript
const scopeId = container.startScope();
// Resolve scoped dependencies within the scope
container.endScope(scopeId);

container.register(FakeType).transient();
container.register(SomeSingletonDependency).asSingleton();
container.register(SomeScopedDependency).scoped();
// Configure other dependencies
```

## 6- Advanced Usage: 
Injected-ts provides advanced features such as constructor parameter injection, interface injection, and factory injection. You can configure these options using the appropriate methods on the container's registration objects.

```typescript
container.register(FakeTypeWithTwoDependency).withConstructor(FakeType).withConstructor(FakeType).asSingleton();
container.register(FakeTypeWithInterfaceDependency).withConstructor('FakeInterface').asSingleton();
container.register('FakeInterface').useFactory(() => new FakeType()).asSingleton();
// Configure other dependencies
```

## 7- Building Modules with ContainerConfigurator
To facilitate modular dependency configuration, Injected-ts provides the ContainerConfigurator class. It allows you to register services and dependencies into modules and load them onto the container.

```typescript
import { Container, ContainerConfigurator } from 'injected-ts';

// Register configurations
ContainerConfigurator.register((container: Container) => {
// Register services and dependencies for Module A
container.register(FakeType).asSingleton();
container.register(FakeTypeWithOneDependency).withConstructor(FakeType).asSingleton();
// ...
});

ContainerConfigurator.register((container: Container) => {
// Register services and dependencies for Module B
container.register('FakeInterface').use(FakeType).asSingleton();
container.register(FakeTypeWithInterfaceDependency).withConstructor('FakeInterface').asSingleton();
// ...
});

// Build the container with the registered configurations
const container = ContainerConfigurator.build(new Container());
```

# License
Injected-ts is licensed under the MIT License.

# Contributing
Contributions are welcome! 

# Acknowledgements
Injected-ts is inspired by various dependency injection frameworks and libraries.

# Contact
If you have any questions, issues, or suggestions, please feel free to open an issue or contact the maintainer.

Happy coding with Injected-ts!