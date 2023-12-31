import { Compute, Method, Mounted, Prop, Template } from "../../component";
import { AbstractComponent, Case, Registry } from "../../entity";

class Card extends AbstractComponent {

    @Mounted(Card, 'CL-Card')
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit("mounted", this.vid);
    }

    @Template
    public template: string = `<div class="mode-container card">
        <div class="case-list-status-page" v-for="statusName in statusNames">
            <div :class="'case-list-card ' + _case_.status.en.toLowerCase()" :style="{ '--cnt': cardCnt }" v-for="_case_ in groupData[statusName]">
                <div class="card-line card-title">
                    <div class="card-ticket" v-if="_case_.ticket" @click="openCardTicket(_case_)">#{{ _case_.ticket }}</div>
                    <div :class="_case_.status.en.toLowerCase()" v-else>{{ _case_.status.en }}</div>
                    <div class="card-name" :title="_case_.caseName">{{ _case_.caseName.replace(/^2.0[-_]/, '').replace(/\.[xX][lL][sS][xX]?$/, '') }}</div>
                </div>
                <div class="card-line card-percent" v-if="['ticket','running'].includesIgnoreCase(_case_.status.en)">
                    <i-progress :style="{ '--bg': 'ticket'.equalsIgnoreCase(_case_.status.en) ? 'red' : 'rgb(180,180,180)' }" class="card-line-item" :caption="lineCaption(_case_)" :percent="linePercent(_case_)"></i-progress>
                    <i-progress :style="{ '--bg': 'ticket'.equalsIgnoreCase(_case_.status.en) ? 'red' : 'rgb(180,180,180)' }" class="card-line-item" :caption="stepCaption(_case_)" :percent="stepPercent(_case_)"></i-progress>
                </div>
                <div class="card-line card-time-cost" v-if="['ticket'].includesIgnoreCase(_case_.status.en)">
                    <div>耗时: {{ _case_.timeCost }}</div>
                </div>
            </div>
        </div>
    </div>`;

    @Method    
    public openCardTicket(_case_: Case): void {
        window.open(`${ window.getConfigOrDefault(this.config, this.defaultConfig, 'urls.ticket', '', false) }/${ _case_.ticket }`, `#${ _case_.ticket }`)
    }

    @Method
    public lineCaption(_case_: Case): string {
        return `行进度: ${ _case_.currentRow }/${ _case_.totalRow }, `;
    }

    @Method
    public linePercent(_case_: Case): string {
        return `${ (_case_.totalRow ? (_case_.currentRow / _case_.totalRow * 100).toFixed(2) : 0) }%`;
    }

    @Method
    public stepCaption(_case_: Case): string {
        return `步数进度: ${ _case_.currentStep }/${ _case_.totalStep }, `;
    }

    @Method
    public stepPercent(_case_: Case): string {
        return `${ (_case_.totalStep ? (_case_.currentStep / _case_.totalStep * 100).toFixed(2) : 0) }%`;
    }

    @Compute(function(): any {
        return window.readConfig();
    })
    public config: any;

    @Compute(function() :any {
        return window.defaultConfig();
    })
    public defaultConfig: any;

    @Prop(Object, {})
    public groupData: any;

    @Prop(Array<string>, [])
    public statusNames: Array<string>;

    @Prop(Number, 5)
    public cardCnt: number;
    
}

export const card = Registry.getComponent('CL-Card').build();