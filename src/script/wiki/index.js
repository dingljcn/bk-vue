import './read-config.js';
import '../../utils/index.js';
import '../../entity/GroupStrategy.js';
import '../../entity/DataFilter.js';
import '../../entity/TabStrategy.js';
import '../../entity/OrderTicket.js';
import mymodal from '../ticket-modal.js';
import wiki from './wiki.js';
import ticket from './ticket.js';
import { afterTableLoad, columnsToDisplay, getCellValue, getLocalStorage, getMyTickets, getNewTickets, getSummary, getTops, groupData, groupNames, readTicket, tabData, updateSummary, whoami } from '../ticket-tool.js';

dinglj.linkCss('assets/css/utils.css');
dinglj.linkCss('assets/css/vue.css');
dinglj.linkCss('src/script/wiki/index.css');
dinglj.injectUserCss();
dinglj.remById('footer');

const mainElement = dinglj.byId('main');
if (mainElement) {
    for (let element of mainElement.children) {
        element.style.display = 'none';
    };
    mainElement.innerHTML += `<div id="dinglj-main">
        <snapscroll :size="2">
            <wiki :origin="originData" :parent="this">
            </wiki>
            <ticket :class="{ 'ticket-page': true, 'active': flag.detail }" :parent="this">
            </ticket>
        </snapscroll>
        <mymodal :display="modal.display" @on-close="modal.display = false" :parent="this" :ticket="modal.ticket"></mymodal>
    </div>`;
}

createVue({
    data() {
        return {
            constant: {
                storage: 'dinglj-v-wiki-storage',
            },
            filter: {},
            tops: undefined,
            newTickets: undefined,
            localStorage: undefined,
            myTickets: undefined,
            modal: {
                display: false,
                ticket: null,
            },
            flag: {
                detail: false,
            }
        }
    },
    methods: {
        updateSummary(ticket) {
            return updateSummary(this, ticket);
        },
        getSummary(ticket) {
            return getSummary(this, ticket);
        },
        tableLoaded(tableId) {
            afterTableLoad(this, tableId);
        },
        getTops() {
            return getTops(this);
        },
        getNewTickets() {
            return getNewTickets(this);
        },
        getMyTickets() {
            return getMyTickets(this);
        },
        getLocalStorage() {
            return getLocalStorage(this);
        },
        getCellValue(ticket, columnKey) {
            return getCellValue(this, ticket, columnKey);
        },
        tabData(groupName) {
            return tabData(this, groupName);
        },
        tabNames(groupName) {
            return Object.keys(this.tabData(groupName));
        },
        columnsToDisplay(groupName, tabName) {
            return columnsToDisplay(this, groupName, tabName)
        }
    },
    computed: {
        originData() {
            return readTicket(window.readData());
        },
        filterData() {
            return this.originData;
        },
        groupColumn() {
            return '';
        },
        whoami() {
            return whoami();
        },
        groupData() {
            return groupData(this);
        },
        groupNames() {
            return groupNames(this);
        }
    },
    components: {
        wiki, mymodal, ticket
    }
}, '#dinglj-main');