import {Constructor}                  from "../Constructor";
import {ComponentWithConstructor}     from "./ComponentWithConstructor";
import {ComponentWithName}            from "./ComponentWithName";
import {ComponentWithoutDependencies} from "./ComponentWithoutDependencies";

export class RegistrationFactory {

    fromName(typeName: string): ComponentWithName {
        return new ComponentWithName(typeName);
    }

    fromType<T extends new (...args: any) => any>(objImplementation: Constructor<T>): ComponentWithoutDependencies {
        return ComponentWithConstructor.createRegistration(objImplementation.name, objImplementation);
    }
}