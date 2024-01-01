Array.prototype.includesIgnoreCase = function(another) {
    let target;
    if (typeof another == "object") {
        target = JSON.stringify(another).toLowerCase();
    } else if (typeof another == "string") {
        target = another.toLowerCase();
    } else {
        target = another;
    }
    return this.map(element => {
        if (typeof element == "object") {
            return JSON.stringify(element).toLowerCase();
        } else if (typeof element == "string") {
            return element.toLowerCase();
        } else {
            return element;
        }
    }).includes(target);
}

Array.prototype.indexOfIgnoreCase = function(another) {
    let target;
    if (typeof another == "object") {
        target = JSON.stringify(another).toLowerCase();
    } else if (typeof another == "string") {
        target = another.toLowerCase();
    } else {
        target = another;
    }
    return this.map(element => {
        if (typeof element == "object") {
            return JSON.stringify(element).toLowerCase();
        } else if (typeof element == "string") {
            return element.toLowerCase();
        } else {
            return element;
        }
    }).indexOf(target);
}

String.prototype.equalsIgnoreCase = function(another) {
    return this.toLowerCase() == another.toLowerCase();
}

String.prototype.includesIgnoreCase = function(another) {
    return this.toLowerCase().includes(another.toLowerCase());
}

String.prototype.info = function() {
    window.info(this, 2000, '10%');
}

String.prototype.warn = function() {
    window.warn(this, 2000, '10%');
}

String.prototype.err = function() {
    window.err(this, 2000, '10%');
}

Element.prototype.animate = function(config, transition) {
    console.log(config);
    const old_transition = getComputedStyle(this).transition;
    const keys = Object.keys(config);
    for (let key of keys) {
        this.style[key] = config[key][0];
        console.log(config[key][0])
    }
    setTimeout(() => {
        const target_transition = transition / 1000 + 's';
        this.style.transition = target_transition;
        for (let key of keys) {
            this.style[key] = config[key][1];
            console.log(config[key][1])
        }
        setTimeout(() => {
            this.style.transition = old_transition;
        }, transition);
    }, 50);
}

/** 根据 class 找孩子DOM节点 */
Element.prototype.findChildrenByClass = function(clazz) {
    let result = [];
    let list = this.children;
    for(let i = 0; i < list.length; i++) {
        if (list[i].classList.contains(clazz)) {
            result.push(list[i]);
        }
    }
    return result;
};