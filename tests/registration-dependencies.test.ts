import {expect}    from "chai";
import {Container} from "../src";
import {
    FakeInterface,
    FakeType,
    FakeTypeWithInterfaceDependency,
    FakeTypeWithOneDependency,
    FakeTypeWithTwoDependency
}                  from "./data/fake-type";

describe('Register types, then resolve them to get an instance', () => {

    it('should work for non dependencies in constructor', () => {
        let container = new Container();
        container.register(FakeType).asSingleton();

        let result = container.get<FakeType>(FakeType.name).doSomething();
        expect(result).to.equal(new FakeType().doSomething());
    });

    it('should work for one dependencies in constructor', () => {
        let container = new Container();
        container.register(FakeType).asSingleton();
        container.register(FakeTypeWithOneDependency).withConstructor(FakeType).asSingleton();

        let result = container.get<FakeTypeWithOneDependency>(FakeTypeWithOneDependency.name).doSomething();
        expect(result).to.equal(new FakeTypeWithOneDependency(new FakeType()).doSomething());
    });


    it('should work for two dependencies in constructor', () => {
        let container = new Container();
        container.register(FakeType).asSingleton();
        container.register(FakeTypeWithOneDependency).withConstructor(FakeType).asSingleton();
        container.register(FakeTypeWithTwoDependency).withConstructor(FakeType).withConstructor(FakeTypeWithOneDependency).asSingleton();

        let result = container.get<FakeTypeWithTwoDependency>(FakeTypeWithTwoDependency.name).doSomething();
        expect(result).to.equal(new FakeTypeWithTwoDependency(new FakeType(), new FakeTypeWithOneDependency(new FakeType())).doSomething());
    });

    it('should work using interface', () => {
        let container = new Container();
        container.register('FakeInterface').use(FakeType).asSingleton();

        let result = container.get<FakeInterface>('FakeInterface').doSomething();
        expect(result).to.equal(new FakeType().doSomething());
    });
    it('should work using interface and many dependencies', () => {
        let container = new Container();
        container.register(FakeType).asSingleton();
        container.register(FakeTypeWithOneDependency).withConstructor(FakeType).asSingleton();
        container.register('FakeInterface').use(FakeTypeWithTwoDependency).withConstructor(FakeType).withConstructor(FakeTypeWithOneDependency).asSingleton();

        let result = container.get<FakeInterface>('FakeInterface').doSomething();
        expect(result).to.equal(new FakeTypeWithTwoDependency(new FakeType(), new FakeTypeWithOneDependency(new FakeType())).doSomething());
    });

    it('should work using interface injection', () => {
        let container = new Container();
        container.register('FakeInterface').use(FakeType).asSingleton();
        container.register(FakeTypeWithInterfaceDependency).withConstructor('FakeInterface').asSingleton();

        let result = container.get<FakeTypeWithInterfaceDependency>(FakeTypeWithInterfaceDependency.name).doSomething();
        expect(result).to.equal(new FakeTypeWithInterfaceDependency(new FakeType()).doSomething());
    });

    it('should work with factory', () => {
        let container = new Container();
        container.register('FakeInterface').useFactory(() => new FakeType()).asSingleton();

        let result = container.get<FakeInterface>('FakeInterface').doSomething();
        expect(result).to.equal(new FakeType().doSomething());
    });
});