import { AbstractComponent, Registry } from "../../entity";

/** 普通方法 */
export function Method(target: AbstractComponent, propertyKey: string, descriptor: PropertyDescriptor) {
    Registry.getComponent().meta.methodNames.push(propertyKey);
}