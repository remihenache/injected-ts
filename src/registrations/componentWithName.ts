import {ComponentCompleted}          from "./componentCompleted";
import {ComponentAlreadyImplemented} from "./componentAlreadyImplemented";
import {Constructor, Factory}     from "../constructor";
import {ComponentWithConstructor} from "./componentWithConstructor";

import {ComponentWithoutDependencies} from "./componentWithoutDependencies";

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