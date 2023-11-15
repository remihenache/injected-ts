import {ComponentCompleted} from "./componentCompleted";
import {ComponentBuilder}   from "./componentBuilder";
import {Lifecycle}          from "../lifecycles";
import {ComponentResolver} from "../componentResolver";

export class ComponentAlreadyImplemented implements ComponentCompleted, ComponentBuilder {
    private readonly _typeName: string;
    private readonly _provider: (...args: any[]) => any;
    private readonly _dependencies: string[];

    constructor(typeName: string, provider: (...args) => any, dependencies: string[]) {
        this._typeName = typeName;
        this._provider = provider;
        this._dependencies = dependencies;
    }

    public build(lifecycle: Lifecycle): ComponentResolver {
        lifecycle.useFactory(this._provider)
        return new ComponentResolver(this._typeName, lifecycle, this._dependencies);
    }
}