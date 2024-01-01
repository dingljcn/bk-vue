import { AbstractComponent, ComponentType } from "../../entity";
import { Field, Method, Mounted, Prop, Template } from "..";

export class ComboX<T> extends AbstractComponent {

    @Mounted(ComboX, ComponentType.ComboX)
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
    }

    @Template
    public template: string = `<div class="dinglj-v-ctl dinglj-v-input combo" :style="getStyle()" :caption="caption" :id="vid">
        <input :placeholder="placeholder" type="text" :value="list.includesIgnoreCase(value) ? getValue(value) : ''"/>
        <img :src="getImg('/src/assets/img/delete.png')" class="clean" @click="setValue('')"/>
        <div class="dinglj-v-combo-selections">
            <div class="dinglj-v-combo-selection" v-for="item in list" @click="setValue(item)">
                {{ getCaption(item) }}
            </div>
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

    @Method
    public getStyle(): object {
        const result = {
            '--height': this.xSize.equalsIgnoreCase('small') ? '24px' : (this.xSize.equalsIgnoreCase('normal') ? '28px' : '32px'),
            '--width': this.xSize.equalsIgnoreCase('small') ? '180px' : (this.xSize.equalsIgnoreCase('normal') ? '200px' : '220px'),
        };
        return result;
    }

    /** 要显示的数据 */
    @Prop(Array<T>, [])
    public list: Array<T>;

    /** 大小 */
    @Prop(String, 'normal')
    public xSize: 'small' | 'normal' | 'big';

    /** 控件名称 */
    @Prop(String, '')
    public caption: string;

    /** 占位符 */
    @Prop(String, '')
    public placeholder: string;

    /** 获取元素要显示的内容, 默认显示元素本身 */
    @Prop(Function, (item: T) => item)
    public getCaption: Function;

    /** 获取元素的值, 默认值就是元素本身 */
    @Prop(Function, (item: T) => item)
    public getValue: Function;

}