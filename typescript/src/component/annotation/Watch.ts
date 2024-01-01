import { AbstractComponent, Registry } from "../../entity";

/** 计算属性 */
export function Watch(field: string, deep: boolean = true) {
    return function(target: AbstractComponent, propertyKey: string) {
        Registry.getComponent().meta.watchInfos.push({
            field: field,
            deep: deep,
            resolve: propertyKey,
        });
    }
}