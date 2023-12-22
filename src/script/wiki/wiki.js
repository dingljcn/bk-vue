import tabpanel from "../../components/base/tabpanel/index.js";
import tablex from "../../components/base/tablex/index.js";
import { Ticket } from "../../entity/Ticket.js";
import { afterTableLoad, getCellValue, parseTicketTime, sortByTime, whoami } from "../ticket-tool.js";

export default {
    template: `<div class="dlj-wiki-page">
        <div class="dlj-wiki-user">
            <div class="company">{{ config.whoami.company }}</div>
            <div class="name zh">{{ config.whoami.zh }}</div>
            <div class="name en">{{ config.whoami.en }}</div>
            <div class="user-info">
                <img class="icon" :src="getImg('group')"/>
                <span class="group">{{ config.whoami.group }}</span>
            </div>
            <div class="user-info">
                <img class="icon" :src="getImg('component')"/>
                <span class="component">{{ config.whoami.component }}</span>
            </div>
            <div class="user-info">
                <img class="icon" :src="getImg('address')"/>
                <span class="address">{{ config.whoami.address }}</span>
            </div>
            <div class="user-info">
                <img class="icon" :src="getImg('tags')"/>
                <span class="tags">
                    <div class="tag-item" v-for="item in tags">
                        {{ item }}
                    </div>
                </span>
            </div>
        </div>
        <div class="dlj-wiki-content">
            <tabpanelview :names="wikiTabNames" :get-tab-name="n => n">
                <div>
                    <div class="wiki-label">项目</div>
                    <div class="wiki-projects">
                        <div :style="{ '--cnt': cnt }" class="wiki-project" v-for="project in projects">
                            <div>
                                <div class="project-name dinglj-v-auto-hidden">
                                    {{ project.zh }}
                                </div>
                                <div style="display: flex">
                                    <div class="flex"></div>
                                    <div class="text-btn" @click="openUrl(project.en)">打开Trac</div>
                                    <div class="text-btn" @click="copySvn(project.en)">复制svn</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="wiki-label">常用链接</div>
                    <div class="wiki-links">
                        <div :style="{ '--cnt': cnt }" class="wiki-link" v-for="link in links">
                            <div style="display: flex">
                                <div class="link-name dinglj-v-auto-hidden">
                                    {{ link.zh }}
                                </div>
                                <div class="flex"></div>
                                <div class="text-btn" @click="openUrl(link.en)">打开</div>
                            </div>
                        </div>
                    </div>
                </div>
                <tablex v-for="tabName of Object.keys(wikiTables)"
                    :columns="columnsToDisplay"
                    :data="wikiTables[tabName]"
                    :flex-columns="['summary']"
                    :get-cell="(t, c) => getCellValue(t, c)"
                    @on-loaded="tableLoaded">
                </tablex>
            </tabpanelview>
        </div>
    </div>`,
    data() {
        return {
            limit: 15,
            cnt: 6
        }
    },
    methods: {
        getCellValue(ticket, column) {
            return getCellValue(this.parent, ticket, column);
        },
        getImg(name) {
            return `${ window.dinglj_home }assets/img/${ name }.png`;
        },
        tableLoaded(tableId) {
            afterTableLoad(this.parent, tableId);
        },
        openUrl(url) {
            window.open(url);
        },
        copySvn(url) {
            let pattern = dinglj.getVal(this.defaultConfig, 'svnPattern', '');
            const target = url.replace(pattern.from, pattern.to);
            dinglj.copyTxt(target);
        }
    },
    computed: {
        config() {
            return window.readConfig();
        },
        defaultConfig() {
            return window.defaultConfig();
        },
        recentlyTicketOfMy() {
            const result = this.origin
                .filter(i => !['fixed', 'closed'].includesIgnoreCase(i.get('status')))
                .filter(i => i.get('owner') == dinglj.getVal(this.config, 'whoami.zh', '')); // 过滤出属主是我的
            result.sort((t1, t2) => {
                return sortByTime(t1, t2);
            });
            if (result.length > this.limit) {
                result.splice(this.limit, result.length - this.limit);
            }
            return result;
        },
        recentlyMyReport() {
            const result = this.origin
                .filter(i => !['closed'].includesIgnoreCase(i.get('status')))
                .filter(i => i.get('reporter') == dinglj.getVal(this.config, 'whoami.zh', '')); // 过滤出属主是我的
            result.sort((t1, t2) => {
                return sortByTime(t1, t2);
            });
            if (result.length > this.limit) {
                result.splice(this.limit, result.length - this.limit);
            }
            return result;
        },
        recentlyNeedClose() {
            const result = this.origin
                .filter(i => 'fixed'.equalsIgnoreCase(i.get('status')))
                .filter(i => i.get('reporter') == dinglj.getVal(this.config, 'whoami.zh', '')); // 过滤出属主是我的
            result.sort((t1, t2) => {
                return sortByTime(t1, t2);
            });
            if (result.length > this.limit) {
                result.splice(this.limit, result.length - this.limit);
            }
            return result;
        },
        wikiTables() {
            const recentlyTicketOfMy = this.recentlyTicketOfMy;
            const recentlyMyReport = this.recentlyMyReport;
            const recentlyNeedClose = this.recentlyNeedClose;
            const result = {};
            result[`最近提给我的变更(${ recentlyTicketOfMy.length })`] = recentlyTicketOfMy;
            result[`最近我提出的变更(${ recentlyMyReport.length })`] = recentlyMyReport;
            result[`最近需要我确认的变更(${ recentlyNeedClose.length })`] = recentlyNeedClose;
            return result;
        },
        wikiTabNames() {
            const result = ['首页'];
            result.push(...Object.keys(this.wikiTables));
            return result;
        },
        columnsToDisplay() {
            return dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'wiki.displayColumns', [], false).map(n => {
                return {
                    label: Ticket.fields[n],
                    value: n
                }
            });
        },
        projects() {
            return dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'link.project', []);
        },
        links() {
            return dinglj.getConfigOrDefault(this.config, this.defaultConfig, 'link.outside', []);
        },
        tags() {
            return dinglj.getVal(this.config, 'whoami.tags', []);
        },
        /** 我的名字 */
        whoami() {
            return whoami();
        },
    },
    props: {
        origin: {
            type: Array,
            default: [],
        },
        parent: {
            type: Object,
            default: {},
            required: true,
        }
    },
    components: {
        tabpanel, tablex
    }
}