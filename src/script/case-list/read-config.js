if (window.isDev()) {
    window.dinglj_home = 'C:/Users/dingljcn/Desktop/bk.vue.beta';
}

window.defaultConfig = function() {
    return {
        constant: {
            status: {
                TICKET: { en: 'TICKET', zh: '变更中断' },
                FAILED: { en: 'FAILED', zh: '失败' },
                SUCCESS: { en: 'SUCCESS', zh: '成功' },
                RUNNING: { en: 'RUNNING', zh: '执行中' },
                SENDED: { en: 'SENDED', zh: '已发送' },
                NOTSEND: { en: 'NOTSEND', zh: '待发送' },
                WAITTING: { en: 'WAITTING', zh: '等待资源' },
            }
        },
    }
}