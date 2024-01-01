import { AbstractComponent, ComponentType } from "../../entity";
import { Method, Mounted, Prop, Template } from "..";

export class ButtonX extends AbstractComponent {

    @Mounted(ButtonX, ComponentType.ButtonX)
    public mounted() {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
    }

    @Template
    template: string = `<div :class="getClass()" :id="vid" :style="getStyle()" @click="$emit('on-click')">
        <slot></slot>
    </div>`;
    
    @Prop(String, 'normal')
    xSize: 'small' | 'normal' | 'big';

    @Prop(String, 'primary')
    xType: 'primary' | 'warn' | 'error' | 'cancel';

    @Method
    getClass(): object {
        return {
            'dinglj-v-btn': true, 
            'dinglj-v-ctl': true,
            'primary': this.xType.equalsIgnoreCase('primary'),
            'cancel': this.xType.equalsIgnoreCase('cancel'),
            'warn': this.xType.equalsIgnoreCase('warn'),
            'error': this.xType.equalsIgnoreCase('error'),
        };
    }

    @Method
    getStyle(): object {
        return {
            '--height': this.xSize.equalsIgnoreCase('small') ? '24px' : (this.xSize.equalsIgnoreCase('normal') ? '28px' : '32px'),
            '--margin-tb': this.xSize.equalsIgnoreCase('small') ? '1px' : (this.xSize.equalsIgnoreCase('normal') ? '2px' : '3px'),
        };
    }

}