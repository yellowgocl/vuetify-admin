import urls from './url'
import util from './util'
import { merge, isString, isObject, isArray, map } from 'lodash'
import storage from '~/common/storage'
let client
let authModule
// let source;

const setClient = (newClient) => {
    client = newClient
}
const setAuth = (newAuth) => {
    authModule = newAuth
}
const get = function (url, option) {
    return request(url, 'get', option)
}
const post = function(url, option) {
    return request(url, 'post', option)
}
const del = function(url, option) {
    return request(url, 'delete', option)
}
const put = function(url, option) {
    return request(url, 'put', option)
}
const request = function(url, method, option = {}) {
    method = util.parseMethod(method || url)
    url = util.parseUri(url)
    // let auth = storage.getItem('auth') || ''
    // let auth = authModule.$storage.getUniversal('auth', false)
    let headers = {
        deviceType: 'pc', deviceId: 99999
    }
    option.headers = merge(headers, option.headers)
    let request = {
        url, method, ...option
    }
    
    return client(request)
}
const _baseCategoryQueryParamsObject = () => {
    return {
        "type": 0,
        "parentId": null,
        "name": null,
        "icon": null,
        "status": 1,
        "orderNum": 0,
        "remarks": null
      }
}
const _baseArchiveQueryParamsObject = (title) => {
    return {
        "title": title,
        "subTitle": null,
        "tags": null,
        "pics": null,
        "content": null,
        "status": 1,
        "orderNum": 0,
        "remarks": null
    }     
}
const _baseTagQueryParamsObject = (value) => {
    return {
        "type": 0,
        value,
        "remarks": null
    }
}
const orderByCategory = (sid, tid, asc=true) => {
    if (sid && tid) {
        let url = `${util.parseUri(urls.ORDER_CATEGORY, false)}/${sid}/${asc?'back':'front'}/${tid}`
        return post(url)
    } else {
        return Promise.reject({
            code: -500,
            message: 'sourceId或targetId不能为空'
        })
    }
}
const addCategory = (params) => {
    if (isString(params)) {
        params = { ..._baseCategoryQueryParamsObject(), name: params }
    } else if (isObject(params)){
        params = merge(_baseCategoryQueryParamsObject(), params)
    } else {
        params = { mockStatusCode: 403 }
    }
    return post(urls.ADD_CATEGORY, { data: params })
}
const delCategory = (params) => {
    let id = params || 0
    let url = `${util.parseUri(urls.DEL_CATEGORY, false)}/${id}`
    return del(url)
}
const getCategory = (params) => {
    let id = params || 0
    let url = `${util.parseUri(urls.GET_CATEGORY, false)}/${id}`
    return get(url)
}
const modCategory = (params) => {
    return put(urls.MOD_CATEGORY, { data: params })
}
const acrhiveAddCategory = (aid, cid) => {
    let url = `${util.parseUri(urls.ARCHIVE_ADD_CATEGORY, false)}/${aid}/${cid}`
    return get(url)
}
const archiveGetCategory = (id) => {
    let url = `${util.parseUri(urls.ARCHIVE_GET_CATEGORY, false)}/${id}`
    return get(url)
}
const addArchive = (params) => {
    if (isString(params)) {
        params = { ..._baseArchiveQueryParamsObject(params)}
    } else if (isObject(params)){
        params = merge(_baseArchiveQueryParamsObject(), params)
    } else {
        params = { mockStatusCode: 403 }
    }
    return post(urls.ADD_ARCHIVE, { data: params })
}
const delArchive = (params) => {
    let id = params || 0
    let url = `${util.parseUri(urls.DEL_ARCHIVE, false)}/${id}`
    return del(url)
}
const getArchive = (params) => {
    let id = params || 0
    let url = `${util.parseUri(urls.GET_ARCHIVE, false)}/${id}`
    return get(url)
}
const modArchive = (params) => {
    return put(urls.MOD_ARCHIVE, { data: params })
}
const addTag = (params) => {
    if (isString(params)) {
        params = { ..._baseTagQueryParamsObject(params)}
    } else if (isObject(params)){
        params = merge(_baseTagQueryParamsObject(), params)
    } else {
        params = { mockStatusCode: 403 }
    }
    return post(urls.ADD_TAG, { data: params })
}
const delTag = (params) => {
    return del(urls.DEL_TAG, { data: params })
}
const getTag = (params) => {
    let id = params || 0
    let url = `${util.parseUri(urls.GET_TAG, false)}/${id}`
    return get(url)
}
const modTag = (params) => {
    return put(urls.MOD_TAG, { data: params })
}
const fileUpload = (params, onUploadProgress, cancelSource) => {
    cancelSource = cancelSource || client.CancelToken.source()
    let url = urls.FILE_UPLOAD
    if (isArray(params)) {
        let key = params.length == 1 ? 'file' : 'files'
        url = params.length == 1 ? urls.FILE_UPLOAD : urls.BATCH_FILE_UPLOAD
        let fm = new FormData();
        map(params, (v, k) => {
            fm.append(key, v);
        })
        params = fm
    }
    return post(url, { data: params, cancelToken: cancelSource.token, headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' }, onUploadProgress: progressEvent => onUploadProgress && onUploadProgress.call(undefined, progressEvent, cancelSource) })
}

const fetchAcrhiveList = (params) => {
    let _base = {
        "pageNo": 1,
        "pageSize": 999,
        "categoryIds": null,
        "status": null,
        "keywords": null,
        "tags": null,
        "orders": "orderNum desc, id desc"
    }
    params = merge({}, _base, params)
    return post(urls.FETCH_ARCHIVE_LIST, { data: params })
}

const getCategoryList = (params = null) => {
    let _base = {
        "pageNo": 1,
        "pageSize": 999,
        "type": 0,
        "parentId": null,
        "status": null,
        "orders": "orderNum desc, id desc"
    }
    params = merge({}, _base, params)
    return post(urls.FETCH_CATEGORY_LIST, {data: params}).then(res => {
        let { ...other } = res
        return { ...other, rootId: 0 }
    })
}
const login = (params) => {
    return authModule.loginWith('local', params)
}
const logout = async () => {
    return await authModule.logout()
}
const getUserOwn = () => {
    return get(urls.GET_USER)
}

const fetchTagList = (params = {}) => {
    let page = params.pageNo || 1
    let size = params.paageSize || 999
    let orders = params.orders || 'id desc'
    let type = params.type || 0
    let url = `${util.parseUri(urls.FETCH_TAG_LIST, false)}/${page}/${size}/${type}/${orders}`
    return get(url)
}

export { urls, getUserOwn, login, logout, setAuth, archiveGetCategory, acrhiveAddCategory, fetchAcrhiveList, fetchTagList, fileUpload, setClient, request, get, post, orderByCategory, addCategory, delCategory, getCategory, modCategory, getCategoryList, addArchive, delArchive, getArchive, modArchive, addTag, delTag, getTag, modTag }
