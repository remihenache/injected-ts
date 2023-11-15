import {Constructor}        from "./constructor";
import {ComponentResolver}  from "./componentResolver";
import {SingletonLifecycle} from "./lifecycles";

export class ServiceProvider {
    private readonly registrations: { [key: string]: ComponentResolver };
    private readonly scopedInstances = {};
    private currentScope: number = 0;

    constructor(registrations: { [key: string]: ComponentResolver }) {
        this.registrations = registrations || {};
        this.addItSelfResolver();
    }


    get<T>(this: ServiceProvider, objToImplement: string): T;
    get<T extends new (...args: any) => any>(this: ServiceProvider, objToImplement: Constructor<T>): T;
    get<T extends new (...args: any) => any>(this: ServiceProvider, objToImplement: Constructor<T> | string): T {
        const typeName = this.getName(objToImplement);
        return this.registrations[typeName].resolve(this);
    }

    startScope(): number {
        let scopeId = Math.floor(Math.random() * 1000) + 1; // returns a random integer from 1 to 1000
        while (this.scopedInstances[scopeId])
            scopeId = Math.floor(Math.random() * 1000) + 1;
        this.scopedInstances[scopeId] = {};
        this.currentScope = scopeId;
        Object.keys(this.registrations).forEach(key => {
            this.registrations[key].startScope(scopeId)
        });
        return scopeId;
    }

    endScope(scopeId: number): void {
        Object.keys(this.registrations).forEach(key => {
            this.registrations[key].endScope(scopeId)
        });
        delete this.scopedInstances[scopeId];
    }

    private getName<T extends new (...args: any) => any>(objToImplement: Constructor<T> | string) {
        let typeName = objToImplement as string;
        if ((objToImplement as Constructor<T>).name) {
            typeName = (objToImplement as Constructor<T>).name;
        }
        return typeName;
    }

    private addItSelfResolver() {
        let lifecycle = new SingletonLifecycle();
        lifecycle.useFactory(() => this)
        this.registrations[ServiceProvider.name] = new ComponentResolver(ServiceProvider.name, lifecycle, []);
    }

}