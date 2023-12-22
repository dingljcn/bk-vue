import modalx from "../components/base/modalx/index.js";
import textareax from '../components/base/textareax/index.js';
import { Ticket } from "../entity/Ticket.js";
import { openTicket } from "./ticket-tool.js";

export default {
    template: `<modalx :display="display" @on-close="$emit('on-close')" v-if="display" width="1000px" height="500px" :on-confirm="confirm">
        <template v-slot:title>
            <div class="modal-ticket-id"
                @click="openTicket">
                {{ ticketId }}
            </div>
            <span :title="ticket.get('summary')">{{ ticket.get('summary') }}</span>
        </template>
        <template v-slot:content>
            <div class="ticket-modal-content">
                <div class="ticket-fields-info">
                    <div class="ticket-field" v-for="key in keys">
                        <div :class="{ 'key': true, 'dinglj-v-auto-hidden': true, 'is-null': getValue(key) == 'null' }">{{ getName(key) }}</div>
                        <div :class="{ 'value': true, 'dinglj-v-auto-hidden': true, 'is-null': getValue(key) == 'null' }" :title="ticket.get(key)">{{ getValue(key) }}</div>
                    </div>
                </div>
                <div class="edit-ticket-note">
                    <textareax caption="变更备注"
                        :default-value="originNote"
                        @mounted="id => textareaId = id">
                    </textareax>
                </div>
            </div>
        </template>
    </modalx>`,
    data() {
        return {
            count: 4,
            textareaId: '',
        }
    },
    methods: {
        openTicket() {
            openTicket(this.parent, this.ticketId);
        },
        getName(key) {
            return Ticket.fields[key];
        },
        getValue(key) {
            return this.ticket.get(key) || 'null';
        },
        confirm() {
            const storage = dinglj.getStorage('dinglj-v-ticket-info', {});
            if (storage[this.ticketId]) {
                storage[this.ticketId].note = dinglj.query(`#${ this.textareaId } textarea`)[0].value;
            } else {
                storage[this.ticketId] = {
                    note: dinglj.query(`#${ this.textareaId } textarea`)[0].value
                };
            }
            dinglj.setStorage('dinglj-v-ticket-info', storage);
            this.$emit('on-close');
        }
    },
    computed: {
        ticketNumber() {
            return this.ticketId.replace('#', '').trim();
        },
        ticketId() {
            return this.ticket.get('id');
        },
        keys() {
            const result = Object.keys(this.ticket);
            result.remove('id');
            result.remove('summary');
            result.remove('dinglj-note');
            return result;
        },
        originNote() {
            const storage = dinglj.getStorage('dinglj-v-ticket-info', {});
            if (storage[this.ticketId]) {
                return storage[this.ticketId].note;
            }
            return '';
        }
    },
    props: {
        parent: {
            type: Object,
            required: true,
        },
        display: {
            type: Boolean,
            default: false,
        },
        ticket: {
            type: Object,
            default: null,
        }
    },
    components: {
        modalx, textareax
    },
}