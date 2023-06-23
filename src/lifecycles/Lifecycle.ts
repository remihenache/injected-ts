export interface Lifecycle {
    resolve<T>(...args: any): T;

    useFactory(provider: (...args: any) => any): void;

    startScope(scopeId: number): void;

    endScope(scopeId: number): void;
}


