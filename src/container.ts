import {ContainerRegistration}            from "./container-registration";
import {Constructor, ConstructorFuncName} from "./constructor";

export class Container {
    private registrations: { [key: string]: ContainerRegistration } = {};
    private instances: { [instanceKey: string]: any } = {};
    private scopedInstances: { [scopeKey: number]: { [instanceKey: string]: any } } = {};
    private currentScope: number = 0;

    constructor(patch?: any) { // { rootNamespace }
        if (patch) {
            this.patch(patch);
        }
    }

    register<T>(this: Container, objToImplement: string): ContainerRegistration;
    register<T extends new (...args: any) => any>(this: Container, objToImplement: Constructor<T>): ContainerRegistration;
    register<T extends new (...args: any) => any>(this: Container, objToImplement: Constructor<T> | string): ContainerRegistration {
        let typeName = objToImplement as string;
        if ((objToImplement as Constructor<T>).name) {
            typeName = (objToImplement as Constructor<T>).name;
            if (typeName.endsWith(ConstructorFuncName))
                typeName = typeName.replace(ConstructorFuncName, "");
        }

        let registration = new ContainerRegistration(typeName);
        this.registrations[typeName] = registration;

        if ((objToImplement as Constructor<T>).name) {
            this.registrations[typeName].constructorFunc = objToImplement as Constructor<T>;
        }
        return registration;
    }

    get<T>(this: Container, objToImplement: string): T;
    get<T extends new (...args: any) => any>(this: Container, objToImplement: Constructor<T>): T;
    get<T extends new (...args: any) => any>(this: Container, objToImplement: Constructor<T> | string): T {
        let typeName = objToImplement as string;
        if ((objToImplement as Constructor<T>).name) {
            typeName = (objToImplement as Constructor<T>).name;
            if (typeName.endsWith(ConstructorFuncName))
                typeName = typeName.replace(ConstructorFuncName, "");
        }
        let registration = this.registrations[typeName];
        if (!registration)
            throw new Error("Type " + typeName + " not found");

        return this.getFromRegistration(registration);

    }

    startScope(): number {
        let scopeId = Math.floor(Math.random() * 1000) + 1; // returns a random integer from 1 to 100
        while (this.scopedInstances[scopeId])
            scopeId = Math.floor(Math.random() * 1000) + 1;
        this.scopedInstances[scopeId] = {};
        this.currentScope = scopeId;
        return scopeId;
    }

    endScope(scopeId: number): void {
        delete this.scopedInstances[scopeId];
    }

    private getFromRegistration = function (this: Container, registration: ContainerRegistration) {
        if (registration.factory)
            return this.getFromLifecyle(registration, registration.factory);
        else if ((!registration.constructorParamsToUse || !registration.constructorParamsToUse.length)) { // @ts-ignore
            return this.getFromLifecyle(registration, () => new registration.constructorFunc());
        }
        else {
            let constructs: any[] = [];
            for (let i = 0; i < registration.constructorParamsToUse.length; i++) {
                if (!this.registrations[registration.constructorParamsToUse[i]])
                    throw new Error("Type " + registration.constructorParamsToUse[i] + " not found");
                constructs.push(this.getFromRegistration(this.registrations[registration.constructorParamsToUse[i]]));
            }
            // @ts-ignore
            return this.getFromLifecyle(registration, () => new registration.constructorFunc(...constructs));
        }
    }

    private getFromLifecyle = function (this: Container, registration: ContainerRegistration, provider: () => any) {
        if (registration.isSingleton) {
            if (!this.instances[registration.typeToImplement])
                this.instances[registration.typeToImplement] = provider();
            return this.instances[registration.typeToImplement];
        }
        else if (registration.isInScope) {
            if (!this.currentScope)
                throw new Error('Trying to instantiate inScope component without starting a scope : ' + registration.typeToImplement);
            if (!this.scopedInstances[this.currentScope][registration.typeToImplement])
                this.scopedInstances[this.currentScope][registration.typeToImplement] = provider();
            return this.scopedInstances[this.currentScope][registration.typeToImplement];
        }
        else
            return provider();
    }

    private patch = function (this: Container, ns: any, path?: string) {
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