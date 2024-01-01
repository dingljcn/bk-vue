export class MetaInfo {
    public clazz: any;
    public fieldNames: Array<string> = [];
    public methodNames: Array<string> = [];
    public computeInfos: Array<{
        key: string,
        func: Function
    }> = [];
    public props: any = {};
    public components: any = {};
    public hockMounted: string = '';
    public template: string = '';
    public watchInfos: Array<{
        field: string,
        deep: boolean,
        resolve: string,
    }> = [];

    public hasWatch(): boolean {
        return this.watchInfos.length > 0;
    }
    public hasField(): boolean {
        return this.fieldNames.length > 0;
    }
    public hasMethod(): boolean {
        return this.methodNames.length > 0;
    }
    public hasCompute(): boolean {
        return this.computeInfos.length > 0;
    }
    public hasProp(): boolean {
        return Object.keys(this.props).length > 0;
    }
    public hasComponents(): boolean {
        return Object.keys(this.components).length > 0;
    }
    public hasMounted(): boolean {
        return this.hockMounted != '';
    }
    public hasTemplate(): boolean {
        return this.template != '';
    }
}