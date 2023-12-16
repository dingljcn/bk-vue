export default {
    template: `
        <div class="dinglj-v-ctl dinglj-v-input textarea" :caption="caption" :style="getStyle()" :id="id">
            <textarea :placeholder="placeholder" 
                v-model="value" 
                @input="setValue(value, 'input')" 
                @blur="setValue(value, 'change')" 
                @change="setValue(value, 'change')">
            </textarea>
        </div>`,
    mounted() {
        this.$emit('mounted', this.id);
        dinglj.msg.on('dinglj-v-input-text-area::clear', this.id, () => this.value = '');
        dinglj.msg.on('dinglj-v-input-text-area::focus', this.id, () => dinglj.byId(this.id).children[0].focus());
    },
    data() {
        return {
            id: dinglj.uuid('input-area'),
            value: this.defaultValue,
        }
    },
    props: {
        caption: String,
        placeholder: String,
        height: {
            type: String,
            default: '100%',
        },
        fontSize: {
            type: String,
            default: '12px',
        },
        lineHeight: {
            type: String,
            default: '24px',
        },
        defaultValue: String,
    },
    methods: {
        setValue(n, event) {
            this.value = n;
            this.$emit(`on-${ event }`, {
                value: n,
                id: this.id,
            });
        },
        getStyle() {
            const result = {
                'height': this.height,
                'width': '100%',
                'font-size': this.fontSize,
                'line-height': this.lineHeight,
            };
            return result;
        }
    },
}