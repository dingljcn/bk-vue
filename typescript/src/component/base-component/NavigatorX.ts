import { AbstractComponent, ComponentType } from "../../entity";
import { Compute, Field, Method, Mounted, Prop, Template } from "..";

export class NavigatorX<T> extends AbstractComponent {

    @Mounted(NavigatorX, ComponentType.NavigatorX)
    public mounted() {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
        if (this.default != null) {
            this.setValue(this.default);
        } else if (this.list.length > 0) {
            this.setValue(this.list[0]);
        }
    }

    @Template
    public template: string = `<div id="dinglj-v-navigator">
        <div class="dinglj-v-navigator-item" 
            v-for="item in list" 
            @click="setValue(item)"
            :class="{ 'active': validItem == item }">
            {{ getCaption(item) }}
        </div>
    </div>`;

    @Field
    public value: T = null;

    @Method
    public setValue(value: T): void {
        if (this.value != value) {
            this.value = value;
            this.emit('on-change', value);
        }
    }

    @Compute(function(): T {
        if (this.value != null) {
            if (!this.list.includesIgnoreCase(this.value) && this.list.length > 0) {
                this.setValue(this.list[0]);
            }
        } else if (this.list.length > 0) {
            this.setValue(this.list[0]);
        }
        return this.value;
    })
    public validItem: T;

    /** 要显示的数据 */
    @Prop(Array<T>, [])
    public list: Array<T>;

    @Prop(Object, null)
    public default: T;

    /** 获取元素要显示的内容, 默认显示元素本身 */
    @Prop(Function, (item: T) => item)
    public getCaption: Function;

}