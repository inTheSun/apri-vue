# something intresting!

> talk is cheap show me the code

remember like browser history

sorry for my poor English, i won't install B anymore. LOL

本来想写一个英文介绍的，想想算了，费那个劲干哈，
项目中遇到页面回退记住上个页面的历史纪录，网上有很多keep-alive的组件始用方法，用的不是很舒服，就自己写了一个，

### 注意：
1.这插件只写了兼容支持html5的history模式的代码,是通过页面切换的pushState方法中state中key值的值变化判断当前页面是否访问过。vue-router中本身就有对于state中key的生成方法，我就直接拿来用了。
> 为什么只兼容html5？因为我懒。逻辑一样，只是路由切换需要加参数判断当前页面是否命中缓存，例子：[vue-navigation](https://github.com/zack24q/vue-navigation);对，就是抄他的，只是好像作者不维护了。

2.插件始用需要嵌套keep-alive,因为transition切换mode="out-in"模式下，过度时的占位dom匹配只对keep-alive有效。
```
function placeholder(h: Function, rawChild: VNode): ? VNode { if (/\d-keep-alive$/.test(rawChild.tag)) { return h('keep-alive', { props: rawChild.componentOptions.propsData }) } }
```
所以始用的时候需要
```
<keep-alive>
    <memory-router>
        <router-view></router-view>
    </memory-router>
</keep-alive>
```
具体参考examples,运行npm run dev:example

后续空了会加一下跳转到history list中指定url的记录（也不知道什么时候空）

