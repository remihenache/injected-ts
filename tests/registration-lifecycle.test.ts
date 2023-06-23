import {expect}                from "chai";
import {DifferentInstanceType} from "./data/fake-type";
import {ServiceCollection}     from "../src";

describe('Register type using lifecycle', () => {

    it('should instantiate singleton only once', () => {
        let serviceCollection = new ServiceCollection();
        serviceCollection.addSingleton(r => r.fromType(DifferentInstanceType));
        let serviceProvider = serviceCollection.build();

        let firstInstance = serviceProvider.get<DifferentInstanceType>(DifferentInstanceType.name);
        let secondInstance = serviceProvider.get<DifferentInstanceType>(DifferentInstanceType.name);
        expect(firstInstance.getValue()).to.equal(secondInstance.getValue());
    });

    it('should instantiate transient each time', () => {
        let serviceCollection = new ServiceCollection();
        serviceCollection.addTransient(r => r.fromType(DifferentInstanceType));
        let serviceProvider = serviceCollection.build();

        let firstInstance = serviceProvider.get<DifferentInstanceType>(DifferentInstanceType.name);
        let secondInstance = serviceProvider.get<DifferentInstanceType>(DifferentInstanceType.name);
        expect(firstInstance.getValue()).to.not.equal(secondInstance.getValue());
    });

    it('should instantiate scoped each time scope changed', () => {
        let serviceCollection = new ServiceCollection();
        serviceCollection.addScoped(r => r.fromType(DifferentInstanceType));
        let serviceProvider = serviceCollection.build();

        const scopeId = serviceProvider.startScope();
        let firstInstanceScope1 = serviceProvider.get<DifferentInstanceType>(DifferentInstanceType.name);
        let secondInstanceScope1 = serviceProvider.get<DifferentInstanceType>(DifferentInstanceType.name);
        expect(firstInstanceScope1.getValue()).to.equal(secondInstanceScope1.getValue());
        serviceProvider.endScope(scopeId);

        const scopeId2 = serviceProvider.startScope();
        let firstInstanceScope2 = serviceProvider.get<DifferentInstanceType>(DifferentInstanceType.name);
        let secondInstanceScope2 = serviceProvider.get<DifferentInstanceType>(DifferentInstanceType.name);
        expect(firstInstanceScope2.getValue()).to.equal(secondInstanceScope2.getValue());
        expect(firstInstanceScope1.getValue()).to.not.equal(firstInstanceScope2.getValue());
        serviceProvider.endScope(scopeId2);
    });
});