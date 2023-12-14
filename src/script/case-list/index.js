import '../../utils/index.js';
import './utils.js';
import { Case } from './entity/Case.js';
import vuefilter from './filter.js';
import cardmode from './cardmode.js';
import tablemode from './tablemode.js';

document.body.innerHTML = `<div id="case-list-dinglj-container">
    <navigatorview :list="componentNames">
        <template v-slot:before>
            <VueFilter @on-change="obj => filter.data = obj"></VueFilter>
        </template>
        <template v-slot:content id="case-list-view">
            <tabpanelview v-for="componentName in componentNames"
                    :names="statusNames(componentName).map(name => { return { 'label': status[name].zh, 'value': name }; })" 
                    :get-value="n => n.value"
                    :get-name="n => n.label + '(' + groupByStatus(componentName)[n.value].length + ')'">
                <tablemode v-if="filter.data.mode != 'card'"
                    :scope="componentName"
                    :status-names="statusNames(componentName)"
                    :group-data="groupByStatus(componentName)">
                </tablemode>
                <cardmode v-else 
                    :status-names="statusNames(componentName)" 
                    :group-data="groupByStatus(componentName)"
                    :card-cnt="filter.data.cardCnt">
                </cardmode>
            </tabpanelview>
        </template>
        <template v-slot:after></template>
    </navigatorview>
</div>`;

createVue({
    mounted() {
        window.displayData = function() {
            console.log(this);
        }
    },
    data() {
        return {
            allVersionDatas: {},
            filter: {
                data: {
                    mode: 'card',
                    cardCnt: 7
                }
            }
        }
    },
    methods: {
        /** 某个 Component 分组下, 再次按照 Status 进行细分组 */
        groupByStatus(componentName) {
            return dinglj.groupBy(this.groupByComponent[componentName], item => item.status.en);
        },
        /** 某个 Component 分组下, 排好序的 Status 顺序 */
        statusNames(componentName) {
            const data = this.groupByStatus(componentName);
            let order = dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'order.preferStatus', [], false)
                .map(i => i.toLowerCase());
            return Object.keys(data).sort((o1, o2) => {
                return dinglj.compareStringByArray(order, o1.toLowerCase(), o2.toLowerCase());
            });
        }
    },
    computed: {
        /** 获取用户配置 */
        config() {
            return window.readConfig();
        },
        /** 获取脚本设置的默认配置 */
        defaultConfig() {
            return window.defaultConfig();
        },
        /** 状态 */
        status() {
            return dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'constant.status', [], true);
        },
        /** 获取用例集合 */
        originData() {
            const version = this.filter.data.versions || 'default';
            if (dinglj.isDev()) {
                return readData(version); // 用于本地测试, 本地会通过这个方法提供数据
            }
            if (this.allVersionDatas[version]) {
                return this.allVersionDatas[version];
            }
            let result;
            if (version == 'default') {
                result = dinglj.get(dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'urls.defaultVersionData', '', false));
                result =  JSON.parse(result).testCaseTasks;
            } else {
                result = dinglj.get(dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'urls.readVersion', '', false) + version);
                result =  JSON.parse(result);
            }
            this.allVersionDatas[version] = result.map(item => new Case(item, this.status));
            return this.allVersionDatas[version];
        },
        /** 经过过滤字段处理的用例集合 */
        filteredData() {
            let result = this.originData;
            if (this.filter.data.keyword) {
                result = result.filter(_case_ => _case_.caseName.includesIgnoreCase(this.filter.data.keyword));
            }
            if (this.filter.data.status) {
                result = result.filter(_case_ => JSON.stringify(_case_.status) == JSON.stringify(this.filter.data.status));
            }
            if (result.length == 0) {
                '未找到任何有效数据'.err();
            }
            return result;
        },
        /** 排过序的模块名称 */
        componentNames() {
            let order = dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'order.preferComponent', [], false)
                .map(i => i.toLowerCase());
            order.unshift('unit');
            const result = Object.keys(this.groupByComponent).sort((o1, o2) => {
                return dinglj.compareStringByArray(order, o1.toLowerCase(), o2.toLowerCase());
            });
            return result;
        },
        /** 将经过过滤处理的用例集合按照 component 字段进行分组, component 值相等的用例放到一个数组中 */
        groupByComponent() {
            let firstGroup = dinglj.groupBy(this.filteredData, 'component');
            const array = this.filteredData.filter(i => i.level == 0);
            if (array.length > 0) {
                firstGroup['UNIT'] = array;
            }
            return firstGroup;
        },
        
    },
    components: {
        vuefilter, cardmode, tablemode
    }
}, '#case-list-dinglj-container');