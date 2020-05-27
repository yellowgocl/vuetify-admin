
function parseMethod(option) {
    let method = option ? option.method || option : undefined
    if(!method || typeof method != 'string') {
        return 'GET'
    }
    method = method.toUpperCase()
    return (method == 'POST' || method == 'GET' || method == 'DELETE' || method == 'PUT') ? method : 'GET'
}
function getUrl(opt) {
    let result = opt;
    if (typeof opt == 'object') {
        result = opt.url || opt
    }
    return result
}
function parseUri(opt, autoMock = true) {
    let result = getUrl(opt);
    if (typeof opt == 'object') {
        if (/^true$/i.test(process.env.IS_PRODUCTION)) {
            opt.mock = false
        } else {
            opt.mock = opt.mock == undefined || opt.mock == null ? true : opt.mock
            if (typeof opt.mock == 'string') {
                opt.mock = autoMock ? `/mock${opt.mock}` : `/mock${opt.url}`
            }
        }
        if (typeof opt.mock == 'boolean' || typeof opt.mock == 'number'){
            // let mockServer = process.env.MOCK_SERVER || ''
            result = opt.mock ? `/mock${opt.url}` : result
        } else {
            result = opt.mock || result
        }
    }
    return result
}
module.exports = { parseMethod, parseUri, getUrl }
