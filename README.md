# Injected-ts

Injected-ts is a lightweight dependency injection library for TypeScript. It provides a container for managing and resolving dependencies within your application.

## Installation

You can install Injected-ts using npm or yarn:

```shell
npm install injected-ts
```


or

```shell
yarn add injected-ts
```

## Usage

### Creating a Container
To use Injected-ts, you need to create a container instance. The container will be responsible for registering and resolving dependencies.

```typescript
import { Container } from 'injected-ts';

const container = new Container();
```
### Registering Dependencies
You can register dependencies with the container using the register method. 
You can register dependencies by providing a constructor function or a string representing the type name.
You can also register dependencies by using a factory method.

```typescript
import { FakeType, FakeTypeWithOneDependency, FakeTypeWithTwoDependency, FakeTypeWithInterfaceDependency, DifferentInstanceType } from './your-dependency-files';

container.register(FakeType).asSingleton();
container.register(FakeTypeWithOneDependency).withConstructor(FakeType).asSingleton();
container.register(FakeTypeWithTwoDependency).withConstructor(FakeType).withConstructor(FakeTypeWithOneDependency).asSingleton();
container.register('FakeInterface').use(FakeType).asSingleton();
container.register('FakeInterface').useFactory(() => new FakeType()).asSingleton();
container.register(FakeTypeWithInterfaceDependency).withConstructor('FakeInterface').asSingleton();
container.register(DifferentInstanceType).asSingleton();
```
### Resolving Dependencies
Once you have registered dependencies, you can resolve them using the get method. The get method retrieves an instance of the registered type.
The constructor dependency will be resolved automatically. 

```typescript
const fakeTypeInstance = container.get<FakeType>(FakeType.name);
const fakeTypeWithTwoDependencyInstance = container.get<FakeTypeWithTwoDependency>(FakeTypeWithTwoDependency.name);
const fakeInterfaceInstance = container.get<FakeInterface>('FakeInterface');
```
### Scopes and Lifecycles
Injected-ts supports scoped instances and different lifecycles for dependencies. You can create a new scope using the startScope method and end the scope using the endScope method. You can also configure dependencies as singletons or transients.

```typescript
// Scopes
const scopeId = container.startScope();
// Resolve dependencies within the scope
const scopedInstance = container.get<SomeScopedDependency>('SomeScopedDependency');
container.endScope(scopeId);

// Lifecycles
container.register(SomeSingletonDependency).asSingleton(); // Singleton instance
container.register(SomeTransientDependency).transient(); // New instance every time
container.register(SomeTransientDependency).scoped(); // New instance every scope
```

### Register by module
Injected-ts provides a ContainerConfigurator class that helps in building modules and registering services into their modules. You can use the register method to register a configuration function that receives the container as a parameter. The build method can then be used to load the registered configurations onto the container.

```typescript
import { Container, ContainerConfigurator } from 'injected-ts';

// Register configurations
ContainerConfigurator.register((container: Container) => {
// Register services and dependencies
container.register(FakeType).asSingleton();
container.register(FakeTypeWithOneDependency).withConstructor(FakeType).asSingleton();
// ...
});

// Build the container with the registered configurations
const container = ContainerConfigurator.build(new Container());
```

## License
Injected-ts is licensed under the MIT License.

## Contributing
Contributions are welcome! 

## Acknowledgements
Injected-ts is inspired by various dependency injection frameworks and libraries.

## Contact
If you have any questions, issues, or suggestions, please feel free to open an issue or contact the maintainer.

Happy coding with Injected-ts!