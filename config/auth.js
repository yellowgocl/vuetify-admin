const env = require('../env')
const urls = require('../api/url')
const utils = require('../api/util')
let isProduction = /^true$/i.test(env.IS_PRODUCTION)
const loginUrl = utils.parseUri(urls.LOGIN, false)
const loginMethod = utils.parseMethod(urls.LOGIN)
const logoutUrl = utils.parseUri(urls.LOGOUT, false)
const logoutMethod = utils.parseMethod(urls.LOGOUT)
const userUrl = utils.parseUri(urls.GET_USER_OWN, false)
const userMethod = utils.parseMethod(urls.GET_USER_OWN)
module.exports = {
    strategies: {
        local: {
            endpoints: {
                login: { url: loginUrl, method: loginMethod, propertyName: 'authorization' },
                logout: { url: logoutUrl, method: logoutMethod },
                user: false //{ url: userUrl, method: userMethod, propertyName: 'data' }
            },
            tokenType: ''
        }
    },
    token: {
        prefix: ''
    },
    redirect: {
        login: '/auth/login',
        logout: '/',
        callback: '/auth/login',
        home: '/'
    },
    plugins: [ { src: '~/plugins/axios', ssr: true }, '~/plugins/auth.js' ]
}