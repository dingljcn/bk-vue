import { Component, Compute, Field, Method, Mounted } from '../../component';
import { AbstractComponent, Case, LangItem, Registry } from '../../entity';
import { filter as xfilter } from './filter';
import { card as xcard } from './card';
import '../../init';

window.linkCss('/src/script/case-list/index.css');

window.document.body.innerHTML = `<div id="case-list-dinglj-container">
    <i-nav-view :list="componentNames">
        <template v-slot:before>
            <xfilter @on-change="obj => filter.data = obj.value"></xfilter>
        </template>
        <template v-slot:content id="case-list-view">
            <i-tab-view v-for="componentName in componentNames"
                :list="tabTitle(componentName)"
                :get-caption="item => item.zh">
                <xcard  v-if="filter.data.mode == 'card'"
                    :status-names="statusNames(componentName)" 
                    :group-data="groupByStatus(componentName)"
                    :card-cnt="filter.data.cardCnt">
                </xcard>
            </i-tab-view>
        </template>
        <template v-slot:after></template>
    </i-nav-view>
</div>`;

window.defunc('uuid', () => {});

export class App extends AbstractComponent {

    @Component({
        xfilter, xcard
    })
    @Mounted(App, 'App')
    public mounted(): void {
        window.displayData = function() {
            console.log(this);
        }
    }

    @Field
    public allVersionDatas: any = {};

    @Field
    public filter = {
        data: {
            mode: 'card',
            cardCnt: 7
        }
    };

    /** 某个 Component 分组下, 再次按照 Status 进行细分组 */
    @Method
    public groupByStatus(componentName: string) {
        return window.groupBy(this.groupByComponent[componentName], (item: Case) => item.status.en);
    }

    /** 某个 Component 分组下, 排好序的 Status 顺序 */
    @Method
    public statusNames(componentName: string): Array<string> {
        const data = this.groupByStatus(componentName);
        let order: Array<string> = window.getConfigOrDefault(this.config, this.defaultConfig, 'order.preferStatus', [], false)
            .map(i => i.toLowerCase());
        return Object.keys(data).sort((o1: string, o2: string) => {
            return window.compareStringByArray(order, o1.toLowerCase(), o2.toLowerCase());
        });
    }

    @Method
    public tabTitle(componentName: string): Array<LangItem> {
        let tabKeys = this.statusNames(componentName);
        return tabKeys.map(key => {
            return new LangItem(key, this.status[key].zh);
        });
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

    /** 获取用例集合 */
    @Compute(function(): Array<Case> {
        const version = this.filter.data.versions || 'default';
        if (window.isDev()) {
            return window.readData(version); // 用于本地测试, 本地会通过这个方法提供数据
        }
        if (this.allVersionDatas[version]) {
            return this.allVersionDatas[version];
        }
        let result;
        if (version == 'default') {
            const str: string = window.get(window.getConfigOrDefault(this.config, this.defaultConfig, 'urls.defaultVersionData', '', false));
            result =  JSON.parse(str).testCaseTasks;
        } else {
            const str: string = window.get(window.getConfigOrDefault(this.config, this.defaultConfig, 'urls.readVersion', '', false) + version);
            result =  JSON.parse(str);
        }
        this.allVersionDatas[version] = result.map((item: any) => new Case(item, this.status));
        return this.allVersionDatas[version];
    })
    public originData: Array<Case>

    /** 经过过滤字段处理的用例集合 */
    @Compute(function() {
        let result = this.originData;
        if (this.filter.data.keyword) {
            result = result.filter((_case_: Case) => _case_.caseName.includesIgnoreCase(this.filter.data.keyword));
        }
        if (this.filter.data.status) {
            result = result.filter((_case_: Case) => JSON.stringify(_case_.status) == JSON.stringify(this.filter.data.status));
        }
        if (result.length == 0) {
            '未找到任何有效数据'.err();
        }
        return result;
    })
    public filteredData: Array<Case>

    /** 将经过过滤处理的用例集合按照 component 字段进行分组, component 值相等的用例放到一个数组中 */
    @Compute(function(): any {
        let firstGroup = window.groupBy(this.filteredData, 'component');
        const array = this.filteredData.filter((i: Case) => i.level == 0);
        if (array.length > 0) {
            firstGroup['UNIT'] = array;
        }
        return firstGroup;
    })
    public groupByComponent: any;

    
    /** 排过序的模块名称 */
    @Compute(function(): Array<string> {
        let order = window.getConfigOrDefault(this.config, this.defaultConfig, 'order.preferComponent', [], false)
            .map(i => i.toLowerCase());
        order.unshift('unit');
        const result = Object.keys(this.groupByComponent).sort((o1, o2) => {
            return window.compareStringByArray(order, o1.toLowerCase(), o2.toLowerCase());
        });
        return result;
    })
    componentNames: Array<string>;

}

window.createVue(Registry.getComponent('App').build(), '#case-list-dinglj-container');