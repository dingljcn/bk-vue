import { AbstractComponent, Registry, ComponentType } from "../../entity";

/** 挂载后事件 */
export function Mounted(componentClass: any, type: string) {
    return function (target: AbstractComponent, propertyKey: string, descriptor: PropertyDescriptor) {
        const component = Registry.getComponent(type);
        component.meta.hockMounted = propertyKey;
        component.meta.clazz = componentClass;
        component.name = type;
    }
}