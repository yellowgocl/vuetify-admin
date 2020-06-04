
import{ map } from 'lodash'
const formatVideoResource = (url) => {
    const types = [
        'video/mpeg', 'video/mp4', 'video/ogg', 'video/m4a', 'video/webm'
    ]
    if (url) {
        return map(types, (n) => ({ type: n, src: url }))
    }
} 

export { formatVideoResource }
