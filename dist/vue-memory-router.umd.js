/**
* vue-memory-router v0.0.1
*/

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueNavigation = factory());
}(this, (function () { 'use strict';

function getComponentName(componentOptions) {
    return componentOptions && (componentOptions.Ctor.options.name || componentOptions.tag);
}

function removeItem(arr, item) {
    if (!isArray(arr) || !arr.length) return false;
    for (var i = 0, l = arr.length; i < l; i++) {
        if (arr[i] === item) {
            return arr.splice(i, 1);
        }
    }
}



function getParentTransition(vnode) {
    while (vnode = vnode.parent) {
        if (vnode.componentOptions.tag === "transition") {
            return vnode;
        }
    }
    return null;
}

var arr = ['Number', 'String', 'Function', 'Array', 'Object', 'Date', 'Boolean'];
arr.forEach(function (item, i) {
    (function (str1) {
        window['is' + item] = function (str2) {
            return Object.prototype.toString.call(str2) === str1;
        };
    })('[object ' + item + ']');
});

function clearCacheItem(cache, key, keys, current) {
    var cached = cache[key];
    if (cached && (!current || cached.tag !== current.tag)) {
        cached.componentInstance.$destroy();
    }
    cache[key] = null;
    removeItem(keys, key);
}

var MemoryRouterComponent = (function (keyName) {
    return {
        name: 'memoryRouter',
        abstract: true,
        props: {
            max: [String, Number]
        },
        computed: {},
        data: function data() {
            return {
                isRepaint: false
            };
        },

        watch: {},
        deactivated: function deactivated() {
            this.isRepaint = true;
        },
        created: function created() {
            this.cache = Object.create(null);
            this.keys = [];

            this.maxInt = Math.min(Math.max(parseInt(this.max) || 6, 6), 20);
        },
        destroyed: function destroyed() {
            for (var key in this.cache) {
                clearCacheItem(this.cache, key, this.keys);
            }
        },
        render: function render(h) {
            if (this.isRepaint && this.$vnode.data.keepAlive) {
                this.isRepaint = false;
                return null;
            }

            var cur = void 0;
            var transtionParent = getParentTransition(this.$vnode);
            if (transtionParent && (cur = transtionParent.componentInstance) && cur.mode === "out-in" && cur._leaving) {
                return null;
            }
            var children = this.$slots.default;
            var firstChildVNode = null;
            if (isArray(children)) {
                firstChildVNode = children.find(function (child) {
                    if (isObject(child) && (isObject(child.componentOptions) || child.isComment && child.asyncFactory)) {
                        return true;
                    }
                });
                var childComponentOptions = firstChildVNode && firstChildVNode.componentOptions;
                if (childComponentOptions) {
                    var name = getComponentName(childComponentOptions);
                    var cache = this.cache,
                        keys = this.keys;

                    var baseKey = firstChildVNode.key == null ? childComponentOptions.Ctor.cid + (childComponentOptions.tag ? '::' + childComponentOptions.tag : '') : firstChildVNode.key;
                    var pageKey = history.state && history.state.key;
                    var finalKey = baseKey + "-pageKey-" + pageKey;

                    if (cache[finalKey]) {
                        console.log("use cache!");
                        firstChildVNode.componentInstance = cache[finalKey].componentInstance;

                        removeItem(keys, finalKey);
                        keys.push(finalKey);
                    } else {
                        console.log("add cache!");
                        cache[finalKey] = firstChildVNode;
                        keys.push(finalKey);
                        if (this.maxInt && keys.length > this.maxInt) {
                            console.log("limit cache!");

                            clearCacheItem(cache, keys[0], keys, this._vnode);
                        }
                    }
                    firstChildVNode.data.keepAlive = true;
                }
            }

            return firstChildVNode || children && children[0];
        }
    };
});

var index = {
    install: function install(Vue) {
        Vue.component('memoryRouter', MemoryRouterComponent());
    }
};

return index;

})));
