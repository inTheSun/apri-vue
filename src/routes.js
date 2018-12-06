let routes = []

if (window.sessionStorage.vueMemoryRouter) {
    routes = JSON.parse(window.sessionStorage.vueMemoryRouter)
}

export default routes
