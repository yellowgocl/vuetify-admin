const urls = require('../url')
const mockjs = require('mockjs')
const _baseResponse = (req) => {
    if (!req) {
        return { code: 500, message: 'unknow error', data: {} }
    } else {
        let code = req.query.mockStatusCode || req.params.mockStatusCode || req.body.mockStatusCode || 200;
        console.info(req.body.mockStatusCode, code)
        return { code, message: 'success', data: {} }
    }
}
const _buildArchive = () => {
    return {
            "id": "@id",
            "title": "@ctitle(5,10)",
            "subTitle": "@ctitle(10,20)",
            "tags|0-3": ['@cword(2,4)'],
            "pics|1-9": ['https://placem.at/places?h=400&random=@cname&txt'],
            "content": "@cword(20,50)",
            "status": 1,
            "orderNum": "@integer(0, 100)",
            "browseCount": "@integer(0, 999)",
            "shareCount": "@integer(0, 999)",
            "downloadCount": "@integer(0,9999)",
            "createBy": "@cname",
            "createDate": new Date().getTime(),
            "updateBy": "@cname",
            "updateDate": new Date().getTime(),
            "remarks": "@cword(10, 20)"
        }
}
_buildUser = () => {
    return  {
        "id": "@id",
        "account": "admin",
        "avatar": 'https://placem.at/places?h=100&random=@cname&txt',
        "status": 1,
        "name": "@cname",
        "createBy": "@account",
        "createDate": new Date(),
        "updateBy": "@account",
        "updateDate": new Date(),
        "remarks": null
    }
}
_buildTag = () => {
    return {
        "id": '@id',
        "type": 0,
        "value": "@cword(2, 6)",
        "useCount": "@integer(0, 999)",
        "createBy": "sys:11231",
        "createDate": 1575965850000,
        "updateBy": "sys:13123",
        "updateDate": 1575965850000,
        "remarks": "@cword(2, 20)",
        "createSysUser": _buildUser(),
        "updateSysUser": _buildUser()
    }
}
const mod = {
    GET_USER: (req, res) => {
        res.json({
            ..._baseResponse(req),
            data: _buildUser()
        })
    },
    GET_DRAWER_MENU: (req, res) => {
        return res.json({
            ..._baseResponse(req),
            data: [
                    { icon: 'dashboard', name: '运营版块', id: 10, status: 1 },
                    { icon: 'settings', name: '系统管理', id: 11, status: 1},
                    { icon: 'settings_input_component', name: '权限管理', id: 201, parentId: 11, status: 1},
                    { icon: 'perm_media', name: '发圈素材', id: 100, parentId: 10, url: '/co/material', status: 1 },
                    { icon: 'category', name: '素材分类', id: 101, parentId: 10, url: '/co/category', status: 1 },
                    { icon: 'person', name: '用户管理', id: 200, parentId: 11, url: '#', status: 1 },
            ]
        })
    },
    FILE_UPLOAD: (req, res) => {
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            data: 'https://placem.at/places?h=400&random=@id&txt='
        }))
    },
    BATCH_FILE_UPLOAD: (req, res) => {
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            'data|2-4': ['https://placem.at/places?h=400&random=@id&txt=']
        }))
    },
    GET_CATEGORY_LIST: (req, res) => {
        return res.json({
            ..._baseResponse(req),
            data: {
                rootId: 0,
                total: 9,
                content: [
                    { name: '分类1', id: 10, parentId: 0, type: 0, status: 1, createBy: 'admin', createDate: '', updateBy: 'admin', updateDate: '', remarks: '', orderNum: 0 },
                    { name: '分类2', id: 11, parentId: 0, type: 0, status: 1, createBy: 'admin', createDate: '', updateBy: 'admin', updateDate: '', remarks: '', orderNum: 0 },
                    { name: '分类1-子分类1', id: 100, parentId: 10, type: 0, status: 1, createBy: 'admin', createDate: '', updateBy: 'admin', updateDate: '', remarks: '', orderNum: 0 },
                    { name: '分类1-子分类2', id: 101, parentId: 10, type: 0, status: 1, createBy: 'admin', createDate: '', updateBy: 'admin', updateDate: '', remarks: '', orderNum: 0 },
                    { name: '分类2-子分类1', id: 200, parentId: 11, type: 0, status: 1, createBy: 'admin', createDate: '', updateBy: 'admin', updateDate: '', remarks: '', orderNum: 0 },
                    { name: '分类1-子分类1-子分类1', id: 1000, parentId: 100, type: 0, status: 1, createBy: 'admin', createDate: '', updateBy: 'admin', updateDate: '', remarks: '', orderNum: 0 },
                    { name: '分类1-子分类2-子分类1', id: 2000, parentId: 101, type: 0, status: 1, createBy: 'admin', createDate: '', updateBy: 'admin', updateDate: '', remarks: '', orderNum: 0 },
                    { name: '分类2-子分类1-子分类1', id: 3000, parentId: 200, type: 0, status: 1, createBy: 'admin', createDate: '', updateBy: 'admin', updateDate: '', remarks: '', orderNum: 0 },
                    { name: '分类2-子分类1-子分类2', id: 3001, parentId: 200, type: 0, status: 1, createBy: 'admin', createDate: '', updateBy: 'admin', updateDate: '', remarks: '', orderNum: 0 },
                ]
            }
        })
    },
    ADD_CATEGORY: (req, res) => {
        return res.json({
            ..._baseResponse(req),
            data: {
                "by": 'create',
                "id": "@id",
                "type": 0,
                "parentId": '@id',
                "name": "@cname",
                "icon": "https://placem.at/places?h=400&random=@id&txt=",
                "status": 1,
                "orderNum": 0,
                "createBy": "",
                "createDate": '@date("T")',
                "updateBy": "",
                "updateDate": '@date("T")',
                "remarks": ""
            }
        })
    },
    DEL_CATEGORY: (req, res) => {
        let _base = _baseResponse(req)
        return res.json({
            ..._base,
            data: _base.code == 200
        })
    },
    MOD_CATEGORY: (req, res) => {
        return res.json({
            ..._baseResponse(req),
            data: {
                "by": 'modify',
                "id": "@id",
                "type": 0,
                "parentId": '@id',
                "name": "@cname",
                "icon": "https://placem.at/places?h=400&random=@id&txt=",
                "status": 1,
                "orderNum": 0,
                "createBy": "",
                "createDate": '@date("T")',
                "updateBy": "",
                "updateDate": '@date("T")',
                "remarks": ""
            }
        })
    },
    GET_CATEGORY: (req, res) => {
        let id = req.query.id || req.params.id || req.body.id || 0
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            data: {
                "by": 'get',
                "id": id,
                "type": 0,
                "parentId": '@id',
                "name": "@cname",
                "icon": "https://placem.at/places?h=400&random=@id&txt=",
                "status": 1,
                "orderNum": 0,
                "createBy": "",
                "createDate": '@date("T")',
                "updateBy": "",
                "updateDate": '@date("T")',
                "remarks": ""
            }
        }))
    },
    LOGIN: (req, res) => {
        return res.json({
            code: 200,
            message: 'success',
            data: {
                authorization: 'aasdfasfaasfs',
                expireIn: 0,
            }
        })
    },
    LOGOUT: (req, res) => {
        return res.json({
            ..._baseResponse(req),
            "data": true
        })
    },
    IS_SIGN_IN: (req, res) => {
        let flag = !!(req.query.flag || req.params.flag || req.body.flag || 0)
        return res.json({
            code: flag ? 200 : 401,
            message: 'success',
            data: {
                flag
            }
        })
    },
    TEST: mockjs.mock({
        code: 200,
        message: 'ok',
        data: {
            "info|6-20": [{
                "id|+1": 1,
                "name": "测试入口-@id",
                "image": 'https://placem.at/places?h=400&random=@id&txt=""',
                "status": '@pick([101, 102, 103, 104, 105, 106, 107])',
                "start_time": '@date("T")',
                "end_time": '@date("T")',
                "anchor_name": '@CFIRST@CLAST',
                "anchor_img": mockjs.Random.image('125x125', '头像')
            }]
        }
    }),
    GOODS: (req, res) => {
        let id = req.query.id || req.params.id || req.body.id || 0
        return res.json(mockjs.mock({
            code: 200,
            message: 'ok',
            data: {
                'id': id,
                'name': `商品-${id}`,
                'image': 'https://placem.at/places?h=400&random=@id&txt=""',
                'price|100-999.1-10': 100, 
            }
        }))
    },
    ARCHIVE_ADD_CATEGORY: (req, res) => {
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            "data": [{
                "archiveId": 0,
                "categoryId": 0,
                "id": 0
            }]
        }))
    },
    ARCHIVE_GET_CATEGORY: (req, res) => {
        return res.json({
            ..._baseResponse(req),
            data: [
                { name: '分类1-子分类1-子分类1', id: 1000, parentId: 100, type: 0, status: 1, createBy: 'admin', createDate: '', updateBy: 'admin', updateDate: '', remarks: '', orderNum: 0 },
                { name: '分类2-子分类1-子分类2', id: 3001, parentId: 200, type: 0, status: 1, createBy: 'admin', createDate: '', updateBy: 'admin', updateDate: '', remarks: '', orderNum: 0 },
            ]
        })
    },
    ADD_ARCHIVE: (req, res) => {
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            data:_buildArchive(req)
        }))
    },
    MOD_ARCHIVE: (req, res) => {
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            data:_buildArchive(req)
        }))
    },
    GET_ARCHIVE: (req, res) => {
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            data:_buildArchive(req)
        }))
    },
    DEL_ARCHIVE: (req, res) => {
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            data: '@boolean'
        }))
    },
    ADD_TAG: (req, res) => {
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            data:_buildTag(req)
        }))
    },
    MOD_TAG: (req, res) => {
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            data:_buildTag(req)
        }))
    },
    GET_TAG: (req, res) => {
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            data:_buildTag(req)
        }))
    },
    DEL_TAG: (req, res) => {
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            data: '@boolean'
        }))
    },
    BARTH_DEL_ARCHIVE: (req, res) => {
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            data: '@boolean'
        }))
    },
    FETCH_ARCHIVE_LIST: (req, res) => {
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            data: {
                total: '@integer(26, 242)',
                'content|10-15': [_buildArchive()]
            }
        }))
    },
    FETCH_TAG_LIST: (req, res) => {
        return res.json(mockjs.mock({
            ..._baseResponse(req),
            data: {
                total: '@integer(26, 242)',
                'content|10-15': [_buildTag()]
            }
        }))
    }
}

exports.url = mod
module.exports = mod
