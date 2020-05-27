const env = require('../env')
let isProduction = /^true$/i.test(env.IS_PRODUCTION)
module.exports = {
    // baseURL: env.API_HOST,
    // proxy: !env.IS_PRODUCTION,
    // credentials: true,
    proxy: !isProduction,
    timeout: 60 * 1000,    
    debug: !isProduction,
}