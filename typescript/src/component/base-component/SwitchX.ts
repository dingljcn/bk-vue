import { AbstractComponent, ComponentType } from "../../entity";
import { Field, Method, Mounted, Prop, Template } from "..";

export class SwitchX extends AbstractComponent {

    @Mounted(SwitchX, ComponentType.SwitchX)
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
    }

    @Template
    public template: string = `<div class="dinglj-v-switch" @click="onclicked" :style="getStyle()">
        <div class="dinglj-v-switch-pre">
            {{ preText }}
        </div>
        <div :class="getClass()">
            <div></div>
        </div>
        <div class="dinglj-v-switch-post">
            {{ postText }}
        </div>
    </div>`;

    @Field
    public active: boolean = false;

    @Method
    public getStyle(): object {
        return {
            '--width': this.xSize.equalsIgnoreCase('small') ? '30px' : (this.xSize.equalsIgnoreCase('normal') ? '40px' : '40px'),
            '--height': this.xSize.equalsIgnoreCase('small') ? '24px' : (this.xSize.equalsIgnoreCase('normal') ? '28px' : '32px'),
            '--padding-tb': this.xSize.equalsIgnoreCase('small') ? '5px' : (this.xSize.equalsIgnoreCase('normal') ? '3px' : '8px'),
        };
    }

    @Method
    public getClass(): object {
        return {
            'dinglj-v-switch-btn': true,
            'active': this.active
        };
    }

    @Method
    public onclicked(): void {
        this.active = !this.active;
        this.emit('on-change', this.active);
        if (this.active) {
            if (this.postText) {
                `已切换至: ${ this.postText }`.info();
            }
        } else {
            if (this.preText) {
                `已切换至: ${ this.preText }`.info();
            }
        }
    }

    @Prop(String, 'normal')
    public xSize: 'small' | 'normal' | 'big';

    @Prop(String, '')
    public preText: string;

    @Prop(String, '')
    public postText: string;
}