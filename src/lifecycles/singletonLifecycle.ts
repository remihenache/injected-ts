import {Lifecycle} from "./lifecycle";

export class SingletonLifecycle implements Lifecycle {
    private _instance: any;
    private _provider: (...args: any) => any;

    useFactory(provider: (...args: any) => any): void {
        this._provider = provider;
    }


    resolve<T>(...args: any): T {
        if (!this._instance) {
            this._instance = this._provider(...args);
        }

        return this._instance;
    }

    endScope(scopeId: number): void {
    }

    startScope(scopeId: number): void {
    }
}