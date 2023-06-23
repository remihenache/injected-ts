import {Lifecycle}         from "../lifecycles";
import {ComponentResolver} from "../ComponentResolver";

export interface ComponentBuilder {
    build(lifecycle: Lifecycle): ComponentResolver;
}