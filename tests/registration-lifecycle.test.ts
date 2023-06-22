import {expect}                from "chai";
import {Container}             from "../src";
import {DifferentInstanceType} from "./data/fake-type";

describe('Register type using lifecycle', () => {

    it('should instantiate singleton only once', () => {
        let container = new Container();
        container.register(DifferentInstanceType).asSingleton();

        let firstInstance = container.get<DifferentInstanceType>(DifferentInstanceType.name);
        let secondInstance = container.get<DifferentInstanceType>(DifferentInstanceType.name);
        expect(firstInstance.getValue()).to.equal(secondInstance.getValue());
    });

    it('should instantiate transient each time', () => {
        let container = new Container();
        container.register(DifferentInstanceType).transient();

        let firstInstance = container.get<DifferentInstanceType>(DifferentInstanceType.name);
        let secondInstance = container.get<DifferentInstanceType>(DifferentInstanceType.name);
        expect(firstInstance.getValue()).to.not.equal(secondInstance.getValue());
    });

    it('should instantiate scoped each time scope changed', () => {
        let container = new Container();
        container.register(DifferentInstanceType).scoped();

        const scopeId = container.startScope();
        let firstInstanceScope1 = container.get<DifferentInstanceType>(DifferentInstanceType.name);
        let secondInstanceScope1 = container.get<DifferentInstanceType>(DifferentInstanceType.name);
        expect(firstInstanceScope1.getValue()).to.equal(secondInstanceScope1.getValue());
        container.endScope(scopeId);

        const scopeId2 = container.startScope();
        let firstInstanceScope2 = container.get<DifferentInstanceType>(DifferentInstanceType.name);
        let secondInstanceScope2 = container.get<DifferentInstanceType>(DifferentInstanceType.name);
        expect(firstInstanceScope2.getValue()).to.equal(secondInstanceScope2.getValue());
        expect(firstInstanceScope1.getValue()).to.not.equal(firstInstanceScope2.getValue());
        container.endScope(scopeId2);
    });
});