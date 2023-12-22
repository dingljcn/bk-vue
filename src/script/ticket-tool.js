import { RightMenu } from "../entity/RightMenu.js";
import { Ticket } from "../entity/Ticket.js";

const config = window.readConfig();

const defaultConfig = window.defaultConfig();

export function whoami() {
    return dinglj.getVal(config, 'whoami.zh', '', true);
}

export function readTicket(htmlData = '') {
    const result = [];
    let _document = window.document;
    if (htmlData.trim()) {
        _document = new DOMParser().parseFromString(htmlData, 'text/html');
    }
    const ticketClass = ['prio1', 'prio2', 'prio3'];
    for (let className of ticketClass) {
        for (let element of dinglj.byClass(_document, className)) {
            result.push(new Ticket(element));
        }
    }
    return result;
}

/** 获取单元格的内容 */
export function getCellValue(vue, ticket, columnKey) {
    if ('summary'.equalsIgnoreCase(columnKey)) {
        return getSummary(vue, ticket); // 概述单元格特殊处理
    }
    return ticket.get(columnKey);
}

export function getNewTickets(vue) {
    if (vue.newTickets) {
        return vue.newTickets;
    }
    const myTickets = getMyTickets(vue);
    vue.newTickets = vue.originData.filter(i => i.get('owner') == vue.whoami && !myTickets.includesIgnoreCase(i.get('id'))).map(i => i.get('id'));
    return vue.newTickets;
}

export function getMyTickets(vue) {
    if (vue.myTickets) {
        return vue.myTickets;
    }
    vue.myTickets = getLocalStorage(vue).myTickets || [];
    return vue.myTickets;
}

export function getLocalStorage(vue) {
    if (vue.localStorage) {
        return vue.localStorage;
    }
    vue.localStorage = dinglj.getStorage(vue.constant.storage, {
        topTickets: [],
        myTickets: [],
    });
    return vue.localStorage;
}

export function parseTicketTime(ticket, field = 'changetime') {
    const target = ticket.get(field);
    if (target == '刚刚') {
        return 0;
    }
    if (/^\d+分钟 ago$/.test(target)) {
        return parseInt(target) * 60; // 转为秒
    }
    if (/^\d+小时 ago$/.test(target)) {
        return parseInt(target) * 60 * 60; // 转为秒
    }
    if (/^\d+天 ago$/.test(target)) {
        return parseInt(target) *24 * 60 * 60; // 转为秒
    }
    if (/^\d+周 ago$/.test(target)) {
        return parseInt(target) * 7 * 24 * 60 * 60; // 转为秒
    }
    if (/^\d+个月 ago$/.test(target)) {
        return parseInt(target) * 30 * 24 * 60 * 60; // 转为秒
    }
    if (/^\d+年 ago$/.test(target)) {
        return parseInt(target)  * 365 * 24 * 60 * 60; // 转为秒
    }
}

export function sortByTime(ticket1, ticket2) {
    const firstCompare = parseTicketTime(ticket1) - parseTicketTime(ticket2);
    if (firstCompare == 0) {
        if (ticket1.get('id') > ticket2.get('id')) {
            return -1;
        } else if (ticket1.get('id') < ticket2.get('id')) {
            return 1;
        } else {
            return 0;
        }
    }
    return firstCompare;
}

export function toTicketId(target) {
    if (typeof target != 'string') {
        target = target.innerText;
    }
    target = target.trim();
    return target.startsWith('#') ? target.substring(1) : target;
}

export function openTicket(vue, target) {
    const ticketId = toTicketId(target);
    for (let element of dinglj.byClass(`ticket-${ ticketId }`)) {
        const selectField = dinglj.findChildrenByClass(element, 'dinglj-v-table-select');
        if (selectField && selectField.length) {
            selectField[0].children[0].checked = true;
        }
    }
    setOpended(vue, ticketId);
    let baseUrl = dinglj.getConfigOrDefault(config, defaultConfig, 'urls.ticket', '', 'false');
    if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
    }
    window.open(baseUrl + ticketId);
}

export function setOpended(vue, target) {
    const ticketId = toTicketId(target);
    const ticket = getTicketById(vue, ticketId);
    if (ticket.get('owner') == vue.whoami && getNewTickets(vue).includes(`#${ ticketId }`)) {
        getNewTickets(vue).remove(`#${ ticketId }`); // 移除元素
        updateSummary(vue, ticket); // 更新页面
        // 更新本地缓存
        vue.localStorage.myTickets.pushNew(`#${ ticketId }`);
        dinglj.setStorage(vue.constant.storage, vue.localStorage);
        return true;
    }
    return false;
}

export function setUnOpen(vue, target) {
    const ticketId = toTicketId(target);
    const ticket = getTicketById(vue, ticketId);
    if (ticket.get('owner') == vue.whoami && !getNewTickets(vue).includes(`#${ ticketId }`)) {
        getNewTickets(vue).pushNew(`#${ ticketId }`); // 添加元素
        updateSummary(vue, ticket); // 更新页面
        // 更新本地缓存
        vue.localStorage.myTickets.remove(`#${ ticketId }`);
        dinglj.setStorage(vue.constant.storage, vue.localStorage);
        return true;
    }
    return false;
}

/**更新概述单元格的内容 */
export function updateSummary(vue, ticket) {
    dinglj.byClass('dinglj-v-cell id').filter(e => e.innerText == ticket.get('id')).forEach(e => {
        let summary = dinglj.findBroByClass(e, 'summary');
        if (summary) {
            summary.innerHTML = getSummary(vue, ticket);
        }
    });
};

/** 拼接概述单元格的内容 */
export function getSummary(vue, ticket) {
    let html = '';
    if (getNewTickets(vue).includes(ticket.get('id'))) {
        html += '<span class="ticket-list-new-ticket">[new]</span>';
    }
    if (getTops(vue).includes(ticket.get('id'))) {
        html += '<span class="ticket-list-top-ticket">[top]</span>';
    }
    html += `<span title="${ ticket.get('summary') }">${ ticket.get('summary') }</span>`;
    return html;
}

export function getTops(vue) {
    if (vue.tops) {
        return vue.tops;
    }
    vue.tops = getLocalStorage(vue).topTickets || [];
    return vue.tops;
}

export function getTicketById(vue, target) {
    const ticketId = toTicketId(target);
    const result = vue.originData.getIfExist('id', `#${ ticketId }`);
    return result && result.length ? result[0] : null;
}

export function afterTableLoad(vue, tableId) {
    const list = dinglj.query(`#${ tableId } .dinglj-v-tbody .dinglj-v-cell.id`);
    list.forEach(element => {
        element.parentNode.classList.add(`ticket-${ toTicketId(element) }`);
        element.addEventListener('click', e => {
            e.stopPropagation();
            openTicket(vue, element);
        });
    });
    const lines = dinglj.query(`#${ tableId } .dinglj-v-tbody .dinglj-v-tr`);
    for (let line of lines) {
        buildTicketRightMenu(vue, line, tableId);
    }
}

export function isTop(vue, obj) {
    if (typeof obj == 'string') {
        return getTops(vue).includesIgnoreCase(obj);
    } else {
        return getTops(vue).includesIgnoreCase(obj.get('id'));
    }
}

export function buildTicketRightMenu(vue, line, id) {
    const idElement = dinglj.findChildrenByClass(line, 'id')[0];
    const ticketId = idElement.innerText.trim();
    const ticket = getTicketById(vue, ticketId);
    dinglj.registRightClick(line, id, {
        items: [
            new RightMenu('打开', () => {
                openTicket(vue, ticketId);
            }),
            new RightMenu('复制描述', () => {
                dinglj.copyTxt(ticket.get('summary'));
            }),
            new RightMenu('置顶', () => {
                toTop(vue, ticketId);
                `${ idElement.innerText } 已置顶`.info();
            }, () => !isTop(vue, ticketId)),
            new RightMenu('取消置顶', () => {
                cancelTop(vue, ticketId);
                `${ idElement.innerText } 已取消置顶`.info();
            }, () => isTop(vue, ticketId)),
            new RightMenu('标记为已读', () => {
                if (setOpended(vue, idElement.innerText)) {
                    `${ idElement.innerText } 已标记为已读`.info();
                }
            }, () => getNewTickets(vue).includes(ticketId)),
            new RightMenu('标记为未读', () => {
                if (setUnOpen(vue, idElement.innerText)) {
                    `${ idElement.innerText } 已取消已读标记`.info();
                }
            }, () => !getNewTickets(vue).includes(ticketId)),
            new RightMenu('显示更多信息', () => {
                vue.modal.ticket = ticket;
                vue.modal.display = true;
            }),
        ]
    });
}

export function toTop(vue, target) {
    const ticketId = toTicketId(target);
    vue.localStorage.topTickets.pushNew(`#${ ticketId }`);
    dinglj.setStorage(vue.constant.storage, vue.localStorage);
}

export function cancelTop(vue, target) {
    const ticketId = toTicketId(target);
    vue.localStorage.topTickets.remove(`#${ ticketId }`);
    dinglj.setStorage(vue.constant.storage, vue.localStorage);
}

export function groupData(vue) {
    if (vue.filterData.length <= 0) {
        return {};
    }
    let result = {};
    if (vue.groupColumn) {
        result = dinglj.groupBy(vue.filterData, vue.groupColumn);
    } else {
        '未找到任何用于分组的配置'.err();
    }
    const strategyList = dinglj.getConfigOrDefault(config, defaultConfig, 'strategy.groupBy', []);
    for (let ticket of vue.filterData) {
        for (let fieldKey of Ticket.fieldNames) {
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
}

export function groupNames(vue) {
    if (vue.groupData.length <= 0) {
        return [];
    }
    const result = Object.keys(vue.groupData); // 所有分组名
    const order = dinglj.getConfigOrDefault(config, defaultConfig, 'strategy.order.group', {}, false); // 获取排序规则
    result.sort((o1, o2) => {
        return dinglj.compareStringByArray(order[vue.groupColumn], o1, o2);
    })
    return result;
}

export function tabData(vue, groupName) {
    // 没有数据, 直接返回
    const groupData = vue.groupData[groupName];
    const result = {};
    if (!groupData || groupData.length == 0) {
        return result;
    }
    const tabStrategys = dinglj.getConfigOrDefault(config, defaultConfig, 'strategy.tabBy', []);
    const rowFilters = dinglj.getConfigOrDefault(config, defaultConfig, 'strategy.rowFilter', []);
    // 遍历每一个 Tab 页策略
    for (let tabStrategy of tabStrategys) {
        // 根据规则, 将所有符合规则的变更找出来
        for (let ticket of groupData) {
            let tmpName = tabStrategy.exec(groupName, ticket);
            if (tmpName) {
                // 根据行过滤器进行二次判断
                let ignore = false;
                for (let filter of rowFilters) {
                    if (filter.exec(groupName, tmpName, groupData, ticket)) {
                        ignore = true;
                        break
                    }
                }
                if (!ignore) {
                    dinglj.pushToObj(result, tmpName, ticket, true);
                }
            }
        }
    }
    // 这样就得到了该 tab 页下所有的变更, 然后对变更进行排序
    const orderStrategys = dinglj.getConfigOrDefault(config, defaultConfig, 'strategy.order.ticket', []);
    for (let tabName of Object.keys(result)) {
        result[tabName].sort((t1, t2) => {
            if (isTop(vue, t1.get('id')) ^ isTop(vue, t2.get('id'))) {
                if (isTop(vue, t1.get('id'))) {
                    return -1;
                } else if (isTop(vue, t2.get('id'))) {
                    return 1;
                }
            }
            for (let orderStrategy of orderStrategys) {
                let flag = orderStrategy.exec(groupName, tabName, t1, t2);
                if (flag != 0) {
                    return flag;
                }
            }
            return sortByTime(t1, t2); // 默认按照时间排序
        })
    }
    return result;
}

export function columnsToDisplay(vue, groupName, tabName) {
    const tabDatas = tabData(vue, groupName);
    if (!tabDatas) {
        return [];
    }
    const everyTab = tabDatas[tabName];
    if (!everyTab || everyTab.length == 0) {
        return [];
    }
    let columnKeys = [];
    const filters = dinglj.getConfigOrDefault(config, defaultConfig, 'strategy.colFilter', []);
    // 根据列的过滤策略进行过滤
    for (let column of Ticket.fieldNames) {
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
}