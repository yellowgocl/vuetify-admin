const env = require('../env')
let isProduction = /^true$/i.test(env.IS_PRODUCTION)
module.exports = {
    // baseURL: 'http://127.0.0.1:3000/api/',
    // proxy: !env.IS_PRODUCTION,
    // credentials: true,
    proxy: true,
    timeout: 60 * 1000,    
    debug: !isProduction,
}