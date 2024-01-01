import { AbstractComponent, ComponentType } from "../../entity";
import { Field, Method, Mounted, Prop, Template } from "..";

export class InputX extends AbstractComponent {

    @Mounted(InputX, ComponentType.InputX)
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
    }

    @Template
    public template: string = `<div class="dinglj-v-ctl dinglj-v-input text" :caption="caption" :style="getStyle()" :id="vid">
        <input type="text" :placeholder="placeholder" v-model="value" @input="setValue(value, 'input')" @blur="setValue(value, 'blur')" @change="setValue(value, 'change')"/>
        <img :src="getImg('/src/assets/img/delete.png')" class="clean" @click="setValue('', 'change')"/>
    </div>`

    @Field
    public value: string = '';

    @Method
    public getStyle(): object {
        const result = {
            '--height': this.xSize.equalsIgnoreCase('small') ? '24px' : (this.xSize.equalsIgnoreCase('normal') ? '28px' : '32px'),
            '--width': this.xSize.equalsIgnoreCase('small') ? '180px' : (this.xSize.equalsIgnoreCase('normal') ? '200px' : '220px'),
        };
        return result;
    }

    @Method
    public setValue(value: string, eventName: 'input' | 'change' | 'blur'): void {
        this.value = value;
        this.emit('on-change', value);
        if (eventName == 'input') {
            this.emit(`on-input`, value);
        }
        if (eventName == 'blur') {
            this.emit('on-blur', value);
        }
    }

    @Prop(String, 'normal')
    public xSize: 'small' | 'normal' | 'big';

    @Prop(String, '')
    public caption: string;

    @Prop(String, '')
    public placeholder: string;
}