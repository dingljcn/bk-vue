import btn from "../btn/index.js";

export default {
    template: `<div class="dinglj-v-modal-mask" :id="id" @mousemove="moveXY" @mouseup="cleanXY" v-if="display">
        <div class="dinglj-v-modal-container" :style="getStyle()">
            <div class="dinglj-v-modal-title" @mousedown="recordXY">
                <div class="dinglj-v-modal-title-content dinglj-v-auto-hidden">
                    <slot name="title"></slot>
                </div>
                <div class="dinglj-v-modal-title-options">
                    <img class="dinglj-v-modal-icon" :src="getIcon('close')" @click="$emit('on-close')"/>
                </div>
            </div>
            <div class="dinglj-v-modal-content">
                <slot name="content"></slot>
            </div>
            <div class="dinglj-v-modal-btns">
                <slot name="btns">
                    <div class="flex"></div>
                    <btn x-type="cancel" style="margin-right: 10px" @click="cancel()">取消</btn>
                    <btn @click="confirm()">确定</btn>
                </slot>
            </div>
        </div>
    </div>`,
    data() {
        return {
            id: dinglj.uuid('dinglj-v-modal'),
            position: undefined,
        }
    },
    methods: {
        cancel() {
            if (this.onCancel) {
                this.onCancel();
            } else {
                this.$emit('on-close');
            }
        },
        confirm() {
            if (this.onConfirm) {
                this.onConfirm();
            } else {
                this.$emit('on-close');
            }
        },
        getIcon(name) {
            return `${ window.dinglj_home }/assets/img/${ name }.png`;
        },
        recordXY(e) {
            const modal = dinglj.byId(this.id).children[0];
            this.position = {
                x: e.screenX - parseInt(getComputedStyle(modal).left),
                y: e.screenY - parseInt(getComputedStyle(modal).top),
            }
        },
        moveXY(e) {
            if (dinglj.getVal(this.position, 'x', false)) {
                const modal = dinglj.byId(this.id).children[0];
                modal.style.left = `${ e.screenX - this.position.x }px`;
                modal.style.top = `${ e.screenY - this.position.y }px`;
            }
        },
        cleanXY() {
            this.position = undefined;
        },
        getStyle() {
            return {
                '--width': this.width,
                '--height': this.height,
            }
        },
    },
    props: {
        display: {
            type: Boolean,
            default: false,
        },
        width: {
            type: String,
            default: '600px'
        },
        height: {
            type: String,
            default: '300px',
        },
        onCancel: {
            type: Function,
            default: undefined,
        },
        onConfirm: {
            type: Function,
            default: undefined,
        }
    },
    components: {
        btn
    }
}