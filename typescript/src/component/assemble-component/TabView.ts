import { AbstractComponent, ComponentType, EmitPara } from "../../entity";
import { Compute, Field, Method, Mounted, Prop, Template } from "..";

export class TabView<T> extends AbstractComponent {

    @Mounted(TabView, ComponentType.TabView)
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
    }

    @Template
    public template: string = `<div class="dinglj-v-tab-panel-view" :id="vid">
        <i-tab-panel :list="list" :get-caption="getCaption" @on-change="changed" @mounted="tabPanelLoaded">
            <i-scroller-x :index="index" :size="list.length">
                <slot></slot>
            </i-scroller-x>
        </i-tab-panel>
    </div>`;

    @Field
    public value: T = null;

    @Field
    public tabPanelId: string = '';

    @Method
    public tabPanelLoaded(param: EmitPara): void {
        this.tabPanelId = param.value;
    }

    @Method
    public changed(param: EmitPara) {
        if (this.value != param.value) {
            this.value = param.value;
            this.emit('on-change', param);
        }
    }

    @Compute(function(): number {
        return this.list.indexOfIgnoreCase(this.value);
    })
    public index: number;

    @Prop(Array<T>, [], true)
    public list: Array<T>;

    @Prop(Function, (item: T): any => item)
    public getCaption: Function;
    
}