import { AbstractComponent, ComponentType } from "../../entity";
import { Compute, Field, Method, Mounted, Prop, Template } from "..";

export class TableX<T> extends AbstractComponent {

    @Mounted(TableX, ComponentType.TableX)
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
    }

    @Template
    public template: string = `<div class="dinglj-v-table" :id="vid">
        <div class="dinglj-v-thead dinglj-v-tr">
            <div class="dinglj-v-cell" :getStyle('') v-if="selectable" class="dinglj-v-table-select" @click="doCheckAll">
                <input type="checkbox" :checked="checkAll"/>选择
            </div>
            <div class="dinglj-v-cell" :getStyle('') v-if="sequanceNum" class="dinglj-v-table-sequence">
                序号
            </div>
            <div class="dinglj-v-cell" :getStyle(getColumnKey(column)) v-for="column in columns" :class="getClass(column)">
                {{ getColumnCaption(column) }}
            </div>
        </div>
        <div class="dinglj-v-tbody">
            <div>
                <div class="dinglj-v-tr" v-for="(line, idx) in data" @click="checkOne(line)">
                    <div class="dinglj-v-cell" :getStyle('') v-if="selectable" class="dinglj-v-table-select">
                        <input type="checkbox" :checked="checkedList.includesIgnoreCase(line)"/>
                    </div>
                    <div class="dinglj-v-cell" :getStyle('') v-if="sequanceNum" class="dinglj-v-table-sequence">
                        {{ idx + 1 }}
                    </div>
                    <div class="dinglj-v-cell" :getStyle(getColumnKey(column)) :class="getClass(column)" v-for="column in columns">
                        <div class="dinglj-v-auto-hidden" v-html="getCell(line, getColumnKey(column))"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    @Field
    public cache: any = {};

    @Field
    public checkAll: boolean = false;

    @Field
    public checkedList: Array<T> = [];

    @Method
    public getClass(column: any): object {
        const columnKey = this.getColumnKey(column);
        if (this.cache[columnKey]) {
            return this.cache[columnKey];
        }
        let flex = this.flexColumns.includesIgnoreCase(columnKey) ? 'flex' : 'fixed';
        const result: any = {};
        result[columnKey] = true;
        result[flex] = true;
        this.cache[columnKey] = result;
        return result;
    }

    @Method
    public getStyle(text: string): object {
        let width;
        if (text == '') {
            width = 80;
        } else {
            width = this.bestWidth[text];
        }
        return {}
    }

    @Method
    public doCheckAll(): void {
        this.checkedList.length = 0; // 直接清空
        if (!this.checkAll) { // 当前不是全选, 表示接下来要全选, 全部加入
            this.checkedList.push(...this.data);
        }
        this.checkAll = !this.checkAll;
    }

    @Compute(function(): any {
        let result: any = {};
        // 一列一列分别计算宽度
        for (let column of this.columns) {
            // 计算本列的标题宽度
            const columnKey = this.getColumnKey(column);
            const columnTitle = this.getColumnCaption(column);
            let titleWidth = window.calcTxtWidth(columnTitle);
            let widthArray = [ titleWidth ];
            // 计算本列的每一行宽度
            widthArray.push(
                ...this.data.map((e: T) => {
                    const columnContent = this.getCell(e, columnKey);
                    return window.calcTxtWidth(columnContent);
                })
            );
            const maxWidth = Math.max(...widthArray);
            result[columnKey] = maxWidth + 30;
        }
        return result;
    })
    public bestWidth: any;

    @Prop(Array<string>, [])
    public flexColumns: Array<string>;

    @Prop(Array<T>, [])
    public data: Array<T>;

    @Prop(Boolean, true)
    public sequanceNum: boolean;

    @Prop(Boolean, true)
    public selectable: boolean;

    @Prop(Array, [])
    public columns: Array<any>;

    @Prop(Function, (item: any): any => item)
    public getColumnKey: Function;

    @Prop(Function, (item: any): string => item)
    public getColumnCaption: Function;

    @Prop(Function, (item: T, columnName: string): string => { return (item as any)[columnName]; })
    public getCell: Function;
}