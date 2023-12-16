export class OrderTicket {
    groupRegExp; tabRegExp; fieldKey; expectValue; func;
    exec(groupName, tabName, ticket1, ticket2) {
        if (this.groupRegExp.test(groupName) && this.tabRegExp.test(tabName)) {
            if (this.func) {
                return this.func(groupName, tabName, ticket1, ticket2);
            } else {
                return dinglj.compareStringByArray(this.expectValue, ticket1.get(this.fieldKey), ticket2.get(this.fieldKey));
            }
        }
    }
}

defunc(window, 'OrderTicket', (groupRegExp, tabRegExp, fieldKey, expectValue) => {
    let result = new OrderTicket();
    result.groupRegExp = groupRegExp;
    result.tabRegExp = tabRegExp;
    result.fieldKey = fieldKey;
    if (Array.isArray(expectValue)) {
        result.expectValue = expectValue;
    } else {
        result.expectValue = [ expectValue ];
    }
    return result;
});

defunc(window, 'OrderTicket', (groupRegExp, tabRegExp, func) => {
    let result = new OrderTicket();
    result.groupRegExp = groupRegExp;
    result.tabRegExp = tabRegExp;
    result.func = func;
    return result;
});