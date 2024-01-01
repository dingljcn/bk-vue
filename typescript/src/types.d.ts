import { IComponent } from "./entity"

declare global {
    interface Array<T> {
        /** 忽略大小写判断是否有子串 */
        includesIgnoreCase(another: T): boolean,
        /** 忽略大小写获取下标 */
        indexOfIgnoreCase(another: T): number,
    }
    interface String {
        /** 忽略大小写判断字符串是否相等 */
        equalsIgnoreCase(another: string): boolean,
        /** 忽略大小写判断是否有子串 */
        includesIgnoreCase(another: string): boolean,
        /** 在界面上输出提示信息 */
        info(): void,
        /** 在界面上输出警告信息 */
        warn(): void,
        /** 在界面上输出错误信息 */
        err(): void,
    }
    interface Window {
        /** 给定一个参照数组, 然后按照此数组进行排序 */
        compareStringByArray(order: Array<string>, list: Array<string>): void,
        /** 给定一个参照数组, 然后按照此数组进行排序 */
        compareStringByArray(order: Array<string>, item1: string, item2: string): number,
        /** 本地测试时用于读取配置 */
        readData(...params: any): any,
        /** 读取用户配置 */
        readConfig(): any,
        /** 读取系统默认配置 */
        defaultConfig(): any,
        /** 判断是不是开发环境 */
        isDev(): boolean,
        /** 重载定义函数, 默认定义在 window.dinglj 上 */
        defunc(functionName: string, func: Function): void,
        /** 重载定义函数 */
        defunc(object: any, functionName: string, func: Function): void,
        /** 创建 Vue 程序 */
        createVue(config: any, mountElement: string): any,
        /** 注册 Vue 组件 */
        registVue(name: string, component: IComponent): any,
        /** 基本 url */
        dinglj_home: string,
        /** 环境 */
        dinglj_env: 'dev' | undefined,
        /** 生成 UID, 无前缀, 长度默认为 10 */
        uuid(): string,
        /** 生成 UID, 长度默认为 10 */
        uuid(prefix: string): string,
        /** 生成 UID */
        uuid(prefix: string, length: number): string,
        /** 添加 css 样式, 默认相对于 dinglj_home */
        linkCss(relativePath: string): void,
        /** 添加 css 样式 */
        linkCss(parentPath: string, relativePath: string): void,
        /** 发送一个 get 请求, 默认无回调函数, 且同步 */
        get<T>(url: string): T
        /** 发送一个 get 请求 */
        get<T>(url: string, config: { callback: Function, async: boolean }): T,
        /** 获取图片路径 */
        imgUrl(relativePath: string): string,
        /** 拼接路径, 默认相对于 dinglj_home */
        mergePath(relativePath: string): string,
        /** 拼接路径 */
        mergePath(parentPath: string, relativePath: string): string,
        /** 根据 id 获取元素 */
        byId(id: string): HTMLElement,
        /** 根据 class 获取元素 */
        byClass(classes: string): Array<HTMLElement>,
        /** 根据选择器获取元素 */
        query(selector: string): Array<HTMLElement>,
        /** 在界面上输出提示信息 */
        info(msg: string, timeout?: number, offsetTop?: string): void,
        /** 在界面上输出警告信息 */
        warn(msg: string, timeout?: number, offsetTop?: string): void,
        /** 在界面上输出错误信息 */
        err(msg: string, timeout?: number, offsetTop?: string): void,
        /** 计算文字宽度 */
        calcTxtWidth(target: string | HTMLElement): number,
        /** 计算文字宽度 */
        calcTxtWidth(txt: string, fontWeight: string, fontSize: string, fontFamily: string): number,
        /** 显示 vue 信息 */
        displayData(): any,
        /** 将对象按传入的 exp 进行分组 */
        groupBy(list: Array<any>, exp: string | Function): any,
        /** 获取对象中的值 */
        getVal<T>(data: any, path: string, _default: T): T,
        /** 获取对象中的值 */
        getVal<T>(data: any, path: string, _default: T, error: boolean): T,
        /** 获取配置, 或从默认配置中取, 默认配置也没有, 则返回默认值 */
        getConfigOrDefault<T>(config: any, defaultConfig: any, path: string, _default: T): T,
        /** 获取配置, 或从默认配置中取, 默认配置也没有, 则返回默认值 */
        getConfigOrDefault<T>(config: any, defaultConfig: any, path: string, _default: T, merge: boolean): T,
    }
    interface Element {
        /** 元素创建时间 */
        time: number,
        /** 重新定义 children 的返回类型 */
        children: Array<HTMLElement>,
        /** 执行动画, config.key: cssProperty, config.value: [from, to] */
        animate(config: any, transition: number): void,
        /** 根据 class 查找子元素集合 */
        findChildrenByClass(clazz: string): Array<HTMLElement>
    }

}

export {}