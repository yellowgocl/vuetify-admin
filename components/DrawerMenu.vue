<template>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
    <!-- <v-list-group dense>
        <template v-for="item in items">
            
        </template>
    </v-list-group> -->
    </v-navigation-drawer>
</template>

<script>
import { reduce, filter } from 'lodash'
export default {
    props: {
        drawer: { type: Boolean, default: () => true }
    },
    data() {
        return {
            items: [],
            rootId: 0
        }
    },
    mounted() {
        this.$api.get(this.$api.urls.GET_DRAWER_MENU).then(res => {
            this.rootId = res.rootId
            // this.items = res.items
            this.items = reduce(res.items, (r, v, k) => {
                if (v.parentId == res.rootId) {
                    v.children = filter(res.items, { id: v.id })
                    r.push(v)
                }
                return r
            }, [])
            console.info(this.items)
            // let part = partition(this.items, { id: rootId })
            // this.rootItems = part[0]
            // this.subItems = part[1]
        })
    },
    methods: {

    }
}
</script>

<style scoped>

</style>

