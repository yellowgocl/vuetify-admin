import { setAuth } from '~/api'
export default function ({ app, route, router, redirect }) {
    setAuth(app.$auth)
    if (!app.$auth.loggedIn) {
        console.info(route.fullPath)
        if (route.name != 'auth-login') {
            app.$auth.$storage.setUniversal('redirectUrl', route.fullPath)
            console.info(app.$auth.$storage.getUniversal('redirectUrl'))
        }
        // this.$auth.$storage.getLocalStorage(key)
    } else if (route.name == 'auth-login' && app.$auth.loggedIn) {
        redirect('/')
    }
    // console.info(app.$auth.loggedIn)
}