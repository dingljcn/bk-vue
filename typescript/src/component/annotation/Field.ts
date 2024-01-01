import { AbstractComponent, Registry } from "../../entity";

/** 字段 */
export function Field(target: AbstractComponent, propertyKey: string) {
    Registry.getComponent().meta.fieldNames.push(propertyKey);
}