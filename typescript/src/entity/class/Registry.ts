import { AbstractComponent, ComponentType } from "..";

export class Registry {
    /** 组件池 */
    public static map: Map<ComponentType, AbstractComponent> = new Map();
    /** 上一次的组件名称 */
    public static lastComponentName: string = '';
    /** 上一次的组件类型 */
    public static lastComponentType: ComponentType = null;
    /** 根据名称和类型, 从组件池获取 */
    public static getComponent(type?: string): AbstractComponent {
        let _type: ComponentType = type as ComponentType;
        if (Registry.lastComponentType == null || Registry.lastComponentType != _type) {
            if (type) {
                Registry.lastComponentType = _type;
            } else {
                _type = Registry.lastComponentType;
            }
        }
        if (Registry.map.has(_type)) {
            return Registry.map.get(_type);
        }
        let component: AbstractComponent = new (AbstractComponent as any)();
        component.type = _type;
        Registry.map.set(_type, component);
        return component;
    }
}