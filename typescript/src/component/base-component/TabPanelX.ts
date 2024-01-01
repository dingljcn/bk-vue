import { AbstractComponent, ComponentType } from "../../entity";
import { Compute, Field, Method, Mounted, Prop, Template } from "..";

export class TabPanelX<T> extends AbstractComponent {

    @Mounted(TabPanelX, ComponentType.TabPanelX)
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
        if (Array.isArray(this.list) && this.list.length > 0) {
            this.clicked(this.list[0], 0);
        }
    }

    @Template
    public template: string = `<div class="dinglj-v-tab-panel" :id="vid" v-if="list.length > 0">
        <div class="dinglj-v-tabpanel-title">
            <div class="dinglj-v-tab-float"></div>
            <div v-for="(item, idx) in list" :class="getClass(item)" :id="getId(idx)" @click="clicked(item, idx)">
                {{ getCaption(item) }}
            </div>
        </div>
        <div class="dinglj-v-tabpanel-view">
            <slot class="tab-panel-content">{{ index }}</slot>
        </div>
    </div>
    <div v-else>
        <h1>未找到数据</h1>
    </div>`;

    @Field
    public value: T = null;

    @Method
    public getClass(item: T): object {
        return {
            'dinglj-v-tabpanel-item': true,
            'active': this.value == item,
        };
    }

    @Method
    public getId(index: number): string {
        return `${ this.vid }-${ index }`;
    }

    @Method
    public clicked(item: T, index: number): void {
        if (item == this.value) {
            return;
        }
        this.value = item;
        this.emit('on-change', item);
        setTimeout(() => {
            const floatElement = window.query(`#${ this.vid } .dinglj-v-tab-float`)[0];
            const element: HTMLElement = window.byId(this.getId(index));
            if (element) {
                floatElement.style.width = `${ element.offsetWidth }px`;
                floatElement.style.left = `${ element.offsetLeft }px`;
            }
        }, 50);
    }

    @Compute(function(): number {
        if (!this.list.includesIgnoreCase(this.value) && this.list.length > 0) {
            this.clicked(this.list[0], 0);
        }
        return this.list.indexOf(this.value);
    })
    public index: number;

    @Prop(Array<T>, [], true)
    public list: Array<T>;

    @Prop(Function, (item: T): any => item)
    public getCaption: Function;

}