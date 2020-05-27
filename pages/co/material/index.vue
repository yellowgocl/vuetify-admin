<template>
<v-container class="co-material">
    <v-card >
        <v-card-title>
            素材管理
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="search"
                label="过滤本页内容"
                single-line
                hide-details
            ></v-text-field>
        </v-card-title>
        <v-card-text>
            <v-data-table
                :search="search"
                :headers="headers"
                :items="items"
                :options.sync="options"
                :loading="loading"
                :server-items-length="total"
                class="" >
                <template v-slot:item.shareCount="{ item }">
                    <v-chip class='share-count-value' :color="getColor(item.shareCount)" dark>{{ item.shareCount }}</v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                    <template v-if='item.loading'>
                        <v-progress-circular size='24' indeterminate color="primary"></v-progress-circular>
                    </template>
                    <template v-else>
                        <nuxt-link :to='`/co/material/${item.id}`'><v-icon small class="mr-2" @click="editItem(item)">edit</v-icon></nuxt-link>
                        <v-icon small @click="deleteItem(item)">delete</v-icon>
                    </template>
                </template>
                <template v-slot:item.status="{item}">
                    <v-switch :disabled='item.loading' @change='onEnabled(item)' :true-value='1' :false-value='0' v-model="item.status" inset :label="`${!!item.status ? '启用' : '禁用'}`"></v-switch>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
    <v-btn
        color="secondary"
        fixed
        fab
        large
        dark
        bottom
        right
        class="fab"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-container>
</template>

<script>
import { unionWith, merge, toNumber, assign, pick, keys, unset } from 'lodash'
export default {
    data() {
        return {
            page: 1,
            total: 0,
            search: '',
            loading: false,
            options: { page: 1, itemsPerPage: 10 },
            items: [],
            headers: [
                { text: '创建人', align: 'start', sortable: false, value: 'createBy' },
                { text: '下载量', align: 'start', sortable: true, value: 'downloadCount' },
                { text: '浏览量', align: 'start', sortable: true, value: 'browseCount' },
                { text: '累计分享', align: 'start', sortable: true, value: 'shareCount' },
                { text: '创建日期', align: 'start', sortable: true, value: 'createDate' },
                { text: '修改日期', align: 'start', sortable: true, value: 'updateDate' },
                { text: '状态', align: 'center', sortable: true, value: 'status' },
                { text: '操作项', align: "center" ,value: 'actions', sortable: false },
            ]
        }
    },
    mounted() {
        let p = toNumber(this.$route.hash.replace('#', ''));
        this.options.page = p == 0 ? 1 : p
        this.fetchList({ page: this.options.page })
    },
    watch: {
        options: {
            handler(n, o) {
                this.fetchList({ page: n.page })
            },
            deep: true
        }
    },
    methods: {
        fetchList(params) {
            this.loading = true
            this.$api.fetchAcrhiveList(params).then(res => {
                this.loading = false
                this.total = res.total
                this.items = res.content
                history.pushState(
                    {},
                    null,
                    this.$route.path + '#' + encodeURIComponent(params ? params.page : 1)
                )
            }, rej => this.loading = false)
        },
        getColor (count) {
            if (count > 400) return 'red'
            else if (count > 200) return 'orange'
            else return 'green'
        },
        deleteItem(item) {
            if (item) {
                let params = assign({}, item)
                unset(params, 'loading')
                item.loading = true
                this.items = unionWith(this.items, [item])
                let flag = confirm('是否确认移除?')
                flag && this.$api.delArchive(params).then(res => {
                    const index = this.items.indexOf(item)
                    this.items.splice(index, 1)
                    item.loading = false
                    this.items = unionWith(this.items, [item])
                })
            }
        },
        editItem(item) {
            if (item) {
                this.$router.navigateTo
            }
        },
        onEnabled(item) {
            if (item) {
                let params = assign({}, item)
                unset(params, 'loading')
                item.loading = true
                this.items = unionWith(this.items, [item])
                this.$api.modArchive(params).then(res => {
                    item.loading = false
                    this.items = unionWith(this.items, [item])
                }, rej => {
                    item.loading = false
                    item.status = item.status == 0 ? 1 : 0
                    this.items = unionWith(this.items, [item])
                })
            }
        }
    }
}
</script>

<style scoped>
.co-material {
    margin-bottom: 3.5rem;
}
.co-material /deep/ a:any-link{
    text-decoration: none !important;
}
.co-material /deep/ .fab {
    bottom: 3rem;
    right: 2rem;
}
.co-material .share-count-value {
    min-width: 3rem;
    text-align: center;
}
.co-material .share-count-value /deep/ .v-chip__content {
    flex: 1;
    justify-content: center
}
</style>
