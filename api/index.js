import urls from './url'
import util from './util'
import { merge, isString, isObject, isArray, map } from 'lodash'
import storage from '~/common/storage'
let client

const setClient = (newClient) => {
    client = newClient
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
    let auth = storage.getItem('auth')
    let headers = {
        deviceType: 'pc', deviceId: 99999, authorization: auth
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
    return del(urls.DEL_CATEGORY, { data: params })
}
const getCategory = (params) => {
    let id = params || 0
    let url = `${util.parseUri(urls.GET_CATEGORY, false)}/${id}`
    return get(url)
}
const modCategory = (params) => {
    return put(urls.MOD_CATEGORY, { data: params })
}
const addArchive = (params) => {
    if (isString(params)) {
        params = { ..._baseArchiveQueryParamsObject(title)}
    } else if (isObject(params)){
        params = merge(_baseArchiveQueryParamsObject(), params)
    } else {
        params = { mockStatusCode: 403 }
    }
    return post(urls.ADD_ARCHIVE, { data: params })
}
const delArchive = (params) => {
    return del(urls.DEL_ARCHIVE, { data: params })
}
const getArchive = (params) => {
    let id = params || 0
    let url = `${util.parseUri(urls.GET_ARCHIVE, false)}/${id}`
    return get(url)
}
const modArchive = (params) => {
    return put(urls.MOD_ARCHIVE, { data: params })
}
const fileUpload = (params) => {
    let url = urls.FILE_UPLOAD
    console.info(isArray(params), params)
    if (isArray(params)) {
        let key = params.length == 1 ? 'file' : 'files'
        url = params.length == 1 ? urls.FILE_UPLOAD : urls.BATCH_FILE_UPLOAD
        let fm = new FormData();
        console.info(params)
        map(params, (v, k) => {
            fm.append(key, v);
        })
        params = fm
    }
    return post(url, { data: params, headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' } })
}

const fetchAcrhiveList = (params) => {
    let _base = {
        "pageNo": 1,
        "pageSize": 999,
        "categoryId": null,
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
    return post(urls.GET_CATEGORY_LIST, {data: params}).then(res => {
        let { content, ...other } = res
        return { ...other, rootId: 0, items: content }
    })
}

export { urls, fetchAcrhiveList, fileUpload, setClient, request, get, post, addCategory, delCategory, getCategory, modCategory, getCategoryList, addArchive, delArchive, getArchive, modArchive }
