const env = require('../env')
let isProduction = process.env.NODE_ENV == 'production'
module.exports = {
    // baseURL: 'http://127.0.0.1:3000/api/',
    // credentials: true,
    proxy: true,
    timeout: 60 * 1000,    
    debug: !isProduction,
}