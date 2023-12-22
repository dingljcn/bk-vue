export default {
    template: `<div class="dinglj-v-snap-scroll" @scroll="onScroll" :id="id">
        <slot></slot>
        <div class="dinglj-v-snap-navi">
            <div v-for="i in size" :class="{ 'active': i - 1 == index }"></div>
        </div>
    </div>`,
    data() {
        return {
            index: 0,
            id: dinglj.uuid('dinglj-v-snap-scroll'),
        }
    },
    methods: {
        onScroll(e) {
            const container = dinglj.byId(this.id);
            const height = parseInt(getComputedStyle(container).height);
            if (container.scrollTop % height == 0) {
                this.index = parseInt(container.scrollTop / height);
            }
        }
    },
    props: {
        size: {
            type: Number,
            default: 0,
        }
    }
}