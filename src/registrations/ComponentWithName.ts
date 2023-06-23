import {ComponentCompleted}          from "./ComponentCompleted";
import {ComponentAlreadyImplemented} from "./ComponentAlreadyImplemented";
import {Constructor, Factory}        from "../Constructor";
import {ComponentWithConstructor}    from "./ComponentWithConstructor";

import {ComponentWithoutDependencies} from "./ComponentWithoutDependencies";

export class ComponentWithName {
    private readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    useFactory(factory: Factory<any>): ComponentCompleted {
        return new ComponentAlreadyImplemented(this.name, factory, []);
    }

    useType<T extends new (...args: any) => any>(objImplementation: Constructor<T>): ComponentWithoutDependencies {
        return ComponentWithConstructor.createRegistration(this.name, objImplementation);
    }
}