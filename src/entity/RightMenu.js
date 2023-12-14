export class RightMenu {
    id; label; event; isDisplay;
    constructor(label, event, isDisplay = () => true) {
        this.id = dinglj.uuid('right-click-item');
        this.label = label;
        this.event = event;
        this.isDisplay = isDisplay;
    }
}