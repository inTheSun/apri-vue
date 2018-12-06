export function genKey() {
    // const t  = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    const t = 'xxxxxxxx'
    return t.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

export function getKey(route, keyName) {
    return `${route.name || route.path}?${route.query[keyName]}`
}

export function matches(pattern, name) {
    if (Array.isArray(pattern)) {
        return pattern.indexOf(name) > -1
    } else if (typeof pattern === 'string') {
        return pattern.split(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) {
        return pattern.test(name)
    }
    return false
}

export function isObjEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true
    } else {
        const keys1 = Object.getOwnPropertyNames(obj1)
        const keys2 = Object.getOwnPropertyNames(obj2)
        if (keys1.length !== keys2.length) {
            return false
        }
        for (const key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false
            }
        }
        return true
    }
}

export function getComponentName(componentOptions) {
    return componentOptions && (componentOptions.Ctor.options.name || componentOptions.tag)
}

export function removeItem(arr,item){
    if(!isArray(arr) || !arr.length) return false;
    for(let i = 0,l = arr.length; i < l; i++){
        if(arr[i] === item){
            return arr.splice(i, 1)    
        }
    }
}

export function getRealChild(vnode){
    const compOptions = vnode && vnode.componentOptions
    if (compOptions && compOptions.Ctor.options.abstract) {
        return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
        return vnode
    }
}

export function getParentTransition(vnode){
    while ((vnode = vnode.parent)) {
        if (vnode.componentOptions.tag === "transition") {
            return vnode
        }
    }
    return null;
}

const arr = [
    'Number',
    'String',
    'Function',
    'Array',
    'Object',
    'Date',
    'Boolean',
];
arr.forEach((item, i) => {
    (function (str1) {
        window['is' + item] = (str2) => {
            return Object.prototype.toString.call(str2) === str1;
        };
    })('[object ' + item + ']');
});
