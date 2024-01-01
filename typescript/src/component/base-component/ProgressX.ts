import { AbstractComponent, ComponentType } from "../../entity";
import { Method, Mounted, Prop, Template } from "..";

export class ProgressX extends AbstractComponent {

    @Mounted(ProgressX, ComponentType.ProgressX)
    public mounted(): void {
        this.vid = window.uuid(this.name);
        this.emit('mounted', this.vid);
    }

    @Template
    public template: string = `<div class="dinglj-v-progress-bar" :id="vid">
        <span :class="{ 'dinglj-v-progress-caption': true, 'top': true, 'right': position == 'rt' }" v-if="['lt', 'rt'].includesIgnoreCase(position)">{{ caption }}{{ percent }}</span>
        <div class="dinglj-v-progress-box" :style="getContainerStyle()">
            <div class="dinglj-v-progress" :style="getProgressStyle()"></div>
        </div>
        <span :class="{ 'dinglj-v-progress-caption': true, 'bottom': true, 'right': position == 'rb' }" v-if="['lb', 'rb'].includesIgnoreCase(position)">{{ caption }}{{ percent }}</span>
    </div>`;
    
    @Method
    public getContainerStyle(): object {
        return {
            '--bar-height': this.height,
        }
    }

    @Method
    public getProgressStyle(): object {
        setTimeout(() => {
            const container = window.byId(this.vid);
            const box = container.findChildrenByClass('dinglj-v-progress-box')[0];
            box.children[0].style.width = this.percent;
        }, 100)
        return {
            'width': '0%',
        }
    }

    @Prop(String, '5px')
    public height: string;

    @Prop(String, '100%')
    public percent: string;

    @Prop(String, 'lt')
    public position: 'lt' | 'lb' | 'rt' | 'rb';  // left-top, left-bottom, right-top, right-bottom

    @Prop(String, '')
    public caption: string;

}