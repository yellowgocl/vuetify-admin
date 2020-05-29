import { setAuth } from '~/api'
export default function ({ app }) {
    setAuth(app.$auth)
    console.info(app.$auth.loggedIn)
}