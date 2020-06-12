const path = require('path')
const filenames = {
    development: '.env.dev',
    test: '.env.test',
    production: '../.env'
}
const env = process.env.NODE_ENV
const filename = filenames[env]||filenames['production']
const dotenv = require('dotenv').config({
    path: path.resolve(__dirname, filename)
})
module.exports = {
    ...dotenv.parsed
}