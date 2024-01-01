import { AbstractComponent, ComponentType } from "../../entity";
import { Method, Mounted, Prop, Template } from "..";

export class ScrollerX extends AbstractComponent {

    @Mounted(ScrollerX, ComponentType.ScrollerX)
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
    }

    @Template
    public template: string = `<div class="dinglj-v-row-scroll" :id="vid" :style="getStyle()">
        <slot></slot>
    </div>`;

    @Prop(Number, 0)
    public size: number;

    @Prop(Number, 0)
    public index: number;
    
    @Method
    getStyle(): object {
        return {
            'left': `-${ (this.index >= 0 && this.index < this.size) ? this.index : 0 }00%`,
            'width': `${ this.size }00%`
        };
    }
    
}