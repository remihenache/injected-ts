import {ServiceProvider} from "./ServiceProvider";

export type Constructor<T extends new (...args: any) => any> = T extends new (...args: infer A) => infer R ? new (...args: A) => R : never;
export type Factory<T> = (serviceProvider: ServiceProvider) => T;