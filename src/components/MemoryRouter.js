// import Routes from '../routes'
import {
    matches,
    getComponentName,
    removeItem,
    getParentTransition,
} from '../utils'

const patternTypes = [String, RegExp, Array]

//如果禁止缓存的页面数组更改,过滤出需要删除的缓存
function clearCacheItemConfirm({
    cache,
    keys,
    _vnode
}, filter) {
    Object.keys(cache).forEach(key => {
        const cachedNode = cache[key];

        if (!cachedNode) return false;

        const name = getComponentName(cachedNode.componentOptions);
        if (name && !filter(name)) clearCacheItem(cache, key, keys, _vnode);
    });
}

/**
 * 删除单条缓存
 * @param {object{vnode} cache 
 * @param {string } key 
 * @param {array} keys 
 * @param {vnode} current 
 */
function clearCacheItem(cache, key, keys, current) {
    const cached = cache[key]
    if (cached && (!current || cached.tag !== current.tag)) {
        cached.componentInstance.$destroy()
    }
    cache[key] = null
    removeItem(keys, key)
}

export default (keyName) => {
    return {
        name: 'memoryRouter',
        abstract: true,
        props: {
            //禁止缓存的页面数组
            // exclude: patternTypes,
            max: [String, Number]
        },
        computed: {},
        data(){
            return {
                isRepaint: false,
            }
        },
        watch: {
            // routes(val) {
            //     for (const key in this.cache) {
            //         if (!matches(val, key)) {
            //             const vnode = this.cache[key]
            //             vnode && vnode.componentInstance.$destroy()
            //             delete this.cache[key]
            //         }
            //     }
            // },
            // exclude(val) {
            //     clearCacheItemConfirm(this, name => !matches(val, name))
            // }
        },
        deactivated(){
            this.isRepaint = true;
        },
        created() {
            this.cache = Object.create(null);
            this.keys = [];
            //默认为6,最小为6,最大为20
            this.maxInt = Math.min(Math.max(parseInt(this.max) || 6, 6), 20);
        },
        destroyed() {
            for (const key in this.cache) {
                clearCacheItem(this.cache, key, this.keys)
            }
        },
        render(h) {
            //deactivated 后的第一次因为transition，不让子元素渲染
            if(this.isRepaint && this.$vnode.data.keepAlive){
                this.isRepaint = false;
                return null;
            }
            // 因为上面的更改，重新促发render，判断是否transition正在切换，正在切换则也不渲染
            let cur;
            const transtionParent = getParentTransition(this.$vnode);
            if (transtionParent && (cur = transtionParent.componentInstance) && cur.mode === "out-in" && cur._leaving) {
                return null;
            }
            const children = this.$slots.default;
            let firstChildVNode = null;
            if (isArray(children)) {
                firstChildVNode = children.find(child => {
                    if (isObject(child) && (isObject(child.componentOptions) || (child.isComment && child.asyncFactory))) {
                        return true
                    }
                })
                const childComponentOptions = firstChildVNode && firstChildVNode.componentOptions;
                if (childComponentOptions) {
                    const name = getComponentName(childComponentOptions)
                    // const {
                    //     exclude
                    // } = this;
                    // if (exclude && name && matches(exclude, name)) {
                    //     return firstChildVNode
                    // }

                    const {
                        cache,
                        keys
                    } = this;
                    const baseKey = firstChildVNode.key == null ? childComponentOptions.Ctor.cid + (childComponentOptions.tag ? `::${childComponentOptions.tag}` : '') : firstChildVNode.key;
                    const pageKey = history.state && history.state.key;
                    const finalKey = baseKey + "-pageKey-" + pageKey;
                    
                    if (cache[finalKey]) {
                        console.log("use cache!");
                        firstChildVNode.componentInstance = cache[finalKey].componentInstance
                        // make current key freshest
                        removeItem(keys, finalKey)
                        keys.push(finalKey)
                    } else {
                        console.log("add cache!");
                        cache[finalKey] = firstChildVNode
                        keys.push(finalKey)
                        if (this.maxInt && keys.length > this.maxInt) {
                            console.log("limit cache!");
                            //如果超过最大值，删除最前一条记录
                            clearCacheItem(cache, keys[0], keys, this._vnode)
                        }
                    }
                    firstChildVNode.data.keepAlive = true;
                }

            }

            return firstChildVNode || (children && children[0]);
        }
    }
}
