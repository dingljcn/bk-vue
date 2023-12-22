import './read-config.js';
import '../../utils/index.js';
import '../../entity/GroupStrategy.js';
import '../../entity/DataFilter.js';
import '../../entity/TabStrategy.js';
import '../../entity/OrderTicket.js';
import vuefilter from './filter.js';
import mymodal from '../ticket-modal.js';
import { afterTableLoad, columnsToDisplay, getCellValue, getLocalStorage, getMyTickets, getNewTickets, getSummary, getTicketById, getTops, groupData, groupNames, isTop, openTicket, readTicket, setOpended, setUnOpen, tabData, updateSummary, whoami } from '../ticket-tool.js';
dinglj.linkCss('assets/css/utils.css');
dinglj.linkCss('assets/css/vue.css');
dinglj.linkCss('src/script/ticket-list/index.css');
dinglj.injectUserCss();
dinglj.remById('footer');

const mainElement = dinglj.byId('main');
if (mainElement) {
    for (let element of mainElement.children) {
        element.style.display = 'none';
    };
    mainElement.innerHTML += `<div id="dinglj-main">
        <navigatorview :list="groupNames">
            <template v-slot:before>
                <vuefilter :data="originData" @on-change="data => filter = data"></vuefilter>
            </template>
            <template class="result-view" v-slot:content>
                <tabpanelview v-for="groupName in groupNames" :names="this.tabNames(groupName)"
                    :get-name="k => k + '(' + tabData(groupName)[k].length + ')'">
                    <TableX v-for="tabName in tabNames(groupName)"
                        :columns="columnsToDisplay(groupName, tabName)"
                        :data="tabData(groupName)[tabName]"
                        :flex-columns="['summary']"
                        :get-cell="(t, c) => getCellValue(t, c)"
                        :key="groupName + tabName + tops.length"
                        @on-loaded="tableLoaded">
                    </TableX>
                </tabpanelview>
            </template>
            <template v-slot:after></template>
        </navigatorview>
        <mymodal :display="modal.display" @on-close="modal.display = false" :parent="this" :ticket="modal.ticket"></mymodal>
    </div>`;
}

createVue({
    data() {
        return {
            constant: {
                storage: 'dinglj-v-ticket-list-storage',
            },
            filter: {},
            tops: undefined,
            newTickets: undefined,
            localStorage: undefined,
            myTickets: undefined,
            modal: {
                display: false,
                ticket: null,
            }
        }
    },
    mounted() {
        const _that = this;
        this.getTops();
        this.getNewTickets();
        window.displayData = function() {
            return _that;
        }
        if (this.getNewTickets().length > 0) {
            let msg = `你有 ${ this.getNewTickets().length } 个新变更, 注意查收<div style="margin-top: 10px; display: flex">
            <div style="flex: 1"></div>
                <div style="margin-left: 5px; font-weight: bold; color: var(--theme-color); cursor: pointer" onclick="${
                    this.getNewTickets().map(t => `dinglj.openTicketById('${ t }');`).join('')
                }">全部打开</div>
                <div style="margin-left: 10px; font-weight: bold; color: var(--theme-color); cursor: pointer" onclick="${
                    (this.getNewTickets().map(t => `dinglj.setOpended('${ t }');`).join('')) + "'已全部标记'.info()"
                }">全部标记为已读</div>
            </div>`;
            msg.info(5000);
        }
    },
    methods: {
        /**更新概述单元格的内容, to-tool */
        updateSummary(ticket) {
            return updateSummary(this, ticket);
        },
        /** 拼接概述单元格的内容, to-tool */
        getSummary(ticket) {
            return getSummary(this, ticket);
        },
        /** 获取单元格的内容, to-tool */
        getCellValue(ticket, columnKey) {
            return getCellValue(this, ticket, columnKey);
        },
        /** 根据变更号打开变更, to-tool */
        openTicketById(id) {
            return openTicket(this, id);
        },
        /** 将变更标记为已读, to-tool */
        setOpended(ticketId) {
            return setOpended(this, ticketId);
        },
        /** 将变更标记为未读, to-tool */
        setUnOpen(ticketId) {
            return setUnOpen(this, ticketId);
        },
        /** 根据变更号获取变更, to-tool */
        getTicketById(id) {
            return getTicketById(this, id);
        },
        /** 表格加载后事件, 绑定点击事件, 右键菜单, to-tool */
        tableLoaded(id) {
            return afterTableLoad(this, id);
        },
        /** 获取某个分组下的 Tab 页数据, to-tool */
        tabData(groupName) {
            return tabData(this, groupName);
        },
        /** 获取某个分组下的 Tab 页名称列表 */
        tabNames(groupName) {
            return Object.keys(this.tabData(groupName));
        },
        /** 要显示的列, to-tool */
        columnsToDisplay(groupName, tabName) {
            return columnsToDisplay(this, groupName, tabName);
        },
        /** 判断一个变更是否置顶, to-tool */
        isTop(obj) {
            return isTop(this, obj);
        },
        /** 本地缓存, to-tool */
        getLocalStorage() {
            return getLocalStorage(this);
        },
        /** 获取要置顶的变更, to-tool */
        getTops() {
            return getTops(this);
        },
        /** 获取新的变更, to-tool */
        getNewTickets() {
            return getNewTickets(this);
        },
        /** 获取我的变更, to-tool */
        getMyTickets() {
            return getMyTickets(this);
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
        /** 获取按照什么字段进行分组 */
        groupColumn() {
            const regExp = /[?&]group=([a-zA-Z0-9]+)[?&]?/;
            let defaultValue = '';
            if(regExp.test(window.location.href)) {
                defaultValue = (regExp.exec(window.location.href))[1]; // url 参数
            }
            const defaultColumns = ['component', 'owner', 'status']; // 如果既没有配置, 也没有 url 参数, 则从这里面选一个存在的
            let firstLevel = dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'groupBy', defaultValue, true, false);
            if (firstLevel && !defaultColumns.includesIgnoreCase(firstLevel)) {
                defaultColumns.unshift(firstLevel);
            }
            for (let tmp of defaultColumns) {
                if (Object.keys(this.originData[0]).includesIgnoreCase(tmp)) {
                    return tmp;
                }
            }
        },
        /** 纯天然无污染的源数据 */
        originData() {
            return readTicket(window.readData());
        },
        /** 经过过滤器过滤的数据 */
        filterData() {
            if (this.originData.length == 0) {
                return [];
            }
            let result = this.originData;
            for (let column of Object.keys(this.originData[0])) {
                if (this.filter[column]) {
                    result = result.filter(i => i.get(column) == this.filter[column]);
                }
            }
            result = result.filter(i => this.filter.keyword ? (i.get('summary').includesIgnoreCase(this.filter.keyword) || i.get('id').includesIgnoreCase(this.filter.keyword)) : true);
            return result;
        },
        /** 分组数据, to-tool */
        groupData() {
            return groupData(this);
        },
        /** 分组名称列表, to-tool */
        groupNames() {
            return groupNames(this);
        },
        /** 获取变更地址 */
        ticketURL() {
            return dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'urls.ticket', '');
        },
        /** 我的名字, to-tool */
        whoami() {
            return whoami();
        }
    },
    components: {
        vuefilter, mymodal
    }
}, '#dinglj-main');