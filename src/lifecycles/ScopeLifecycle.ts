import {Lifecycle} from "./Lifecycle";

export class ScopeLifecycle implements Lifecycle {
    private readonly _scopedInstances: Map<number, any> = new Map<number, any>();
    private readonly _scopedIds: number[] = [];
    private _provider: (...args: any) => any;

    public useFactory(provider: (...args: any) => any): void {
        this._provider = provider;
    }

    startScope(scopeId: number) {
        this._scopedInstances.set(scopeId, undefined);
        this._scopedIds.push(scopeId);
        return scopeId;
    }

    resolve<T>(...args: any): T {
        const currentScopeId = this._scopedIds[this._scopedIds.length - 1];
        if (!this._scopedInstances[currentScopeId])
            this._scopedInstances[currentScopeId] = this._provider(...args);
        return this._scopedInstances[currentScopeId];
    }

    endScope(scopeId: number) {
        this._scopedInstances.delete(scopeId);
        this._scopedIds.splice(this._scopedIds.indexOf(scopeId), 1);
    }
}