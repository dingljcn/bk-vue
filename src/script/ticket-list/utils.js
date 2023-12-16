import { RightMenu } from '../../entity/RightMenu.js';
import { Ticket } from '../../entity/Ticket.js';

export function buildTicketRightMenu(that, line, id) {
    const idElement = dinglj.findChildrenByClass(line, 'id')[0];
    const ticketId = idElement.innerText.trim();
    const ticket = that.getTicketById(ticketId);
    dinglj.registRightClick(line, id, {
        items: [
            new RightMenu('打开', () => {
                that.openTicketById(ticketId);
            }),
            new RightMenu('复制描述', () => {
                dinglj.copyTxt(ticket.get('summary'));
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
                that.modal.ticket = ticket;
                that.modal.display = true;
            }),
        ]
    });
}