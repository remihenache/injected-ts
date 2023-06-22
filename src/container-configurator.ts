import {Container} from "./container";

export class ContainerConfigurator {
    private static _lstRegistration: ((container: Container) => void)[] = [];

    static register(registration: (container: Container) => void) {
        this._lstRegistration.push(registration);
    }

    static build(container: Container) {
        for (let i = 0; i < this._lstRegistration.length; i++)
            this._lstRegistration[i](container);
        return container;
    }
}