import { AbstractComponent, Registry } from "../../entity";

export function Template(target: AbstractComponent, propertyKey: string) {
    Registry.getComponent().meta.template = propertyKey;
}