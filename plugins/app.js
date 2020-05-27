import * as api from '~/api'
import { Utils, Storage } from '~/common'
export default (app, inject) => {
    inject('api', api)
    inject('utils', Utils)
    inject('storage', Storage)
}