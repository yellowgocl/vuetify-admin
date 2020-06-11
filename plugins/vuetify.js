// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// import VuetifyDraggableTreeview from 'vuetify-draggable-treeview'

Vue.use(Vuetify)
// Vue.use(VuetifyDraggableTreeview)

const opts = {
    icons: {
        iconfont: 'mdi', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
    theme: {
        options: { 
            customProperties: true
        }
    }
}

export default new Vuetify(opts)