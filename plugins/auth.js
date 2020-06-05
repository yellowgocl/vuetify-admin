import { setAuth } from '~/api'
export default function ({ app, route, router, redirect }) {
    setAuth(app.$auth)
    
    // console.info(app.$auth.loggedIn)
}