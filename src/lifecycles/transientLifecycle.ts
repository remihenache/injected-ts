import {Lifecycle} from "./lifecycle";

export class TransientLifecycle implements Lifecycle {
    private _provider: (...args: any) => any;

    useFactory(provider: (...args: any) => any): void {
        this._provider = provider;
    }


    resolve<T>(...args: any): T {
        return this._provider(...args);
    }

    endScope(scopeId: number): void {
    }

    startScope(scopeId: number): void {
    }
}