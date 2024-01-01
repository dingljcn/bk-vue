import { AbstractComponent, ComponentType } from "../../entity";
import { Method, Mounted, Prop, Template } from "..";

export class ScrollerY extends AbstractComponent {

    @Mounted(ScrollerY, ComponentType.ScrollerY)
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
    }

    @Template
    public template: string = `<div class="dinglj-v-column-scroll" :id="vid" :style="getStyle()">
        <slot></slot>
    </div>`;

    @Prop(Number, 0)
    public size: number;

    @Prop(Number, 0)
    public index: number;
    
    @Method
    getStyle(): object {
        return {
            'top': `-${ (this.index >= 0 && this.index < this.size) ? this.index : 0 }00%`,
            'height': `${ this.size }00%`
        };
    }
    
}