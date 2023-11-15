import {ServiceProvider}                                                   from "./serviceProvider";
import {Lifecycle, ScopeLifecycle, SingletonLifecycle, TransientLifecycle} from "./lifecycles";
import {ComponentResolver}                                                 from "./componentResolver";
import {ComponentBuilder, ComponentCompleted, RegistrationFactory}         from "./registrations";

export class ServiceCollection {
    private readonly registrations: { [key: string]: ComponentResolver } = {};

    constructor(patch?: any) { // { rootNamespace }
        if (patch) {
            this.patch(patch);
        }
    }

    addScoped<T extends new (...args: any) => any>(this: ServiceCollection, type: ((registration: RegistrationFactory) => ComponentCompleted)): ServiceCollection {
        if (typeof type === "function")
            return this.add(new ScopeLifecycle(), type);
    }

    addTransient<T extends new (...args: any) => any>(this: ServiceCollection, registration: (registration: RegistrationFactory) => ComponentCompleted): ServiceCollection {
        return this.add(new TransientLifecycle(), registration);
    }

    addSingleton<T extends new (...args: any) => any>(this: ServiceCollection, registration: (registration: RegistrationFactory) => ComponentCompleted): ServiceCollection {
        return this.add(new SingletonLifecycle(), registration);
    }


    add<T extends new (...args: any) => any>(this: ServiceCollection, lifecycle: Lifecycle, registration: (registration: RegistrationFactory) => ComponentCompleted): ServiceCollection {
        let componentRegistration = registration(new RegistrationFactory()) as ComponentBuilder;
        let componentResolver = componentRegistration.build(lifecycle);
        this.registrations[componentResolver.getName()] = componentResolver;
        return this;
    }


    build(): ServiceProvider {
        return new ServiceProvider(this.registrations);
    }


    private patch = function (this: ServiceCollection, ns: any, path?: string) {
        if (ns)
            Object.keys(ns).forEach((key) => {
                const value = ns[key];
                const currentPath = path ? `${path}.${key}` : key;
                if (typeof value === 'object') {
                    this.patch(value, currentPath);
                }
                if (typeof value === 'function') {
                    Object.defineProperty(value, 'name', {
                        value: currentPath,
                        configurable: true,
                    });
                }
            });
    }
}