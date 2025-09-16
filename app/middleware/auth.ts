export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore()
    const { token } = userStore

    console.log(to.path, '链接')

    if(to.path.startsWith('admin') && !token.refreshToken) {
        return navigateTo('/login')
    }


    if(to.params.id === '1') {
        return abortNavigation()
    }


    if(to.path != '/') {
        return navigateTo('/')
    }

})