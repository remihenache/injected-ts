import {Constructor} from "./constructor";

export class ContainerRegistration {
    typeToImplement: string;
    typeToUse: undefined | string;
    constructorParamsToUse: string[] = [];
    factory: undefined | (() => any);
    constructorFunc: undefined | (new (...args: any[]) => any);
    isSingleton = false;
    isInScope = false;

    constructor(typename: string) {
        this.typeToImplement = typename;
    }

    use = function <T extends new (...args: any) => any>(this: ContainerRegistration, objImplementation: Constructor<T>): ContainerRegistration {
        this.constructorFunc = objImplementation;
        this.typeToUse = (objImplementation as any).name;
        if (!this.typeToUse)
            throw new Error("le type " + objImplementation + " n'est pas enregistré dans l'ioc !");
        if (this.typeToUse.endsWith(".constructorFunc"))
            this.typeToUse = this.typeToUse.replace(".constructorFunc", "");

        return this;
    }

    useFactory = function <T>(this: ContainerRegistration, provider: () => T): ContainerRegistration {
        this.factory = provider;
        return this;
    }

    withConstructor<T>(this: ContainerRegistration, constType: string): ContainerRegistration;
    withConstructor<T extends new (...args: any) => any>(this: ContainerRegistration, constType: Constructor<T>): ContainerRegistration;
    withConstructor<T extends new (...args: any) => any>(this: ContainerRegistration, constType: Constructor<T> | string): ContainerRegistration {
        let typeName = (constType as any).name;
        if (typeName) {
            if (typeName.endsWith(".constructorFunc"))
                typeName = typeName.replace(".constructorFunc", "");

            this.constructorParamsToUse.push(typeName);
        }
        else
            this.constructorParamsToUse.push(constType as string);
        return this;
    }

    asSingleton = function (this: ContainerRegistration): ContainerRegistration {
        this.isSingleton = true;
        this.isInScope = false;
        return this;
    }

    scoped = function (this: ContainerRegistration): ContainerRegistration {
        this.isSingleton = false;
        this.isInScope = true;
        return this;
    }

    transient = function (this: ContainerRegistration): ContainerRegistration {
        this.isSingleton = false;
        this.isInScope = false;
        return this;
    }
}