import {expect}            from "chai";
import {
    FakeInterface,
    FakeType,
    FakeTypeWithInterfaceDependency,
    FakeTypeWithOneDependency,
    FakeTypeWithTwoDependency
}                          from "./data/fake-type";
import {ServiceCollection} from "../src";

describe('Register types, then resolve them to get an instance', () => {

    it('should work for no dependencies in constructor', () => {
        let serviceCollection = new ServiceCollection();
        serviceCollection.addSingleton(r => r.fromType(FakeType));
        serviceCollection.addSingleton(r => r.fromType(FakeTypeWithInterfaceDependency).withDependencies(FakeType));
        let serviceProvider = serviceCollection.build();

        let result = serviceProvider.get<FakeType>(FakeType.name).doSomething();
        expect(result).to.equal(new FakeType().doSomething());
    });

    it('should work for one dependencies in constructor', () => {
        let serviceCollection = new ServiceCollection();
        serviceCollection.addSingleton(r => r.fromType(FakeType));
        serviceCollection.addSingleton(r => r.fromType(FakeTypeWithOneDependency).withDependencies(FakeType));
        let serviceProvider = serviceCollection.build();

        let result = serviceProvider.get<FakeTypeWithOneDependency>(FakeTypeWithOneDependency.name).doSomething();
        expect(result).to.equal(new FakeTypeWithOneDependency(new FakeType()).doSomething());
    });


    it('should work for two dependencies in constructor', () => {
        let serviceCollection = new ServiceCollection();
        serviceCollection.addSingleton(r => r.fromType(FakeType));
        serviceCollection.addSingleton(r => r.fromType(FakeTypeWithOneDependency).withDependencies(FakeType));
        serviceCollection.addSingleton(r => r.fromType(FakeTypeWithTwoDependency).withDependencies(FakeType, FakeTypeWithOneDependency));
        let serviceProvider = serviceCollection.build();

        let result = serviceProvider.get<FakeTypeWithTwoDependency>(FakeTypeWithTwoDependency.name).doSomething();
        expect(result).to.equal(new FakeTypeWithTwoDependency(new FakeType(), new FakeTypeWithOneDependency(new FakeType())).doSomething());
    });

    it('should work using interface', () => {
        let serviceCollection = new ServiceCollection();
        serviceCollection.addSingleton(r => r.fromName('FakeInterface').useType(FakeType));
        let serviceProvider = serviceCollection.build();

        let result = serviceProvider.get<FakeInterface>('FakeInterface').doSomething();
        expect(result).to.equal(new FakeType().doSomething());
    });
    it('should work using interface and many dependencies', () => {
        let serviceCollection = new ServiceCollection();
        serviceCollection.addSingleton(r => r.fromType(FakeType));
        serviceCollection.addSingleton(r => r.fromType(FakeTypeWithOneDependency).withDependencies(FakeType));
        serviceCollection.addSingleton(r => r.fromName('FakeInterface').useType(FakeTypeWithTwoDependency).withDependencies(FakeType, FakeTypeWithOneDependency));
        let serviceProvider = serviceCollection.build();

        let result = serviceProvider.get<FakeInterface>('FakeInterface').doSomething();
        expect(result).to.equal(new FakeTypeWithTwoDependency(new FakeType(), new FakeTypeWithOneDependency(new FakeType())).doSomething());
    });

    it('should work using interface injection', () => {
        let serviceCollection = new ServiceCollection();
        serviceCollection.addSingleton(r => r.fromName('FakeInterface').useType(FakeType));
        serviceCollection.addSingleton(r => r.fromType(FakeTypeWithInterfaceDependency).withDependencies('FakeInterface'));
        let serviceProvider = serviceCollection.build();

        let result = serviceProvider.get<FakeTypeWithInterfaceDependency>(FakeTypeWithInterfaceDependency.name).doSomething();
        expect(result).to.equal(new FakeTypeWithInterfaceDependency(new FakeType()).doSomething());
    });

    it('should work with factory', () => {
        let serviceCollection = new ServiceCollection();
        serviceCollection.addSingleton(r => r.fromName('FakeInterface').useFactory(() => new FakeType()));
        let serviceProvider = serviceCollection.build();

        let result = serviceProvider.get<FakeInterface>('FakeInterface').doSomething();
        expect(result).to.equal(new FakeType().doSomething());
    });


    it('should work with factory using service provider', () => {
        let serviceCollection = new ServiceCollection();
        serviceCollection.addSingleton(r => r.fromType(FakeType));
        serviceCollection.addSingleton(r => r.fromName('FakeInterface').useFactory(s => s.get(FakeType)));
        let serviceProvider = serviceCollection.build();

        let result = serviceProvider.get<FakeInterface>('FakeInterface').doSomething();
        expect(result).to.equal(new FakeType().doSomething());
    });
});