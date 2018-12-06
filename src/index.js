import MemoryRouterComponent from './components/MemoryRouter'

export default {
    install: (Vue) => {
        Vue.component('memoryRouter', MemoryRouterComponent())
    }
}
