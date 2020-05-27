const axios = require('./axios')
const proxy = require('./proxy')
exports.axios = axios
exports.proxy = proxy
module.exports = { axios, proxy }