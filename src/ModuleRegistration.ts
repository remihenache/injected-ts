import {ServiceCollection} from "./ServiceCollection";

export class ModuleRegistration {
    private static _lstRegistration: ((serviceCollection: ServiceCollection) => void)[] = [];

    static register(registration: (serviceCollection: ServiceCollection) => void) {
        this._lstRegistration.push(registration);
    }

    static build(serviceCollection: ServiceCollection) {
        for (let i = 0; i < this._lstRegistration.length; i++)
            this._lstRegistration[i](serviceCollection);
        return serviceCollection;
    }
}