/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */

// import delay from 'mocker-api/utils/delay'
// import mockjs from 'mockjs'
const delay = require('mocker-api/lib/delay')
const mocks = require('./api')
const urls = require('../url')
const utils = require('../util')
// import URL from '../url'

// function _parseMethod(option) {
//     let method = option ? option.method : undefined
//     if(!method || typeof method != 'string') {
//         return 'GET'
//     }
//     method = method.toUpperCase()
//     return (method == 'POST' || method == 'GET' || method == 'DELETE' || method == 'PUT') ? method : 'GET'
// }
// function _parseUri(opt) {
//     if (typeof opt == 'string') {
//         return opt
//     } else if (typeof opt == 'object') {
//         return opt.mock || opt.url
//     } else {
//         return opt
//     }
// }

const getData = () => {
    let result = {}
    for (let [key, value] of Object.entries(urls)) {
        let method = utils.parseMethod(value)
        let url = utils.parseUri(value)
        let mock = mocks[key]
        if (!mock) 
            continue;
        result[`${method} ${url}`] = mock
    }
    console.info(result)
    return result
}

// const data = {
//     'POST /account/v1/third/login': (req, res) => {
//         return res.json({
//             code: 200,
//             message: 'success',
//             data: {}
//         })
//     },
//     'POST /api/v3/token': (req, res) => {
//         return res.json({
//             code: 200,
//             data: { token: { type: 0, requestId: 10000, value: "cra4pieg42390jkoe1md", expiresIn: 7200 } },
//             msg: "success"
//         })        
//     },
//     'GET /test/get': (req, res) => {
//         return res.json({code: 200, messge: 'success', data: {}})
//     },
//     'GET /ext/room/list': mockjs.mock({
//         code: 200,
//         message: 'ok',
//         data: {
//             "errcode": 0, // errcode = 0 代表成功；errcode = 1 代表未创建直播房间
//             "errmsg": "ok",
//             "room_info|1-3": [{
//                 "name": "直播房间@integer(1, 10)",
//                 "roomid|1": 1,
//                 "cover_img": '@image("200x200", @hex)',
//                 "live_satus": '@pick([101, 102, 103, 104, 105, 106, 107])',
//                 "start_time": '@date("T")',
//                 "end_time": '@date("T")',
//                 "anchor_name": '@CFIRST@CLAST',
//                 "anchor_img": mockjs.Random.image('125x125', '头像'),
//                 "goods": [{
//                         "cover_img": mockjs.Random.image('200x200', '#fff'),
//                         "url": "pages/goods/index",
//                         "price": '@integer(60,1000)',
//                         "name": '@ctitle(3, 7)'
//                 }]
//             }],
//             "total": 1
//         }
//     })
    
// }

module.exports = delay(getData(), 1000)
