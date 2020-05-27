import * as api from '~/api'
import qs from 'qs'
export default ({$axios, redirect, app }) => {
    $axios.onRequest(config => {
        if (config.method == 'post') {
            // config.transformRequest = [(data) => (typeof data == 'string') ? data : qs.stringify(data, { encode: false })]
        } else if (config.method == 'get') {
            // console.info(config)
        }
    })
    $axios.onError(error => {
        if (!error.response || error.response.status == 500) {
            redirect('/error')
        }
       //  return error
    })
    $axios.onResponse(response => {
        let data = response.data
        // console.info(response)
        if (!data) {
            return Promise.reject(data)
        }
        if (data.code == 200) {
            return data.data
        } else {
            if (data.code == 401) {
                app.$storage.removeItem('auth')
                redirect('/auth/login')
            }
            return Promise.reject(data)
        }
    })
    api.setClient($axios)
}