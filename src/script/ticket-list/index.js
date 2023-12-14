import './read-config.js';
import '../../utils/index.js';
import './entity/GroupStrategy.js';
import './entity/DataFilter.js';
import './entity/TabStrategy.js';
import './entity/OrderTicket.js';
import vuefilter from './filter.js';
import { buildTicketRightMenu } from './utils.js';
import { Ticket } from './entity/Ticket.js';

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
    </div>`;
}

createVue({
    data() {
        return {
            constant: {
                storage: 'dinglj-v-ticket-list-storage',
                ticketInfo: 'dinglj-v-ticket-info',
            },
            filter: {},
            tops: undefined,
            newTickets: undefined,
            localStorage: undefined,
            myTickets: undefined,
        }
    },
    mounted() {
        const _that = this;
        this.getTops();
        this.getNewTickets();
        window.displayData = function() {
            return _that;
        }
        window.dinglj.openTicketById = this.openTicketById;
        window.dinglj.setOpended = this.setOpended;
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
        dinglj.msg.on('to-top', (that, ticketId) => {
            this.localStorage.topTickets.pushNew(ticketId);
            dinglj.setStorage(this.constant.storage, this.localStorage);
        });
        dinglj.msg.on('remove-top', (that, ticketId) => {
            this.localStorage.topTickets.remove(ticketId);
            dinglj.setStorage(this.constant.storage, this.localStorage);
        });
    },
    methods: {
        /**更新概述单元格的内容 */
        updateSummary(ticket) {
            dinglj.byClass('dinglj-v-cell id').filter(e => e.innerText == ticket.id).forEach(e => {
                let summary = dinglj.findBroByClass(e, 'summary');
                if (summary) {
                    summary.innerHTML = this.getSummary(ticket);
                }
            });
        },
        /** 拼接概述单元格的内容 */
        getSummary(ticket) {
            let html = '';
            if (this.getNewTickets().includes(ticket.id)) {
                html += '<span class="ticket-list-new-ticket">[new]</span>';
            }
            if (this.tops.includes(ticket.id)) {
                html += '<span class="ticket-list-top-ticket">[top]</span>';
            }
            html += `<span title="${ ticket.summary }">${ ticket.summary }</span>`;
            return html;
        },
        /** 获取单元格的内容 */
        getCellValue(ticket, columnKey) {
            if ('summary'.equalsIgnoreCase(columnKey)) {
                return this.getSummary(ticket); // 概述单元格特殊处理
            }
            return ticket[columnKey];
        },
        /** 根据变更号打开变更 */
        openTicketById(id) {
            window.open(`${ this.ticketURL }/${ id.replace('#', '').trim() }`);
            this.setOpended(id);
        },
        /** 将变更标记为已读 */
        setOpended(ticketId) {
            const ticket = this.getTicketById(ticketId);
            if (ticket.owner == this.whoami && this.getNewTickets().includes(ticketId)) {
                this.getNewTickets().remove(ticketId); // 移除元素
                this.updateSummary(ticket); // 更新页面
                // 更新本地缓存
                this.localStorage.myTickets.pushNew(ticketId);
                dinglj.setStorage(this.constant.storage, this.localStorage);
                return true;
            }
            return false;
        },
        /** 将变更标记为未读 */
        setUnOpen(ticketId) {
            const ticket = this.getTicketById(ticketId);
            if (ticket.owner == this.whoami && !this.getNewTickets().includes(ticketId)) {
                this.getNewTickets().pushNew(ticketId); // 添加元素
                this.updateSummary(ticket); // 更新页面
                // 更新本地缓存
                this.localStorage.myTickets.remove(ticketId);
                dinglj.setStorage(this.constant.storage, this.localStorage);
                return true;
            }
            return false;
        },
        /** 根据变更号获取变更 */
        getTicketById(id) {
            return this.originData[this.originData.indexOfByProp('id', id)];
        },
        /** 表格加载后事件, 绑定点击事件, 右键菜单 */
        tableLoaded(id) {
            const list = dinglj.query(`#${ id } .dinglj-v-tbody .dinglj-v-cell.id`);
            list.forEach(element => {
                element.addEventListener('click', () => this.openTicketById(element.innerText.trim()));
            });
            const lines = dinglj.query(`#${ id } .dinglj-v-tbody .dinglj-v-tr`);
            for (let line of lines) {
                buildTicketRightMenu(this, line, id);
            }
        },
        /** 获取某个分组下的 Tab 页数据 */
        tabData(groupName) {
            // 没有数据, 直接返回
            const groupData = this.groupData[groupName];
            const result = {};
            if (!groupData || groupData.length == 0) {
                return result;
            }
            const tabStrategys = dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'strategy.tabBy', []);
            const rowFilters = dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'strategy.rowFilter', []);
            // 遍历每一个 Tab 页策略
            for (let tabStrategy of tabStrategys) {
                let tabName = '';
                let list = []
                // 根据规则, 将所有符合规则的变更找出来
                for (let ticket of groupData) {
                    let tmpName = tabStrategy.exec(groupName, ticket);
                    if (tmpName) {
                        tabName = tmpName;
                        // 根据行过滤器进行二次判断
                        let ignore = false;
                        for (let filter of rowFilters) {
                            if (filter.exec(groupName, tabName, groupData, ticket)) {
                                ignore = true;
                                break
                            }
                        }
                        if (!ignore) {
                            list.push(ticket);
                        }
                    }
                }
                // 这样就得到了该 tab 页下所有的变更
                if (tabName && list.length > 0) {
                    const orderStrategys = dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'strategy.order.ticket', []);
                    // 然后对变更进行排序
                    list.sort((t1, t2) => {
                        if (this.isTop(t1.id) ^ this.isTop(t2.id)) {
                            if (this.isTop(t1.id)) {
                                return -1;
                            } else if (this.isTop(t2.id)) {
                                return 1;
                            }
                        }
                        for (let orderStrategy of orderStrategys) {
                            let flag = orderStrategy.exec(groupName, tabName, t1, t2);
                            if (flag != 0) {
                                return flag;
                            }
                        }
                        return 0;
                    })
                    // 最后放入返回结果中
                    result[tabName] = list;
                }
            }
            return result;
        },
        /** 获取某个分组下的 Tab 页名称列表 */
        tabNames(groupName) {
            return Object.keys(this.tabData(groupName));
        },
        /** 要显示的列 */
        columnsToDisplay(groupName, tabName) {
            const tabData = this.tabData(groupName);
            if (!tabData) {
                return [];
            }
            const everyTab = tabData[tabName];
            if (!everyTab || everyTab.length == 0) {
                return [];
            }
            let columnKeys = [];
            const filters = dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'strategy.colFilter', []);
            // 根据列的过滤策略进行过滤
            for (let column of Object.keys(everyTab[0])) {
                let ignore = false;
                for (const filter of filters) {
                    if (filter.exec(groupName, tabName, everyTab, null, column)) {
                        ignore = true;
                        break;
                    }
                }
                if (!ignore) {
                    columnKeys.push(column);
                }
            }
            return columnKeys.map(i => {
                return {
                    label: Ticket.getCaption(i),
                    value: i,
                }
            })
        },
        /** 判断一个变更是否置顶 */
        isTop(obj) {
            if (typeof obj == 'string') {
                return this.getTops().includesIgnoreCase(obj);
            } else {
                return this.getTops().includesIgnoreCase(obj.id);
            }
        },
        /** 本地缓存 */
        getLocalStorage() {
            if (this.localStorage) {
                return this.localStorage;
            }
            this.localStorage = dinglj.getStorage(this.constant.storage, {
                topTickets: [],
                myTickets: [],
            });
            return this.localStorage;
        },
        /** 获取要置顶的变更 */
        getTops() {
            if (this.tops) {
                return this.tops;
            }
            this.tops = this.getLocalStorage().topTickets || [];
            return this.tops;
        },
        /** 获取新的变更 */
        getNewTickets() {
            if (this.newTickets) {
                return this.newTickets;
            }
            const myTickets = this.getMyTickets();
            this.newTickets = this.originData.filter(i => i.owner == this.whoami && !myTickets.includesIgnoreCase(i.id)).map(i => i.id);
            return this.newTickets;
        },
        /** 获取我的变更 */
        getMyTickets() {
            if (this.myTickets) {
                return this.myTickets;
            }
            this.myTickets = this.getLocalStorage().myTickets || [];
            return this.myTickets;
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
            const columns = Object.keys(this.originData[0]); // 所有显示出来的列
            let groupColumn = dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'groupBy', defaultValue, true, false);
            for (let tmp of defaultColumns) {
                if (columns.includesIgnoreCase(tmp)) {
                    groupColumn = tmp;
                    break;
                }
            }
            return groupColumn;
        },
        /** 纯天然无污染的源数据 */
        originData() {
            let result = [];
            if (dinglj.isDev()) {
                result = readData(); // 用于本地测试, 本地会通过这个方法提供数据
            } else {
                let ticketClass = dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'constant.ticketClass', '', false);
                for (let className of ticketClass) {
                    for (let element of dinglj.byClass(className)) {
                        result.push(new Ticket(element));
                    }
                }
            }
            return result;
        },
        /** 经过过滤器过滤的数据 */
        filterData() {
            if (this.originData.length == 0) {
                return [];
            }
            let result = this.originData;
            for (let column of Object.keys(this.originData[0])) {
                if (this.filter[column]) {
                    result = result.filter(i => i[column] == this.filter[column]);
                }
            }
            result = result.filter(i => this.filter.keyword ? i.summary.includesIgnoreCase(this.filter.keyword) : true);
            return result;
        },
        /** 分组数据 */
        groupData() {
            if (this.filterData.length <= 0) {
                return {};
            }
            if (this.groupColumn) {
                const result = dinglj.groupBy(this.filterData, this.groupColumn);
                const fieldList = Object.keys(this.filterData[0]);
                const strategyList = dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'strategy.groupBy', []);
                for (let ticket of this.filterData) {
                    for (let fieldKey of fieldList) {
                        for (let idx = strategyList.length - 1; idx >= 0; idx--) {
                            let groupName = strategyList[idx].exec(ticket, fieldKey);
                            if (groupName) {
                                if (!result[groupName] || !result[groupName].includes(ticket)) {
                                    dinglj.unshiftToObj(result, groupName, ticket);
                                }
                            }
                        }
                    }
                }
                return result;
            } else {
                '未找到任何用于分组的配置'.err();
                return {};
            }
        },
        /** 分组名称列表 */
        groupNames() {
            if (this.groupData.length <= 0) {
                return [];
            }
            const result = Object.keys(this.groupData); // 所有分组名
            const order = dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'strategy.order.group', {}, false); // 获取排序规则
            result.sort((o1, o2) => {
                return dinglj.compareStringByArray(order[this.groupColumn], o1, o2);
            })
            return result;
        },
        /** 获取变更地址 */
        ticketURL() {
            return dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'urls.ticket', '');
        },
        /** 我的名字 */
        whoami() {
            return dinglj.getVal(this.config, 'whoami.zh', '', true);
        }
    },
    components: {
        vuefilter
    }
}, '#dinglj-main');