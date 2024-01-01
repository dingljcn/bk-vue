window.defunc('uuid', function(): string {
    return window.uuid('', 10);
});

window.defunc('uuid', function(prefix: string): string {
    return window.uuid(prefix, 10);
});

window.defunc('uuid', function(prefix: string, length: number): string {
    const randomNumber = Math.random() * 10000000;
    const subNumber = ('' + randomNumber).replace('.', '').substring(0, length);
    return `${ prefix }-${ subNumber }`;
});

window.defunc('linkCss', function(relativePath: string): void {
    window.linkCss(window.dinglj_home, relativePath);
});

window.defunc('linkCss', function(parentPath: string, relativePath: string): void {
    const styleElement: HTMLStyleElement = document.createElement('style');
    const url = window.mergePath(parentPath, relativePath);
    styleElement.innerHTML = window.get<string>(url);
    document.head.appendChild(styleElement);
});

window.defunc('get', function<T>(url: string): T {
    return window.get<T>(url, {
        callback: null,
        async: false,
    });
});

window.defunc('get', function<T>(url: string, config: { callback: Function, async: boolean }): T {
    const http: XMLHttpRequest = new XMLHttpRequest();
    http.open('GET', url, !!config.async);
    http.send();
    if (http.readyState == 4 && http.status == 200 && config.callback) {
        config.callback(http.responseText);
    }
    return http.responseText as T;
});

window.defunc('imgUrl', function(relativePath: string): string {
    return window.mergePath(window.dinglj_home, relativePath);
});

window.defunc('mergePath', function(relativePath: string): string {
    return window.mergePath(window.dinglj_home, relativePath);
});

window.defunc('mergePath', function(parentPath: string, relativePath: string): string {
    if (!parentPath.endsWith('/') && !parentPath.endsWith('\\')) {
        parentPath = parentPath + '/';
    }
    if (relativePath.startsWith('/') || relativePath.startsWith('\\')) {
        relativePath = relativePath.substring(1);
    }
    return `${ parentPath }${ relativePath }`;
});

window.defunc('byId', function(id: string): HTMLElement {
    return document.getElementById(id);
});

window.defunc('byClass', function(classes: string): Array<HTMLElement> {
    const result: Array<HTMLElement> = [];
    const findData: any = document.getElementsByClassName(classes);
    if (findData) {
        result.push(...findData);
    }
    return result;
});

window.defunc('query', function(selector: string): Array<HTMLElement> {
    let result = [];
    const findData: any = document.querySelectorAll(selector);
    if (findData) {
        result.push(...findData);
    }
    return result;
});

/** 计算文本宽度 */
window.defunc(window, 'calcTxtWidth', function(item: string | HTMLElement): number {
    if (typeof item == 'string') {
        return window.calcTxtWidth(item, '400', '12px', '微软雅黑');
    } else {
        if (!item) {
            return 0;
        }
        const computedStyle = window.getComputedStyle(item);
        return window.calcTxtWidth(item.innerText, computedStyle.fontWeight, computedStyle.fontSize, computedStyle.fontFamily);
    }
});

/** 计算文本宽度 */
window.defunc(window, 'calcTxtWidth', function(txt: string, fontWeight: string, fontSize: string, fontFamily: string): number {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${ fontWeight } ${ fontSize } ${ fontFamily }`;
    const { width } = ctx.measureText(txt);
    return Math.floor(width);
});

window.defunc('groupBy', function(list: Array<any>, exp: string | Function): object {
    let result: any = {};
    list.forEach(item => {
        let key = '';
        if (typeof exp == 'string') {
            key = item[exp];
        } else if (typeof exp == 'function') {
            key = exp(item);
        }
        if (result[key]) {
            result[key].push(item);
        } else {
            result[key] = [ item ];
        }
    });
    return result;
});

/** 获取配置, 如果取不到则返回默认值 */
window.defunc('getVal', function(data: any, path: string, _default: any): object {
    return window.getVal(data, path, _default, false);
});

/** 获取配置, 如果取不到则返回默认值, 并根据参数确认是否要报错 */
window.defunc('getVal', function(data: any, path: string, _default: any, error: boolean): object {
    if (data == null || data == undefined) {
        return _default;
    }
    let result = data;
    for (let propName of path.split('.')) {
        result = result[propName];
        if (!result) { // 如果取不到值, 则报错并返回默认值
            if (error) {
                console.error(`${ path }: 配置不存在, 请检查脚本`);
            }
            return _default
        }
    }
    return result;
});

/** 获取配置, 或从默认配置中取, 默认配置也没有, 则返回默认值 */
window.defunc('getConfigOrDefault', function(config: any, defaultConfig: any, path: string, _default: any): object {
    return window.getConfigOrDefault(config, defaultConfig, path, _default, true);
});

/** 获取配置, 或从默认配置中取, 默认配置也没有, 则返回默认值 */
window.defunc('getConfigOrDefault', function(config: any, defaultConfig: any, path: string, _default: any, merge: boolean): object {
    let config1: any = window.getVal(config, path, 'NOT_FOUND');
    let config2: any = window.getVal(defaultConfig, path, 'NOT_FOUND');
    let result: any = 'NOT_FOUND';
    if (config1 != 'NOT_FOUND') { // 还是优先考虑用户的配置吧
        if (Array.isArray(config1)) {
            result = [];
            result.push(...config1);
        } else if (typeof config1 == 'object') {
            result = {};
            for (let key of Object.keys(config1)) {
                result[key] = config1[key];
            }
        } else {
            return config1;
        }
    }
    if (config2 != 'NOT_FOUND') {
        if (result == 'NOT_FOUND') {
            // config1 没数据, 则完全使用 config2
            return config2;
        } else if (Array.isArray(config1)) {
            // config1 是数组, 要求 config2 也是数组, 否则无法合并
            if (Array.isArray(config2) && merge) {
                result.push(...config2);
            }
        } else if (typeof config2 == 'object' && merge) {
            // config1 到这里一定是 object, 要求 config2 也是 object, 否则无法合并
            for (let key of Object.keys(config2)) {
                if (result[key] == undefined) {
                    result[key] = config2[key];
                }
            }
        }
    }
    if (result == 'NOT_FOUND') { // 仍然没有则直接报错, 并返回默认值
        result = _default;
        console.error(`${ path }: 配置不存在, 请检查脚本`);
    }
    return result;
});

window.defunc('compareStringByArray', function(order: Array<string>, list: Array<string>): void {
    list.sort((o1, o2): number => {
        return window.compareStringByArray(order, o1, o2);
    });
});

window.defunc('compareStringByArray', function(order: Array<string>, o1: string, o2: string): number {
    if (order && order.length > 0) {
        let idx1 = order.indexOfIgnoreCase(o1) == -1 ? 9999 : order.indexOfIgnoreCase(o1);
        let idx2 = order.indexOfIgnoreCase(o2) == -1 ? 9999 : order.indexOfIgnoreCase(o2);
        if (idx1 == idx2) {
            return o1 < o2 ? -1 : (o1 > o2 ? 1 : 0);
        }
        return idx1 - idx2;
    }
    if (o1 < o2) {
        return -1;
    } else if (o1 > o2) {
        return 1;
    }
    return 0;
});