import {ComponentCompleted} from "./componentCompleted";
import {Constructor}        from "../constructor";

export interface ComponentWithoutDependencies {
    withDependencies(...dependencies: (string | Constructor<any>)[]): ComponentCompleted;
}