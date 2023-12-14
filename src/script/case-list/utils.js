import { LangItem } from '../../entity/LangItem.js';

dinglj.remCss();
dinglj.linkCss('assets/css/utils.css');
dinglj.linkCss('assets/css/vue.css');
dinglj.linkCss('src/script/case-list/index.css');
dinglj.injectUserCss();

window.defaultConfig = function() {
    return {
        constant: {
            status: {
                TICKET: new LangItem('TICKET', '变更中断'),
                FAILED: new LangItem('FAILED', '失败'),
                SUCCESS: new LangItem('SUCCESS', '成功'),
                RUNNING: new LangItem('RUNNING', '执行中'),
                SENDED: new LangItem('SENDED', '已发送'),
                NOTSEND: new LangItem('NOTSEND', '待发送'),
                WAITTING: new LangItem('WAITTING', '等待资源'),
            }
        },
    }
}