window.dinglj.modalEvents = {};

window.modalCall = function(id) {
    (window.dinglj.modalEvents[id])();
}

/** 显示对话框 */
defunc(window.dinglj, 'showModal', config => {
    let modalMask = document.createElement('div');
    modalMask.classList.add('dinglj-v-modal');
    modalMask.id = config.id;
    let innerHTML = `<div class="dinglj-modal-container" style="
        --width: ${ dinglj.getVal(config, 'style.width', '600px') };
        --height: ${ dinglj.getVal(config, 'style.height', '100px') } ">
    <div class="dinglj-modal-title">
        <div class="modal-title-content dinglj-v-auto-hidden">${ config.title }</div>
        <span class="modal-options modal-option-close" onclick="document.getElementById('${ config.id }').remove()">x</span>
    </div>
    <div class="dinglj-modal-content">
        ${ config.content }
    </div>`
    if (config.btns) {
        innerHTML += `<div class="dinglj-modal-btns">
            <div class="flex"></div>
            ${ config.btns.map(i => {
                const key = `${ config.id }-${ i.name }`;
                dinglj.modalEvents[key] = i.event;

                let inLineStyle = '';
                const styleObj = dinglj.styleForBtn(i.size);
                for (let key of Object.keys(styleObj)) {
                    inLineStyle += `${ key }: ${ styleObj[key] };`;
                }
                return `<div class="dinglj-v-btn ${ i.type }" style="${ inLineStyle }" onclick="modalCall('${ key }')">${ i.name }<div>`
            }).join('') }
        </div>`;
    }
    innerHTML += "</div>";
    modalMask.innerHTML = innerHTML;
    document.body.appendChild(modalMask);
});