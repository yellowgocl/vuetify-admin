
const mod = {
    LOGIN: { url: '/api/auth/v1/authorize/system', method: 'post', mock: true },
    GET_DRAWER_MENU: { url: '/api/sys/drawer-menu' },
    GET_CATEGORY_LIST: { url: '/api/content/v1/category/manage/page', method: 'post', mock: true },
    ADD_CATEGORY: { url: '/api/content/v1/category', method: 'post', mock: true },
    GET_CATEGORY: { url: '/api/content/v1/category', method: 'get', mock: '/api/content/v1/category/:id' },
    MOD_CATEGORY: { url: '/api/content/v1/category', method: 'put', mock: true },
    DEL_CATEGORY: { url: '/api/content/v1/category', method: 'delete' },
    ADD_ARCHIVE: { url: '/api/content/v1/archive', method: 'post' },
    GET_ARCHIVE: { url: '/api/content/v1/archive', method: 'get', mock: '/api/content/v1/archive/:id' },
    MOD_ARCHIVE: { url: '/api/content/v1/archive', method: 'put' },
    DEL_ARCHIVE: { url: '/api/content/v1/archive', method: 'delete' },
    BATCH_DEL_ARCHIVE: { url: '/api/content/v1/archive/batch', method: 'delete' },
    FETCH_ARCHIVE_LIST: { url: '/api/content/v1/archive/manage/page', method: 'post' },
    FILE_UPLOAD: { url: '/api/content/v1/file/upload', method: 'post', mock: true },
    BATCH_FILE_UPLOAD: { url: '/api/content/v1/file/batch/upload', method: 'post', mock: true },
    IS_SIGN_IN: { url: '/api/auth/v1/authorize/is_sign_in', method: 'post' },
    TEST: { url: '/api/test' },
    GOODS: { url: '/api/goods', method: 'post' }
}
exports.url = mod
module.exports = mod
// export default mod