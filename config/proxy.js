const env = require('../env')
module.exports = {
    '/mock/': {
        target: env.MOCK_SERVER || '',
        changeOrigin: true,
        pathRewrite: {}
    },
    '/api/': {
        target: env.API_URL, // 填入你的需要代理的url,
        changeOrigin: true,
        pathRewrite: {
            '^/api/': '/',
        }
    }
}