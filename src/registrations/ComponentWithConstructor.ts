import {Constructor}                  from "../Constructor";
import {ComponentCompleted}           from "./ComponentCompleted";
import {ComponentAlreadyImplemented}  from "./ComponentAlreadyImplemented";
import {ComponentBuilder}             from "./ComponentBuilder";
import {ComponentWithoutDependencies} from "./ComponentWithoutDependencies";
import {Lifecycle}                    from "../lifecycles";
import {ComponentResolver}            from "../ComponentResolver";

export class ComponentWithConstructor implements ComponentWithoutDependencies, ComponentBuilder {
    private readonly _typeName: string;
    private _constructorFunc: (new (...args: any[]) => any);

    private constructor(typeName: string) {
        this._typeName = typeName;
    }

    static createRegistration<T extends new (...args: any) => any>(typeName: string, objImplementation: Constructor<T>): ComponentWithConstructor {
        let registration = new ComponentWithConstructor(typeName);
        registration._constructorFunc = objImplementation;
        return registration;
    }

    withDependencies(...dependencies: (string | Constructor<any>)[]): ComponentCompleted {
        return new ComponentAlreadyImplemented(this._typeName, (...args) => new this._constructorFunc(...args), dependencies.map(dependency => typeof dependency === "string" ? dependency : dependency.name));
    }

    public build(lifecycle: Lifecycle): ComponentResolver {
        lifecycle.useFactory((...args) => new this._constructorFunc(...args))
        return new ComponentResolver(this._typeName, lifecycle, []);
    }

}