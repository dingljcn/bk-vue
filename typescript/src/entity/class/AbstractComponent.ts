import { IComponent, ComponentType, MetaInfo, EmitPara } from "..";

export abstract class AbstractComponent {
    /** mounted 是必须实现的一个函数 */
    public abstract mounted(): void;
    /** Vue 向父级发送事件, 仅起定义作用 */
    private $emit(eventName: string, param: EmitPara) {}
    /** 组件 id, 仅起定义作用 */
    public vid: string;
    /** 组件名称 */
    public name: string;
    /** 组件类型 */
    public type: ComponentType;
    /** Vue 元信息 */
    public meta: MetaInfo = new MetaInfo();
    /** 原生自带的方法, 将图片相对路径转绝对路径 */
    public getImg(path: string): string {
        return window.imgUrl(path);
    }
    /** 原生自带的方法, 封装 $emit */
    public emit(eventName: string, param: any): void {
        this.$emit(eventName, {
            value: param,
            vid: this.vid,
        })
    }
    /** 构建为 Vue 对象 */
    public build(): IComponent {
        const _this: any = this;
        let instance: any = new this.meta.clazz();
        const vue: IComponent = {};
        // data()
        vue.data = function() {
            const result: any = {
                vid: '',
                name: _this.name,
            };
            if (_this.meta.hasField()) {
                for (let fieldName of _this.meta.fieldNames) {
                    result[fieldName] = instance[fieldName];
                }
            }
            return result;
        }
        // mounted
        if (this.meta.hasMounted()) {
            vue.mounted = instance[this.meta.hockMounted];
        }
        // template
        if (this.meta.hasTemplate()) {
            vue.template = instance[this.meta.template];
        }
        // methods
        vue.methods = {
            getImg: this.getImg,
            emit: this.emit,
        };
        if (this.meta.hasMethod()) {
            for (let methodName of this.meta.methodNames) {
                vue.methods[methodName] = instance[methodName];
            }
        }
        // computed
        if (this.meta.hasCompute()) {
            vue.computed = {};
            for (let compute of this.meta.computeInfos) {
                vue.computed[compute.key] = compute.func;
            }
        }
        // props
        if (this.meta.hasProp()) {
            vue.props = this.meta.props;
        }
        // watch
        if (this.meta.hasWatch()) {
            vue.watch = {};
            for (let watch of this.meta.watchInfos) {
                vue.watch[watch.field] = {
                    handler: instance[watch.resolve],
                    deep: watch.deep,
                }
            }
        }
        // components
        if (this.meta.hasComponents()) {
            vue.components = this.meta.components;
        }
        window.registVue(this.type, vue);
        return vue;
    }
}