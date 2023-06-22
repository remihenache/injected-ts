export type Constructor<T extends new (...args: any) => any> = T extends new (...args: infer A) => infer R ? new (...args: A) => R : never;

export const ConstructorFuncName = ".constructorFunc";