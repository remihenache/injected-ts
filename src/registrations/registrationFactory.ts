import {Constructor}              from "../constructor";
import {ComponentWithConstructor}     from "./componentWithConstructor";
import {ComponentWithName}            from "./componentWithName";
import {ComponentWithoutDependencies} from "./componentWithoutDependencies";

export class RegistrationFactory {

    fromName(typeName: string): ComponentWithName {
        return new ComponentWithName(typeName);
    }

    fromType<T extends new (...args: any) => any>(objImplementation: Constructor<T>): ComponentWithoutDependencies {
        return ComponentWithConstructor.createRegistration(objImplementation.name, objImplementation);
    }
}