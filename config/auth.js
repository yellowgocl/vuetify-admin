const env = require('../env')
const urls = require('../api/url')
const utils = require('../api/util')
const loginUrl = utils.parseUri(urls.LOGIN, false)
const loginMethod = utils.parseMethod(urls.LOGIN)
const logoutUrl = utils.parseUri(urls.LOGOUT, false)
const logoutMethod = utils.parseMethod(urls.LOGOUT)
const userUrl = utils.parseUri(urls.GET_USER, false)
const userMethod = utils.parseMethod(urls.GET_USER)
console.info(process.env.NODE_ENV)
module.exports = {
    strategies: {
        local: {
            endpoints: {
                login: { url: loginUrl, method: loginMethod, propertyName: 'authorization' },
                logout: { url: logoutUrl, method: logoutMethod },
                user: { url: userUrl, method: userMethod, propertyName: false }
            },
            tokenRequired: true,
            tokenType: '',
            // _scheme: '~/schemes/customLocalScheme',
        }
    },
    watchLoggedIn: true,
    token: {
        prefix: ''
    },
    cookie: {
        options: {
            secure: process.env.NODE_ENV && process.env.NODE_ENV === 'production'
        }
    },
    redirect: {
        login: '/auth/login',
        logout: '/auth/login',
        home: '/',
        callback: '/'
    },
    plugins: [ { src: '~/plugins/axios' }, { src: '~/plugins/auth.js' , mode: 'client', ssr: false} ] //
}