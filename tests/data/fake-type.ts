export interface FakeInterface {
    doSomething(): string
}

export class FakeType implements FakeInterface {
    doSomething(): string {
        return "FakeType doSomething"
    }
}

export class FakeTypeWithOneDependency implements FakeInterface {
    private _fakeInstance: FakeType;

    constructor(fakeInstance: FakeType) {
        this._fakeInstance = fakeInstance;
    }

    doSomething(): string {
        return this._fakeInstance.doSomething() + "FakeTypeWithOneDependency doSomething";
    }
}

export class FakeTypeWithTwoDependency implements FakeInterface {
    private _fakeInstance: FakeType;
    private _fakeInstance2: FakeTypeWithOneDependency;

    constructor(fakeInstance: FakeType, fakeInstance2: FakeTypeWithOneDependency) {
        this._fakeInstance = fakeInstance;
        this._fakeInstance2 = fakeInstance2;
    }

    doSomething(): string {
        return this._fakeInstance.doSomething() + this._fakeInstance2.doSomething();
    }
}

export class FakeTypeWithInterfaceDependency implements FakeInterface {
    private _fakeInstance: FakeType;

    constructor(fakeInstance: FakeInterface) {
        this._fakeInstance = fakeInstance;
    }

    doSomething(): string {
        return this._fakeInstance.doSomething() + "FakeTypeWithInterfaceDependency doSomething";
    }
}

export class DifferentInstanceType {
    private static _value: number = 0;
    private readonly _instance_value: number;

    constructor() {
        DifferentInstanceType._value++;
        this._instance_value = DifferentInstanceType._value;
    }

    getValue(): number {
        return this._instance_value;
    }
}