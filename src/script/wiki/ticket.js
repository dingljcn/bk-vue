import tablex from "../../components/base/tablex/index.js";

export default {
    template: `<navigatorview :list="parent.groupNames">
        <template class="result-view" v-slot:content>
            <tabpanelview v-for="groupName in parent.groupNames" :names="parent.tabNames(groupName)"
                :get-name="k => k + '(' + parent.tabData(groupName)[k].length + ')'">
                <tablex v-for="tabName in parent.tabNames(groupName)"
                    :columns="parent.columnsToDisplay(groupName, tabName)"
                    :data="parent.tabData(groupName)[tabName]"
                    :flex-columns="['summary']"
                    :get-cell="(t, c) => parent.getCellValue(t, c)"
                    :key="groupName + tabName + parent.tops.length"
                    @on-loaded="parent.tableLoaded">
                </tablex>
            </tabpanelview>
        </template>
    </navigatorview>`,
    props: {
        parent: {
            type: Object,
            default: {},
            required: true,
        }
    },
    component: {
        tablex
    }
}