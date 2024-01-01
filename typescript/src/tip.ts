
/** 删除消息提示 */
function distoryPopMsg(element: Element, container: HTMLElement) {
    if (!element) {
        return;
    }
    element.animate({
        opacity: ['1', '0'],
        height: [getComputedStyle(element).height, '0px'],
        margin: [getComputedStyle(element).margin, '0px'],
        padding: [getComputedStyle(element).padding, '0px'],
    }, 1000);
    setTimeout(() => {
        element.remove();
        if (container && container.children.length == 0) {
            container.remove();
        }
    }, 300)
}

/** 创建消息提示 */
function createPopMsg(msg: string, type: 'info' | 'warn' | 'err', timeout = 2000, marginTop = '10%') {
    // 创建容器
    let container: HTMLElement = window.byId('dinglj-v-pop-msg-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'dinglj-v-pop-msg-container';
        document.body.appendChild(container);
    }
    container.style.top = marginTop;
    const msgList: Array<HTMLElement> = window.byClass('dinglj-v-pop-msg');
    // 容器最多同时显示 5 条消息, 超过 5 条时删除最早的
    if (msgList.length >= 5) {
        msgList.sort((n1, n2) => {
            return n1.time - n2.time;
        });
        for (let i = 0; i < msgList.length - 4; i++) {
            distoryPopMsg(msgList[i], undefined);
        }
    }
    // 创建一条提示信息
    const newElemenet: Element = document.createElement('div');
    newElemenet.classList.add('dinglj-v-pop-msg', type)
    newElemenet.time = Date.now();
    // 创建提示 icon, 以表达提示的类型
    const icon = document.createElement('div');
    icon.classList.add('dinglj-v-pop-msg-icon', type);
    icon.innerText = type.substring(0, 1).toUpperCase();
    newElemenet.appendChild(icon);
    // 追加提示的信息
    newElemenet.innerHTML += msg;
    container.appendChild(newElemenet);
    newElemenet.animate({
        height: ['0px', getComputedStyle(newElemenet).height],
        padding: ['0px 5px', '5px 5px'],
        marginBottom: ['0px', '5px'],
        opacity: ['0', '1'],
        top: ['50px', '0px'],
    }, 1000);
    // 前面都准备就绪, 激活该消息
    newElemenet.classList.add('active');
    // 一定时间后销毁该消息
    setTimeout(() => {
        distoryPopMsg(newElemenet, container);
    }, timeout);
}

/** 提示消息 */
window.defunc('info', (msg: string, timeout = 2000, offsetTop = '10%') => {
    createPopMsg(msg, 'info', timeout, offsetTop);
});

/** 报错消息 */
window.defunc('err', (msg: string, timeout = 2000, offsetTop = '10%') => {
    createPopMsg(msg, 'err', timeout, offsetTop);
});

/** 警告消息 */
window.defunc('warn', (msg: string, timeout = 2000, offsetTop = '10%') => {
    createPopMsg(msg, 'warn', timeout, offsetTop);
});