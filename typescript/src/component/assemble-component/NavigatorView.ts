import { AbstractComponent, ComponentType, EmitPara } from "../../entity";
import { Component, Mounted, Template, Prop, Field, Method } from "..";

export class NavigatorView<T> extends AbstractComponent {

    @Mounted(NavigatorView, ComponentType.NavigatorView)
    public mounted(): void {
        this.vid = window.uuid(this.name);
    }

    @Template
    public template: string = `<div class="dinglj-v-navigator-view">
        <i-navigator style="margin-right: 10px" :list="list" :get-caption="getCaption" @on-change="changed">
        </i-navigator>
        <div class="dinglj-v-navigator-right">
            <slot name="before"></slot>
            <div class="dinglj-v-navigator-content">
                <i-scroller-y :index="list.indexOf(active)" :size="list.length">
                    <slot name="content"></slot>
                </i-scroller-y>
            </div>
            <slot name="after"></slot>
        </div>
    </div>`;

    @Field
    public active: T = null;

    @Method
    public changed(item: EmitPara) {
        this.active = item.value;
        this.emit('on-change', item);
    }

    @Prop(Array<T>, [], true)
    public list: Array<T>;

    /** 获取元素要显示的内容, 默认显示元素本身 */
    @Prop(Function, (item: T) => item)
    public getCaption: Function;

}