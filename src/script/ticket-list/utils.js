import { RightMenu } from '../../entity/RightMenu.js';
import { Ticket } from './entity/Ticket.js';

export function buildTicketRightMenu(that, line, id) {
    const idElement = dinglj.findChildrenByClass(line, 'id')[0];
    const ticketId = idElement.innerText.trim();
    const ticket = that.getTicketById(ticketId);
    const modalId = dinglj.uuid('modal');
    dinglj.registRightClick(line, id, {
        items: [
            new RightMenu('打开', () => {
                that.openTicket(idElement);
            }),
            new RightMenu('复制描述', () => {
                dinglj.copyTxt(ticket.summary);
            }),
            new RightMenu('置顶', () => {
                dinglj.msg.send(window, 'to-top', ticketId);
                `${ idElement.innerText } 已置顶`.info();
            }, () => !that.isTop(ticketId)),
            new RightMenu('取消置顶', () => {
                dinglj.msg.send(window, 'remove-top', ticketId);
                `${ idElement.innerText } 已取消置顶`.info();
            }, () => that.isTop(ticketId)),
            new RightMenu('标记为已读', () => {
                if (that.setOpended(idElement.innerText)) {
                    `${ idElement.innerText } 已标记为已读`.info();
                }
            }, () => that.getNewTickets().includes(ticketId)),
            new RightMenu('标记为未读', () => {
                if (that.setUnOpen(idElement.innerText)) {
                    `${ idElement.innerText } 已取消已读标记`.info();
                }
                
            }, () => !that.getNewTickets().includes(ticketId)),
            new RightMenu('显示更多信息', () => {
                dinglj.showModal(moreInfoModal(that, idElement.innerText, ticket.summary, modalId));
            }),
        ]
    });
}


function moreInfoModal(that, ticketId, ticketSummary, modalId) {
    /**************** 拼接要显示的字段信息 ****************/
    ticketId = ticketId.trim();
    const ticket = that.getTicketById(ticketId);
    const keys = Ticket.fieldNames;
    let fieldsHTML = '';
    let everyLineCount = 3;
    let count = 0;
    for(let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.startsWith('dinglj_') || ['id', 'summary'].includesIgnoreCase(key)) {
            continue;
        }
        if (count % everyLineCount == 0) {
            count = 0;
            if (fieldsHTML) {
                fieldsHTML += '</div>';
            }
            fieldsHTML += '<div class="modal-ticket-line">';
        }
        count++;
        fieldsHTML += `<div class="modal-ticket-item ${ key } key">
            ${ Ticket.getCaption(key) }
        </div>
        <div class="dinglj-v-auto-hidden modal-ticket-item ${ ticket[key] ? key : 'null' } value" title="${ ticket[key] ? ticket[key] : 'null' }">
            ${ ticket[key] ? ticket[key] : 'null' }
        </div>`;
    }
    while(count < everyLineCount) {
        fieldsHTML += `<div class="modal-ticket-item"></div><div class="modal-ticket-item"></div>`;
        count++;
    }
    fieldsHTML += '</div>'
    /**************** 拼接文本域 ****************/
    const storage = dinglj.getStorage(that.constant.ticketInfo, {});
    let textAreaTxt = '';
    if (storage[ticketId]) {
        textAreaTxt = storage[ticketId].note;
    }
    let textArea = `<div  class="dinglj-v-input textarea" caption="本地备注信息"><textarea>${ textAreaTxt }</textarea></div>`
    return {
        id: modalId,
        title: `<div class="modal-ticket-id" onclick="window.open('${ that.ticketURL }/${ ticketId.replace('#', '').trim() }'); 
            dinglj.setOpended('${ ticketId }')">${ ticketId }</div> ${ ticketSummary }`,
        content: `<div class="modal-ticket-content">${ fieldsHTML }${ textArea }</div>`,
        style: {
            width: '800px',
            height: '400px',
        },
        btns: [
            {
                size: 'normal',
                type: 'primary',
                name: '确认',
                event: () => {
                    const storage = dinglj.getStorage(that.constant.ticketInfo, {});
                    if (storage[ticketId]) {
                        storage[ticketId].note = dinglj.query(`#${ modalId } textarea`)[0].value;
                    } else {
                        storage[ticketId] = {
                            note: dinglj.query(`#${ modalId } textarea`)[0].value
                        };
                    }
                    dinglj.setStorage(that.constant.ticketInfo, storage);
                    dinglj.remById(modalId);
                }
            }
        ]
    };
}