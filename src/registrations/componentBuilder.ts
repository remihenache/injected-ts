import {Lifecycle}         from "../lifecycles";
import {ComponentResolver} from "../componentResolver";

export interface ComponentBuilder {
    build(lifecycle: Lifecycle): ComponentResolver;
}