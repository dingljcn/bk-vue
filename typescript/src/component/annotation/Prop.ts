import { AbstractComponent, Registry } from "../../entity";

/** 上级传入的参数 */
export function Prop(type: any, def: any, required: boolean = false) {
    return function (target: AbstractComponent, propertyKey: string) {
        Registry.getComponent().meta.props[propertyKey] = {
            type: type,
            default: def,
            required: required,
        }
    }
}