import {ComponentCompleted} from "./ComponentCompleted";
import {Constructor}        from "../Constructor";

export interface ComponentWithoutDependencies {
    withDependencies(...dependencies: (string | Constructor<any>)[]): ComponentCompleted;
}