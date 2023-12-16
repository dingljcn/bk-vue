const fields = {
    id: '变更号',
    summary: '概述',
    status: '状态',
    reporter: '报告人',
    owner: '属主',
    type: '类型',
    priority: '优先级',
    component: '组件',
    resolution: '处理结果',
    time: '创建时间',
    changetime: '修改时间',
    plandate: '计划日期',
    pingtai: '平台',
    project: '项目',
    ticketclass: '分类',
    testadjust: '测试调整',
    testreport: '测试调整提出者',
    testower1: '测试调整处理者',
    keywords: '关键词',
    cc: '抄送',
    version: '版本',
    dinglj_note: '备注',
};

export class Ticket {
    static fields = fields;
    static fieldNames = Object.keys(fields);
    static fieldValues = Object.values(fields);
    static unknownColumn = ['sel'];
    static getCaption(key) {
        if (Ticket.fieldNames.includesIgnoreCase(key)) {
            return Ticket.fields[key];
        }
        return key;
    }
    constructor(element = null) {
        if (element == null) {
            return;
        }
        const info = dinglj.getStorage('dinglj-v-ticket-info', {});
        for (let cell of element.children) {
            const key = cell.className;
            const value = cell.innerText.trim();
            this.set(key, value);
            if ('id'.equalsIgnoreCase(key) && info[value]) {
                this.set('dinglj_note', info[value].note);
            }
        }
    }
    static forLocalTest(element) {
        let ticket = new Ticket();
        const info = dinglj.getStorage('dinglj-v-ticket-info', {});
        for (let key of Object.keys(element)) {
            const value = element[key];
            ticket.set(key, value);
            if ('id'.equalsIgnoreCase(key) && info[value]) {
                ticket.set('dinglj_note', info[value].note);
            }
        }
        return ticket;
    }
    set(key, value) {
        if (Ticket.fieldNames.includesIgnoreCase(key)) {
            this[key] = value;
        } else if (!Ticket.unknownColumn.includesIgnoreCase(key)) {
            `不存在的列: ${ key }`.warn();
            Ticket.unknownColumn.push(key);
        }
    }
    get(key) {
        if (this[key]) {
            return this[key];
        }
        return '';
    }
}