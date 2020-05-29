const axios = require('./axios')
const proxy = require('./proxy')
const auth = require('./auth')
exports.axios = axios
exports.proxy = proxy
exports.auth = auth
module.exports = { axios, proxy, auth }