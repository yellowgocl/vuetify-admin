
const mod = {
    LOGIN: { url: '/api/auth/v1/authorize/system', method: 'post', mock: false },
    LOGOUT: { url: '/api/auth/v1/authorize/logout', method: 'get', mock: false },
    GET_USER: { url: '/api/auth/v1/sys/user', method: 'get', mock: false }, // mock: '/api/auth/v1/sys/user/:id'
    GET_DRAWER_MENU: { url: '/api/auth/v1/menu/tree/own', method: 'post', mock: false },
    ORDER_CATEGORY: { url: '/api/content/v1/category/order', method: 'post', mock: false }, // mock: '/api/content//v1/category/order/:sourceId/back/:targetId'
    ADD_CATEGORY: { url: '/api/content/v1/category', method: 'post', mock: false },
    GET_CATEGORY: { url: '/api/content/v1/category', method: 'get', mock: '/api/content/v1/category/:id' },
    MOD_CATEGORY: { url: '/api/content/v1/category', method: 'put', mock: false },
    DEL_CATEGORY: { url: '/api/content/v1/category', method: 'delete', mock: false },
    ADD_ARCHIVE: { url: '/api/content/v1/archive', method: 'post', mock: false },
    GET_ARCHIVE: { url: '/api/content/v1/archive', method: 'get' , mock: false },
    MOD_ARCHIVE: { url: '/api/content/v1/archive', method: 'put', mock: false },
    DEL_ARCHIVE: { url: '/api/content/v1/archive', method: 'delete', mock: false },
    ADD_TAG: { url: '/api/content/v1/tag', method: 'post', mock: false },
    GET_TAG: { url: '/api/content/v1/tag', method: 'get', mock: false },
    MOD_TAG: { url: '/api/content/v1/tag', method: 'put', mock: false },
    DEL_TAG: { url: '/api/content/v1/tag', method: 'delete', mock: false },
    ARCHIVE_GET_CATEGORY: { url: '/api/content/v1/archive/category/list/', mock: false },
    ARCHIVE_ADD_CATEGORY: { url: '/api/content/v1/archive/add/to/category', mock: false },
    FETCH_TAG_LIST: { url: '/api/content/v1/tag/page', method: 'get', mock: false },
    FETCH_CATEGORY_LIST: { url: '/api/content/v1/category/manage/page', method: 'post', mock: false },
    BATCH_DEL_ARCHIVE: { url: '/api/content/v1/archive/batch', method: 'delete' },
    FETCH_ARCHIVE_LIST: { url: '/api/content/v1/archive/manage/page', method: 'post', mock: false },
    FILE_UPLOAD: { url: '/api/content/v1/file/upload', method: 'post', mock: false },
    BATCH_FILE_UPLOAD: { url: '/api/content/v1/file/batch/upload', method: 'post', mock: false },
    IS_SIGN_IN: { url: '/api/auth/v1/authorize/is_sign_in', method: 'post' },
    TEST: { url: '/api/test' },
    GOODS: { url: '/api/goods', method: 'post' }
}
exports.url = mod
module.exports = mod
// export default mod