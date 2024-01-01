import { Compute, Field, Mounted, Template, Watch } from "../../component";
import { AbstractComponent, Registry } from "../../entity";

class Filter extends AbstractComponent {

    @Mounted(Filter, 'CL-Filter')
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
    }

    @Template
    public template: string = `<div id="case-filter">
        <div class="filter-row">
            <i-input caption="搜索" placeholder="请输入关键字"
                @on-input="data => filter.keyword = data.value">
            </i-input>
            <i-combo caption="状态" placeholder="请选择状态"
                style="margin-left: 10px"
                :list="Object.values(status)"
                :get-value="i => i.en" 
                :get-caption="i => i.zh"
                @on-change="s => filter.status = s">
            </i-combo>
            <i-combo caption="版本" placeholder="默认为当前版本"
                style="margin-left: 10px; --width: 400px"
                :list="versionNames"
                @on-change="v => filter.versions = v">
            </i-combo>
            <div style="flex: 1"></div>
            <i-switch pre-text="卡片视图" post-text="表格视图" @on-change="data => filter.mode = (data.value ? 'table' : 'card')">
            </i-switch>
        </div>
        <div class="filter-row" v-if="filter.mode == 'card'">
            <i-input caption="每列的卡片数" placeholder="请输入每列的卡片数量"
                default-value="7"
                @on-input="data => filter.cardCnt = ((isNaN(data.value) || data.value < 5) ? 5 : parseInt(data.value))">
            </i-input>
        </div>
    </div>`;

    @Field
    public filter = {
        keyword: '',
        status: '',
        versions: '',
        mode: 'card',
        cardCnt: 7,
    }

    @Field
    public versionList: Array<string> = [];

    @Watch('filter')
    public onFilterChange(newVal: any, oldVal: any): void {
        this.emit('on-change', newVal);
    }
    
    /** 获取用户配置 */
    @Compute(function() {
        return window.readConfig();
    })
    public config: any;

    /** 获取脚本设置的默认配置 */
    @Compute(function() {
        return window.defaultConfig();
    })
    public defaultConfig: any;

    /** 状态 */
    @Compute(function(): Array<any> {
        return window.getConfigOrDefault(this.config, this.defaultConfig, 'constant.status', [], true);
    })
    public status: any

    @Compute(function(): Array<any> {
        if (window.isDev()) {
            return (window as any).readVersion();
        }
        if (this.versionList.length == 0) {
            let versions = window.getConfigOrDefault(this.config, this.defaultConfig, 'urls.versions', '', false);
            this.versionList = JSON.parse(window.get(versions));
        }
        return this.versionList;
    })
    public versions: Array<any>;

    @Compute(function() {
        return this.versions.map((i: any) => i.erpVersion);
    })
    public versionNames: Array<string>;

}

export const filter = Registry.getComponent('CL-Filter').build();