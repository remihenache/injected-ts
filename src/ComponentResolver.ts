import {Lifecycle}       from "./lifecycles";
import {ServiceProvider} from "./ServiceProvider";

export class ComponentResolver {
    private readonly _name: string;
    private readonly _lifecycle: Lifecycle;
    private readonly _dependencies: string[];

    constructor(name: string, lifecycle: Lifecycle, dependencies: string[]) {
        this._name = name;
        this._lifecycle = lifecycle;
        this._dependencies = dependencies;
    }

    resolve(serviceProvider: ServiceProvider): any {
        if (this._dependencies.length === 0)
            return this._lifecycle.resolve(serviceProvider);
        return this._lifecycle.resolve(...this._dependencies.map(dependency => serviceProvider.get(dependency)));
    }

    getName() {
        return this._name;
    }

    public startScope(scopeId: number) {
        this._lifecycle.startScope(scopeId);
    }

    public endScope(scopeId: number) {
        this._lifecycle.endScope(scopeId);
    }
}