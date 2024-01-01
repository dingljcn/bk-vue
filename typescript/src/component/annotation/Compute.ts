import { AbstractComponent, Registry } from "../../entity";

/** 计算属性 */
export function Compute(func: Function) {
    return function(target: AbstractComponent, propertyKey: string) {
        Registry.getComponent().meta.computeInfos.push({
            key: propertyKey,
            func: func
        });
    }
}