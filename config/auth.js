const env = require('../env')
const urls = require('../api/url')
const utils = require('../api/util')
let isProduction = /^true$/i.test(env.IS_PRODUCTION)
const loginUrl = utils.parseUri(urls.LOGIN, false)
const loginMethod = utils.parseMethod(urls.LOGIN)
const logoutUrl = utils.parseUri(urls.LOGOUT, false)
const logoutMethod = utils.parseMethod(urls.LOGOUT)
const userUrl = utils.parseUri(urls.GET_USER, false)
const userMethod = utils.parseMethod(urls.GET_USER)
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
    token: {
        prefix: ''
    },
    cookie: false,
    redirect: {
        login: '/auth/login',
        logout: '/auth/login',
        home: '/',
        callback: '/'
    },
    plugins: [ { src: '~/plugins/axios', ssr: false }, { src: '~/plugins/auth.js' , mode: 'client', ssr: false} ] //
}